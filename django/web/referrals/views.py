from datetime import datetime

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
from apps.main.models import ReferralPerson
from conf.pagination import CustomPagination
from web.auth import forms
from web.clients.serializers import ClientSerializer
from rest_framework import generics

from web.referrals.serializers import ReferralPersonListSerializer, ReferralPersonCreateSerializer, \
    ReferralPersonShortListSerializer, ReferralDetailSerializer, ReferralInfoSerializer
from web.views import LoginRequiredMixin


class ReferralPersonListAPIView(generics.ListAPIView):
    queryset = ReferralPerson.objects.all()
    serializer_class = ReferralPersonListSerializer
    permission_classes = (permissions.AllowAny,)
    pagination_class = CustomPagination

    def get(self, request, *args, **kwargs):
        search = request.GET.get('search')
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')
        q_filter = Q()
        q_item_filter = Q()
        if search:
            q_filter = Q(full_name__icontains=search)
            if search.isdigit():
                q_filter |= Q(id=search)
        if start_date:
            s_d = datetime.strptime(start_date, "%d/%m/%y").date()
            q_item_filter &= Q(referral_items__created_at__date__gte=s_d)
        if end_date:
            e_d = datetime.strptime(end_date, "%d/%m/%y").date()
            q_item_filter &= Q(referral_items__created_at__date__lte=e_d)

        # queryset = ReferralPerson.objects.filter(q_filter).order_by('-updated_at')

        queryset = ReferralPerson.objects.filter(q_filter).annotate(
            total_invited_people=Count(
                'referral_items',
                filter=q_item_filter
            ),
            unpaid_invited_people=Count(
                'referral_items',
                filter=Q(referral_items__was_paid=False) & Q(q_item_filter)
            )
        ).order_by('-total_invited_people')

        data = self.get_response_data(self.serializer_class, queryset, many=True)
        return Response(data)

    def get_response_data(self, serializer_class, instance, pagination=True, **kwargs) -> dict:
        if "many" in kwargs and pagination:
            page = self.paginate_queryset(instance)
            if page is not None:
                serializer = serializer_class(page, **kwargs)
                return self.get_paginated_response(serializer.data)
        return serializer_class(instance, **kwargs).data


class ReferralPersonShortListAPIView(generics.ListAPIView):
    queryset = ReferralPerson.objects.all()
    serializer_class = ReferralPersonShortListSerializer
    permission_classes = (permissions.AllowAny,)
    pagination_class = CustomPagination

    def get(self, request, *args, **kwargs):
        search = request.GET.get('search')
        q_filter = Q()
        if search:
            q_filter = Q(full_name__icontains=search)
            if search.isdigit():
                q_filter |= Q(id=search)
        queryset = ReferralPerson.objects.filter(q_filter).order_by('-updated_at')
        data = self.get_response_data(self.serializer_class, queryset, many=True)
        return Response(data)

    def get_response_data(self, serializer_class, instance, pagination=True, **kwargs) -> dict:
        if "many" in kwargs and pagination:
            page = self.paginate_queryset(instance)
            if page is not None:
                serializer = serializer_class(page, **kwargs)
                return self.get_paginated_response(serializer.data)
        return serializer_class(instance, **kwargs).data


class ReferralPersonCreateAPIView(generics.CreateAPIView):
    model = ReferralPerson
    serializer_class = ReferralPersonCreateSerializer
    permission_classes = (permissions.AllowAny,)


class ReferralPersonUpdateAPIView(generics.UpdateAPIView):
    model = ReferralPerson
    serializer_class = ReferralPersonCreateSerializer
    permission_classes = (permissions.AllowAny,)
    lookup_url_kwarg = "pk"
    queryset = ReferralPerson.objects.all()


class ReferralPersonListView(LoginRequiredMixin, generic.TemplateView):
    template_name = 'referrals/referral_person_list.html'


class ReferralDetailAPIView(generics.RetrieveAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = ReferralDetailSerializer
    lookup_url_kwarg = "pk"
    queryset = ReferralPerson.objects.all()


class ReferralInfoAPIView(generics.GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = ReferralInfoSerializer
    lookup_url_kwarg = "pk"
    queryset = ReferralPerson.objects.all()

    def get(self, request, *args, **kwargs):
        referral = ReferralPerson.objects.get(id=kwargs.get("pk"))
        all_referrals = referral.referral_items.all().count()
        paid_referrals = referral.referral_items.filter(was_paid=True).count()
        unpaid_referrals = all_referrals - paid_referrals
        data = {
            "id": referral.id,
            "all_referrals": all_referrals,
            "paid_referrals": paid_referrals,
            "unpaid_referrals": unpaid_referrals,
        }
        return JsonResponse(status=status.HTTP_200_OK, data=data)

    def patch(self, request, *args, **kwargs):
        referral = ReferralPerson.objects.get(id=kwargs.get("pk"))
        pay = int(request.data.get("pay"))
        if pay:
            for r in referral.referral_items.filter(was_paid=False)[:pay]:
                r.was_paid = True
                r.save()
        return JsonResponse(status=status.HTTP_200_OK, data={})
