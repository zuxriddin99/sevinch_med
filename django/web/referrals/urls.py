from django.urls import include, path

from web.referrals.views import ReferralPersonListAPIView, ReferralPersonListView, ReferralPersonCreateAPIView, \
    ReferralPersonShortListAPIView, ReferralDetailAPIView, ReferralPersonUpdateAPIView, ReferralInfoAPIView

app_name = "referrals"
urlpatterns = [
    path("", ReferralPersonListView.as_view(), name="list"),
    path("list/api/", ReferralPersonListAPIView.as_view(), name="list-api"),
    path("<int:pk>/get/api/", ReferralDetailAPIView.as_view(), name="get-api"),
    path("<int:pk>/info/api/", ReferralInfoAPIView.as_view(), name="info-api"),
    path("<int:pk>/update/info/api/", ReferralInfoAPIView.as_view(), name="info-api"),
    path("<int:pk>/update/api/", ReferralPersonUpdateAPIView.as_view(), name="update-api"),
    path("short-list/api/", ReferralPersonShortListAPIView.as_view(), name="short-list-api"),
    path("create/", ReferralPersonCreateAPIView.as_view(), name="create"),
]
