# Installation de l'environnement complet sur la PI

Doc encore à l'état de brouillon.

## Serveur en production

Lien du tuto avec tout dedans : https://sysadmin.cyklodev.com/deployer-une-application-flask/

### Config du service :

Sans reverse proxy :
```
[Unit]
Description=Gunicorn Flask Parasite App 
After=network.target

[Service]
User=bot
Group=bot
WorkingDirectory=/home/bot/flask_app
ExecStart=gunicorn --chdir /home/bot/flask_app --workers 3 --bind 0.0.0.0:5000 wsgi:app

[Install]
WantedBy=multi-user.target
```

`sudo systemctl enable parasiteApp.service`
`sudo systemctl start parasiteApp.service`