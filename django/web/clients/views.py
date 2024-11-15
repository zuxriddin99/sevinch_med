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
from apps.main.models import ReferralPerson
from conf.pagination import CustomPagination
from services.clients import ClientCreateService
from web.auth import forms
from web.clients.serializers import ClientSerializer, ClientCreateOrUpdateSerializer
from rest_framework import generics

from web.logics import phone_number_input_update
from web.views import LoginRequiredMixin


class ClientsListAPIView(generics.ListAPIView):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    permission_classes = (permissions.AllowAny,)
    pagination_class = CustomPagination

    def get(self, request, *args, **kwargs):
        search = request.GET.get('search')
        q_filter = Q()
        if search:
            q_filter = Q(first_name__icontains=search) | Q(last_name__icontains=search)
            if search.isdigit():
                q_filter |= Q(id=search)
        queryset = Client.objects.filter(q_filter).order_by('-updated_at')
        data = self.get_response_data(self.serializer_class, queryset, many=True)
        return Response(data)

    def get_response_data(self, serializer_class, instance, pagination=True, **kwargs) -> dict:
        if "many" in kwargs and pagination:
            page = self.paginate_queryset(instance)
            if page is not None:
                serializer = serializer_class(page, **kwargs)
                return self.get_paginated_response(serializer.data)
        return serializer_class(instance, **kwargs).data


class ClientListView(LoginRequiredMixin, generic.TemplateView):
    template_name = 'clients/clients_list.html'


class ClientCreateAPIView(generics.GenericAPIView):
    serializer_class = ClientCreateOrUpdateSerializer
    service = ClientCreateService()

    def post(self, request, *args, **kwargs):
        data = self.update_price_fields(request.data.copy())
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        client = self.service.create_or_update_client(val_date=serializer.validated_data)
        data = {
            "client_id": client.id,
            "message": f"ID-raqam: {client.id}, {client.last_name} {client.first_name} yangilandi."
        }
        return JsonResponse(status=status.HTTP_200_OK, data=data)

    @staticmethod
    def update_price_fields(data):
        if data.get("phone_number"):
            data["phone_number"] = phone_number_input_update(data.get("phone_number"))
        return data


class ClientDetailAPIView(generics.RetrieveAPIView):
    serializer_class = ClientSerializer
    queryset = Client.objects.all()
    permission_classes = (permissions.AllowAny,)
