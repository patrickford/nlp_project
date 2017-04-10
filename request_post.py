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

r3 = requests.post('https://murmuring-ridge-56754.herokuapp.com/user', json={
    "username" : "MYE",
    "password" : "test",
    "firstName" : "Michael",
    "lastName" : "Echeverria"
})

print r3.json()
