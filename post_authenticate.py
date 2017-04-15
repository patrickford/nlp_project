import requests

r = requests.post('http://localhost:8080/login', json={
    "username" : "yurik4",
    "password" : "test"
})

print r.json()
