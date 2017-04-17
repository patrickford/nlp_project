import os
from subprocess import call
import test

def update_remote():
    command_add = "git add ."
    commit_revised = '''git commit -m "Revised commit"'''
    push_github = '''git push origin master'''
    push_heroku = '''git push heroku master'''
    call([commit_revised], shell=True)
    call([push_github], shell=True)
    call([push_heroku], shell=True)
    call([push_github], shell=True)
    return True

update_remote()
test.main()
