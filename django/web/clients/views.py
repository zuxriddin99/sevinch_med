from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.db.models import Q
from django.shortcuts import render, redirect
from django.views import generic
from gunicorn.config import User
from rest_framework import permissions, status
from rest_framework.response import Response

from apps.clients.models import Client
from apps.main.models import ReferralPerson
from conf.pagination import CustomPagination
from web.auth import forms
from web.clients.serializers import ClientSerializer
from rest_framework import generics

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

