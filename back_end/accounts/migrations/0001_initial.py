# Generated by Django 5.0.7 on 2024-07-17 01:38

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Account',
            fields=[
                ('id', models.UUIDField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=50)),
                ('balance', models.IntegerField()),
            ],
        ),
    ]