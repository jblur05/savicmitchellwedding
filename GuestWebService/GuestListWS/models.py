from django.db import models
import uuid
import string
import random

secure_random = random.SystemRandom()
rsvp_url_length = 7

def generate_url():
    all_chars = list(string.ascii_letters + string.digits)
    rsvp_url_gen = ''

    for i in range(0, rsvp_url_length):
        rsvp_url_gen += secure_random.choice(all_chars)
    return rsvp_url_gen  

# Create your models here.
class Guest(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, help_text="Unique ID for this guest")
    name = models.CharField(max_length=200, help_text="Guest Name")
    address = models.CharField(max_length=300, help_text="Guest Address")
    city = models.CharField(max_length=300, help_text="Guest city")
    state = models.CharField(max_length=300, help_text="Guest state")
    zip_code = models.CharField(max_length=10, help_text="The zip code")
    country = models.CharField(max_length=300, default="USA", help_text="Guest country")
    rsvp = models.DateField(blank=True, null=True, help_text="The date the guest sent rsvp")
    rsvp_url = models.CharField(max_length=7, unique=True, default=generate_url, help_text="URL to use when submitting RSVP")
    will_attend = models.BooleanField(default=False, help_text="Will guest attend")

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('guest', args=[str(self.id)])    

class FamilyMember(models.Model):
    CHICKEN = 'Chicken'
    PORK = 'Pork'
    RAV = 'Ravioli'
    CHILD = 'Child'
    NOT_NEEDED='Not Needed'
    FOOD_CHOICES = (
        (CHICKEN, 'Chicken'),
        (PORK, 'Pork'),
        (RAV, 'Ravioli'),
        (CHILD, 'Kid'),
        (NOT_NEEDED, 'Not Needed')
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, help_text="Unique ID for this family member")
    guest = models.ForeignKey('Guest', related_name='familymember', on_delete=models.CASCADE, null=False)
    name = models.CharField(max_length=200, help_text="The name of the family member")
    food_choice = models.CharField(max_length=2, choices=FOOD_CHOICES, default=CHICKEN)

    def __str__(self):
        return self.name + self.guest.name
