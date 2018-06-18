from django.http import Http404, JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import mixins
from rest_framework import generics
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny
import csv
import io
import json
from GuestWebService.serializers import GuestSerializer, CreateGuestSerializer, FamilyMemberSerializer, RSVPSerializer, RSVPSubmitSerializer
from .models import Guest, FamilyMember
from django.views.decorators.csrf import csrf_exempt

class GuestList(generics.ListCreateAPIView):
    queryset = Guest.objects.all()
    serializer_class = GuestSerializer
    def get(self, request, *args, **kwargs):
        print("hello")
        guests = Guest.objects.all()
        familymembers = {}
        for guest in guests:
            #get all family members as a python json list for this guest and store them in a map so that we can add them to the response
            #later
            familymembers[str(guest.id)] = [familymember for familymember in FamilyMember.objects.filter(guest=guest).values()]
        response = super().get(request, *args, **kwargs)
        for guest in response.data:
            guest['num_guests'] = len(familymembers.get(guest.get('id')))
        return response

class GuestDetail(generics.RetrieveAPIView):
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

class RSVPRetriever(generics.RetrieveAPIView):
    serializer_class = RSVPSerializer

    def get_object(self):
        queryset = self.get_queryset()
        queryset = self.filter_queryset(queryset)  # Apply any filter backends
        return get_object_or_404(queryset)

    def get_queryset(self):
        return Guest.objects.filter(name__iexact=self.kwargs.get('name')).filter(rsvp_url=self.kwargs.get('rsvp_url'))

class RSVPUpdater(generics.UpdateAPIView):
    queryset = Guest.objects.all()
    serializer_class = RSVPSubmitSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        
        family_members_data = request.data.pop('familymember')
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        
        if serializer.is_valid(raise_exception=True):   
            self.perform_update(serializer)
            for family_member_data in family_members_data:
                member_id = family_member_data.get('id', None)
                if member_id:
                    family_member = FamilyMember.objects.get(id=member_id)
                    family_member_serializer = FamilyMemberSerializer(family_member, data=family_member_data, partial=True)
                    family_member_serializer.is_valid(raise_exception=True)
                    family_member_serializer.save()
            return Response(status=200, data=serializer.data)
        return Response(status=400)

class GuestFileUploaderGeneric(generics.ListCreateAPIView):
    parser_classes = (MultiPartParser, FormParser,)
    serializer_class = GuestSerializer

    def post(self, request, *args, **kwargs):
        upload = request.FILES['data']
        
        upload.seek(0)        
        fileReader = csv.DictReader(io.StringIO(upload.read().decode('utf-8')))

        for row in fileReader:
            guestSerializer = Guest(name=row['name'],
                            address=row['address'],
                            city=row['city'],
                            state=row['state'],
                            zip_code=row['zip_code'],
                            country=row['country'])
            guestSerializer.save()
            
            for i in range(0, int(row['num_guests'])):
                FamilyMember(guest=guestSerializer, name='guest_' + str(i)).save()
        return Response(status=200)


class GuestFileUploader(APIView):
    parser_classes = (MultiPartParser, FormParser,)

    def post(self, request, format=None):
        upload = request.FILES['data']
        print('hello')        
        upload.seek(0)        
        fileReader = csv.DictReader(io.StringIO(upload.read().decode('utf-8')))

        for row in fileReader:
            guestSerializer = Guest(name=row['name'],
                            address=row['address'],
                            city=row['city'],
                            state=row['state'],
                            zip_code=row['zip_code'],
                            country=row['country'])
            guestSerializer.save()
            
            for i in range(0, int(row['num_guests'])):
                FamilyMember(guest=guestSerializer, name='guest_' + str(i)).save()
        return Response(status=200)


