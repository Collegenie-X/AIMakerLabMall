# Generated by Django 5.2.1 on 2025-05-29 02:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='productimage',
            name='image',
            field=models.ImageField(blank=True, help_text='상품 이미지 파일', null=True, upload_to='products/'),
        ),
    ]
