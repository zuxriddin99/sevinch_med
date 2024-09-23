from rest_framework import mixins, viewsets
from rest_framework.serializers import Serializer
from django.views import generic
from django.contrib.auth.mixins import AccessMixin

from apps.users.models import CustomUser


class LoginRequiredMixin(AccessMixin):
    """Verify that the current user is authenticated."""

    def dispatch(self, request, *args, **kwargs):
        print(11)
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
