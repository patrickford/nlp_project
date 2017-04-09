import requests
import json

URL_delete = "http://localhost:8080/analysis/" + "58dffbe86b3d42039d423ac1"

mydata = {}
mydata['id'] = "58dffbe86b3d42039d423ac1"
r = requests.delete(URL_delete)
print r
