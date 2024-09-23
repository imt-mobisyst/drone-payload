import json
from RPi import GPIO
from flask import Flask, render_template, request, flash, Response, send_from_directory

PINS = {"v1": 11,"v2": 12}
valves = {
    "v1": {"is_open": False},
    "v2": {"is_open": False}
}

app = Flask(__name__)

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BOARD)
for pin in PINS.values():
    GPIO.setup(pin, GPIO.OUT, initial=GPIO.HIGH)

@app.route('/', methods = ["GET", "POST"])
def index():
    if request.method == "POST": 
        # Note : Relay is active low
        if request.json is not None and \
        request.json["valve_nb"] is not None and \
        request.json["open"] is not None:
            pin = PINS[request.json["valve_nb"]]

            if(request.json["open"] == True):
                GPIO.output(pin, GPIO.LOW)
            else:
                GPIO.output(pin,GPIO.HIGH)

            valves[request.json["valve_nb"]]["is_open"] = not GPIO.input(pin)

            return json.dumps(valves)
        else:
            flash("Error, try again...")
            return Response(status = 500)
    
    else:
        return render_template('index.html.jinja', valves=valves) 

