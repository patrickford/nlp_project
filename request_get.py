import urllib
import requests

# r = requests.get('http://localhost:8080/posts')
# print r

myurl = 'http://localhost:8080/history/'
response = urllib.urlopen(myurl)
data = response.read()
print data
