from datetime import datetime
from typing import List
from django.urls import reverse

from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.db.models import Q, Count, Sum
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.views import generic
from gunicorn.config import User
from rest_framework import permissions, status
from rest_framework.response import Response

from apps.clients.models import Client
from apps.main.models import ReferralPerson, Procedure, ProcedureType, ProcedurePrice, Product, Transfer
from conf.pagination import CustomPagination
from services.procedures import ProcedureCreateService, ProcedureUpdateService
from web.auth import forms
from web.clients.serializers import ClientSerializer
from rest_framework import generics

from web.logics import convert_to_int, phone_number_input_update, calculate_price, format_price
from web.procedures.forms import ProcedureForm
from web.procedures.serializers import ReferralPersonListSerializer, ReferralPersonCreateSerializer, \
    ProcedureListSerializer, ProcedureTypeListSerializer, ProcedurePaymentMainSerializer, ProcedureCreateSerializer, \
    ProcedureUpdateSerializer
from web.views import LoginRequiredMixin, CustomListView


class ReferralPersonListAPIView(CustomListView):
    queryset = ReferralPerson.objects.all()
    serializer_class = ReferralPersonListSerializer
    permission_classes = (permissions.AllowAny,)
    pagination_class = CustomPagination

    def get(self, request, *args, **kwargs):
        search = request.GET.get('search')
        q_filter = Q()
        if search:
            q_filter = Q(full_name__icontains=search)
        queryset = ReferralPerson.objects.filter(q_filter).order_by('-updated_at')
        data = self.get_response_data(self.serializer_class, queryset, many=True)
        return Response(data)


class ReferralPersonCreateAPIView(generics.CreateAPIView):
    model = ReferralPerson
    serializer_class = ReferralPersonCreateSerializer
    permission_classes = (permissions.AllowAny,)


class ProcedureCreateAPIView(generics.GenericAPIView):
    serializer_class = ProcedureCreateSerializer
    service = ProcedureCreateService()

    def post(self, request, *args, **kwargs):
        data = self.update_price_fields(request.data.copy())
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        department_id = request.session.get('department_id')
        is_created, procedure_id = self.service.create_procedure(department_id=department_id,
                                                                 val_data=serializer.validated_data)
        if is_created:
            data = {"message": "Mijoz uchun muolaja yaratildi", "is_created": is_created,
                    "url": reverse("web:procedures:update", kwargs={"pk": procedure_id})}
        else:
            domain = request.scheme + "://" + request.get_host()
            url = domain + reverse("web:procedures:update", kwargs={"pk": procedure_id})
            data = {'message': f"Ushbu mijozda yakunlanmagan muolaja bor oldin shuni yakunlang.",
                    "is_created": is_created, "url": url}
        return JsonResponse(status=status.HTTP_200_OK, data=data)

    @staticmethod
    def update_price_fields(data):
        data["cash_pay"] = convert_to_int(data.get("cash_pay", 0))
        data["card_pay"] = convert_to_int(data.get("card_pay", 0))
        data["card_transfer_pay"] = convert_to_int(data.get("card_transfer_pay"))
        data["discount"] = convert_to_int(data.get("discount"))
        data["phone_number"] = phone_number_input_update(data.get("phone_number"))
        return data


class ProcedureListView(LoginRequiredMixin, generic.TemplateView):
    template_name = 'procedures/list.html'


class ProcedureListAPIView(CustomListView):
    queryset = Procedure.objects.all()
    serializer_class = ProcedureListSerializer
    permission_classes = (permissions.AllowAny,)
    pagination_class = CustomPagination

    def get(self, request, *args, **kwargs):
        department_id = request.session.get("department_id")
        search = request.GET.get('search')
        q_filter = Q()
        if search:
            q_filter = Q(Q(client__first_name__icontains=search) | Q(client__last_name__icontains=search))
        if department_id:
            q_filter &= Q(department_id=department_id)
        queryset = Procedure.objects.filter(q_filter).order_by('-updated_at').select_related('client',
                                                                                             "procedure_type").prefetch_related(
            "items").annotate(items_count=Count('items'))
        data = self.get_response_data(self.serializer_class, queryset, many=True)
        return Response(data)


class GeneratePaymentDataAPIView(generics.GenericAPIView):
    serializer_class = ProcedurePaymentMainSerializer

    def get(self, request, *args, **kwargs):
        # Safely get query params with defaults
        try:
            treatments_count = int(request.GET.get('treatments_count', 3))  # Default to 3 if not provided
            discount = int(request.GET.get('discount', 0))  # Default to 0 if not provided
            paid = int(request.GET.get('paid', 0))  # Default to 0 if not provided
        except ValueError:
            return JsonResponse({"error": "Invalid input for treatments_count or discount_price"}, status=400)

        # Get prices from the database
        prices = list(ProcedurePrice.objects.all().values("start_quantity", "end_quantity", "price"))
        result = calculate_price(prices, treatments_count, paid, discount)
        return JsonResponse(result)


class ProcedureTypeListAPIView(CustomListView):
    queryset = ProcedureType.objects.all()
    serializer_class = ProcedureTypeListSerializer
    permission_classes = (permissions.AllowAny,)
    pagination_class = CustomPagination

    def get(self, request, *args, **kwargs):
        search = request.GET.get('search')
        q_filter = Q()
        if search:
            q_filter = Q(name__icontains=search)
        queryset = ProcedureType.objects.filter(q_filter)
        data = self.get_response_data(self.serializer_class, queryset, many=True)
        return Response(data)


class ProcedureUpdateView(LoginRequiredMixin, generic.UpdateView):
    template_name = "procedures/update.html"
    pk_url_kwarg = "pk"
    model = Procedure
    form_class = ProcedureForm
    context_object_name = 'procedure'
    login_url = 'web:auth:login'

    def get_context_data(self, **kwargs):
        import json
        context = super().get_context_data(**kwargs)
        context["products"] = Product.objects.all()
        context["products_list"] = json.dumps(
            list(Product.objects.all().values("id", "name", "price", "default", "default_quantity")))
        context["prices_list"] = list(ProcedurePrice.objects.all().values("start_quantity", "end_quantity", "price"))
        return context


class ProcedureUpdateAPIView(generics.GenericAPIView):
    serializer_class = ProcedureUpdateSerializer
    service = ProcedureUpdateService()

    def post(self, request, *args, **kwargs):
        serializer = ProcedureUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # print(serializer.errors)
        self.service.perform(procedure_id=kwargs.get("pk"), val_data=serializer.validated_data)
        return JsonResponse(status=status.HTTP_200_OK, data={})


class ProcedurePrintView(generic.TemplateView):
    template_name = "printable_pages/payment_check.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        procedure = Procedure.objects.get(pk=self.kwargs['pk'])
        billing_data = self.get_procedure_billing_data(procedure)
        context['transfers'] = Transfer.objects.filter(procedure_id=kwargs.get("pk"))
        context['procedure_type'] = procedure.procedure_type.name
        context['treatment_count'] = procedure.number_of_recommended_treatments
        context['total_need_paid'] = billing_data.get("total_need_paid")
        context['paid'] = billing_data.get("paid")
        context['discount'] = billing_data.get("discount")
        context['need_paid'] = billing_data.get("need_paid")
        return context

    @staticmethod
    def get_procedure_billing_data(procedure: Procedure):
        total_need_paid = procedure.items.all().aggregate(Sum('price')).get("price__sum", 0) or 0
        paid = procedure.procedure_payments.all().aggregate(Sum('amount')).get("amount__sum") or 0
        discount = procedure.discount or 0
        need_paid = total_need_paid - paid - discount
        return {
            "total_need_paid": f"{format_price(total_need_paid)} so'm" if total_need_paid else 0,
            "paid": f"{format_price(paid)} so'm" if paid else 0,
            "discount": f"{format_price(discount)} so'm" if discount else None,
            "need_paid": f"{format_price(need_paid)} so'm" if need_paid else 0
        }
