from django.http import Http404, JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import mixins
from rest_framework import generics
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
import csv
import io

from GuestWebService.serializers import GuestSerializer, CreateGuestSerializer, FamilyMemberSerializer, RSVPSerializer, RSVPSubmitSerializer
from .models import Guest, FamilyMember

class MultipleFieldLookupMixin(object):
    """
    Apply this mixin to any view or viewset to get multiple field filtering
    based on a `lookup_fields` attribute, instead of the default single field filtering.
    """
    def get_object(self):
        print("yoyo")
        queryset = self.get_queryset()             # Get the base queryset
        queryset = self.filter_queryset(queryset)  # Apply any filter backends
        filter = {}
        for field in self.lookup_fields:
            if self.kwargs[field]: # Ignore empty fields.
                print(self.kwargs[field])
                filter[field] = self.kwargs[field]
        obj = get_object_or_404(queryset, **filter)  # Lookup the object
        self.check_object_permissions(self.request, obj)
        return obj

class GuestList(generics.ListCreateAPIView):
    queryset = Guest.objects.all()
    serializer_class = GuestSerializer

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

class RSVPRetriever(MultipleFieldLookupMixin, generics.RetrieveAPIView):
    queryset = Guest.objects.all()
    serializer_class = RSVPSerializer
    lookup_fields = ('rsvp_url', 'name')

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


