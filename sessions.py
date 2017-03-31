import requests
from requests.auth import HTTPBasicAuth
s = requests.session()

r1 = s.get('http://localhost:8080/auth', auth=('yuriyerastov', 'password%@#@'))
print r1

r2 = s.post('http://localhost:8080/posts/', json={
 "username" : "yuri",
  "text": "http://www.bbc.com/news/world-us-canada-39300452"
})

print r2
