import datetime
import locale
from calendar import month
from typing import List
from dateutil.relativedelta import relativedelta

from django.db import models
from django.db.models import Sum, QuerySet
from django.db.models.functions import TruncDay

from apps.main.models import Transfer, Procedure


class IndexPageService:
    def get_15_days_transfers(self, days_range: List):
        last_15_days_totals = list(
            Transfer.objects.filter(created_at__date__in=days_range)
            .annotate(day=TruncDay('created_at'))
            .values('day')
            .annotate(total_amount=Sum('amount'))
            .order_by('day')
        )
        totals_dict = {item['day'].date(): item['total_amount'] for item in last_15_days_totals}
        return self.reformat_data(days_range, totals_dict)

    @staticmethod
    def reformat_data(days_range: List, data: dict):
        result = []
        for day in days_range:
            result.append(data.get(day, 0))
        return result

    @staticmethod
    def get_last_15_days():
        locale.setlocale(locale.LC_TIME, 'uz_UZ.UTF-8')
        today = datetime.date.today()
        # Generate the last 15 days
        last_15_days = [(today - datetime.timedelta(days=i)) for i in range(15)]
        last_15_days.reverse()
        last_15_days_label = [i.strftime("%-d-%b") for i in last_15_days]
        return last_15_days, last_15_days_label

    @staticmethod
    def get_last_2_month_procedure_counts() -> [int, int]:
        today = datetime.date.today()
        today_minus_month = today - relativedelta(months=1)
        the_month_procedures = Procedure.objects.filter(created_at__date__month=today.month, created_at__date__year=today.year).count()
        prev_month_procedures = Procedure.objects.filter(created_at__date__month=today_minus_month.month, created_at__date__year=today.year).count()
        return the_month_procedures, prev_month_procedures