#!/usr/bin/env python

import RPi.GPIO as GPIO
import time

print('Lancement du script <ouvrir.py>')

GPIO_PIN = 11
TIMED_DELAY = 2 # seconds

def pinOn(pin):
    GPIO.output(pin, GPIO.HIGH)

def pinOff(pin):
    GPIO.output(pin, GPIO.LOW)

GPIO.setwarnings(False)
# to use Raspberry Pi board pin numbers
GPIO.setmode(GPIO.BOARD)
GPIO.setup(GPIO_PIN, GPIO.OUT)
pinOff(GPIO_PIN)

print('Fin du script <ouvrir.py>')
