def remove_duplicates(string):
    string = string.lower()
    temp = []
    for char in string:
        if char not in temp:
            temp.append(char)
    removed = "".join(temp)
    return removed

sent = "The woman was among several pedestrians struck by a car on Westminster bridge"

print remove_duplicates(sent)
