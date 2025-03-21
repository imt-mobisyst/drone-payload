import transceivers.lora.sx126x as sx126x
import os
import time
import ast
import json




class LoRaNode ():

    def __init__(self, device = "/dev/ttyS0", frequency = 868):

        self.frequency = frequency
        self.device = device
        self.node = sx126x.sx126x(serial_num=self.device, freq=self.frequency, addr=0, power=22, rssi=True, air_speed=2400, relay=False)

    def send_data(self, action):
   
        offset_frequence = self.frequency-(850 if self.frequency>850 else 410)
        if isinstance(action, str):
            action = action.encode()
        #
        # the sending message format
        #
        #         receiving node              receiving node                   receiving node           own high 8bit           own low 8bit                 own 
        #         high 8bit address           low 8bit address                    frequency                address                 address                  frequency             message payload
        data = bytes([0>>8]) + bytes([0&0xff]) + bytes([offset_frequence]) + bytes([self.node.addr>>8]) + bytes([self.node.addr&0xff]) + bytes([self.node.offset_freq]) + action

        if self.node :
            self.node.send(data)
            print('\x1b[2A',end='\r')
            print(" "*200)
            print(" "*200)
            print(" "*200)
            print('\x1b[3A',end='\r')
        else : 
            print("there is no node set")

    def receive_data(self, callback = None):
        msg = None
        rssi = None
        while not msg :
            try :
                msg, rssi = self.node.receive()
                
            except:
                pass
        
        if (callback is not None):
            callback(msg)
        
        return msg, rssi
    
    def send_file(self, file_path, dest_filename, file_content):
        print(f'inside send file{file_path}', flush=True)
        if not os.path.exists(file_path):
            print(f"Error: File '{file_path}' not found.", flush=True)
            return
        
        try:
            print('inside try', flush=True)
            file_size = len(file_content)
            print(f"File size: {file_size} bytes", flush=True)
            
            self.send_data(f"START:{dest_filename}:{file_content}")
            time.sleep(0.5)
            print(f"Sending file content: {file_content}", flush=True)
            
            print("File transmission complete", flush=True)
        except Exception as e:
            print(f"Error sending file: {e}", flush=True)
    

    def receive_file(self, save_directory, data):
        print("inside recieve file")
        os.makedirs(save_directory, exist_ok=True) 
        file_path = None

        filename = data.split(":")[1]
        file_content = data.split(":")[2]
        print("inside recieve"+filename)
        file_path = os.path.join(save_directory, filename)
        print(f"Receiving file: {file_path}")

        while True:
            data, _ = self.receive_data()


            if data == b"END":
                print(f"File received successfully: {file_path}")
                break

            elif file_path:
                with open(file_path, "w") as file:
                    print(data)
                    data = data[20:-1]
                    json.dump(ast.literal_eval(data), file, indent=4)
                    #file.write(data)
                    print(f"Received chunk: {len(data)} bytes")
