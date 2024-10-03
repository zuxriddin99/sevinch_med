from django.contrib.auth.models import User

from apps.clients.models import Client


class ProcedureCreateService:
    def create_procedure(self, val_data: dict) -> [bool, int]:
        print(val_data)
        exist_user_id = val_data.get("exist_user_id")
        first_name = val_data.get("first_name")
        last_name = val_data.get("last_name")
        date_of_birth = val_data.get("date_of_birth")
        address = val_data.get("address")
        workplace = val_data.get("workplace")
        diagnosis = val_data.get("diagnosis")
        number_of_recommended_treatments = val_data.get("number_of_recommended_treatments")
        cash_pay = val_data.get("cash_pay")
        card_pay = val_data.get("card_pay")
        card_transfer_pay = val_data.get("card_transfer_pay")
        discount = val_data.get("discount")
        phone_number = val_data.get("phone_number")
        client_data = {
            "first_name": first_name,
            "last_name": last_name,
            "phone_number": phone_number,
            "date_of_birth": date_of_birth,
            "address": address,
            "workplace": workplace,
            "diagnosis": diagnosis,
        }
        if exist_user_id:
            user = Client.objects.get(id=exist_user_id)
        else:
            user = Client.objects.create(
                first_name=first_name,
                last_name=last_name,
                phone_number=phone_number,
                date_of_birth=date_of_birth,
                address=address,
                workplace=workplace,
                diagnosis=diagnosis,
            )

        return False, 1