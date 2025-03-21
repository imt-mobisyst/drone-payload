import config.configure as configure



import subprocess
import threading


import serial
import time
import RPi.GPIO as GPIO
import pigpio

import json


import lib8relind

import signal
import sys

# Define valve GPIO pins (same pin mapping as in Arduino)
VALVE_PIN_OFFSET = 16
V1_PIN = 17
V2_PIN = 18
V3_PIN = 19
# Add additional valve pins as needed
# V3_PIN = 9
# V4_PIN = 10
# V5_PIN = 11
# V6_PIN = 12
# V7_PIN = 13

# GPIO Setup


pi = pigpio.pi()

# Set GPIO 17 to output
pi.set_mode(17, pigpio.OUTPUT)
pi.set_mode(18, pigpio.OUTPUT)
pi.set_mode(19, pigpio.OUTPUT)
#Functioning pin
pi.set_mode(13, pigpio.OUTPUT)

# Set GPIO 17 to HIGH
pi.write(17, 0)
pi.write(18, 0)
pi.write(19, 0)

pi.write(13, 1)

# XBee setup
RX_PIN = 2
TX_PIN = 3
SERIAL_PORT = '/dev/ttyUSB0'  # The serial port the XBee is connected to
BAUD_RATE = 9600

# Set up serial connection to XBee
try :
    ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
except Exception as e :
    ser = None
    print("could not open serial port :", str(e))
# Valve control dictionary
valves_payloads = {
    '1': ['1', 'C'],
    '2': ['2', 'C'],
    '3': ['3', 'C'],
    # Add additional valves if necessary
    # 
    # '4': ['4', 'C'],
}

xbee_device, lora_node = configure.initialize_nodes()


def close_valve(valve_nb):
    if valves_payloads[str(valve_nb)][1] == 'O':
        pi.write(get_valve_pin(valve_nb), 0)
        try :
            lib8relind.set(0, valve_nb, 0)
        except Exception as e :
            print(e)
        valves_payloads[str(valve_nb)][1] = 'C'
    else :
        print("Valve already closed")
# Helper functions
def get_valve_pin(valve_char):
    return VALVE_PIN_OFFSET + int(valve_char)

def send_xbee_payload(payload):
    ser.write(payload)

def process_received_data(data):
    # Extract valve control information from XBee data
    print('inside process data')
    try :
        raw = data
        data = str(data[2:-1])
        valve_char = data[1] # Get the valve number (character)
        valve_pin = get_valve_pin(valve_char)
        valve_index = int(valve_char) - 1
    except :
        print("not a commun O/C command")
    
    if data[0] == 'O':  # 'O' for open
        
        try :
            lib8relind.set(0, int(valve_char), 1)
        except Exception as e :
            print(e)
        pi.write(valve_pin, 1)
        valves_payloads[valve_char][1] = 'O'
        print(configure.timers["valve_v"+valve_char])
        timer = threading.Timer(int(configure.timers["valve_v"+valve_char]), close_valve, args = (int(valve_char), ))
        timer.start()
        #send_xbee_payload(valves_payloads[valve_char].encode())
    elif data[0] == 'C':  # 'C' for close
        pi.write(valve_pin, 0)
        try :
            lib8relind.set(0, int(valve_char), 0)
        except Exception as e:
            print(e)
        valves_payloads[valve_char][1] = 'C'
        #send_xbee_payload(valves_payloads[valve_char].encode())
    
    elif str(raw)[2:-1].startswith("START:"):
        print("inside elif starting with")
        lora_node.receive_file(configure.BASE_DIR, raw)
        reload_service("onboard.service")
    else :
        print('A none valve message received ... returning uptime')
        #lora_node.send_data('uptime :'+subprocess.check_output("uptime -p", shell=True).decode().strip()+" with rssi on board : " + str(lora_node.node.get_channel_rssi()))


def reload_service(service_name):
    # Vérifier si le service existe et est actif
    check_cmd = f"systemctl is-active {service_name}"
    status = os.system(check_cmd)
    
    if status != 0:  # 0 signifie actif, autre chose signifie inactif ou inexistant
        print(f"Erreur : Le service {service_name} n’est pas actif ou n’existe pas.")
        return False
    
    # Tenter de recharger le service
    reload_cmd = f"sudo systemctl reload {service_name}"
    reload_result = os.system(reload_cmd)
    
    if reload_result == 0:
        print(f"Service {service_name} rechargé avec succès.")
        return True
    else:
        print(f"Échec du rechargement de {service_name}. Tentative de redémarrage...")
        # Fallback sur restart si reload échoue
        restart_cmd = f"sudo systemctl restart {service_name}"
        restart_result = os.system(restart_cmd)
        
        if restart_result == 0:
            print(f"Service {service_name} redémarré avec succès.")
            return True
        else:
            print(f"Échec du redémarrage de {service_name}. Vérifie le service manuellement.")
            return False
def main():
    while True:

        # Read LoRa data
        
        msg, rssi = lora_node.receive_data()
        if msg :
            print("heard something")
            response_thread = threading.Thread(target=lora_node.send_data, args=("Request processed onboard ",))
            response_thread.start()
            process_thread = threading.Thread(target=process_received_data, args=(msg,))
            process_thread.start()
            #process_received_data(msg)
            
        else :
            pass

        # Read XBee data
        if ser and ser.in_waiting > 0:
            data = ser.read(ser.in_waiting)
            process_received_data(data)
        else :
            pass
        
        time.sleep(5)

def cleanup_and_exit(signum, frame):
    print("Stopping service, cleaning up...")
    pi.write(17, 0)
    pi.write(18, 0)
    pi.write(19, 0)

    pi.write(13, 0)
    #GPIO.cleanup() 
    sys.exit(0)        

if __name__ == '__main__':
    try:
        signal.signal(signal.SIGTERM, cleanup_and_exit)
        #signal.signal(signal.SIGINT, cleanup_and_exit)
        main()
    except KeyboardInterrupt:
        print("Program interrupted")


    finally:
        cleanup_and_exit(None, None)
        #ser.close()  

    
    

