from rest_framework import serializers
from django.db import transaction
from .models import Account,Transfer


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model= Account
        fields = ['id','name','balance']

 
class TransferSerializer(serializers.ModelSerializer):
    
    from_account = serializers.PrimaryKeyRelatedField(queryset=Account.objects.all())
    to_account= serializers.PrimaryKeyRelatedField(queryset=Account.objects.all())

    
    # from_account = AccountSerializer(read_only=True)
    # to_account = AccountSerializer(read_only=True)
    
    amount = serializers.IntegerField()
    class Meta:
        model=Transfer
        fields=['from_account','to_account','amount','created_at']
        depth=2
    
    

    def validate(self, attrs):
        from_account = attrs.get('from_account')
        to_account = attrs.get('to_account')
        amount = attrs.get('amount')
        if from_account == to_account:
            raise serializers.ValidationError("Cannot send funds to yourself!")
        if from_account.balance < amount:
            raise serializers.ValidationError("Insufficient funds in sender account !")
        if amount <= 0 :
            raise serializers.ValidationError("Only positive funds are accepted !")
        return attrs

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['from_account'] = AccountSerializer(instance.from_account).data
        representation['to_account'] = AccountSerializer(instance.to_account).data
        return representation




    
class TransferValidationSerializer(serializers.Serializer):
    from_account = serializers.PrimaryKeyRelatedField(queryset=Account.objects.all())
    to_account = serializers.PrimaryKeyRelatedField(queryset=Account.objects.all())
    # to_account = serializers.UUIDField()
    amount = serializers.IntegerField()

    def validate(self, attrs):
        print('from seriaizer',attrs)
        from_account = attrs.get('from_account')
        to_account = attrs.get('to_account')
        amount = attrs.get('amount')
        
        if from_account.balance < amount:
            raise serializers.ValidationError("Insufficient funds in sender account !")
        if amount <= 0 :
            raise serializers.ValidationError("Only positive funds are accepted !")
        
        return {'from_account':from_account.id,'to_account':to_account.id,'amount':amount}
        
    
class FileSerializer(serializers.Serializer):
    file = serializers.FileField()

    def validate_file(self,value):

        if not value.name.lower().endswith('.csv'):
            raise serializers.ValidationError("Invalid file type, expected csv file !")
        return value