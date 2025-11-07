from django.shortcuts import render
from django.http import JsonResponse
from django.core.paginator import Paginator
from django.contrib.auth.decorators import login_required

from . import services


def first(request):
    return render(request, 'dashboard.html')

@login_required
def main(request):
    all_dash = services.fetch_all_dash(order='DESC')
    paginator = Paginator(all_dash, 8)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, 'main.html', {'page_obj': page_obj})

@login_required
def load_more_cards(request):
    page = int(request.GET.get("page", 1))
    limit = 8
    offset = (page - 1) * limit

    cards = services.fetch_all_dash(limit=limit, offset=offset)
    has_next = len(cards) == limit

    data = {
        "cards": [
            {
                "title": obj.title,
                "description": obj.description,
                "url": obj.url,
                "preview": obj.preview.url if obj.preview else '',
                "source": obj.source
            }
            for obj in cards
        ],
        "has_next": has_next
    }
    return JsonResponse(data)

@login_required
def rep(request):
    return render(request, 'rep.html')

@login_required
def sherlar_royxati(request):
    sherlar = services.fetch_sherlar()
    return render(request, 'sherlar.html', {'sherlar': sherlar})

@login_required
def sher_detail(request, pk):
    sher = services.fetch_sher_detail(pk)
    return render(request, 'sher_detail.html', {'sher': sher})

@login_required
def books_page(request):
    books = services.fetch_books()
    return render(request, 'books.html', {'books': books})

@login_required
def book_detail_api(request, pk):
    book = services.fetch_book_detail(pk)
    if not book:
        return JsonResponse({'error': 'Book not found'}, status=404)

    data = {
        'title': book.title,
        'url': book.url if book.url else '',
        'file': book.file.url if book.file else '',
        'audio': book.audio.url if hasattr(book, 'audio') and book.audio else '',
        'audio_time': book.audio_time if hasattr(book, 'audio_time') else '',
        'file_type': book.file.name.split('.')[-1] if book.file else '',
        'description': book.description,
        'owner': book.owner,
    }
    return JsonResponse(data)

@login_required
def philosophy_view(request):
    philosophy = services.fetch_philosophy()
    return render(request, 'philosophy.html', {'philosophy': philosophy})




from django.shortcuts import render
from django.http import JsonResponse
from .models import Dash, Sher, Book, Philosophy
from django.db.models import Q

@login_required
def search_page(request):
    return render(request, "search.html")

@login_required
def search_results(request):
    query = request.GET.get("q", "")
    dash_results = Dash.objects.filter(Q(title__icontains=query) | Q(description__icontains=query))[:5]
    sher_results = Sher.objects.filter(Q(sarlavha__icontains=query) | Q(matn__icontains=query) | Q(muallif__icontains=query))[:5]
    book_results = Book.objects.filter(Q(title__icontains=query) | Q(description__icontains=query) | Q(owner__icontains=query))[:5]
    philosophy_results = Philosophy.objects.filter(Q(title__icontains=query) | Q(desc__icontains=query) | Q(text__icontains=query))[:5]

    data = {
        "dash": list(dash_results.values("title", "url", "description", "source")),
        "sher": list(sher_results.values("sarlavha", "muallif", "matn", "janr", "til")),
        "book": list(book_results.values("title", "owner", "description", "url")),
        "philosophy": list(philosophy_results.values("title", "desc", "text")),
    }
    return JsonResponse(data)



from django.http import JsonResponse
from .models import Dash, Sher, Book, Philosophy

@login_required
def search_api(request):
    q = request.GET.get('q', '')

    dash = Dash.objects.filter(title__icontains=q)
    sher = Sher.objects.filter(sarlavha__icontains=q)
    books = Book.objects.filter(title__icontains=q)
    philosophy = Philosophy.objects.filter(title__icontains=q)

    return JsonResponse({
        "dash": [
            {
                "id": d.id,
                "title": d.title,
                "description": d.description,
                "preview": d.preview.url if d.preview else "",
                "source": d.source,
                "url": f"/dash/{d.id}/"   # 🔥 mavjud URL
            } for d in dash
        ],
        "sher": [
            {
                "id": s.id,
                "sarlavha": s.sarlavha,
                "qisqa_qator": s.qisqa_qator(),
                "muallif": s.muallif,
                "url": f"/sher/{s.id}/"   # 🔥 qo‘shildi
            } for s in sher
        ],
        "books": [
            {
                "id": b.id,
                "title": b.title,
                "description": b.description,
                "img": b.img.url if b.img else "",
                "owner": b.owner,
                "url": f"/books/{b.id}/"  # 🔥 qo‘shildi
            } for b in books
        ],
        "philosophy": [
            {
                "id": p.id,
                "title": p.title,
                "desc": p.desc[:100] + "...",
                "img": p.img.url if p.img else "",
                "url": f"/philosophy/{p.id}/"  # 🔥 qo‘shildi
            } for p in philosophy
        ]
    })




from django.contrib.auth.decorators import login_required
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.core.paginator import Paginator
from .models import Dash

@login_required
def dash_detail_page(request, pk):
    open_item = get_object_or_404(Dash, pk=pk)
    dashes = Dash.objects.all().order_by('-id')

    paginator = Paginator(dashes, 8)
    page_number = request.GET.get('page', 1)
    page_obj = paginator.get_page(page_number)

    return render(request, "main.html", {
        "page_obj": page_obj,
        "open_dash_id": open_item.id,
    })


@login_required
def dash_detail_json(request, pk):
    dash = get_object_or_404(Dash, pk=pk)
    return JsonResponse({
        "id": dash.id,
        "title": dash.title,
        "description": dash.description,
        "source": dash.source,
        "url": dash.url,
        "preview": dash.preview.url if dash.preview else None
    })


def sher_detail_page(request, pk):
    sherlars = Sher.objects.all()   # barcha cardlar chiqishi uchun
    open_item = get_object_or_404(Sher, pk=pk)  # modal ochilishi uchun
    return render(request, "sherlar.html", {
        "sherlar": sherlars,
        "open_sher_id": open_item.id
    })

def sher_detail_json(request, pk):
    sher = get_object_or_404(Sher, pk=pk)
    return JsonResponse({
        "id": sher.id,
        "sarlavha": sher.sarlavha,
        "muallif": sher.muallif,
        "matn": sher.matn,
        "sana": sher.sana,
        "janr": sher.janr,
        "til": sher.til,
        "manba": sher.manba,
        "haqida": sher.haqida,
    })




def philosophy_detail_page(request, pk):
    philosophy = Philosophy.objects.all()
    open_item = get_object_or_404(Philosophy, pk=pk)
    return render(request, "philosophy.html", {
        "philosophy": philosophy,
        "open_philosophy_id": open_item.id
    })


def philosophy_detail_json(request, pk):
    philosophy = get_object_or_404(Philosophy, pk=pk)
    return JsonResponse({
        "id": philosophy.id,
        "title": philosophy.title,
        "desc": philosophy.desc,
        "text": philosophy.text,
        "img": philosophy.img.url if philosophy.img else None
    })


def book_detail_page(request, pk):
    books = Book.objects.all()
    open_book = get_object_or_404(Book, pk=pk)
    return render(request, "books.html", {
        "books": books,
        "open_book_id": open_book.id
    })

def book_detail_json(request, pk):
    book = get_object_or_404(Book, pk=pk)
    return JsonResponse({
        "id": book.id,
        "title": book.title,
        "description": book.description,
        "img": book.img.url if book.img else None,
        "file": book.file.url if book.file else None,
        "url": book.url if book.url else None,
        "audio": book.audio.url if book.audio else None,
        "audio_duration": book.audio_duration,
        "file_type": book.file_type,
        "owner": str(book.owner),
    })

from django.http import FileResponse, Http404
from django.views.decorators.clickjacking import xframe_options_exempt
from django.shortcuts import get_object_or_404

@xframe_options_exempt
def book_file_view(request, pk):
    book = get_object_or_404(Book, pk=pk)
    if not book.file:
        raise Http404("Fayl topilmadi")
    # FileResponse bilan inline ko'rsatish
    response = FileResponse(book.file.open('rb'), content_type='application/pdf')
    response['Content-Disposition'] = f'inline; filename="{book.file.name}"'
    return response


from django.contrib.auth import logout
from django.shortcuts import redirect
from django.contrib import messages


def logout_view(request):
    """Foydalanuvchini tizimdan chiqarish"""
    logout(request)
    messages.success(request, "Siz tizimdan muvaffaqiyatli chiqdingiz 🖐️")
    return redirect('login')





from django.core.mail import send_mail
from django.contrib import messages
from django.conf import settings
from django.shortcuts import render

def contact_view(request):
    if request.method == "POST":
        name = request.POST.get("sender_name") or request.user.get_full_name() or request.user.username
        email = request.POST.get("sender_email") or request.user.email
        phone = request.POST.get("sender_phone") or (getattr(request.user.profile, 'phone_number', None) or "Ko‘rsatilmagan")
        message = request.POST.get("message")

        # Profil ma'lumotlari agar mavjud bo‘lsa
        profile = getattr(request.user, 'profile', None)

        gender = getattr(profile, 'get_gender_display', lambda: "Ko‘rsatilmagan")()
        address = getattr(profile, 'address', "Ko‘rsatilmagan")
        job_title = getattr(profile, 'job_title', "Ko‘rsatilmagan")
        workplace = getattr(profile, 'workplace', "Ko‘rsatilmagan")
        website = getattr(profile, 'website', "Ko‘rsatilmagan")
        bio = getattr(profile, 'bio', "Ko‘rsatilmagan")
        interested_genres = getattr(profile, 'interested_genres', "Ko‘rsatilmagan")
        books_read = getattr(profile, 'books_read', "Ko‘rsatilmagan")
        telegram = getattr(profile, 'telegram', "Belgilanmagan")
        instagram = getattr(profile, 'instagram', "Belgilanmagan")
        linkedin = getattr(profile, 'linkedin', "Belgilanmagan")
        github = getattr(profile, 'github', "Belgilanmagan")
        created_at = getattr(profile, 'created_at', None)
        last_active = getattr(profile, 'last_active', None)

        subject = f"Yangi xabar: {name} ({email})"
        body = (
            f"📨 Yangi xabar yuborildi!\n\n"
            f"👤 Ism: {name}\n"
            f"📧 Email: {email}\n"
            f"📞 Telefon: {phone}\n"
            f"🏠 Manzil: {address}\n"
            f"💼 Kasb: {job_title}\n"
            f"🏢 Ish joyi: {workplace}\n"
            f"🌐 Sayt: {website}\n"
            f"🚻 Jinsi: {gender}\n"
            f"📅 Profil yaratilgan: {created_at}\n"
            f"🕒 So‘nggi faollik: {last_active}\n\n"
            f"🎯 Qiziqqan janrlar: {interested_genres}\n"
            f"📚 O‘qigan kitoblar: {books_read}\n"
            f"🧠 Bio:\n{bio}\n\n"
            f"💬 Xabar matni:\n{message}\n\n"
            f"🌍 Ijtimoiy tarmoqlar:\n"
            f"   Telegram: {telegram}\n"
            f"   Instagram: {instagram}\n"
            f"   LinkedIn: {linkedin}\n"
            f"   GitHub: {github}\n\n"
            f"──────────────────────────────\n"
            f"Ushbu xabar sayt orqali yuborilgan."
        )

        try:
            send_mail(
                subject,
                body,
                settings.DEFAULT_FROM_EMAIL,
                ['takhirovbunyad@gmail.com'],
                fail_silently=False,
            )
            messages.success(request, "Xabaringiz muvaffaqiyatli yuborildi!")
        except Exception as e:
            messages.error(request, f"Xatolik yuz berdi: {e}")

    return render(request, "contact.html")



def landing_page(request):
    return render(request, "landing.html")