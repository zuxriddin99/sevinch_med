import datetime
from dateutil.relativedelta import relativedelta
from django.db.models import Sum, Case, When

from apps.main.models import Transfer


class TransferListService:
    def get_transfer_list_context(self):
        today = datetime.date.today()
        data = {
            "today": self.get_today_data(today=today),
            "yesterday": self.get_yesterday_data(today=today),
            "the_month": self.get_the_month_data(today=today),
        }
        print(data)
        return data

    @staticmethod
    def get_today_data(today: datetime.date):
        return Transfer.objects.filter(
            created_at__date=today,
        ).aggregate(
            income_total=Sum(Case(
                When(transfer_type=Transfer.TypeTransferEnum.INCOME, then='amount'),
                default=0
            )),
            expense_total=Sum(Case(
                When(transfer_type=Transfer.TypeTransferEnum.EXPENSE, then='amount'),
                default=0
            ))
        )

    @staticmethod
    def get_yesterday_data(today: datetime.date):
        yesterday = today - relativedelta(days=1)
        return Transfer.objects.filter(
            created_at__date=yesterday,
        ).aggregate(
            income_total=Sum(Case(
                When(transfer_type=Transfer.TypeTransferEnum.INCOME, then='amount'),
                default=0
            )),
            expense_total=Sum(Case(
                When(transfer_type=Transfer.TypeTransferEnum.EXPENSE, then='amount'),
                default=0
            ))
        )

    @staticmethod
    def get_the_month_data(today: datetime.date):
        return Transfer.objects.filter(
            created_at__year=today.year,
            created_at__month=today.month
        ).aggregate(
            income_total=Sum(Case(
                When(transfer_type=Transfer.TypeTransferEnum.INCOME, then='amount'),
                default=0
            )),
            expense_total=Sum(Case(
                When(transfer_type=Transfer.TypeTransferEnum.EXPENSE, then='amount'),
                default=0
            ))
        )
