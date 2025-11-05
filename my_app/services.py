from my_app.models import Dash, Sher, Book, Philosophy


def fetch_all_dash(order='DESC', limit=None, offset=None):
    query = f"""
        SELECT * FROM my_app_dash
        ORDER BY id {order}
    """
    if limit is not None:
        query += f" LIMIT {limit}"
    if offset is not None:
        query += f" OFFSET {offset}"

    return list(Dash.objects.raw(query))


def fetch_sherlar():
    query = """
        SELECT * FROM my_app_sher
        ORDER BY sana DESC
    """
    return list(Sher.objects.raw(query))


def fetch_sher_detail(pk):
    query = """
        SELECT * FROM my_app_sher
        WHERE id = %s
    """
    sher = list(Sher.objects.raw(query, [pk]))
    return sher[0] if sher else None


def fetch_books():
    query = """
        SELECT * FROM my_app_book
        ORDER BY id DESC
    """
    return list(Book.objects.raw(query))


def fetch_book_detail(pk):
    query = """
        SELECT * FROM my_app_book
        WHERE id = %s
    """
    book = list(Book.objects.raw(query, [pk]))
    return book[0] if book else None


def fetch_philosophy():
    query = """
        SELECT * FROM my_app_philosophy
        ORDER BY id DESC
    """
    return list(Philosophy.objects.raw(query))
