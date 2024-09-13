# Web

Ce dossier contient les fichiers PHP générant la page web de la station et les scripts Python activant les électrovannes.

## Environnement en local

Voici les étapes pour avoir un environnement de développement en local, similaire à ce qu'on retrouve dans la Raspberry Pi.

### Installation de PHP

```
sudo apt update && sudo apt upgrade -y
sudo apt install php -y
```

### Mise en route du serveur en local

Ouvrez un terminal, placez vous dans le dossier `drone-payload/web`, et démarrez un serveur PHP en local grâce à la commande :
```
php -S localhost:8000
```
