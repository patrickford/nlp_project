import csv, codecs
import random
import chardet

randoms = []

rawdata = open("spanish.csv", "r").read()
result = chardet.detect(rawdata)
charenc = result['encoding']
print charenc

def get_csv(f):
    new_data = []
    with open(f, 'r') as csvfile:
        data = csv.reader(csvfile)
        for row in data:
            new_data.append(row)
 	return new_data

def get_random_words(array, n):
    random_words = {}
    i = 0
    while i < n:
        randomNum = random.randint(0, len(array))
        if randomNum not in randoms:
            row = data[randomNum]
            spanish_word = row[1]
            english_word = row[2]
            random_words[english_word] = spanish_word
            i = i+1
    return random_words

def get_distractors(array, n):
    array_distractors = []
    i = 0
    while i < n:
        randomNum = random.randint(0, len(array)-1)
        if randomNum not in randoms:
            # print randomNum
            # print array[randomNum]
            english_distractor = array[randomNum]
            array_distractors.append(english_distractor)
            i=i+1
    return array_distractors


data = get_csv('spanish.csv')
random_dict = get_random_words(data, 6)
english_words = [item[1] for item in data]
english_distractors = get_distractors(english_words, 5)


def get_answers():
    for entry in random_dict:
        question = entry
        answer = random_dict[entry]
        english_distractors = get_distractors(english_words, 5)
        print 'question', question
        # print 'answer', answer
        # print 'distractors', english_distractors
        # print ''
        all_answers = english_distractors
        all_answers.append(answer)
        random.shuffle(all_answers)
        for answer in all_answers:
            print answer
        print ''


# for row in data:
#     print row[2]

get_answers()

#     print row[0], row[1], row[2]
    #x = codecs.decode(cell, 'utf8')
