from rest_framework import serializers

from apps.clients.models import Client


class ClientSerializer(serializers.ModelSerializer):
    date_of_birth = serializers.SerializerMethodField()
    date_of_birth_for_input = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()
    trunc_name = serializers.SerializerMethodField()
    phone_number = serializers.SerializerMethodField()
    phone_number_for_input = serializers.SerializerMethodField()

    class Meta:
        model = Client
        fields = ["id",
                  "first_name",
                  "last_name",
                  "date_of_birth",
                  "address",
                  "created_at",
                  "trunc_name",
                  "phone_number",
                  "phone_number_for_input",
                  "workplace",
                  "date_of_birth_for_input",
                  "diagnosis"]

    @staticmethod
    def get_trunc_name(obj: Client) -> str:
        return ''.join(filter(None, [
            obj.last_name[0].upper() if obj.last_name else '',
            obj.first_name[0].upper() if obj.first_name else ''
        ])) or "AA"

    @staticmethod
    def get_date_of_birth(obj: Client) -> str:
        return obj.translated_date_of_birth

    @staticmethod
    def get_date_of_birth_for_input(obj: Client) -> str:
        return obj.date_of_birth.strftime("%d/%m/%Y") if obj.date_of_birth else ""

    @staticmethod
    def get_created_at(obj: Client) -> str:
        return obj.translated_created_at

    @staticmethod
    def get_phone_number(obj: Client) -> str:
        return obj.formated_phone_number

    @staticmethod
    def get_phone_number_for_input(obj: Client) -> str:
        if obj.phone_number.startswith("+998") and len(obj.phone_number) == 13:
            return obj.phone_number.replace("+998", "")
        return ""
