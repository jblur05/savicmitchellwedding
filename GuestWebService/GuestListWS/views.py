from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import mixins
from rest_framework import generics
from rest_framework.parsers import MultiPartParser, FormParser
import csv
import io

from GuestWebService.serializers import GuestSerializer, CreateGuestSerializer, FamilyMemberSerializer, RSVPSerializer
from .models import Guest, FamilyMember

class GuestList(generics.ListCreateAPIView):
    queryset = Guest.objects.all()
    serializer_class = GuestSerializer

class GuestDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Guest.objects.all()
    serializer_class = GuestSerializer

class CreateGuest(generics.CreateAPIView):
    queryset = Guest.objects.all()
    serializer_class = CreateGuestSerializer

class FamilyMemberList(generics.ListCreateAPIView):
    queryset = FamilyMember.objects.all()
    serializer_class = FamilyMemberSerializer

class FamilyMemberDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = FamilyMember.objects.all()
    serializer_class = FamilyMemberSerializer

class RSVPRetriever(generics.ListAPIView):
    serializer_class = RSVPSerializer
    
    def get_queryset(self):
        return Guest.objects.filter(rsvp_url=self.kwargs['guestUrl'])

class GuestFileUploader(APIView):
    parser_classes = (MultiPartParser, FormParser,)

    def post(self, request, format=None):
        upload = request.FILES['data']
        
        upload.seek(0)        
        fileReader = csv.DictReader(io.StringIO(upload.read().decode('utf-8')))

        for row in fileReader:
            guestSerializer = Guest(name=row['Last Name'],
                            address=row['Home Street'] + row['Home Street 2'],
                            city=row['Home City'],
                            state=row['Home State'],
                            zip_code=row['Home Postal Code'],
                            country=row['Home Country'])
            guestSerializer.save()
            
            for i in range(0, int(row['num guests'])):
                FamilyMember(guest=guestSerializer, name='guest_' + str(i)).save()
        return Response(status=200)


