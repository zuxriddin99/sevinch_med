from django.urls import include, path

from web.referrals.views import ReferralPersonListAPIView, ReferralPersonListView, ReferralPersonCreateAPIView, \
    ReferralPersonShortListAPIView

app_name = "referrals"
urlpatterns = [
    path("", ReferralPersonListView.as_view(), name="list"),
    path("list/api/", ReferralPersonListAPIView.as_view(), name="list-api"),
    path("short-list/api/", ReferralPersonShortListAPIView.as_view(), name="short-list-api"),
    path("create/", ReferralPersonCreateAPIView.as_view(), name="create"),
]
