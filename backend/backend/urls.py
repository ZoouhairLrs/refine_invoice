# backend/urls.py

from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('inventory.urls')),  # Auth URLs
    path('api/', include('inventory.urls')),  # Products URLs
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
