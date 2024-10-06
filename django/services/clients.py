from apps.clients.models import Client
from web.logics import phone_number_input_update


class ClientCreateService:

    def create_or_update_client(self, val_date: dict):
        exist_user = val_date.get("exist_user_id")
        first_name = val_date.get("first_name")
        last_name = val_date.get("last_name")
        phone_number = val_date.get("phone_number", "")
        date_of_birth = val_date.get("date_of_birth")
        address = val_date.get("address", "")
        workplace = val_date.get("workplace", "")
        diagnosis = val_date.get("diagnosis", "")

        if exist_user:
            client = Client.objects.get(id=exist_user)
            client.first_name = first_name if first_name else client.first_name
            client.last_name = last_name if last_name else client.last_name
            client.phone_number = phone_number if phone_number else client.phone_number
            client.date_of_birth = date_of_birth if date_of_birth else client.date_of_birth
            client.address = address if address else client.address
            client.workplace = workplace if workplace else client.workplace
            client.diagnosis = diagnosis if diagnosis else client.diagnosis
            client.save()
        else:
            client = Client.objects.create(
                first_name=first_name,
                last_name=last_name,
                phone_number=phone_number,
                date_of_birth=date_of_birth,
                address=address,
                workplace=workplace,
                diagnosis=diagnosis,
            )
        return client
