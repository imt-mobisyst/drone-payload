import RPi.GPIO as GPIO
import os
import time

GPIO.setmode(GPIO.BCM)

PIN1 = 20  
PIN2 = 26  

GPIO.setup(PIN1, GPIO.OUT)
GPIO.setup(PIN2, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)

GPIO.output(PIN1, GPIO.HIGH)

print("Monitoring GPIO pins... Connect GPIO 17 and GPIO 27 to shutdown.")

try:
    while True:
        if GPIO.input(PIN2) == GPIO.HIGH:
            print("Pins connected! Shutting down...")
            GPIO.cleanup()
            os.system("sudo shutdown -h now")
            break
        time.sleep(0.1)

except KeyboardInterrupt:
    print("\nScript stopped by user.")
    GPIO.cleanup()