from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Account,Transfer


@receiver(post_save,sender=Transfer)
def create_transfer(sender,instance,created,**kwargs):
    if created:


        from_account = Account.objects.get(id=instance.from_account.id)
        to_account = Account.objects.get(id=instance.to_account.id)

        from_account.balance -= instance.amount
        to_account.balance += instance.amount

        from_account.save()
        to_account.save()


