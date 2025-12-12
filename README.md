# Données Météo France par stations (1850-2019)

## Méthode d'extraction

1. Télécharger les données de Météo France en utilisant le premier NoteBook dans le dossier Téléchargement

2. Pré-découper les fichiers téléchargés avec le code `JavaScript` / `NodeJS` contenu dans le dossier Téléchargement

> [!WARNING]
> Le dossier Téléchargement ne contient aucune donnée brute, car les fichiers téléchargés sont trop volumineux pour `GitHub`.

3. Une fois les fichiers pré-découpés, regrouper les données par stations dans le dossier meteofrance-stations avec le deuxième NoteBook.

## Contenu du dépôt

- Code source pour télécharger et mettre en forme les données

- Dossier API : description de l'A.P.I.

- Dossier CSV : métadonnées

- Téléchargement : dossier sans donnée

- meteofrance-stations : données de Météo France par stations

> [!NOTE]
> Les deux (si le nombre contient huit chiffres) ou trois (si le nombre contient neuf chiffres) premiers chiffres du code de la station correspond au département. Il faut noter que la Corse est regroupée sous l'indicatif unique 20, et non 2A ou 2B.
