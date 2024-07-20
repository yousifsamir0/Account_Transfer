from django.db import models

# Create your models here.

# class Currency(models.Model):
#     name = models.CharField(max_length=50)
#     code = models.CharField(max_length=3)
#     d = models.IntegerField()

class Account(models.Model):

    id = models.UUIDField(primary_key=True)
    name = models.CharField(max_length=50)
    balance = models.IntegerField()
    # currency = models.ForeignKey(Currency)

class Transfer(models.Model):
    from_account = models.ForeignKey(Account,on_delete=models.CASCADE,related_name='from_account')
    to_account = models.ForeignKey(Account,on_delete=models.CASCADE,related_name='to_account')
    amount = models.PositiveIntegerField()
    created_at =  models.DateTimeField(auto_now=True)
    class meta:
        ordering = ['-created_at']
    
