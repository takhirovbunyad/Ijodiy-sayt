from django import forms
from django.contrib.auth.models import User
from .models import Profile

class ProfileForm(forms.ModelForm):
    first_name = forms.CharField(
        max_length=50,
        required=False,
        label="Ism",
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Ismingizni kiriting'
        })
    )

    last_name = forms.CharField(
        max_length=50,
        required=False,
        label="Familiya",
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Familiyangizni kiriting'
        })
    )

    email = forms.EmailField(
        required=False,
        label="Email",
        widget=forms.EmailInput(attrs={
            'class': 'form-control',
            'placeholder': 'Email manzilingiz'
        })
    )

    class Meta:
        model = Profile
        fields = [
            'profile_picture',
            'phone_number',
            'address',
            'gender',
            'interested_genres',
            'books_read',
            'bio',
            'job_title',
            'workplace',
            'website',
            'telegram',
            'instagram',
            'linkedin',
            'github'
        ]
        labels = {
            'profile_picture': 'Profil rasmi',
            'phone_number': 'Telefon raqam',
            'address': 'Manzil',
            'gender': 'Jinsi',
            'interested_genres': 'Qiziqqan janrlar',
            'books_read': 'O‘qigan kitoblar',
            'bio': 'Bio',
            'job_title': 'Kasb / Lavozim',
            'workplace': 'Ish joyi',
            'website': 'Shaxsiy sayt',
            'telegram': 'Telegram',
            'instagram': 'Instagram',
            'linkedin': 'LinkedIn',
            'github': 'GitHub',
        }
        widgets = {
            'profile_picture': forms.ClearableFileInput(attrs={'class': 'form-control-file'}),
            'phone_number': forms.TextInput(attrs={'class': 'form-control', 'placeholder': '+998901234567'}),
            'address': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Manzilingiz'}),
            'gender': forms.Select(attrs={'class': 'form-control'}),
            'interested_genres': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Fantastika, Detektiv...'}),
            'books_read': forms.Textarea(attrs={'class': 'form-control', 'rows': 3, 'placeholder': 'O‘qigan kitoblaringiz'}),
            'bio': forms.Textarea(attrs={'class': 'form-control', 'rows': 3, 'placeholder': 'O‘zingiz haqida qisqacha yozing'}),
            'job_title': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Kasbingiz'}),
            'workplace': forms.TextInput(attrs={'class': 'form-control', 'placeholder': 'Ish joyingiz'}),
            'website': forms.URLInput(attrs={'class': 'form-control', 'placeholder': 'https://'}),
            'telegram': forms.URLInput(attrs={'class': 'form-control', 'placeholder': 'https://t.me/...'}),
            'instagram': forms.URLInput(attrs={'class': 'form-control', 'placeholder': 'https://instagram.com/...'}),
            'linkedin': forms.URLInput(attrs={'class': 'form-control', 'placeholder': 'https://linkedin.com/in/...'}),
            'github': forms.URLInput(attrs={'class': 'form-control', 'placeholder': 'https://github.com/...'}),
        }

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user', None)
        super(ProfileForm, self).__init__(*args, **kwargs)
        if user:
            self.fields['first_name'].initial = user.first_name
            self.fields['last_name'].initial = user.last_name
            self.fields['email'].initial = user.email

    def save(self, commit=True):
        profile = super(ProfileForm, self).save(commit=False)
        user = self.instance.user
        user.first_name = self.cleaned_data.get('first_name', user.first_name)
        user.last_name = self.cleaned_data.get('last_name', user.last_name)
        user.email = self.cleaned_data.get('email', user.email)
        if commit:
            user.save()
            profile.save()
        return profile
