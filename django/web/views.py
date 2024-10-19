import datetime
import locale

from rest_framework import mixins, viewsets, generics
from rest_framework.serializers import Serializer
from django.views import generic
from django.contrib.auth.mixins import AccessMixin

from apps.main.models import Procedure
from apps.users.models import CustomUser
from services.index import IndexPageService
from web.logics import format_price


class LoginRequiredMixin(AccessMixin):
    """Verify that the current user is authenticated."""

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return self.handle_no_permission()
        # if not self.has_department(request.user):
        #     return self.handle_no_permission()
        return super().dispatch(request, *args, **kwargs)

    def has_department(self, user: CustomUser):
        return bool(user.department_id)


class HomeView(LoginRequiredMixin, generic.TemplateView):
    template_name = 'index.html'
    login_url = 'web:auth:login'
    service = IndexPageService()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        last_15_days, last_15_days_label = self.service.get_last_15_days()
        last_15_days_transfers = self.service.get_15_days_transfers(last_15_days)
        the_month_procedures, prev_month_procedures = self.service.get_last_2_month_procedure_counts()
        context["last_15_days_label"] = last_15_days_label
        context["last_15_days_transfers"] =last_15_days_transfers
        context["today_transfer_amount"] = format_price(last_15_days_transfers[-1])
        context["yesterday_transfer_amount"] = format_price(last_15_days_transfers[-2])
        context["total_procedures"] = Procedure.objects.all().count()
        context["the_month_procedures"] = the_month_procedures
        context["prev_month_procedures"] = prev_month_procedures
        return context


class TestView(generic.TemplateView):
    template_name = 'test.html'


class CustomListView(generics.ListAPIView):

    def get_response_data(self, serializer_class, instance, pagination=True, **kwargs) -> dict:
        if "many" in kwargs and pagination:
            page = self.paginate_queryset(instance)
            if page is not None:
                serializer = serializer_class(page, **kwargs)
                return self.get_paginated_response(serializer.data)
        return serializer_class(instance, **kwargs).data
