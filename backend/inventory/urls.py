# inventory/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoginView, ProduitViewSet, ProduitListCreateView, ClientViewSet, FactureViewSet

router = DefaultRouter()
router.register(r'produits', ProduitViewSet)  # This will automatically create routes for the CRUD operations
router.register(r'clients', ClientViewSet)
router.register(r'factures', FactureViewSet)

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('api/produits/', ProduitListCreateView.as_view(), name='produit-list-create'),
    path('', include(router.urls)),  # Include the router URLs
]
