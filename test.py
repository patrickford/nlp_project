import requests
import urllib
import json

s = requests.Session()

_user = 'yurik4'
_password = raw_input("Password: ")
local = 'http://localhost:8080/'
remote = 'https://murmuring-ridge-56754.herokuapp.com/'

def login(url):
    url = url + 'login'
    r = s.post(url, json={
        "username" : _user,
        "password" : _password
    })
    response = r.json()
    if response['username']:
        print "/login --  PASS"
    else:
        print "/login --  FAIL"
    return response

def history(url):
    url = url + 'history'
    r = s.get(url)
    response = r.json()
    if isinstance(response, list) == True:
        print "database get /history --  PASS"
    else:
        print "database get /history --  FAIL"
    return response

def update_user(url):
    url = url + 'user'
    payload = {'username': _user, 'first': 'Yuri', 'last':'Yerastoff', 'email':'y_yerastov@fhsu.edu'}
    r = requests.put(url, data=payload)
    if r.status_code == 200:
        print "update /user --  PASS"
    else:
        print "update /user --  FAIL"
    return r.content

def create_user(url, _first, _last):
    url = url + 'user'
    r = requests.post(url, json={
        "username" : _user,
        "password" : _password,
        "firstName" : _first,
        "lastName" : _last
    })
    return r.json()

def writeMongo(url):
    url = url + 'posts'
    r = s.post(url, json={
        "url": "http://www.bbc.com/news/world-us-canada-39300452",
        "description": "BBC article"
    })
    response = r.json()
    if response['tagged']:
        print 'create record post /posts --  PASS'
    else:
        print 'create record post /posts --  FAIL'
    return response

def deleteMongo(url, _id):
    url = url + 'analysis/'
    URL_delete = url + _id
    r = s.delete(URL_delete)
    if r.status_code == 204:
        print "delete record /analysis --  PASS"
    else:
        print "delete record /analysis --  FAIL"
    print r.status_code
    return r

def test_server(server):
    login(server)
    writeMongo(server)
    random_id = history(server)[-1]['id']
    deleteMongo(server, random_id)
    update_user(server)

def main():
    test_server(local)
    test_server(remote)
    
