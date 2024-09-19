# Web

Ce dossier contient les fichiers générant la page web de la station et les scripts Python activant les électrovannes.
Auparavant, la page web était générée en PHP. Si vous voulez découvrir la documentation et le code source de la solution en PHP, veuillez remonter au commit taggé `php_version` : `git checkout php_version`.

## Mise en route en production

Pour lancer le serveur manuellement, en étant par avance connecté à la Raspberry Pi en ssh :
```
flask --app ~/flask-app run --host 0.0.0.0
```