from django.contrib import admin
from .models import Note, Todo, Process, MetaUser
# Register your models here.
admin.site.register(Todo)
admin.site.register(Process)
admin.site.register(MetaUser)
admin.site.register(Note)
