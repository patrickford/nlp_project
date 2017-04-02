import urllib
import requests


r2 = requests.post('https://murmuring-ridge-56754.herokuapp.com/user', json={
    "username" : "Michael",
    "password" : "test",
    "firstName" : "Michael",
    "lastName" : "Yehudi"
})

r1 = requests.post('https://murmuring-ridge-56754.herokuapp.com/user', json={
    "username" : "yuriyerastov",
    "password" : "password%@#@",
    "firstName" : "Yuri",
    "lastName" : "Yerastov"
})

print r2.json()
