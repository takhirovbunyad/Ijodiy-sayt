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


from django.db import models
from django.utils import timezone

from django.db import models
from django.utils import timezone


class Sher(models.Model):
    JANR_TANLOV = [
        ('lirik', 'Lirik'),
        ('epik', 'Epik'),
        ('dramatik', 'Dramatik'),
        ('satirik', 'Satirik'),
    ]

    sarlavha = models.CharField(max_length=100)
    matn = models.TextField()
    muallif = models.CharField(max_length=100)

    sana = models.DateTimeField(auto_now_add=True)
    janr = models.CharField(max_length=20, choices=JANR_TANLOV, blank=True, null=True)
    til = models.CharField(max_length=50, default="O'zbekcha")
    manba = models.CharField(max_length=200, blank=True, null=True)
    haqida = models.TextField('Tanqid va izohlar tarixi , O‘qish va taqdimotlar , Keyingi nashrlar , Tahrirlar va o‘zgarishlar  , Dastlabki nashr , Voqealar fonida , Yozilgan sana ,' ,max_length=200, blank=True , null=True)


    def qisqa_qator(self):
        return '\n'.join(self.matn.split('\n')[:4])

    def __str__(self):
        return f"{self.sarlavha} - {self.muallif}"

    class Meta:
        ordering = ['-sana']


from django.db import models
from mutagen.mp3 import MP3
import os

class Book(models.Model):
    title = models.CharField(max_length=50)
    owner = models.CharField('Yozuvchi ismi va familyasi', max_length=50)
    img = models.ImageField('Eskiz', upload_to='images/')
    description = models.TextField("Izoh", max_length=400)
    file = models.FileField('Kitob fayli', upload_to='book_files/', blank=True, null=True)
    url = models.URLField('Havola', blank=True, null=True)

    audio = models.FileField('Audio', upload_to='book_audio/', blank=True, null=True)
    audio_duration = models.CharField('Audio davomiyligi', max_length=20, blank=True, null=True)

    def save(self, *args, **kwargs):
        # Fayl turi aniqlash
        if self.file:
            self.file_type = os.path.splitext(self.file.name)[1].lower()

        # Audio davomiyligi aniqlash
        if self.audio and self.audio.name.endswith('.mp3'):
            try:
                audio_file = MP3(self.audio)
                duration_seconds = int(audio_file.info.length)
                minutes, seconds = divmod(duration_seconds, 60)
                self.audio_duration = f"{minutes}:{seconds:02}"
            except:
                self.audio_duration = None

        super().save(*args, **kwargs)

    def __str__(self):
        return self.title




class Philosophy(models.Model):
    img = models.ImageField(upload_to='images/')
    title = models.CharField(max_length=255)
    desc = models.TextField()
    text = models.TextField()
