# Inventaire des icônes — CodeBook

## Favicons et icônes d'application

Créer deux déclinaisons de la marque, en gardant le même dessin et les mêmes couleurs Coda:

- `favicon-solid.svg` — version pleine, pour les onglets et les raccourcis.
- `favicon-rounded.svg` — version aux formes arrondies, pour les contextes plus chaleureux et les avatars d'application.
- `favicon.ico` — export multi-tailles 16, 32 et 48 px, solution de repli navigateur.
- `apple-touch-icon.png` — 180 × 180 px.
- `icon-192.png` et `icon-512.png` — icônes d'installation PWA.
- `icon-maskable-512.png` — variante adaptative avec le dessin dans la zone centrale de sécurité.
- `site.webmanifest` — références aux icônes PWA et couleur de thème `#F6F5FC`.

Motif conseillé: un signe de question ou une coche dans une bulle/carte de quiz compacte; conserver une silhouette reconnaissable à 16 px. Palette: fond citron `#DDF849`, dessin encre `#080331`, accent violet `#4B00EB`. Éviter le texte dans le favicon.

## Icônes d'interface nécessaires

| Usage | Nom Material Symbols conseillé | État |
| --- | --- | --- |
| Marque / aide contextuelle | `quiz` ou `help` — icône de marque et bouton d'aide pour expliquer les règles ou le fonctionnement | À dessiner avec le favicon |
| Choix du thème de jeu | `balance` (Éthique) / `terminal` (GNU/Linux) — sélection du cadre philosophique ou technique du quiz | Requis |
| Choix de la série | `menu_book` ou `library_books` — sélection de la série de questions à étudier ou à jouer | Requis |
| Démarrer un quiz | `play_arrow` — lancer une session ou une série de questions | Requis |
| Validation / quiz terminé | `check_circle` ou `task_alt` — confirmation d'une bonne réponse ou de la fin de session | Requis |
| Réponse incorrecte | `cancel` ou `close` — feedback négatif sur une réponse ou une action refusée | Requis |
| Progression du quiz | `monitoring` ou `query_stats` — indicateur de progression, de score ou d'avancement | Requis |
| Série de révision | `local_fire_department` ou `bolt` — mode révision rapide ou session intensive | Facultatif |
| Réglages du quiz | `tune` — paramètres de la partie (durée, difficulté, mélange, etc.) | Requis |
| Mélanger les questions | `shuffle` — réorganiser l'ordre des questions ou des réponses | Requis |
| Réponse écrite | `keyboard` ou `edit` — saisie libre, réponse textuelle ou correction manuelle | Requis |
| Profil utilisateur | `account_circle` ou `person` — accès au compte, au profil et aux préférences | Requis |
| Choisir un avatar | `face` — sélection de l'avatar visuel du profil | Requis |
| Ouvrir / fermer un menu | `expand_more`, `close` — afficher ou réduire un panneau, un menu ou un sous-menu | Requis |
| Question / étape suivante | `arrow_forward` — passer à la question suivante ou à l'écran suivant | Requis |
| Temps estimé | `schedule` — durée prévue de la session ou de la réponse | Facultatif |

## Familles visuelles

- **Solid:** Material Symbols avec `FILL=1`, pour actions principales, progression et états validés.
- **Rounded:** Material Symbols Rounded avec `FILL=1`, pour navigation, profils et actions secondaires.
- Garder une seule famille par contexte; éviter de mélanger emoji et icônes fonctionnelles.
- Icônes de commande: cible tactile d'au moins 40 × 40 px et nom accessible (`aria-label` ou texte visible).
- Les états correct/incorrect ont toujours un libellé en plus de leur icône et de leur couleur.
