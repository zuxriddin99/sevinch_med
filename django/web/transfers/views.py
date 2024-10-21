import datetime

from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.db.models import Q
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.views import generic
from gunicorn.config import User
from rest_framework import permissions, status
from rest_framework.response import Response

from apps.clients.models import Client
from apps.main.models import ReferralPerson, Transfer
from conf.pagination import CustomPagination
from services.clients import ClientCreateService
from services.transfers import TransferListService, TransferCreateService
from web.auth import forms
from web.transfers.serializers import TransferCreateSerializer, TransferSerializer
from rest_framework import generics

from web.logics import phone_number_input_update, convert_to_int
from web.views import LoginRequiredMixin


class TransferListAPIView(generics.ListAPIView):
    queryset = Transfer.objects.all()
    serializer_class = TransferSerializer
    permission_classes = (permissions.AllowAny,)
    pagination_class = CustomPagination

    def get(self, request, *args, **kwargs):
        transfer_method = request.GET.get('transfer_method')
        transfer_type = request.GET.get('transfer_type')
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')
        q_filter = Q()
        if transfer_method:
            q_filter &= Q(transfer_method=transfer_method)
        if transfer_type:
            q_filter &= Q(transfer_type=transfer_type)
        if start_date:
            s_d = datetime.datetime.strptime(start_date, "%d/%m/%y").date()
            q_filter &= Q(created_at__date__gte=s_d)
        if end_date:
            e_d = datetime.datetime.strptime(end_date, "%d/%m/%y").date()
            q_filter &= Q(created_at__date__lte=e_d)
        queryset = Transfer.objects.filter(q_filter).order_by('-updated_at')
        data = self.get_response_data(self.serializer_class, queryset, many=True)
        return Response(data)

    def get_response_data(self, serializer_class, instance, pagination=True, **kwargs) -> dict:
        if "many" in kwargs and pagination:
            page = self.paginate_queryset(instance)
            if page is not None:
                serializer = serializer_class(page, **kwargs)
                return self.get_paginated_response(serializer.data)
        return serializer_class(instance, **kwargs).data


class TransfersListView(LoginRequiredMixin, generic.TemplateView):
    template_name = 'transfers/list.html'
    service = TransferListService()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["statistics"] = self.service.get_transfer_list_context()
        return context


class TransferCreateAPIView(generics.GenericAPIView):
    serializer_class = TransferCreateSerializer
    service = TransferCreateService()

    def post(self, request, *args, **kwargs):
        data = self.update_amount_fields(request.data.copy())
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        department_id = request.session.get('department_id')
        self.service.create_transfer(department_id=department_id, val_data=serializer.validated_data)
        return JsonResponse(status=status.HTTP_200_OK, data={"message": "Ma'lumot qo'shildi"})

    @staticmethod
    def update_amount_fields(data):
        if data.get("amount"):
            data["amount"] = convert_to_int(data.get("amount"))
        return data


class StatisticAPIView(generics.GenericAPIView):
    service = TransferListService()

    def get(self, request, *args, **kwargs):
        data = self.service.get_total_statistic(request.GET)
        return JsonResponse(status=status.HTTP_200_OK, data=data)
