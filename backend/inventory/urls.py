# inventory/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoginView, ProduitViewSet, ProduitListView, ProduitListCreateView

router = DefaultRouter()
router.register(r'produits', ProduitViewSet)  # This will automatically create routes for the CRUD operations

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('api/produit/', ProduitListView.as_view(), name='Produit-list'),
    path('api/produits/', ProduitListCreateView.as_view(), name='produit-list-create'),
    path('', include(router.urls)),  # Include the router URLs
]
