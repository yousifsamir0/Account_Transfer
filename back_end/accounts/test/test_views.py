from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import Account, Transfer
import uuid 
import csv 
import io



class AccountListViewTest(TestCase):
    client = APIClient()
    url = '/api/accounts/'

    def setUp(self):
        Account.objects.create(id=str(uuid.uuid4()),name='name1',balance=10)
        Account.objects.create(id=str(uuid.uuid4()),name='name2',balance=11)
        Account.objects.create(id=str(uuid.uuid4()),name='name3',balance=12)
        Account.objects.create(id=str(uuid.uuid4()),name='name4',balance=13)

    def test_list_accounts(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(len(response.data),4)

    def test_search_accounts(self):
        response =self.client.get(self.url,{'search':'name1'})
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(len(response.data),1)
        self.assertEqual(response.data[0]['name'],'name1')

    def test_pagination_accounts(self):
        response =self.client.get(self.url,{'limit':1,'offset':1})
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(len(response.data),4)
        self.assertEqual(len(response.data['results']),1)
        self.assertEqual(response.data['results'][0]['name'],'name2')

class FileImportViewTest(TestCase):

    client= APIClient()
    url = '/api/accounts/import/'

    def setUp(self):
        #create in memory csv file
        csv_file = io.StringIO()
        csv_file.name ='accounts.csv'
        writer = csv.writer(csv_file)
        writer.writerow(['ID', 'Name', 'Balance'])
        writer.writerow([str(uuid.uuid4()), 'name1', 100])
        writer.writerow([str(uuid.uuid4()), 'name2', 200])
        csv_file.seek(0)
        self.file=csv_file

    def test_import_csv_file(self):
        response = self.client.post(self.url,{'file':self.file},format='multipart')
        accounts = Account.objects.all()
        self.assertEqual(response.status_code,status.HTTP_201_CREATED)
        self.assertEqual(accounts[0].name,'name1')
        self.assertEqual(accounts[1].name,'name2')

 

class TransferListCreateViewTest(TestCase):
    client = APIClient()
    list_create_url = '/api/accounts/transfer/'
    accountTransfere_url = lambda _,id : f'/api/accounts/{id}/transfer/'

    def setUp(self):
        self.account1 = Account.objects.create(id=str(uuid.uuid4()),name='name1',balance=15)
        self.account2 = Account.objects.create(id=str(uuid.uuid4()),name='name2',balance=20)
        self.account3 = Account.objects.create(id=str(uuid.uuid4()),name='name3',balance=10)

        self.transfer1 = Transfer.objects.create(to_account=self.account2,from_account=self.account1,amount=5) #a1:10, a2:25 ,a3:10
        self.transfer2 = Transfer.objects.create(to_account=self.account3,from_account=self.account2,amount=5) #a1:10, a2:20 ,a3:15
        

    def test_create_transfer(self):
        data = {
            "from_account":self.account1.id,
            "to_account" :self.account2.id,
            "amount" : 5
        }
        response = self.client.post(self.list_create_url,data=data)
        self.assertEqual(response.status_code,status.HTTP_201_CREATED)
        self.account1.refresh_from_db()
        self.account2.refresh_from_db()
        self.assertEqual(self.account2.balance,25)
        self.assertEqual(self.account1.balance,5)


    def test_create_transfer_insufficient_balance(self):
        data = {
            "from_account":self.account1.id,
            "to_account" :self.account2.id,
            "amount" : 11
        }
        response = self.client.post(self.list_create_url,data=data)
        self.assertNotEqual(response.status_code,status.HTTP_201_CREATED)
        self.account1.refresh_from_db()
        self.account2.refresh_from_db()
        self.assertEqual(self.account2.balance,20)
        self.assertEqual(self.account1.balance,10)

    def test_create_transfer_lte_zero_amount(self):
        data = {
            "from_account":self.account1.id,
            "to_account" :self.account2.id,
            "amount" : 0
        }
        response = self.client.post(self.list_create_url,data=data)
        self.assertNotEqual(response.status_code,status.HTTP_201_CREATED)
        self.account1.refresh_from_db()
        self.account2.refresh_from_db()
        self.assertEqual(self.account2.balance,20)
        self.assertEqual(self.account1.balance,10)
    def test_create_transfer_same_sender(self):
        data = {
            "from_account":self.account1.id,
            "to_account" :self.account1.id,
            "amount" : 5
        }
        response = self.client.post(self.list_create_url,data=data)
        self.assertNotEqual(response.status_code,status.HTTP_201_CREATED)
        self.account1.refresh_from_db()
        self.assertEqual(self.account1.balance,10)

    def test_list_transfers(self):
        response = self.client.get(self.list_create_url)
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(len(response.data),2)

    def test_list_account_transfers(self):
        # test list account2 transfers
        response = self.client.get(self.accountTransfere_url(self.account2.id))
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(len(response.data),2)
        self.assertEqual(response.data[1]["to_account"]['name'],self.account2.name) #transfer ordered by '-created' 

        # test list account1 transfers
        response = self.client.get(self.accountTransfere_url(self.account1.id))
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(len(response.data),1)
        self.assertEqual(response.data[0]["from_account"]['name'],self.account1.name) 
    

    

    

        
        
    