from django.urls import include, path

from web.procedures.views import ProcedureListAPIView, ProcedureListView, ProcedureCreateAPIView, \
    ProcedureTypeListAPIView, GeneratePaymentDataAPIView, ProcedureUpdateView, ProcedureUpdateAPIView, \
    ProcedurePrintView

app_name = "procedures"
urlpatterns = [
    path("", ProcedureListView.as_view(), name="list"),
    path("list/api/", ProcedureListAPIView.as_view(), name="list-api"),
    path("get-payment-data/api/", GeneratePaymentDataAPIView.as_view(), name="get-payment-data-api"),
    path("type-list/api/", ProcedureTypeListAPIView.as_view(), name="type-list-api"),
    path("create/", ProcedureCreateAPIView.as_view(), name="create"),
    path("<int:pk>/update/", ProcedureUpdateView.as_view(), name="update"),
    path("<int:pk>/print/", ProcedurePrintView.as_view(), name="print-payment"),
    path("<int:pk>/update/api/", ProcedureUpdateAPIView.as_view(), name="update-api"),
]
