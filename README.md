# Drone-Payload
UV projet de P1, par des FISE 2025 en CI3.

**Membres du groupe** :
- Timothé KOBAK
- Matis SPINELLI
- Arthur MATA

*Remarque* : Les différentes commandes présentes dans la documentation sont à exécuter sur un système Linux.

## Tags

Nous avons sauvegardé différentes versions du projet au fil du temps, en fonction des solutions que nous testions.
Il suffit de faire `git checkout <tag>` pour charger le repository d'une ancienne version en local.

- Version **WiFi** (tag: `rpi_wifi`): Serveur utilisant Flask et des fichiers Python et le WiFi pour communiquer avec l'Arduino. C'est une solution simple mais avec une courte portée (moins de 50m a priori).
- Version **PHP** (tag: `php_version`): Page web entièrement en PHP au lieu de Python, fonctionnant avec un serveur *lighttpd*, et communicant en WiFi avec l'Arduino. C'est le prototype le plus ancien du projet. Il est nécessaire de modifier la configuation lighttpd acutelle pour la faire fonctionner.

## Documentation
- Doc
  - [SDK](doc/SDK.md)
    - [MSDK](doc/SDK/MSDK.md)
    - [OSDK](doc/SDK/OSDK.md)
  - [Modèles 3D](doc/3D.md)
  - [Payload](doc/Payload.md)
- [Web](web/README.md)
- [Scripts](scripts/README.md)

## Installation

Toutes les étapes de l'installation sont données dans le fichier [Install.md](./Install.md).

## Anciens repositories :
- https://github.com/ceri-num/alpaga-rambouillet/
- https://github.com/ceri-num/alpaga-ros