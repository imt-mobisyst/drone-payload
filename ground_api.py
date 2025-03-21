import config.configure as configure
from flask import Flask, render_template, request, Response, jsonify, send_from_directory
import json

import threading

#from web.configure import valves

app = Flask(__name__, template_folder = 'web/templates', static_folder="web/static")
xbee_device, lora_node = configure.initialize_nodes()
communication_established = False

def receive_callback(msg) :
    global communication_established
    print("Message received : ", msg)
    communication_established = True




@app.route('/', methods = ["GET"])
def index():
    
    return render_template('index.html.jinja', valves=configure.valves, nb_valves=len(configure.valves))

@app.route('/config')
def get_config():
    return send_from_directory('config', 'config.json')

@app.route('/toggle_valve', methods = ["POST"])
def toggle_valve():
    if request.method == "POST": 
        # Note : Relay is active low
        if (request.json is not None) and (request.json["valve_nb"] is not None) and (request.json["open"] is not None):
            valve_nb = int(request.json["valve_nb"][1])
            open = request.json["open"]
            data = ("O" if open else "C") + str(valve_nb)
            #Sending with LoRa
            lora_node.send_data(data)
            response_thread = threading.Thread(target=lora_node.receive_data, args=(receive_callback,))
            response_thread.start()

            #Sending with Xbee
            try :
                remote_device = xbee_device.get_device_by_addr()
                xbee_device.send_zb_data(remote_device, data)
                #Wait to answer from Xbee
                xbee_message = xbee_device.get_zb_data(5) # Wait for response for 5 seconds
                if xbee_message is not None:
                    xbee_message = xbee_message.data.decode()

                    xbee_open = xbee_message[1] == "O"
                    configure.valves[valve_nb - 1]["is_open"] = xbee_open

                else:
                    print("ERROR : no response from Drone...")
            except :
                pass

            
            

            return json.dumps(configure.valves)

        else:
            print("ERROR : try again...")
            return Response(status = 500)
    
    else:
        return render_template('index.html.jinja', valves=configure.valves, nb_valves=len(configure.valves))



@app.route('/ping', methods = ["POST"])
def test_portee():
    if request.json['message'] is not None :
        print("inside if")
        lora_node.send_data(str(request.json['message']))
        response_thread = threading.Thread(target=lora_node.receive_data, args=(receive_callback,))
        response_thread.start()
    return Response(status = 200)
    
@app.route('/save-config', methods=['POST'])
def save_config():
    try:
        config_data = request.get_json()
        print(config_data)
        with open('config/config.json', 'w') as f:
            json.dump(config_data, f, indent=4)
            lora_node.send_file(configure.CONFIG_PATH, "config.json", config_data)
        return jsonify({"status": "success"}), 200

        
    except Exception as e:
        return jsonify({"error": str(e)}), 500  

@app.route('/set_timer', methods = ["POST"])
def set_timer():
    if request.method == "POST":
        valve_nb = request.json['valve_nb']
        timer = request.json['timer']



@app.route('/check_wifi', methods=['GET'])
def check_wifi():
    client_ip = request.remote_addr
    # Assuming the RPi's network is on 10.3.141. subnet 
    device_to_rpi = client_ip.startswith("192.168.1.")
    rpi_to_drone = False

    if device_to_rpi:
        send_zb_data("X") # Value for connection test

        # Wait for response for 2 seconds, should be less than the connection test interval
        xbee_message = get_zb_data(2) 
        if ((xbee_message is not None and xbee_message.data.decode() == "C") or communication_established):
            rpi_to_drone = True

    return json.dumps({"deviceToRpi": device_to_rpi, "rpiToDrone": rpi_to_drone})


@app.route('/valve_status', methods=['POST'])
def valve_status():
    global communication_established
    
    data = request.get_json()
    valve_id = data.get('valve')
    status = data.get('status')
    
    communication_established = False
    
    if xbee_device:
        xbee_device.send_data_async(lora_node, f"Valve {valve_id} {status}")
    
    import time
    timeout = 5
    start_time = time.time()
    
    while not communication_established and (time.time() - start_time) < timeout:
        time.sleep(0.1)
    
    return jsonify({
        'confirmed': communication_established
    })

def main():
    
    app.run(host="0.0.0.0", port=5000, debug=True)


if __name__=="__main__":

    main()
