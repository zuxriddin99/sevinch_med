from rest_framework import serializers
import re
from apps.clients.models import Client
from apps.main.models import ReferralPerson


class ReferralPersonListSerializer(serializers.ModelSerializer):
    total_invited_people = serializers.SerializerMethodField()
    unpaid_invited_people = serializers.SerializerMethodField()
    trunc_name = serializers.SerializerMethodField()
    additional_information = serializers.SerializerMethodField()
    phone_number = serializers.SerializerMethodField()
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = ReferralPerson
        fields = [
            "id",
            "full_name",
            "phone_number",
            "additional_information",
            "total_invited_people",
            "unpaid_invited_people",
            "trunc_name",
        ]

    @staticmethod
    def get_additional_information(obj: ReferralPerson):
        return obj.additional_information if obj.additional_information else "-"

    @staticmethod
    def get_phone_number(obj: ReferralPerson):
        return obj.formated_phone_number if obj.phone_number else "-"

    @staticmethod
    def get_full_name(obj: ReferralPerson):
        return obj.full_name if obj.full_name else "-"

    @staticmethod
    def get_total_invited_people(obj: ReferralPerson):
        return obj.total_invited_people

    @staticmethod
    def get_unpaid_invited_people(obj: ReferralPerson):
        return obj.unpaid_invited_people

    @staticmethod
    def get_trunc_name(obj: ReferralPerson) -> str:
        name_parts = obj.full_name.split()
        # Get the first letter of the first two words (if they exist)
        return "".join([name[0].upper() for name in name_parts[:2]])


class ReferralPersonCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReferralPerson
        fields = ["full_name", "phone_number", "additional_information"]

    def to_internal_value(self, data):
        phone_number = data.get("phone_number")
        if phone_number:
            # Remove parentheses, spaces, and other non-numeric characters
            cleaned_number = re.sub(r'\D', '', phone_number)

            # Add the country code prefix
            data["phone_number"] = '+998' + cleaned_number
        return super().to_internal_value(data)


class ReferralPersonShortListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReferralPerson
        fields = [
            "id",
            "full_name",
        ]
