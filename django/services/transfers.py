import datetime
from dateutil.relativedelta import relativedelta
from django.db.models import Sum, Case, When, Q

from apps.main.models import Transfer
from web.logics import format_price


class TransferListService:
    def get_transfer_list_context(self):
        today = datetime.date.today()
        data = {
            "all": self.reformat_data(self.get_all_data()),
            "today": self.reformat_data(self.get_today_data(today=today)),
            "yesterday": self.reformat_data(self.get_yesterday_data(today=today)),
            "the_month": self.reformat_data(self.get_the_month_data(today=today)),
        }
        return data

    def get_total_statistic(self, get_data: dict):
        transfer_method = get_data.get('transfer_method')
        transfer_type = get_data.get('transfer_type')
        start_date = get_data.get('start_date')
        end_date = get_data.get('end_date')
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
        return self.reformat_data(
            Transfer.objects.filter(
                q_filter
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
        )

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
    def get_all_data():
        return Transfer.objects.all(
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
    def reformat_data(data):
        return {
            "income_total": data.get("income_total") or 0,
            "expense_total": format_price(data.get("expense_total") or 0),
        }

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


class TransferCreateService:

    def create_transfer(self, department_id: int, val_data: dict):
        Transfer.objects.create(department_id=department_id, **val_data)
