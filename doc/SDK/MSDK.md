# MSDK (Mobile Software Development Kit)

DJI met à disposition un MSDK, qui permet, via une application mobile, de communiquer avec l'OnBoard Computer et son [OSDK](./OSDK.md).
En utilisant le MSDK et le OSDK, cela aurait permis à l'utilisateur au sol de commander le drone via un téléphone ou une tablette.

[<-- Retour en arrière](../../README.md)

## Compatibilité

Depuis 2023, le MSDK n'est plus maintenu ni pour les applis iOS ([source d'information ici](https://sdk-forum.dji.net/hc/en-us/articles/11675868224665-The-announcement-of-iOS-Mobile-SDK)), ni pour Flutter ([source d'information ici](https://sdk-forum.dji.net/hc/en-us/articles/900005842986-Can-you-import-flutter-in-DJI-MSDK-project)).

Voir [ici](https://developer.dji.com/mobile-sdk/documentation/application-development-workflow/workflow-integrate.html) un tuto de 2020 sur l'intégration du MSDK dans une application iOS ou Android.

Malgré plusieurs essais de création d'une application Android simple intégrant le MSDK, nous n'avons pas réussi à obtenir quoi que ce soit de fonctionnel. Nous avons donc abandonné l'idée d'utiliser un MSDK.