# Generated by Django 3.2.8 on 2021-12-04 09:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todo', '0012_alter_metauser_image'),
    ]

    operations = [
        migrations.CreateModel(
            name='Note',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(default='', max_length=100)),
                ('content', models.CharField(default='', max_length=5000)),
            ],
        ),
    ]