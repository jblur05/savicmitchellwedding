from django.conf.urls import url
from GuestListWS import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    url(r'^guests/$', views.GuestList.as_view()),
    url(r'^familymembers/$', views.FamilyMemberList.as_view()),
    url(r'^guest/(?P<pk>[0-9a-f-]+)/$', views.GuestDetail.as_view()),
    url(r'^guest/$', views.CreateGuest.as_view()),
    url(r'^familymember/(?P<pk>[0-9a-f-]+)/$', views.FamilyMemberDetail.as_view()),
    url(r'^upload/$', views.GuestFileUploaderGeneric.as_view()),
    url(r'^rsvp/(?P<rsvp_url>[0-9a-zA-Z-]+)/(?P<name>[0-9a-zA-Z-]+)$', views.RSVPRetriever.as_view()),
    url(r'^rsvp/(?P<pk>[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$', views.RSVPUpdater.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)