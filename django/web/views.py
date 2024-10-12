from rest_framework import mixins, viewsets, generics
from rest_framework.serializers import Serializer
from django.views import generic
from django.contrib.auth.mixins import AccessMixin

from apps.users.models import CustomUser


class LoginRequiredMixin(AccessMixin):
    """Verify that the current user is authenticated."""

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return self.handle_no_permission()
        # if not self.has_department(request.user):
        #     return self.handle_no_permission()
        return super().dispatch(request, *args, **kwargs)

    def has_department(self, user: CustomUser):
        return bool(user.department_id)


class HomeView(LoginRequiredMixin, generic.TemplateView):
    template_name = 'index.html'
    login_url = 'web:auth:login'


class TestView(generic.TemplateView):
    template_name = 'test.html'


class CustomListView(generics.ListAPIView):

    def get_response_data(self, serializer_class, instance, pagination=True, **kwargs) -> dict:
        if "many" in kwargs and pagination:
            page = self.paginate_queryset(instance)
            if page is not None:
                serializer = serializer_class(page, **kwargs)
                return self.get_paginated_response(serializer.data)
        return serializer_class(instance, **kwargs).data
