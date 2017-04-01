import urllib
import requests


r2 = requests.post('http://localhost:8080/user/', json={
    "username" : "yuriyerastov",
    "password" : "password%@#@",
    "firstName" : "Yuri",
    "lastName" : "Yerastov"
})

print r2.json()
