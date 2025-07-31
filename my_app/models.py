from django.db import models


class Dash(models.Model):
    title = models.CharField('Sarlavha', max_length=70)
    url = models.URLField('Havola', unique=True , blank=True , null = True)
    preview = models.ImageField('Eskiz', upload_to='images/')
    description = models.TextField("Izoh", max_length=200)
    source = models.CharField('Reklama yoki post egasi', max_length=30)


class PublishedManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(status='published')



class Sher(models.Model):
    sarlavha = models.CharField(max_length=200)
    matn = models.TextField()
    muallif = models.CharField(max_length=100)
    sana = models.DateTimeField(auto_now_add=True)

    def qisqa_qator(self):
        return '\n'.join(self.matn.split('\n')[:4])

    def __str__(self):
        return self.sarlavha
