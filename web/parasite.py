#!/bin/python3

import json
from flask import Flask, render_template, request, flash, Response
from digi.xbee.exception import TransmitException, InvalidOperatingModeException, TimeoutException
from digi.xbee.devices import ZigBeeDevice, RemoteZigBeeDevice
from digi.xbee.models.address import XBee64BitAddress

with open('static/config.json', 'r') as file:
    config = json.load(file)["config"]
    file.close()

nb_valves = config['nb_valves']

valves = [{"is_open": False} for _ in range(nb_valves)]
# Voir si valve n°2 est ouverte : valves[1]["is_open"]

app = Flask(__name__)

device = ZigBeeDevice("/dev/ttyUSB0", 9600)
addr = XBee64BitAddress(bytearray([0x00, 0x13, 0xA2, 0x00, 0x41, 0xBF, 0x6A, 0x04]))
remote = RemoteZigBeeDevice(device, x64bit_addr=addr)

device.open()
device.flush_queues()

@app.route('/', methods = ["GET", "POST"])
def index():
    if request.method == "POST": 
        # Note : Relay is active low
        if (request.json is not None) and (request.json["valve_nb"] is not None) and (request.json["open"] is not None):
            valve_nb = request.json["valve_nb"][1]
            open = request.json["open"]
            data = ("O" if open else "C") + str(valve_nb)

            send_zb_data(data)

            xbee_message = get_zb_data(5) # Wait for response for 5 seconds
            if xbee_message is not None:
                xbee_message = xbee_message.data.decode()

                print("Xbee vxbee_vaalve", xbee_message)
                xbee_open = xbee_message[1] == "O"
                valves[int(valve_nb)]["is_open"] = xbee_open

            else:
                flash("Error, no response from Drone...")

            return json.dumps(valves)

        else:
            flash("Error, try again...")
            return Response(status = 500)
    
    else:
        return render_template('index.html.jinja', valves=valves, nb_valves=nb_valves)


def send_zb_data(data):
    try:
        device.send_data(remote, data=data)
    except InvalidOperatingModeException:
        flash("ERROR : Bad XBee configuration...")
    except TimeoutException:
        flash("ERROR : Can't connect to Drone...")
    except TransmitException:
        flash("ERROR : Bad response from Drone...")
    except:
        flash("ERROR : Can't use XBee module...")


def get_zb_data(timeout):
    try:
        return device.read_data(timeout)
    except InvalidOperatingModeException:
        flash("ERROR : Bad XBee configuration...")
    except TimeoutException:
        pass
    except TransmitException:
        flash("ERROR : Bad response from Drone...")
    except:
        flash("ERROR : Can't use XBee module...")

    return None
