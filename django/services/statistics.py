import datetime
from typing import List

from django.db.models import Case, When, Sum, Value, F, IntegerField
from django.db.models.functions import TruncDate
from django.db.models import Count, Q

from apps.main.models import Transfer, ProcedureItem


class StatisticService:
    def get_main_statistics(self, start_date: str, end_date: str) -> dict:
        start_date, end_date = self.reformat_date_type(start_date, end_date)

        # Query ProcedureItems for the last n days
        procedure_items = ProcedureItem.objects.filter(
            received_dt__date__range=[start_date, end_date],
            is_received=True
        ).order_by("-received_dt__date").values('received_dt__date').annotate(
            _1_3_treatment=Sum(Case(When(n_th_treatment__lte=3, then=1), default=0, output_field=IntegerField())),
            _4_5_treatment=Sum(Case(When(n_th_treatment__gte=4, n_th_treatment__lte=5, then=1), default=0,
                                    output_field=IntegerField())),
            _6_10_treatment=Sum(Case(When(n_th_treatment__gte=6, n_th_treatment__lte=10, then=1), default=0,
                                     output_field=IntegerField())),
            drug=Sum('drug'),
            adapter=Sum('adapter')
        )

        # Query Transfers for the last n days and group by transfer method
        transfers = Transfer.objects.filter(
            created_at__date__range=[start_date, end_date]
        ).values('created_at__date').annotate(
            cash=Sum(Case(When(transfer_method='cash', then='amount'), default=Value(0), output_field=IntegerField())),
            card=Sum(Case(When(transfer_method='card', then='amount'), default=Value(0), output_field=IntegerField())),
            transfer_to_card=Sum(Case(When(transfer_method='transfer_to_card', then='amount'), default=Value(0),
                                      output_field=IntegerField()))
        )
        # Merge ProcedureItems and Transfers results by date
        result = []
        for p_item in procedure_items:
            date = p_item['received_dt__date']
            transfer = next((t for t in transfers if t['created_at__date'] == date), {})
            result.append({
                "received_dt": date.strftime('%d/%m/%y'),
                "_1_3_treatment": p_item["_1_3_treatment"],
                "_4_5_treatment": p_item["_4_5_treatment"],
                "_6_10_treatment": p_item["_6_10_treatment"],
                "drug": p_item["drug"],
                "adapter": p_item["adapter"],
                "cash": transfer.get("cash", 0),
                "card": transfer.get("card", 0),
                "transfer_to_card": transfer.get("transfer_to_card", 0),
            })
        return {
            "message": f"{start_date.strftime('%d/%m/%y')} sanadan {end_date.strftime('%d/%m/%y')} sanagacha ma'lumotlar ko'rsatilyabdi.",
            "result": result
        }

    @staticmethod
    def reformat_date_type(start_date: str, end_date: str):
        today = datetime.date.today()
        last_10_day = today - datetime.timedelta(days=10)
        start_date = datetime.datetime.strptime(start_date, "%d/%m/%y").date() if start_date else last_10_day
        end_date = datetime.datetime.strptime(end_date, "%d/%m/%y").date() if end_date else today
        return start_date, end_date
