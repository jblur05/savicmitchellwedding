from GuestListWS.models import Guest, FamilyMember

#DJANGO REST FRAMEWORK INCLUDES
from django.contrib.auth.models import User, Group
from rest_framework import serializers

class GuestSerializer(serializers.ModelSerializer):
	id = serializers.UUIDField()
	class Meta:
		model = Guest
		fields = ('id', 'name', 'will_attend', 'address', 'city', 'state', 'zip_code', 'country', 'rsvp', 'rsvp_url')

class FamilyMemberSerializer(serializers.ModelSerializer):
	class Meta:
		model = FamilyMember
		fields = ('id', 'guest', 'name', 'food_choice')

class CreateGuestSerializer(serializers.ModelSerializer):
	num_guests = serializers.IntegerField(write_only=True)

	def create(self, validated_data):
		print(validated_data)
		num_guests = validated_data.pop('num_guests')
		guest = super(CreateGuestSerializer, self).create(validated_data)
		for i in range(0, num_guests):
			FamilyMember.objects.create(guest=guest, name=("guest" + str(i))).save()
		print(validated_data)
		return guest

	def update(self, instance, validated_data):
		validated_data.pop('num_guests')
		return super(CreateGuestSerializer, self).update(instance, validated_data)

	class Meta:
		model = Guest
		fields = ('name', 'address', 'will_attend', 'city', 'state', 'zip_code', 'country', 'num_guests')

class RSVPSerializer(serializers.ModelSerializer):
	familymember = FamilyMemberSerializer(many=True)

	class Meta:
		model = Guest
		fields = ('id', 'name', 'address', 'will_attend', 'city', 'state', 'zip_code', 'country', 'rsvp', 'rsvp_url', 'familymember')

	def create(self, validated_data):
		family_members_data = validated_data.pop('familymember')
		guest = Guest.objects.create(**validated_data)
		for family_member_data in family_members_data:
			FamilyMember.objects.create(guest=guest, **family_member_data)
		return guest
