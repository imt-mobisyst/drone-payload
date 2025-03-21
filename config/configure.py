#!/bin/python3


import sys, os
BASE_DIR = os.path.dirname(os.path.realpath(__file__))
CONFIG_PATH = os.path.join(BASE_DIR, 'config.json')
import argparse
from transceivers.lora import lora as LoRa
from transceivers.xbee.python import xbee 

import json


# Load configuration and setup terminal settings
#old_settings = termios.tcgetattr(sys.stdin)
#tty.setcbreak(sys.stdin.fileno())

with open(CONFIG_PATH, 'r') as file:
    content = json.load(file)
    config = content["config"]
    timers = content["timers"]

nb_valves = config['nb_valves']
global valves
valves = [{"is_open": False} for _ in range(nb_valves)]


def initialize_nodes(lora_dev='/dev/ttyS0', lora_freq=868, xbee_dev='/dev/ttyUSB0', xbee_br=9600):

    xbee_device, lora_node = None, None

    # Initialize XBee device
    # try:
    #     xbee_device = xbee.XbeeNode(device=xbee_dev, baude_rate=xbee_br)
    #     xbee_device.device.open()
    #     xbee_device.device.flush_queues()
    # except Exception as e:
    #     print(f"\033[91mFailed to open serial port for XBee module: {e}\033[0m")

    # Initialize LoRa device
    try:
        lora_node = LoRa.LoRaNode(device=lora_dev, frequency=lora_freq)
    except Exception as e:
        print(f"\033[91mFailed with LoRa Module: {e}\033[0m")

    return xbee_device, lora_node

def main():
    parser = argparse.ArgumentParser(description='Arguments for operating mode')
    parser.add_argument("--lora-dev", type=str, default='/dev/ttyS0', help="LoRa device location (default /dev/ttyS0)")
    parser.add_argument("--lora-freq", type=int, default=868, help="LoRa frequency (default 868 MHz)")
    parser.add_argument("--xbee-dev", type=str, default='/dev/ttyUSB0', help="XBee device location (default /dev/ttyUSB0)")
    parser.add_argument("--xbee-br", type=int, default=9600, help="XBee baud rate (default 9600)")
    
    args = parser.parse_args()

    # Pass parsed arguments to initialize_nodes
    xbee_device, lora_node = initialize_nodes(
        lora_dev=args.lora_dev,
        lora_freq=args.lora_freq,
        xbee_dev=args.xbee_dev,
        xbee_br=args.xbee_br,
    )

    if xbee_device:
        print("XBee device initialized successfully.")
    if lora_node:
        print("LoRa node initialized successfully.")


if __name__ == "__main__":
    

    main()
