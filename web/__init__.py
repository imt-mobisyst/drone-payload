from RPi import GPIO
from flask import Flask, redirect, render_template, request, url_for

PIN = 11

app = Flask(__name__)

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BOARD)
GPIO.setup(PIN, GPIO.OUT)

@app.route('/', methods=["GET", "POST"])
def index_get():
    if request.method == "POST": # 0 for open, any for close
        # Note : Relay is active low
        if(request.json["action"] == 0):
            GPIO.output(PIN, GPIO.LOW)
        else:
            GPIO.output(PIN,GPIO.HIGH)
        return redirect(url_for('index_get'))
    
    else:
        pin_state = GPIO.input(PIN) 
        return render_template('index.html.jinja', is_open=pin_state)

