
from django.contrib import admin
from django.urls import path, re_path
from django.urls.conf import include
from todo import views
from django.conf.urls.static import static
from django.conf import settings
urlpatterns = [
    #####################home_page###########################################
    path('', views.home, name="home"),
    path('manage/', views.manage, name="manage"),
    path('logout/', views.logout_view, name="logout"),
    path('detail/<int:item_id>', views.detail, name="detail"),
    ####################give id no. item_id name or item_id=i.id ############
    path('del/<int:item_id>', views.remove, name="del"),
    path('createprocess/', views.createprocess, name="create"),
    path('deleteprocess/<int:item_id>', views.deleteprocess, name="delprocess"),
    path('updateprocess/<int:item_id>',
         views.updateprocess, name="updateprocess"),
    ########################################################################
    path('admin/', admin.site.urls),

    path('calendar/', views.calendar, name="calendar"),
    path('delete/<int:item_id>', views.delete, name="delete"),
    path('update/<int:item_id>', views.update, name="update"),

    path('note/', views.note, name="note"),
    path('ckeditor/', include('ckeditor_uploader.urls')),
    path('add_note/', views.add_note, name="add_note"),
    path('delete_note/<int:item_id>', views.delete_note, name="delete_note"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
