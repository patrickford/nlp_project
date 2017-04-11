import requests

payload = {'username': 'yurik4', 'first': 'Yuri', 'last':'Yerastoff', 'email':'y_yerastov@fhsu.edu'}
r = requests.put("http://localhost:8080/user", data=payload)
# print r.statusCode
print r.content
