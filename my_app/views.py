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