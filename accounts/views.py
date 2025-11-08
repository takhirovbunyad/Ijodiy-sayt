from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate
from django.contrib import messages
import random
from django.core.mail import send_mail
from django.conf import settings
from django.shortcuts import render, redirect


from django.shortcuts import render, redirect
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings
import random
from django.contrib.auth import get_user_model

User = get_user_model()

from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
import random
import re

User = get_user_model()


def validate_password(password):
    if len(password) < 6 or len(password) > 15:
        return False
    if not re.search(r"[A-Za-z]", password):
        return False
    if not re.search(r"[0-9]", password):
        return False
    return True


def register(request):
    if request.method == "POST":
        first_name = request.POST.get("first_name")
        last_name = request.POST.get("last_name")
        username = request.POST.get("username")
        email = request.POST.get("email")
        password = request.POST.get("password")
        confirm_password = request.POST.get("confirm_password")

        # Parol mos emas
        if password != confirm_password:
            messages.error(request, "Parollar mos emas!")
            return redirect("register")

        # Parol validatsiyasi
        if not validate_password(password):
            messages.error(
                request, "Parol 6-15 belgi, kamida 1 ta harf va 1 ta raqamdan iborat bo‘lishi kerak!"
            )
            return redirect("register")

        if User.objects.filter(username=username).exists():
            messages.error(request, "Bu username band!")
            return redirect("register")

        if User.objects.filter(email=email).exists():
            messages.error(request, "Bu email allaqachon ishlatilgan!")
            return redirect("register")

        # Tasdiqlash kodi
        verification_code = str(random.randint(100000, 999999))

        request.session["registration_data"] = {
            "first_name": first_name,
            "last_name": last_name,
            "username": username,
            "email": email,
            "password": password,
            "code": verification_code,
        }

        try:
            send_mail(
                subject="Email tasdiqlash kodi",
                message=f"Sizning tasdiqlash kodingiz: {verification_code}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
            )
        except Exception as e:
            messages.error(request, f"Email yuborishda xato: {e}")
            return redirect("register")

        return redirect("verify_email")

    return render(request, "register.html")


def verify_email(request):
    if request.method == "POST":
        code = request.POST.get("code")
        reg_data = request.session.get("registration_data")

        if reg_data and code == reg_data["code"]:
            user = User.objects.create_user(
                username=reg_data["username"],
                email=reg_data["email"],
                password=reg_data["password"],
                first_name=reg_data["first_name"],
                last_name=reg_data["last_name"],
            )

            del request.session["registration_data"]

            login(request, user)
            return redirect("login")

        return render(request, "verify_email.html", {"error": "Kod noto‘g‘ri!"})

    return render(request, "verify_email.html")


def login_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(request, username=username, password=password)

        if user:
            login(request, user)
            return redirect("/home/")

        messages.error(request, "Login yoki parol noto‘g‘ri!")
        return render(request, "login.html", {"username": username})

    return render(request, "login.html")



from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Profile
from .forms import ProfileForm

@login_required
def hisobim_view(request):
    # Foydalanuvchining profilini olish yoki yaratish
    profile, created = Profile.objects.get_or_create(user=request.user)

    if request.method == 'POST':
        form = ProfileForm(request.POST, request.FILES, instance=profile, user=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, "Profil ma'lumotlaringiz muvaffaqiyatli saqlandi ✅")
            return redirect('hisobim')  # URL nomi hisobim.html sahifasiga olib boradi
        else:
            messages.error(request, "Xatolik yuz berdi! Iltimos, maydonlarni to‘g‘ri to‘ldiring.")
    else:
        form = ProfileForm(instance=profile, user=request.user)

    context = {
        'form': form,
        'profile': profile,
    }
    return render(request, 'hisobim.html', context)



from django.contrib.auth.decorators import login_required
from django.contrib.auth import update_session_auth_hash
from django.contrib import messages
from django.shortcuts import render, redirect

@login_required
def change_password_view(request):
    if request.method == 'POST':
        current = request.POST.get('current_password')
        new = request.POST.get('new_password')
        confirm = request.POST.get('confirm_password')

        if not request.user.check_password(current):
            messages.error(request, 'Joriy parol noto‘g‘ri.')
        elif new != confirm:
            messages.error(request, 'Yangi parol tasdiqlanmadi.')
        else:
            request.user.set_password(new)
            request.user.save()
            update_session_auth_hash(request, request.user)  # logout bo‘lmasligi uchun
            messages.success(request, 'Parolingiz muvaffaqiyatli o‘zgartirildi!')
            return redirect('hisobim')

    return render(request, 'change_password_modal.html')
