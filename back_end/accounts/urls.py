from django.urls import path
from .views import AccountListView,AccountDetailsView, FileImportView,TransferListCreateView

urlpatterns = [
    path('',AccountListView.as_view(),name='account-list'),#//
    path('<uuid:pk>/',AccountDetailsView.as_view(),name='account-details-update-delete'),
    path('<uuid:pk>/transfer/',TransferListCreateView.as_view(),name='transfer-list'),
    path('import/',FileImportView.as_view(),name='account-bulk-create'),
    path('transfer/',TransferListCreateView.as_view(),name='transfer-create'),
]