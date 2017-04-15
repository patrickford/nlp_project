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

r4 = requests.post('https://murmuring-ridge-56754.herokuapp.com/user', json={
    "username" : "YuriYerastov",
    "password" : "test",
    "firstName" : "Yuri",
    "lastName" : "Yuri Yerastov",
    "email": "yerastov@hotmail.com"
})

r5 = requests.post('http://localhost:8080/user', json={
    "username" : "yurik",
    "password" : "test",
    "firstName" : "Yuri",
    "lastName" : "Yerastov",
    "email": "yerastov@hotmail.com"
})

r6 = requests.post('http://localhost:8080/record', json={
    "id" : "58e04272b767330869754252"
})

print r6.json()
