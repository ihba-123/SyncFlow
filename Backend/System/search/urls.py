from django.urls import path
from .views import (
    GlobalSearchView,
    ProjectSearchView,
    TaskSearchView,
    MemberSearchView,)

urlpatterns =  [    
    path('search/', GlobalSearchView.as_view(), name='global-search'),
    path('projects/search/', ProjectSearchView.as_view()),
    path('tasks/search/', TaskSearchView.as_view()),
    path('members/search/', MemberSearchView.as_view()),
]   