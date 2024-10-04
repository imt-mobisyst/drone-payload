#!/bin/python3

import json
from flask import Flask, render_template, request, Response

from digi.xbee.exception import TransmitException, InvalidOperatingModeException, TimeoutException
from digi.xbee.devices import ZigBeeDevice, RemoteZigBeeDevice
from digi.xbee.models.address import XBee64BitAddress

valves = {
    "v1": {"is_open": False},
    "v2": {"is_open": False}
}

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
        if request.json is not None and \
        request.json["valve_nb"] is not None and \
        request.json["open"] is not None:
            pin = request.json["valve_nb"][1] # "1" or "2"

            if(request.json["open"] == True):
                data = "O" + str(pin)
            else:
                data = "C" + str(pin)

            send_zb_data(data)

            xbee_message = get_zb_data(5) # Wait for response for 5 seconds
            if xbee_message is not None:
                xbee_message = xbee_message.data.decode()

                valves[request.json["valve_nb"]]["is_open"] = \
                    True if xbee_message[1] == "O" else False

            else:
                print("Error, no response from Drone...")

            return json.dumps(valves)

        else:
            print("Error, try again...")
            return Response(status = 500)
    
    else:
        return render_template('index.html.jinja', valves=valves) 


def send_zb_data(data):
    try:
        device.send_data(remote, data=data)
    except InvalidOperatingModeException:
        print("ERROR : Bad XBee configuration...")
    except (TimeoutException, TransmitException):
        print("ERROR : Can't connect to Drone...")
    except:
        print("ERROR : Can't use XBee module...")


def get_zb_data(timeout):
    try:
        return device.read_data(timeout)
    except InvalidOperatingModeException:
        print("ERROR : Bad XBee configuration...")
    except TimeoutException:
        pass
    except:
        print("ERROR : Can't use XBee module...")

    return None

@app.route('/check_wifi', methods=['GET'])
def check_wifi():
    client_ip = request.remote_addr
    # Assuming the RPi's network is on 10.3.141. subnet 
    device_to_rpi = client_ip.startswith("10.3.141.")
    rpi_to_drone = False

    if device_to_rpi:
        send_zb_data("X") # Value for connection test

        # Wait for response for 2 seconds, should be less than the connection test interval
        xbee_message = get_zb_data(2) 
        if xbee_message is not None and xbee_message.data.decode() == "C":
            rpi_to_drone = True

    return json.dumps({"deviceToRpi": device_to_rpi, "rpiToDrone": rpi_to_drone})
