"""
Django settings for conf project.

Generated by 'django-admin startproject' using Django 5.0.6.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.0/ref/settings/
"""
import os
from datetime import timedelta
from pathlib import Path
import sentry_sdk

import dj_database_url
from django.contrib.messages import constants as messages

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "django-insecure-krgw8smzy-fd7v&qrh0w0xsb*hgyn9otws1edpapx6m*jw3&z(")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = bool(os.environ.get("DEBUG", True))

ALLOWED_HOSTS = ['*']

# Application definition

BASE_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    "django_filters",
]

LIBS = [
    "rest_framework",
    'nested_admin',

    # 'django_celery_beat',
    # "django_celery_results",
]
APPS = [
    "apps.clients",
    "apps.users",
    "apps.main",
]
INSTALLED_APPS = BASE_APPS + LIBS + APPS

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'conf.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates']
        ,
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'conf.wsgi.application'

# Database
# https://docs.djangoproject.com/en/5.0/ref/settings/#databases

database_url = os.environ.get("DATABASE_URL", None)
if database_url:
    db_from_env = dj_database_url.config(default=database_url, conn_max_age=600)
    DATABASES = {"default": db_from_env}
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = []

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny'
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
    ),
    'DEFAULT_PAGINATION_CLASS': 'conf.pagination.CustomPagination',
}

# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'uz-UZ'
TIME_ZONE = 'Asia/Tashkent'

USE_TZ = True

USE_I18N = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = 'static/'
# STATIC_ROOT = os.path.join(BASE_DIR, "static/")
STATICFILES_DIRS = [
    BASE_DIR / 'static',
]
MEDIA_ROOT = os.path.join(BASE_DIR, "media/")
MEDIA_PATH = "/media/"

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# REDIS_HOST = os.environ.get("REDIS_HOST", "localhost")
# REDIS_PORT = os.environ.get("REDIS_PORT", "6379")
# REDIS_LOCATION = f"redis://{REDIS_HOST}:{REDIS_PORT}/0"
# EXTRA_SETTINGS_ADMIN_APP = "extra_settings"
# CACHES = {
#     'default': {
#         'BACKEND': 'django_redis.cache.RedisCache',
#         'LOCATION': REDIS_LOCATION,
#         "OPTIONS": {
#             "CLIENT_CLASS": "django_redis.client.DefaultClient"
#         },
#         'TIMEOUT': 4233600  # Set the default timeout to 604800 seconds (14 day)
#     }
# }

CSRF_TRUSTED_ORIGINS = ["https://*.zukhriddin.uz", "https://*.zukhriddin.uz", "http://127.0.0.1", "http://localhost",
                        "http://185.43.6.212", "http://185.43.6.212:81"]

# CELERY SETTINGS

# CELERY_broker_url = REDIS_LOCATION
# accept_content = ['application/json']
# result_serializer = 'json'
# task_serializer = 'json'
# result_backend = 'django-db'
# timezone = TIME_ZONE
# result_extended = True

# CELERY_BROKER_URL = REDIS_LOCATION
# CELERY_ACCEPT_CONTENT = ['application/json']
# CELERY_RESULT_SERIALIZER = 'json'
# CELERY_TASK_SERIALIZER = 'json'
# CELERY_RESULT_BACKEND = 'django-db'
# CELERY_TIMEZONE = TIME_ZONE
# CELERY_RESULT_EXTENDED = True

# CELERY BEAT SCHEDULER

# CELERY_BEAT_SCHEDULER = 'django_celery_beat.schedulers:DatabaseScheduler'

DATA_UPLOAD_MAX_MEMORY_SIZE = 104857600
MESSAGE_TAGS = {
    messages.INFO: 'info',
    messages.SUCCESS: 'success',
    messages.WARNING: 'warning',
    messages.ERROR: 'danger',
}
AUTH_USER_MODEL = "users.CustomUser"  # new

sentry_sdk.init(
    dsn=os.environ.get("SENTRY_DSN", None),
    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for tracing.
    traces_sample_rate=1.0,
    # Set profiles_sample_rate to 1.0 to profile 100%
    # of sampled transactions.
    # We recommend adjusting this value in production.
    profiles_sample_rate=1.0,
)
