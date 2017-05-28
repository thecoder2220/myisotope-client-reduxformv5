# isotope Starter Kit

## Utiliser isotope-client

1. `npm set registry http://10.1.4.13:4873` pour configurer le repo npm
1. `npm i isotope-client` pour installer la dépendance

## Contribuer à isotope-client

1. Update le projet (contrairement à un projet Maven, il est tout à fait possible de release une version qui n'est pas à jour)
1. Faire ses modifications
1. `npm run-script test` pour les tests unitaires
1. Modifier le script `build:babeldev` dans le fichier `package.json` pour que les fichiers d'isotope soient copiés dans le répertoire du projet sur lequel vous travaillez
1. `npm run-script build:babeldev` pour tester vos modifications dans votre projet
1. `npm run-script build` pour déployer la nouvelle version
1. Commit les modifications