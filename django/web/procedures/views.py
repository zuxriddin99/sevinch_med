from typing import List

from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.db.models import Q, Count
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.views import generic
from gunicorn.config import User
from rest_framework import permissions, status
from rest_framework.response import Response

from apps.clients.models import Client
from apps.main.models import ReferralPerson, Procedure, ProcedureType, ProcedurePrice
from conf.pagination import CustomPagination
from services.procedures import ProcedureCreateService
from web.auth import forms
from web.clients.serializers import ClientSerializer
from rest_framework import generics

from web.logics import convert_to_int, phone_number_input_update
from web.procedures.serializers import ReferralPersonListSerializer, ReferralPersonCreateSerializer, \
    ProcedureListSerializer, ProcedureTypeListSerializer, ProcedurePaymentMainSerializer, ProcedureCreateSerializer
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
        is_created, procedure_id = self.service.create_procedure(val_data=serializer.validated_data)
        url = "http://localhost"
        if is_created:
            return JsonResponse(status=status.HTTP_200_OK, data={"message": "Mijoz uchun muolaja yaratildi", "is_created": is_created})
        return JsonResponse(status=status.HTTP_200_OK, data={'message': f"Ushbu mijozda yakunlanmagan muolaja bor oldin shuni yakunlang {url}", "is_created": is_created})

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

        # Initialize result data
        data = []
        total_price = 0

        # Loop through treatment counts to generate the payment data
        for i in range(1, treatments_count + 1):
            price = self.get_price(prices=prices, quantity=i)
            data.append({
                "name": f"{i}-muolaja.",
                "price": price
            })
            total_price += price

        # Prepare the result
        result = {
            "data": data,
            "total_price": total_price,
            "price": total_price - discount,
            "paid": paid,
            "need_paid": total_price - paid - discount,
            "discount": discount
        }
        return JsonResponse(result)

    @staticmethod
    def get_price(prices: List[dict], quantity: int):
        # Use filter to find the correct price range, or return the last price if no match is found
        price = next(filter(lambda x: x['start_quantity'] <= quantity <= x['end_quantity'], prices), None)

        # Return the matched price, or fallback to the last price in the list
        return price['price'] if price else prices[-1]['price']


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


from django.shortcuts import render, redirect
from web.procedures.forms import ProcedureForm, ProcedureItemFormSet, ExpenseItemFormSet


def create_procedure(request):
    if request.method == 'POST':
        procedure_form = ProcedureForm(request.POST)
        procedure_item_formset = ProcedureItemFormSet(request.POST, prefix='procedure_item')
        expense_item_formset = ExpenseItemFormSet(request.POST, prefix='expense_item')

        if procedure_form.is_valid() and procedure_item_formset.is_valid() and expense_item_formset.is_valid():
            procedure = procedure_form.save()

            # Save Procedure Items
            procedure_items = procedure_item_formset.save(commit=False)
            for item in procedure_items:
                item.procedure = procedure
                item.save()

            # Save Expense Items
            expense_items = expense_item_formset.save(commit=False)
            for expense in expense_items:
                expense.save()

            return redirect('procedure_success_page')

    else:
        procedure_form = ProcedureForm()
        procedure_item_formset = ProcedureItemFormSet(prefix='procedure_item')
        expense_item_formset = ExpenseItemFormSet(prefix='expense_item')

    return render(request, 'procedures/test.html', {
        'procedure_form': procedure_form,
        'procedure_item_formset': procedure_item_formset,
        'expense_item_formset': expense_item_formset,
    })
