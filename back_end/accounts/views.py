from rest_framework import generics,status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.pagination import LimitOffsetPagination
from django.db.models import Q

from .models import Account,Transfer

from .serializers import AccountSerializer,FileSerializer,TransferSerializer,TransferValidationSerializer

import csv

class AccountListView(generics.ListAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    pagination_class = LimitOffsetPagination
    def get_queryset(self):
        queryset = Account.objects.all()
        seach_keyword = self.request.query_params.get('search')
        if seach_keyword is not None:
            queryset = queryset.filter(name__contains=seach_keyword)
        return queryset

class AccountDetailsView(generics.RetrieveUpdateDestroyAPIView):
    queryset =Account.objects.all()
    serializer_class = AccountSerializer

class TransferListCreateView(generics.ListCreateAPIView):

    serializer_class = TransferSerializer
    pagination_class = LimitOffsetPagination

    def get_queryset(self):
        queryset = Transfer.objects.all()   
        id = self.kwargs.get('pk')
        if id is not None:
            queryset = queryset.filter(Q(from_account_id=id) | Q(to_account_id=id))
        return queryset
    

    
class FileImportView(generics.GenericAPIView):
    serializer_class= FileSerializer
    def post(self,request:Request):
        serializer = self.serializer_class(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        
        
        file = request.FILES['file']
        decoded_file = file.read().decode('utf-8').splitlines()
        csv_reader = csv.DictReader(decoded_file)

        rows_length= len(decoded_file)-1
        rows_error=[]
        accounts=[]
        for row in csv_reader:
            try:
                balance = int(float(row['Balance'])*100)
                accounts.append( Account(id=row['ID'],name=row['Name'],balance=balance))
            except Exception as e:
                ext_row = row
                ext_row['error'] = e
                rows_error.append(ext_row)
        Account.objects.bulk_create(accounts,update_conflicts=True,update_fields=['name','balance'],unique_fields=['id'])
        return Response({"created":rows_length-len(rows_error),"fail": len(rows_error)}, status=status.HTTP_201_CREATED)