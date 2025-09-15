from django.shortcuts import render
from django.http import JsonResponse
from django.core.paginator import Paginator
from . import services


def first(request):
    return render(request, 'dashboard.html')


def main(request):
    all_dash = services.fetch_all_dash(order='DESC')
    paginator = Paginator(all_dash, 8)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)
    return render(request, 'main.html', {'page_obj': page_obj})


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


def rep(request):
    return render(request, 'rep.html')


def sherlar_royxati(request):
    sherlar = services.fetch_sherlar()
    return render(request, 'sherlar.html', {'sherlar': sherlar})


def sher_detail(request, pk):
    sher = services.fetch_sher_detail(pk)
    return render(request, 'sher_detail.html', {'sher': sher})


def books_page(request):
    books = services.fetch_books()
    return render(request, 'books.html', {'books': books})


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


def philosophy_view(request):
    philosophy = services.fetch_philosophy()
    return render(request, 'philosophy.html', {'philosophy': philosophy})




from django.shortcuts import render
from django.http import JsonResponse
from .models import Dash, Sher, Book, Philosophy
from django.db.models import Q

def search_page(request):
    return render(request, "search.html")

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
                "url": f"/dash/{d.id}/"   # 🔥 to‘liq url yasadik
            } for d in dash
        ],
        "sher": [
            {
                "sarlavha": s.sarlavha,
                "qisqa_qator": s.qisqa_qator(),
                "muallif": s.muallif,
            } for s in sher
        ],
        "books": [
            {
                "id": b.id,
                "title": b.title,
                "description": b.description,
                "img": b.img.url if b.img else "",
                "owner": b.owner,
                "url": f"/books/{b.id}/"  # kitob detail link
            } for b in books
        ],
        "philosophy": [
            {
                "id": p.id,
                "title": p.title,
                "desc": p.desc[:100] + "...",
                "img": p.img.url if p.img else "",
                "url": f"/philosophy/{p.id}/"  # falsafa detail link
            } for p in philosophy
        ]
    })


from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import Dash

def dash_detail_page(request, pk):
    dash = get_object_or_404(Dash, pk=pk)
    return render(request, "main.html", {   # senga mos nomni yoz
        "open_dash_id": dash.id
    })

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
