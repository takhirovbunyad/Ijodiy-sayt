from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator


class Profile(models.Model):
    GENDER_CHOICES = [
        ('M', 'Erkak'),
        ('F', 'Ayol'),
        ('O', 'Boshqa'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")

    # Asosiy ma'lumotlar
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True, verbose_name="Profil rasmi")
    phone_number = models.CharField(
        max_length=15,
        blank=True,
        null=True,
        validators=[RegexValidator(r'^\+?998?\d{9,12}$')],
        verbose_name="Telefon raqam"
    )
    address = models.CharField(max_length=255, blank=True, null=True, verbose_name="Manzil")
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True, null=True, verbose_name="Jinsi")

    # Ijodiy qism
    interested_genres = models.TextField(
        blank=True,
        null=True,
        verbose_name="Qiziqqan janrlar (vergul bilan ajrating)",
        help_text="Masalan: fantastika, detektiv, sarguzasht, tarixiy"
    )
    books_read = models.TextField(
        blank=True,
        null=True,
        verbose_name="O‘qigan kitoblar",
        help_text="Masalan: Alkimyogar, O‘tkan kunlar, Jinoyat va jazo"
    )
    bio = models.TextField(
        blank=True,
        null=True,
        verbose_name="Bio (o‘zingiz haqingizda qisqacha)",
        help_text="Ijodiy ishingiz, hayotingiz yoki maqsadlaringiz haqida yozing"
    )

    # Qo‘shimcha ma'lumotlar
    job_title = models.CharField(max_length=100, blank=True, null=True, verbose_name="Kasb / Lavozim")
    workplace = models.CharField(max_length=150, blank=True, null=True, verbose_name="Ish joyi")
    website = models.URLField(blank=True, null=True, verbose_name="Shaxsiy sayt")

    # Ijtimoiy tarmoqlar
    telegram = models.URLField(blank=True, null=True, verbose_name="Telegram")
    instagram = models.URLField(blank=True, null=True, verbose_name="Instagram")
    linkedin = models.URLField(blank=True, null=True, verbose_name="LinkedIn")
    github = models.URLField(blank=True, null=True, verbose_name="GitHub")

    # Tizim ma'lumotlari
    last_active = models.DateTimeField(auto_now=True, verbose_name="So‘nggi faollik")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Profil yaratilgan sana")

    def __str__(self):
        return f"{self.user.username} profili"

    class Meta:
        verbose_name = "Profil"
        verbose_name_plural = "Foydalanuvchi profillari"
