# Web

Ce dossier contient les fichiers générant la page web de la station et les scripts Python activant les électrovannes.
Auparavant, la page web était générée en PHP. Si vous voulez découvrir la documentation et le code source de la solution en PHP, veuillez remonter au commit taggé `php_version` : `git checkout php_version`.

[<-- Retour en arrière](../README.md)

## Fonctionnement

La page web est générée par un serveur web Flask, qui se lance automatiquement quand la Raspberry Pi boot, via un service configuré dans `/etc/systemd/system/parasiteApp.service`.

## Installation et déploiement

Un fichier de documentation est dédiée [ici](../doc/Installation_PI.md).

## Mise à jour du serveur en production

Si vous avez modifié le code source du dossier `/web`, et que vous voulez mettre à jour le serveur se trouvant sur la Raspberry Pi, vous pouvez exécuter le script dédié à cette tâche (si vous êtes sur IoT IMT Nord Europe) :
```
drone-payload/scripts/update_web.sh
```
Et si vous êtes sur M600_RPI :
```
drone-payload/scripts/update_web.sh -m
```
Enfin, si vous vouhaitez écrire l'adresse IP de la PI à la main :
```
drone-payload/scripts/update_web.sh -a <adresseIP>
```

*Voir la [section sur les scripts](../scripts/README.md)*.

## Mise en route du serveur Flask en debug

Si vous souhaitez voir les **print** des scripts Python, vous pouvez arrêter le service de **systemd**, puis lancer la commande **gunicorn** à la main en ssh (en se trouvant de préférence dans le dossier /home/bot ):
```
sudo systemctl stop parasiteApp.service
sudo gunicorn --chdir /home/bot/flask_app --workers 1 --bind 0.0.0.0:80 wsgi:app
```

Pour lancer le serveur sans utiliser **gunicorn**, en étant par avance connecté à la Raspberry Pi en ssh :
```
flask --app ~/flask-app run --host 0.0.0.0
```

**Attention** : Cette commande n'est pas recommandée pour un serveur en production.

