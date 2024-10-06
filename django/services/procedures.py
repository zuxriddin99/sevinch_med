from django.contrib.auth.models import User

from apps.clients.models import Client
from apps.main.models import Procedure, Transfer, ReferralItem


class ProcedureCreateService:
    def create_procedure(self, department_id: int, val_data: dict) -> [bool, int]:
        client = self.update_or_create_client(val_data=val_data)
        procedure = Procedure.objects.filter(client=client, was_completed=False).order_by("-created_at").first()
        if procedure:
            return False, procedure.id
        procedure = Procedure.objects.create(
            department_id=department_id,
            client=client,
            procedure_type_id=val_data.get("procedure_type"),
            description=val_data.get("description", ""),
            number_of_recommended_treatments=val_data.get("number_of_recommended_treatments", 3),
            discount=val_data.get("discount", 0)
        )
        self.create_referral_item(val_data=val_data)
        self.create_transfers(procedure=procedure, val_data=val_data)
        return True, procedure.id

    @staticmethod
    def create_referral_item(val_data: dict):
        referral_person = val_data.get("referral_person")
        if referral_person:
            ReferralItem.objects.create(referral_id=referral_person)

    @staticmethod
    def create_transfers(procedure: Procedure, val_data: dict):
        cash_pay = val_data.get("cash_pay", 0)
        card_pay = val_data.get("card_pay", 0)
        card_transfer_pay = val_data.get("card_transfer_pay", 0)
        if cash_pay > 0:
            Transfer.objects.create(
                procedure=procedure, transfer_method=Transfer.MethodTransferEnum.CASH, amount=cash_pay,
                transfer_type=Transfer.TypeTransferEnum.INCOME)
        if card_pay > 0:
            Transfer.objects.create(
                procedure=procedure, transfer_method=Transfer.MethodTransferEnum.CARD, amount=card_pay,
                transfer_type=Transfer.TypeTransferEnum.INCOME)
        if card_transfer_pay > 0:
            Transfer.objects.create(
                procedure=procedure, transfer_method=Transfer.MethodTransferEnum.TRANSFER_TO_CARD,
                amount=card_transfer_pay, transfer_type=Transfer.TypeTransferEnum.INCOME)

    @staticmethod
    def update_or_create_client(val_data: dict):
        client, created = Client.objects.get_or_create(id=val_data.get("exist_user_id"))
        client.first_name = val_data.get("first_name")
        client.last_name = val_data.get("last_name")
        client.phone_number = val_data.get("phone_number")
        client.date_of_birth = val_data.get("date_of_birth")
        client.address = val_data.get("address")
        client.workplace = val_data.get("workplace")
        client.diagnosis = val_data.get("diagnosis")
        client.save()
        return client

    @staticmethod
    def has_uncompleted_procedure(client: Client) -> [bool, Procedure]:
        procedure = Procedure.objects.filter(client=client, was_completed=False).order_by("-created_at").first()
        return bool(procedure), procedure
