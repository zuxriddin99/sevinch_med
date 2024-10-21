from django.urls import include, path

from web.transfers.views import TransferListAPIView, TransfersListView, TransferCreateAPIView, StatisticAPIView

app_name = "transfers"
urlpatterns = [
    path("list/api/", TransferListAPIView.as_view(), name="list-api"),
    path("create/api/", TransferCreateAPIView.as_view(), name="create-api"),
    path("statistic/api/", StatisticAPIView.as_view(), name="statistic-api"),
    path("list/", TransfersListView.as_view(), name="list"),
]
