from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
#from ckeditor.fields import RichTextField
from ckeditor_uploader.fields import RichTextUploadingField
# Create your models here.


class Todo(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    details = models.TextField()
    date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title


class Process(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    process_id = models.IntegerField()
    content = models.TextField()

    def __str__(self):
        return self.content


class MetaUser(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    fullname = models.CharField(max_length=100, default='')
    image = models.ImageField(
        upload_to='images/', null=True, default="default.png")

    def __str__(self):
        return '{} | {}'.format(self.username, self.fullname)


class Note(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    #content = models.CharField(max_length=5000, default='')
    content = RichTextUploadingField(blank=True, null=True)

    def __str__(self):
        return str(self.id)
