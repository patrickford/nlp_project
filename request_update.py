import requests

payload = {'username': 'uriyerastov', 'first': 'Uri', 'last':'Erastov'}
r = requests.put("http://localhost:8080/user", data=payload)
# print r.statusCode
print r.content
