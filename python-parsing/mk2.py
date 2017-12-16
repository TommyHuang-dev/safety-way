from flask import Flask, render_template, request

import random  # For picking random statements
import datetime  # For timing out people
import os

app = Flask(__name__)

@app.route("/")
# Homepage, after first input changes to chat page
def hello():
    return render_template('home.html')


@app.route("/chat", methods=['POST'])
# Chat page, chats here but error if first lands here (IMPORTANT AND SHOULD BE FIXED)
def chat():
    input = request.form['userInput']
    thing = input.strip().lower()

    start_time = datetime.datetime.now()
    print(start_time)
    # Pick random joke, pick random not sure statement
    rand_jokes = random.choice(jokes)
    rand_not_sure = random.choice(list(dict.keys()))
    if "joke" in thing:
        return render_template('chat.html', input=random.choice(jokes))
    elif thing in dict:
        return render_template('chat.html', input=dict[thing])
    else:
        return render_template('chat.html', input=dict[rand_not_sure])


        # Suggestions: Add dropdown so as users type, they get a list of choices so no more idk

        # Failed thing
        # Supposed to search an input, if word in input then use dict response for it
        # for t in dict:
        #    if dict.key() in thing:
        #        return render_template('chat.html', input=dict[t])
        # else:
        #    return render_template('chat.html', input="I can't do that yet")


@app.route("/about")
# About us, plus disclaimer
def about():
    return render_template('about.html')


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)