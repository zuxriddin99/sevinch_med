import datetime

from django.db.models import Q
from django.http import JsonResponse
from django.views import generic
from rest_framework import generics
from rest_framework import permissions, status
from rest_framework.response import Response

from apps.main.models import Transfer
from conf.pagination import CustomPagination
from services.statistics import StatisticService
from services.transfers import TransferListService, TransferCreateService
from web.logics import convert_to_int
from web.views import LoginRequiredMixin


class StatisticsListAPIView(generics.GenericAPIView):
    permission_classes = (permissions.AllowAny,)
    service = StatisticService()

    def get(self, request, *args, **kwargs):
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')
        result = self.service.get_main_statistics(start_date, end_date)
        return JsonResponse(status=status.HTTP_200_OK, data=result, safe=False)

    def get_response_data(self, serializer_class, instance, pagination=True, **kwargs) -> dict:
        if "many" in kwargs and pagination:
            page = self.paginate_queryset(instance)
            if page is not None:
                serializer = serializer_class(page, **kwargs)
                return self.get_paginated_response(serializer.data)
        return serializer_class(instance, **kwargs).data


class StatisticView(generic.TemplateView):
    template_name = 'statistics/list.html'
