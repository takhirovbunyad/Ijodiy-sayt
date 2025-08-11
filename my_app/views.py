from django.shortcuts import render, get_object_or_404
from django.core.paginator import Paginator
from django.http import JsonResponse
from my_app.models import Dash

def first(request):
    return render(request , 'dashboard.html')


def main(request):
    all_dash = Dash.objects.all().order_by('-id')
    paginator = Paginator(all_dash, 8)
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return render(request, 'main.html', {'page_obj': page_obj})



def load_more_cards(request):
    page = int(request.GET.get("page", 1))
    cards = Dash.objects.all().order_by('-id')
    paginator = Paginator(cards, 8)

    current_page = paginator.get_page(page)

    data = {
        "cards": [
            {
                "title": obj.title,
                "description": obj.description,
                "url": obj.url,
                "preview": obj.preview.url if obj.preview else '',
                "source": obj.source
            }
            for obj in current_page
        ],
        "has_next": current_page.has_next()
    }

    return JsonResponse(data)


def rep(request):
    return render(request , 'rep.html')



from django.shortcuts import render, get_object_or_404
from .models import Sher

def sherlar_royxati(request):
    sherlar = Sher.objects.order_by('-sana')
    return render(request, 'sherlar.html', {'sherlar': sherlar})


def sher_detail(request, pk):
    sher = get_object_or_404(Sher, pk=pk)
    return render(request, 'sher_detail.html', {'sher': sher})


from django.shortcuts import render
from .models import Book  # modelni to'g'ri import qilgin

def books_page(request):
    books = Book.objects.all().order_by('-id')  # oxirgi qo'shilganlar birinchi
    context = {
        'books': books
    }
    return render(request, 'books.html', context)


def book_detail_api(request, pk):
    try:
        book = Book.objects.get(pk=pk)
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
    except Book.DoesNotExist:
        return JsonResponse({'error': 'Book not found'}, status=404)





# views.py
from django.shortcuts import render
from .models import Philosophy

def philosophy_view(request):
    philosophy = Philosophy.objects.all().order_by('-id')
    return render(request, 'philosophy.html', {'philosophy': philosophy})
