import datetime
from typing import List

from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from apps.clients.models import Client
from apps.main.models import Procedure, Transfer, ReferralItem, ProcedureItem, ProcedurePrice, Product, ExpenseItem
from web.logics import get_price


class ProcedureBaseService:

    @staticmethod
    def create_transfers(procedure: Procedure, val_data: dict):
        payments = [
            {"amount": val_data.get("cash_pay", 0), "transfer_method": Transfer.MethodTransferEnum.CASH},
            {"amount": val_data.get("card_pay", 0), "transfer_method": Transfer.MethodTransferEnum.CARD},
            {"amount": val_data.get("card_transfer_pay", 0),
             "transfer_method": Transfer.MethodTransferEnum.TRANSFER_TO_CARD}
        ]

        # Iterate over the payments and create a transfer if the amount is greater than 0
        for payment in payments:
            if payment["amount"] > 0:
                Transfer.objects.create(
                    procedure=procedure,
                    transfer_type=Transfer.TypeTransferEnum.INCOME,
                    **payment
                )


class ProcedureCreateService(ProcedureBaseService):
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
        self.create_procedure_items(procedure=procedure)
        return True, procedure.id

    @staticmethod
    def create_referral_item(val_data: dict):
        referral_person = val_data.get("referral_person")
        if referral_person:
            ReferralItem.objects.create(referral_id=referral_person)

    def create_procedure_items(self, procedure: Procedure):
        prices = list(ProcedurePrice.objects.all().values("start_quantity", "end_quantity", "price"))
        for i in range(1, procedure.number_of_recommended_treatments + 1):
            procedure_item = ProcedureItem.objects.create(
                procedure=procedure, n_th_treatment=i, price=get_price(prices=prices, quantity=i))
            self.create_procedure_expanse(procedure_item=procedure_item)

    @staticmethod
    def create_procedure_expanse(procedure_item: ProcedureItem):
        products = Product.objects.filter(default=True)
        for product in products:
            ExpenseItem.objects.create(
                procedure_item=procedure_item, product=product, quantity=product.default_quantity, amount=product.price)

    @staticmethod
    def update_or_create_client(val_data: dict):
        client, created = Client.objects.get_or_create(id=val_data.get("exist_user_id"))
        client.first_name = val_data.get("first_name", client.first_name)
        client.last_name = val_data.get("last_name", client.last_name)
        client.phone_number = val_data.get("phone_number", client.phone_number)
        client.date_of_birth = val_data.get("date_of_birth", client.date_of_birth)
        client.address = val_data.get("address", client.address)
        client.workplace = val_data.get("workplace", client.workplace)
        client.diagnosis = val_data.get("diagnosis", client.diagnosis)
        client.save()
        return client

    @staticmethod
    def has_uncompleted_procedure(client: Client) -> [bool, Procedure]:
        procedure = Procedure.objects.filter(client=client, was_completed=False).order_by("-created_at").first()
        return bool(procedure), procedure


class ProcedureUpdateService(ProcedureBaseService):
    def perform(self, procedure_id: int, val_data: dict):
        print(val_data)
        procedure = get_object_or_404(Procedure, id=procedure_id)
        self.update_client(client=procedure.client, client_data=val_data.get("client"))
        self.create_transfers(procedure=procedure, val_data=val_data.get("billing_data"))
        self.procedure_item_perform(procedure=procedure, val_data=val_data.get("procedure_items", []))
        self.delete_procedure_items(deleted_procedure_items=val_data.get("deleted_procedure_items"))
        procedure.discount = val_data.get("discount", procedure.discount)
        procedure.number_of_recommended_treatments = procedure.items.all().count()
        procedure.description = val_data.get("description", procedure.description)
        procedure.was_completed = val_data.get("was_completed", procedure.was_completed)
        procedure.save()

    @staticmethod
    def update_client(client: Client, client_data: dict):
        for key, value in client_data.items():
            if hasattr(client, key):  # Check if the client object has the attribute
                setattr(client, key, value)  # Set the attribute dynamically
        client.save()  # Save the updated client object

    @staticmethod
    def delete_procedure_items(deleted_procedure_items: List[int]):
        ProcedureItem.objects.filter(id__in=deleted_procedure_items).delete()

    def procedure_item_perform(self, procedure: Procedure, val_data: List[dict]):
        for item in val_data:
            item_id = item.get("procedure_item_id")
            try:
                procedure_item = ProcedureItem.objects.get(id=item_id)
                procedure_item.n_th_treatment = item.get("treatment_count")
                procedure_item.price = item.get("price")
                procedure_item.is_received = item.get("received")
                procedure_item.received_dt = datetime.datetime.now()
                procedure_item.save()
            except ProcedureItem.DoesNotExist:
                procedure_item = ProcedureItem.objects.create(
                    procedure=procedure,
                    n_th_treatment=item.get("treatment_count"),
                    price=item.get("price"),
                    is_received=item.get("received"),
                    received_dt=datetime.datetime.now(),
                )
            self.expanse_update_or_create(procedure_item=procedure_item, val_data=item.get("expanses", []))

    @staticmethod
    def expanse_update_or_create(procedure_item: ProcedureItem, val_data: List[dict]):
        for item in val_data:
            expanse_id = item.get('expanse_id')
            if item.get("quantity") == 0:
                if expanse_id:
                    ExpenseItem.objects.filter(id=expanse_id).delete()
                continue
            try:
                # Get the existing Expanse object by expanse_id
                expanse = ExpenseItem.objects.get(id=expanse_id)
                # Update its fields
                expanse.product_id = item['product']
                expanse.quantity = item['quantity']
                expanse.amount = item['price']
                expanse.save()  # Save the updated object
            except ExpenseItem.DoesNotExist:
                expanse = ExpenseItem.objects.create(
                    procedure_item=procedure_item,
                    product_id=item['product'],
                    quantity=item['quantity'],
                    amount=item['price']
                )
