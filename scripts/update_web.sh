#!/bin/bash

# Display Help
Help()
{
   echo "Copy the project's web folder into the Raspberry Pi's files via ssh."
   echo
   echo "Syntax: deploy_web.sh [-a IP | i | m | h]"
   echo "options:"
   echo "i     If you are connected to IOT_IMT_NORD_EUROPE."
   echo "m     If you are connected to M600_RPI."
   echo "a     Specify manually the Raspberry Pi's IP address."
   echo "h     Print the help documentation."
   echo
}

# IP addresses
IP_RPI="10.3.141.1"
IP_IOT="10.89.2.55"

ip_target=$IP_IOT

# Get the options
while getopts "hima:" option; do
   case $option in
      h) # Display Help
         Help
         exit;;
      a) # Specify manually the Raspberry Pi's IP address
         ip_target=$OPTARG;;
      i) # If you are connected to IOT_IMT_NORD_EUROPE
         ip_target=$IP_IOT;;
      m) # If you are connected to M600_RPI
         ip_target=$IP_RPI;;
     \?) # Invalid option
         echo "Error: Invalid option"
         echo
         Help
         exit;;
   esac
done

if ! command -v sshpass 2>&1 >/dev/null
then
    echo "Please install sshpass by doing :"
    echo "'sudo apt install sshpass'"
    exit 1
fi

if [ -z "$ip_target" ]; then
  echo "Error: No IP address provided or selected."
  Help
  exit 1
fi

echo "SSH on $ip_target"

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

echo "Deleting current web files..."
sshpass -p "bot" sshpass -p "bot" ssh bot@$ip_target "sudo rm -r /home/bot/flask_app/*"
echo "Copying new files..."
sshpass -p "bot" scp -r $SCRIPT_DIR/../web/* bot@$ip_target:/home/bot/flask_app
echo "Restarting service..."
sshpass -p "bot" ssh bot@$ip_target "sudo systemctl restart parasiteApp.service"

echo "Web page updated and restarted successfully."
