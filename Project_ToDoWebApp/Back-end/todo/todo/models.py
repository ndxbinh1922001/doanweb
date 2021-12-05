from django.db import models
from django.utils import timezone
#from ckeditor.fields import RichTextField
from ckeditor_uploader.fields import RichTextUploadingField
# Create your models here.


class Todo(models.Model):
    username = models.CharField(max_length=100, default='')
    title = models.CharField(max_length=100)
    details = models.TextField()
    date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title


class Process(models.Model):
    username = models.CharField(max_length=100, default='')
    title = models.CharField(max_length=100)
    process_id = models.IntegerField()
    content = models.TextField()

    def __str__(self):
        return self.content


class MetaUser(models.Model):
    username = models.CharField(max_length=100, default='')
    fullname = models.CharField(max_length=100, default='')
    image = models.ImageField(
        upload_to='images/', null=True, default="default.png")

    def __str__(self):
        return '{} | {}'.format(self.username, self.fullname)


class Note(models.Model):
    username = models.CharField(max_length=100, default='')
    #content = models.CharField(max_length=5000, default='')
    content = RichTextUploadingField(blank=True, null=True)

    def __str__(self):
        return str(self.id)
