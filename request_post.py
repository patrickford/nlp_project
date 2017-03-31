import urllib
import requests


r2 = requests.post('http://localhost:8080/posts/', json={
 # "username": 'yuri2',
  "text": "http://www.bbc.com/news/world-us-canada-39300452"
  #"text": '''https://www.nytimes.com/2017/03/15/us/politics/trump-travel-ban.html?hp&action=click&pgtype=Homepage&clickSource=story-heading&module=first-column-region&region=top-news&WT.nav=top-news&_r=0"'''
})

print r2.json()
