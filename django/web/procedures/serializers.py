from rest_framework import serializers
import re
from apps.clients.models import Client
from apps.main.models import ReferralPerson, Procedure, ProcedureType


class ReferralPersonListSerializer(serializers.ModelSerializer):
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


class ProcedureClientSerializer(serializers.ModelSerializer):
    date_of_birth = serializers.SerializerMethodField()
    trunc_name = serializers.SerializerMethodField()
    phone_number = serializers.SerializerMethodField()

    class Meta:
        model = Client
        fields = ["id", "first_name", "last_name", "date_of_birth", "address", "created_at", "trunc_name",
                  "phone_number"]

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
    def get_phone_number(obj: Client) -> str:
        return obj.formated_phone_number


class ProcedureListSerializer(serializers.ModelSerializer):
    procedure_type_name = serializers.CharField(source='procedure_type.name')
    client = ProcedureClientSerializer()
    items_count = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()

    class Meta:
        model = Procedure
        fields = [
            "id",
            "client",
            "procedure_type_name",
            "was_completed",
            "number_of_recommended_treatments",
            "items_count",
            "created_at",
        ]

    @staticmethod
    def get_created_at(obj: Procedure) -> str:
        return obj.translated_created_at

    @staticmethod
    def get_items_count(obj: Procedure):
        return obj.items.filter(is_received=True).count()

class ProcedureTypeListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcedureType
        fields = ["id", "name"]


class ProcedurePaymentDataSerializer(serializers.Serializer):
    name = serializers.CharField()
    price = serializers.IntegerField()


class ProcedurePaymentMainSerializer(serializers.Serializer):
    data = ProcedurePaymentDataSerializer(many=True)
    total_price = serializers.IntegerField()
    discount_price = serializers.IntegerField()


class ProcedureCreateSerializer(serializers.Serializer):
    exist_user_id = serializers.IntegerField(required=False)
    first_name = serializers.CharField(required=False)
    last_name = serializers.CharField(required=False)
    phone_number = serializers.CharField(required=False)
    date_of_birth = serializers.DateField(required=False, input_formats=["%d/%m/%Y"], )
    address = serializers.CharField(required=False)
    workplace = serializers.CharField(required=False)
    diagnosis = serializers.CharField(required=False)
    referral_person = serializers.IntegerField(required=False)
    number_of_recommended_treatments = serializers.IntegerField(required=False)
    procedure_type = serializers.IntegerField(required=False)
    description = serializers.CharField(required=False)
    cash_pay = serializers.IntegerField(required=False, default=0)
    card_pay = serializers.IntegerField(required=False, default=0)
    card_transfer_pay = serializers.IntegerField(required=False, default=0)
    discount = serializers.IntegerField(required=False, default=0)


# Serializer for Expanses
class ExpanseSerializer(serializers.Serializer):
    expanse_id = serializers.IntegerField(default=0)
    product = serializers.IntegerField(default=0)
    quantity = serializers.IntegerField(default=0)
    price = serializers.IntegerField(default=0)


# Serializer for Procedure Items
class ProcedureItemSerializer(serializers.Serializer):
    price = serializers.IntegerField(default=0)
    received = serializers.BooleanField()
    treatment_count = serializers.IntegerField(default=0)
    procedure_item_id = serializers.IntegerField(default=0)
    drug = serializers.IntegerField(default=0)
    adapter = serializers.IntegerField(default=0)


# Serializer for Client Information
class ClientSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=100, required=False)
    last_name = serializers.CharField(max_length=100, required=False)
    phone_number = serializers.CharField(max_length=20, required=False)
    date_of_birth = serializers.DateField(required=False,
                                          input_formats=["%d/%m/%Y"])  # Expecting date in "dd/mm/yyyy" format
    address = serializers.CharField(default="", required=False, allow_blank=True)
    workplace = serializers.CharField(allow_blank=True, required=False)
    diagnosis = serializers.CharField(allow_blank=True, required=False)


# Serializer for Billing Data
class BillingDataSerializer(serializers.Serializer):
    cash_pay = serializers.IntegerField(default=0, required=False)
    card_pay = serializers.IntegerField(default=0, required=False)
    card_transfer_pay = serializers.IntegerField(default=0, required=False)


# Serializer for the entire Procedure Data
class ProcedureUpdateSerializer(serializers.Serializer):
    procedure_items = ProcedureItemSerializer(many=True, required=False)  # Nested list of procedure items
    client = ClientSerializer(required=False)  # Nested client data
    was_completed = serializers.BooleanField(default=False)
    description = serializers.CharField(allow_blank=True, required=False)
    discount = serializers.IntegerField(default=0, required=False)
    billing_data = BillingDataSerializer(required=False)  # Nested billing data
    deleted_procedure_items = serializers.ListSerializer(child=serializers.IntegerField(), required=False)
