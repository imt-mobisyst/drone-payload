# Drone-Based Air Sampling System

This project aims to develop a sophisticated air sampling system capable of collecting samples at altitudes of approximately 120 meters. The system utilizes a depressurized air canister controlled by a solenoid valve for precise sample collection.

## System Overview

The air sampling system consists of three main components:

1. Drone-mounted payload
2. Ground-level Raspberry Pi
3. User interface device (any web-enabled device)

The **MATRICE 600 PRO** drone serves as the aerial platform for this project.

## Key Features

- **Long-range communication**: Utilizes XBee modules for extended range capabilities
- **High-altitude sampling**: Designed to collect air samples at approximately 120 meters
- **Remote operation**: Controlled via a web-based interface

## Hardware Components

### Payload (Drone-Mounted)

- 1 Raspberry Pi 3 with MicroSD card
- 2 XBee Module (PRO S2C) with antenna
- 1 Arduino board
- Solenoid valve(s) (1-2 depending on requirements)
- Electrical relay(s) (1-2 matching solenoid valve count)
- Battery pack

### Ground Station

- Raspberry Pi (for communication relay)
- XBee Module (PRO S2C) with antenna

### Configuration Setup

- Linux laptop
- Ethernet cable

## Communication Architecture



## Advantages

- **Versatility**: Adaptable for various air quality monitoring applications
- **Precision**: Accurate sample collection at specific altitudes
- **Safety**: Enables sampling in hard-to-reach or hazardous areas
- **Real-time control**: Web-based interface allows for immediate adjustments

## Future Enhancements

- Integration of real-time air quality sensors
- Automated flight path programming for systematic sampling


--------------------------------

# Installation 



## Installation

### 1. Arduino Setup

To set up the Arduino side of the project, follow these steps:

1. **Install Arduino IDE:**
   - Download and install the [Arduino IDE](https://www.arduino.cc/en/software) if you haven't already.
   
2. **Connect the Arduino:**
   - Connect your Arduino board to your computer via USB.
   
3. **Install Required Libraries:**
   - Open the Arduino IDE and install the necessary libraries for the project:
     - `XBee.h` or any other libraries used in your project.

4. **Upload the Code:**
   - Open the provided Arduino `.ino` file.
   - Select the correct board and port from the "Tools" menu.
   - Upload the sketch to the Arduino.

### 2. Raspberry Pi Setup

To set up the Raspberry Pi:

1. **Install Raspberry Pi OS:**
   - Flash the latest version of Raspberry Pi OS onto an SD card.
   - You can follow the official Raspberry Pi [installation guide](https://www.raspberrypi.org/documentation/installation/installing-images/) if needed.

2. **Install Required Packages:**
   - Open a terminal and run the following commands to update and install necessary software:
     ```bash
     sudo apt-get update
     sudo apt-get install python3 python3-pip git
     ```

3. **Clone the Project Repository:**
   - Navigate to the directory where you want to store the project:
     ```bash
     git clone <your-project-repo-link>
     cd <your-project-directory>
     ```

4. **Install Python Libraries:**
   - Run the following command to install the required Python libraries:
     ```bash
     pip3 install -r requirements.txt
     ```

5. **Configure XBee Radio:**
   - Ensure the Raspberry Pi is connected to the XBee module via serial interface.
   - Configure the XBee on the Raspberry Pi using [XBee Configuration Software](https://www.digi.com/products/xbee-rf-solutions/xctu-software/xctu) or Zigbee TH Pro software.

### 3. Wiring

Here’s how to wire the components together:

#### **Arduino to XBee:**
- Connect the **TX (Transmitter)** pin of the Arduino to the **DIN** pin of the XBee.
- Connect the **RX (Receiver)** pin of the Arduino to the **DOUT** pin of the XBee.
- Power the XBee with 3.3V (not 5V) and connect the GND of the Arduino to the GND of the XBee.

#### **Raspberry Pi to XBee:**
- Use a USB-to-serial converter to connect the XBee to the Raspberry Pi via USB.
- Alternatively, connect the **TX/RX** pins of the Raspberry Pi directly to the **DIN/DOUT** pins of the XBee (ensure you use a level shifter to match voltage levels if required).

#### **Other Connections:**
- Add any additional connections (e.g., sensors, LEDs) according to your project needs.
  
You can use a diagram like this to visualize the wiring:


