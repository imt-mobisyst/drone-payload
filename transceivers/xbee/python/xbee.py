from digi.xbee.exception import TransmitException, InvalidOperatingModeException, TimeoutException
from digi.xbee.devices import ZigBeeDevice, RemoteZigBeeDevice
from digi.xbee.models.address import XBee64BitAddress



class XbeeNode():

    def __init__(self, device ="/dev/ttyUSB0", baude_rate = 9600):

        try :
            self.device = ZigBeeDevice(device, baude_rate)
        except :
            pass
        
        

    def send_zb_data(self, remote_device, data):
        try:
            device.send_data(remote_device, data=data)
        except InvalidOperatingModeException:
            print("ERROR : Bad XBee configuration...")
        except (TimeoutException, TransmitException):
            print("ERROR : Can't connect to Drone...")
        except:
            print("ERROR : Can't use XBee module...")

    def get_device_by_addr(self, addr = bytearray([0x00, 0x13, 0xA2, 0x00, 0x41, 0xBF, 0x6A, 0x04])):

        addr = XBee64BitAddress(addr)
        remote = RemoteZigBeeDevice(self.device, x64bit_addr=addr)

        return remote

    def get_zb_data(self, timeout):
        try:
            return self.device.read_data(timeout)
        except InvalidOperatingModeException:
            print("ERROR : Bad XBee configuration...")
        except TimeoutException:
            pass
        except:
            print("ERROR : Can't use XBee module...")

        return None


