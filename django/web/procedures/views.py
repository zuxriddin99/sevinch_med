from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.db.models import Q, Count
from django.shortcuts import render, redirect
from django.views import generic
from gunicorn.config import User
from rest_framework import permissions, status
from rest_framework.response import Response

from apps.clients.models import Client
from apps.main.models import ReferralPerson, Procedure, ProcedureType
from conf.pagination import CustomPagination
from web.auth import forms
from web.clients.serializers import ClientSerializer
from rest_framework import generics

from web.procedures.serializers import ReferralPersonListSerializer, ReferralPersonCreateSerializer, \
    ProcedureListSerializer, ProcedureTypeListSerializer
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
