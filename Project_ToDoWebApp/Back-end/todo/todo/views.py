from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .forms import DocumentForm, TodoForm, ProcessForm, UserForm
from .models import Todo, Process, MetaUser
from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import UserCreationForm
from django.core.files.storage import FileSystemStorage
from django.contrib.auth import logout
###############################################


def logout_view(request):
    logout(request)
    return redirect("home")


@login_required(redirect_field_name='home')
@login_required(redirect_field_name='home')
def manage(request):
    user = MetaUser.objects.get(username__exact=request.user.username)
    fullname = getattr(user, 'fullname')
    username = getattr(user, 'username')
    img = getattr(user, "image")

    item_list = Todo.objects.order_by(
        "-date").filter(username__exact=request.user.username)
    if request.method == "POST" and request.FILES:
        metauser = MetaUser.objects.get(
            username__exact=request.user.username)
        print("anh")
        if metauser == None:
            meta = UserForm(username=request.user.username,
                            fullname=request.POST['fullname'], image=request.POST['image'])
            if meta.is_valid():
                meta.save()
        else:
            if len(request.FILES) != 0:
                uploaded_file = request.FILES['document']
                fs = FileSystemStorage()
                name = fs.save(uploaded_file.name, uploaded_file)
                metauser.image = name
                metauser.save()
    elif request.method == "POST" and "fullname" in request.POST:
        print("fullname")
        metauser = MetaUser.objects.get(username__exact=request.user.username)
        if metauser == None:
            meta = UserForm(username=request.user.username,
                            fullname=request.POST['fullname'], image=request.POST['image'])
            if meta.is_valid():
                meta.save()
        else:
            metauser.fullname = request.POST['fullname']
            metauser.save()
    elif request.method == "POST" and "title_update" in request.POST:
        print("ok")
        print(request.POST['title_update'])
        print(request.POST['details_update'])
        print(request.POST['date_update'])
        todo = Todo.objects.get(
            username__exact=request.user.username, title__exact=request.POST['title_old'])
        todo.title = request.POST['title_update']
        todo.details = request.POST['details_update']
        if len(request.POST['date_update']) != 0:
            todo.date = request.POST['date_update']
        todo.save()
    elif request.method == "POST":
        print("no ok")
        print("task")
        todo = Todo(username=request.user.username,
                    title=request.POST['title'], details=request.POST['details'], date=request.POST['date'])
        todo.save()
        form = TodoForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('manage')
    form = TodoForm()
    form1 = DocumentForm()
    user = MetaUser.objects.get(username__exact=request.user.username)
    img = getattr(user, "image")
    fullname = getattr(user, 'fullname')
    print(img)
    page = {
        "forms": form,
        "list": item_list,
        "title": "TODO LIST",
        "fullname": fullname,
        "img": img,
        "username": username,
        "form1": form1,
    }
    return render(request, 'todo/index.html', page)


def home(request):
    if (request.method == "POST" and 'button-login' in request.POST):
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect("manage")
    if (request.method == "POST" and 'button-logup' in request.POST):
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            username = request.POST['username']
            print(username)
            raw_password = request.POST['password1']
            user = authenticate(request, username=username,
                                password=raw_password)
            login(request, user)
            meta = MetaUser()
            meta.username = request.user.username
            meta.save()
            return redirect("manage")
    return render(request, 'todo/home.html')


### function to remove item , it recive todo item id from url ##


@login_required(redirect_field_name='home')
def remove(request, item_id):
    item = Todo.objects.get(id=item_id)
    item.delete()

    return redirect('manage')


@login_required(redirect_field_name='home')
def detail(request, item_id):
    item = Todo.objects.get(id=item_id)
    list_nostatus = Process.objects.filter(
        username__exact=item.username).filter(title__exact=item.title).filter(process_id=0)
    list_notstarted = Process.objects.filter(
        username__exact=item.username).filter(title__exact=item.title).filter(process_id=1)
    list_inprogress = Process.objects.filter(
        username__exact=item.username).filter(title__exact=item.title).filter(process_id=2)
    list_complete = Process.objects.filter(
        username__exact=item.username).filter(title__exact=item.title).filter(process_id=3)
    username = item.username
    title = item.title
    list_todo = Todo.objects.filter()
    user = MetaUser.objects.get(username__exact=request.user.username)
    img = getattr(user, "image")
    fullname = getattr(user, 'fullname')
    return render(request, 'todo/process_function.html', {
        "img": img,
        "fullname": fullname,
        'username': username,
        'title': title,
        'list_nostatus': list_nostatus,
        'list_notstarted': list_notstarted,
        'list_inprogress': list_inprogress,
        'list_complete': list_complete,
        "list_todo": list_todo,
    })


@login_required(redirect_field_name='home')
def createprocess(request):

    form = ProcessForm(request.POST)
    if form.is_valid():
        form.save()
        print(form)
    list_nostatus = Process.objects.filter(
        username__exact=form.cleaned_data["username"]).filter(title__exact=form.cleaned_data["title"]).filter(process_id=0)
    list_notstarted = Process.objects.filter(
        username__exact=form.cleaned_data["username"]).filter(title__exact=form.cleaned_data["title"]).filter(process_id=1)
    list_inprogress = Process.objects.filter(
        username__exact=form.cleaned_data["username"]).filter(title__exact=form.cleaned_data["title"]).filter(process_id=2)
    list_complete = Process.objects.filter(
        username__exact=form.cleaned_data["username"]).filter(title__exact=form.cleaned_data["title"]).filter(process_id=3)
    username = form.cleaned_data["username"]
    title = form.cleaned_data["title"]
    user = MetaUser.objects.get(username__exact=request.user.username)
    img = getattr(user, "image")
    fullname = getattr(user, 'fullname')
    list_todo = Todo.objects.filter()
    return render(request, 'todo/process_function.html', {
        "img": img,
        "fullname": fullname,
        'username': username,
        'title': title,
        'list_nostatus': list_nostatus,
        'list_notstarted': list_notstarted,
        'list_inprogress': list_inprogress,
        'list_complete': list_complete,
        "list_todo": list_todo,
    })


@login_required(redirect_field_name='home')
def deleteprocess(request, item_id):
    item = Process.objects.get(id=item_id)
    username = getattr(item, 'username')
    title = getattr(item, 'title')
    item.delete()
    list_nostatus = Process.objects.filter(
        username__exact=username).filter(
            title__exact=title).filter(process_id=0)
    list_notstarted = Process.objects.filter(
        username__exact=username).filter(
            title__exact=title).filter(process_id=1)
    list_inprogress = Process.objects.filter(
        username__exact=username).filter(
            title__exact=title).filter(process_id=2)
    list_complete = Process.objects.filter(
        username__exact=username).filter(
            title__exact=title).filter(process_id=3)
    user = MetaUser.objects.get(username__exact=request.user.username)
    img = getattr(user, "image")
    fullname = getattr(user, 'fullname')
    list_todo = Todo.objects.filter()
    return render(request, 'todo/process_function.html', {
        "img": img,
        "fullname": fullname,
        'username': username,
        'title': title,
        'list_nostatus': list_nostatus,
        'list_notstarted': list_notstarted,
        'list_inprogress': list_inprogress,
        'list_complete': list_complete,
        "list_todo": list_todo,
    })


@login_required(redirect_field_name='home')
def updateprocess(request, item_id):
    item = Process.objects.get(id=item_id)
    item.process_id = request.POST["process_id"]
    item.save()
    username = getattr(item, 'username')
    title = getattr(item, 'title')
    list_nostatus = Process.objects.filter(
        username__exact=username).filter(
            title__exact=title).filter(process_id=0)
    list_notstarted = Process.objects.filter(
        username__exact=username).filter(
            title__exact=title).filter(process_id=1)
    list_inprogress = Process.objects.filter(
        username__exact=username).filter(
            title__exact=title).filter(process_id=2)
    list_complete = Process.objects.filter(
        username__exact=username).filter(
            title__exact=title).filter(process_id=3)
    user = MetaUser.objects.get(username__exact=request.user.username)
    img = getattr(user, "image")
    fullname = getattr(user, 'fullname')
    list_todo = Todo.objects.filter()
    return render(request, 'todo/process_function.html', {
        "img": img,
        "fullname": fullname,
        'username': username,
        'title': title,
        'list_nostatus': list_nostatus,
        'list_notstarted': list_notstarted,
        'list_inprogress': list_inprogress,
        'list_complete': list_complete,
        "list_todo": list_todo,
    })


@login_required(redirect_field_name='home')
def calendar(request):
    user = MetaUser.objects.get(username__exact=request.user.username)
    fullname = getattr(user, 'fullname')
    username = getattr(user, 'username')
    img = getattr(user, "image")

    item_list = Todo.objects.order_by(
        "-date").filter(username__exact=request.user.username)
    if request.method == "POST" and request.FILES:
        metauser = MetaUser.objects.get(
            username__exact=request.user.username)
        print("anh")
        if metauser == None:
            meta = UserForm(username=request.user.username,
                            fullname=request.POST['fullname'], image=request.POST['image'])
            if meta.is_valid():
                meta.save()
        else:
            if len(request.FILES) != 0:
                uploaded_file = request.FILES['document']
                fs = FileSystemStorage()
                name = fs.save(uploaded_file.name, uploaded_file)
                metauser.image = name
                metauser.save()
    elif request.method == "POST" and "fullname" in request.POST:
        print("fullname")
        metauser = MetaUser.objects.get(username__exact=request.user.username)
        if metauser == None:
            meta = UserForm(username=request.user.username,
                            fullname=request.POST['fullname'], image=request.POST['image'])
            if meta.is_valid():
                meta.save()
        else:
            metauser.fullname = request.POST['fullname']
            metauser.save()
    elif request.method == "POST" and "title_update" in request.POST:
        print("ok")
        print(request.POST['title_update'])
        print(request.POST['details_update'])
        print(request.POST['date_update'])
        todo = Todo.objects.get(
            username__exact=request.user.username, title__exact=request.POST['title_old'])
        todo.title = request.POST['title_update']
        todo.details = request.POST['details_update']
        if len(request.POST['date_update']) != 0:
            todo.date = request.POST['date_update']
        todo.save()
    elif request.method == "POST" and "title" in request.POST:
        print("no ok")
        print("task")
        todo = Todo(username=request.user.username,
                    title=request.POST['title'], details=request.POST['details'], date=request.POST['date'])
        todo.save()
        form = TodoForm(request.POST)
        if form.is_valid():
            form.save()
            request = None
            return redirect('calendar')
    form = TodoForm()
    form1 = DocumentForm()
    user = MetaUser.objects.get(username__exact=request.user.username)
    img = getattr(user, "image")
    fullname = getattr(user, 'fullname')
    print(img)
    #print(str(item_list[0].date).split(' ')[0])
    print(convertFullData(item_list))
    page = {
        "forms": form,
        "list": convertData(item_list),
        "list_full": convertFullData(item_list),
        "title": "TODO LIST",
        "fullname": fullname,
        "img": img,
        "username": username,
        "form1": form1,
    }
    return render(request, 'todo/calendar.html', page)


def convertData(item_list):
    result_list = []
    for i in item_list:
        a = str(i.date).split(' ')[0]
        x, y, z = a.split('-')
        b = str(int(y))+"/"+str(int(z))+"/"+x
        result_list.append(b)
    return result_list


def convertFullData(item_list):
    result_list = []
    for i in item_list:
        a = str(i.date).split(' ')[0]
        x, y, z = a.split('-')

        b = str(int(y))+"/"+str(int(z))+"/"+x+"|" + \
            i.title+"|"+i.details+"|"+str(i.id)
        result_list.append(b)
    return result_list


@login_required(redirect_field_name='home')
def delete(request, item_id):
    item = Todo.objects.get(id=item_id)
    item.delete()
    return redirect('calendar')


@login_required(redirect_field_name='home')
def update(request, item_id):
    item = Todo.objects.get(id=item_id)
    item.title = request.POST['title_update']
    item.details = request.POST['detail_update']
    if len(request.POST['date_update']) != 0:
        item.date = request.POST['date_update']
    item.save()
    return redirect('calendar')
