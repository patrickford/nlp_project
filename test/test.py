import requests
import urllib
import json

s = requests.Session()

_user = raw_input("Username: ")
_password = raw_input("Password: ")

def login():
    r = s.post('http://localhost:8080/login', json={
        "username" : _user,
        "password" : _password
    })
    response = r.json()
    if response['username']:
        print "/login --  PASS"
    else:
        print "/login --  FAIL"
    return response

def history():
    myurl = 'http://localhost:8080/history/'
    r = s.get(myurl)
    response = r.json()
    if isinstance(response, list) == True:
        print "database get /history --  PASS"
    else:
        print "database get /history --  FAIL"
    return response

def update_user():
    payload = {'username': 'yurik4', 'first': 'Yuri', 'last':'Yerastoff', 'email':'y_yerastov@fhsu.edu'}
    r = requests.put("http://localhost:8080/user", data=payload)
    if r.status_code == 200:
        print "update /user --  PASS"
    else:
        print "update /user --  FAIL"
    return r.content

def create_user(_first, _last):
    r = requests.post('http://localhost:8080//user', json={
        "username" : _user,
        "password" : _password,
        "firstName" : _first,
        "lastName" : _last
    })
    return r.json()

def writeMongo():
    r = s.post('http://localhost:8080/posts', json={
        "url": "http://www.bbc.com/news/world-us-canada-39300452",
        "description": "BBC article"
    })
    response = r.json()
    if response['tagged']:
        print 'create record post /posts --  PASS'
    else:
        print 'create record post /posts --  FAIL'
    return response

def deleteMongo(_id):
    URL_delete = "http://localhost:8080/analysis/" + _id
    r = s.delete(URL_delete)
    if r.status_code == 204:
        print "delete record /analysis --  PASS"
    else:
        print "delete record /analysis --  FAIL"
    return r

def main():
    login()
    writeMongo()
    random_id = history()[-1]['id']
    deleteMongo(random_id)
    update_user()

main()
