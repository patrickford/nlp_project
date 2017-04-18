import os
from subprocess import call
import test


def update_remote():
    add = '''git add .'''
    commit_message = raw_input("commit message: ")
    commit_revised = '''git commit -m ''' + commit_message
    push_github = '''git push origin master'''
    push_heroku = '''git push heroku master'''
    call([add], shell=True)
    call([commit_revised], shell=True)
    call([push_github], shell=True)
    call([push_heroku], shell=True)
    call([push_github], shell=True)
    return True

if update_remote() == True:
    test.main()
