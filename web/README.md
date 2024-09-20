# Web

Ce dossier contient les fichiers générant la page web de la station et les scripts Python activant les électrovannes.
Auparavant, la page web était générée en PHP. Si vous voulez découvrir la documentation et le code source de la solution en PHP, veuillez remonter au commit taggé `php_version` : `git checkout php_version`.

## Fonctionnement

La page web est générée par un serveur web Flask, qui se lance automatiquement quand la Raspberry Pi, via un service configuré dans `/etc/systemd/system/parasiteApp.service`.

## Mise à jour du serveur en production

Si vous avez modifié le code source du dossier `/web`, et que vous voulez mettre à jour le serveur se trouvant sur la Raspberry Pi, vous pouvez exécuter le script dédié à cette tâche :
```
drone-payload/scripts/update_web.sh
```

*Voir la [section sur les scripts](../scripts/README.md)*.

## Mise en route du serveur Flask

Pour lancer le serveur manuellement, en étant par avance connecté à la Raspberry Pi en ssh :
```
flask --app ~/flask-app run --host 0.0.0.0
```

Vous pouvez aussi lancer directement le service correspondant : `sudo systemctl start parasiteApp.service`

