# Réveil Spirituel — Guide Administration

## Architecture

Site statique hébergé sur **GitHub Pages** (repo `Addams98/rs`, branche `main`).  
Pas de serveur backend — les données sont stockées dans des fichiers JSON que l'admin modifie via l'**API REST GitHub** directement depuis le navigateur.

```
rs/
├── admin/          ← Panel d'administration (accès /admin/login.html)
│   ├── login.html  ← Page de connexion (PAT GitHub)
│   ├── index.html  ← Tableau de bord
│   ├── livres.html ← CRUD Livres
│   ├── audios.html ← CRUD Audios
│   ├── videos.html ← CRUD Vidéos
│   ├── projets.html← CRUD Projets
│   ├── config.html ← Configuration du site
│   ├── admin.css   ← Styles du panel
│   └── admin.js    ← Logique partagée (auth, API GitHub, toasts, modals)
├── data/           ← Fichiers JSON (source de vérité)
│   ├── livres.json
│   ├── audios.json
│   ├── videos.json
│   ├── projets.json
│   └── config.json
└── ...pages HTML publiques...
```

## Accès à l'Admin

URL : `https://addams98.github.io/rs/admin/login.html`

### Créer un Personal Access Token (PAT) GitHub

1. Sur GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Cliquer **Generate new token (classic)**
3. Nommer : `RS Admin`
4. Permissions requises : cocher **`repo`** (accès complet aux repos)
5. Expiration : choisir selon vos besoins (90 jours recommandé)
6. Copier le token (ne s'affiche qu'une fois !)
7. Coller ce token sur la page de login

> Le token est stocké en `sessionStorage` — il disparaît à la fermeture du navigateur. Vous devrez vous reconnecter à chaque nouvelle session.

## Flux de mise à jour

Chaque sauvegarde dans l'admin :
1. Lit le fichier JSON actuel via `GET /repos/Addams98/rs/contents/data/xxx.json`
2. Modifie les données en mémoire
3. Écrit le fichier modifié via `PUT /repos/Addams98/rs/contents/data/xxx.json` (crée un commit automatique)
4. GitHub Pages redéploie automatiquement en **1–2 minutes**

## Gestion des Livres

- **Champs** : titre, auteur, catégorie, description, image couverture, lien PDF, statut publié, dans carousel
- **Lien PDF** : utiliser Google Drive (voir section Google Drive ci-dessous)
- **Dans carousel** : cocher pour que le livre apparaisse dans le hero carousel de la page Ouvrages

## Gestion des Audios

- **Champs** : titre, auteur, catégorie, description, image couverture, lien audio MP3, durée, statut publié, dans carousel
- **Lien audio** : utiliser Google Drive avec lien de téléchargement direct
- **Dans carousel** : cocher pour faire apparaître l'audio dans le hero carousel

## Gestion des Vidéos

- **Champs** : titre, série, catégorie, ID YouTube, durée, statut publié
- **ID YouTube** : l'identifiant dans l'URL `youtube.com/watch?v=`**`dQw4w9WgXcQ`**
- La miniature est générée automatiquement depuis YouTube

## Gestion des Projets

- **Champs** : titre, catégorie, description, image, progression (0-100%), statut, publié
- **Statut** : En planification / En cours / Actif / Terminé / Suspendu

## Configuration

- Informations du site (nom, slogan, email, téléphone, adresse)
- Réseaux sociaux (YouTube, Facebook, Instagram, WhatsApp)
- Liste des contacts responsables
- Clé API YouTube (pour intégration future)

## Google Drive — Liens de fichiers

### Préparer un fichier

1. Uploader le PDF ou MP3 sur Google Drive
2. Clic droit → **Partager** → **Obtenir le lien**
3. Changer l'accès à : **"Tous les utilisateurs disposant du lien"** → **Lecteur**
4. Copier le lien

### Convertir en lien direct

Le lien partagé est de la forme :
```
https://drive.google.com/file/d/FILE_ID/view?usp=sharing
```

Pour un lien de téléchargement direct, utiliser :
```
https://drive.google.com/uc?export=download&id=FILE_ID
```

> Remplacer `FILE_ID` par l'identifiant extrait du lien partagé.

### Exemple

Lien partagé : `https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view`  
→ Lien direct : `https://drive.google.com/uc?export=download&id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs`

## Hero Carousel (Ouvrages)

Le carousel de la page `/ouvrages.html` charge dynamiquement ses slides depuis JSON.

**Pour qu'un livre ou audio apparaisse dans le carousel :**
1. Aller dans Admin → Livres (ou Audios)
2. Éditer l'élément
3. Cocher **"Afficher dans le Hero Carousel"**
4. Sauvegarder

Si aucun élément n'a cette case cochée, le carousel affiche automatiquement les 3 premiers livres et 2 premiers audios publiés.

## Structure des JSON

### livres.json
```json
{
  "id": "slug-unique",
  "titre": "Titre du livre",
  "auteur": "Nom auteur",
  "categorie": "theologie|torah|prophetie|formation",
  "description": "Courte description",
  "couverture": "https://...",
  "lien_pdf": "https://drive.google.com/uc?export=download&id=...",
  "publie": true,
  "dans_carousel": false,
  "date_publication": "2024-01-01"
}
```

### audios.json
```json
{
  "id": "slug-unique",
  "titre": "Titre audio",
  "auteur": "Nom auteur",
  "categorie": "priere|vie-chretienne|formation|theologie|louange",
  "description": "Courte description",
  "couverture": "https://...",
  "lien_audio": "https://drive.google.com/uc?export=download&id=...",
  "duree": "~45 min",
  "publie": true,
  "dans_carousel": false,
  "date_publication": "2024-01-01"
}
```

### videos.json
```json
{
  "id": "slug-unique",
  "titre": "Titre vidéo",
  "serie": "Nom de la série",
  "categorie": "predication|enseignement|temoignage|adoration|formation",
  "youtube_id": "dQw4w9WgXcQ",
  "miniature": "https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
  "duree": "45:32",
  "publie": true,
  "date_publication": "2024-01-01"
}
```

### projets.json
```json
{
  "id": "slug-unique",
  "titre": "Titre projet",
  "categorie": "evangelisation|media|formation|social|international",
  "description": "Description détaillée",
  "image": "https://...",
  "progression": 65,
  "statut": "en-cours",
  "publie": true
}
```
