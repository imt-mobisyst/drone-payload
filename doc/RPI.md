# Raspberry Pi

The Raspberry Pi is configured as an access point with the following access method :

- SSID : M600_RPI
- Password : M600_RPI
- Address on own network : 10.141.3.1
- Config page port : 8080
- Application page port : 80

Other access method :

- Address on IMT network : 10.89.2.1
- Computer name : m600
- Linux user name : bot
    - Password : bot

## Lighttpd config

Add this to the lighttpd config file (/etc/lighttpd/lighttpd.conf) :

```
$SERVER["socket"] == ":8080" {
	server.document-root = "/var/www/html"
}
```

Change this line :

```
server.document-root = "/var/www/html"
```

to this :

```
server.document-root = "/srv/html"
```

## Users setup

Web app is controlled by the www-data user, which needs to be in the `gpio` group to control the outputs :

```bash
sudo usermod -aG gpio www-data
```

## Copying to the Raspberry Pi

```bash
scp -r <path_to_git_project>/web/* bot@<rpi_ip>:/srv/html/
```

> **Note :**
> Beware of permissions denied errors when using scp.

