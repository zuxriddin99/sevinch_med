from django.urls import include, path

from web.transfers.views import TransferListAPIView, TransfersListView, ClientCreateAPIView

app_name = "transfers"
urlpatterns = [
    path("list/api/", TransferListAPIView.as_view(), name="list-api"),
    path("create/api/", ClientCreateAPIView.as_view(), name="create-api"),
    path("list/", TransfersListView.as_view(), name="list"),
]
