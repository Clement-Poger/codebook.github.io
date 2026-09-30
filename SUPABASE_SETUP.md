# Configuration Supabase

# uOum1oMasDN9oMcC
# Clé PUBLIQUE MAIL : e4a83d952b35d744e81bce679c1630ae
# Clé PRIVE MAIL: c4b0217ef492b843e5dd37eb941cd146

L'application utilise Supabase Auth pour les connexions, les inscriptions publiques et la récupération des mots de passe, PostgreSQL avec RLS pour la progression et une Edge Function pour inviter des comptes. Aucun mot de passe n'est stocké par l'application.

## Développement local avec npm

Installe les dépendances puis démarre le serveur HTTP depuis la racine du projet :

```powershell
npm install
npm start
```

Ouvre ensuite `http://localhost:4173/app/home.html` et ajoute `http://localhost:4173` aux URL autorisées dans Supabase. Ne lance pas l'application avec `file://`, car les liens d'invitation et de récupération nécessitent une origine web. `npm test` vérifie la syntaxe des scripts JavaScript; il ne remplace pas un test de connexion au projet Supabase.

## 1. Créer et verrouiller le projet

1. Crée un projet Supabase et active le fournisseur d'authentification par e-mail et mot de passe.
2. Dans les réglages Auth, active les nouvelles inscriptions publiques, active la confirmation des adresses e-mail et impose une longueur minimale de mot de passe de 12 caractères. Le navigateur utilise `signUp` pour créer un compte, `signInWithPassword` pour la connexion et `updateUser` pour choisir le mot de passe après invitation ou récupération. Les administrateurs peuvent aussi inviter un compte via `auth.admin.inviteUserByEmail`.
3. Impose le second facteur pour les comptes admin et configure un fournisseur SMTP de production.
4. Dans les URL de redirection autorisées, ajoute l'origine de production et les chemins de l'application, par exemple `https://ton-domaine.example/app/**`. Pour le développement local, ajoute l'origine HTTP locale utilisée par ton serveur de développement.
5. Héberge l'application sur HTTPS. Ne l'ouvre pas en `file://`: les redirections e-mail et la politique CORS requièrent une origine web configurée.

## 2. Créer la table protégée

Avec la CLI Supabase installée et authentifiée, lie le dépôt au projet puis applique la migration :

```powershell
supabase login
supabase link --project-ref <reference-du-projet>
supabase db push
```

La migration crée `public.quiz_progress`. Les politiques RLS n'autorisent chaque utilisateur authentifié qu'à lire ou modifier la ligne dont `user_id` correspond à `auth.uid()`. Aucun accès n'est accordé au rôle `anon`.

## 3. Déployer les invitations admin

Dans les secrets des Edge Functions, configure l'origine exacte du site et l'URL de la page d'accueil :

```powershell
supabase secrets set APP_ORIGIN=https://ton-domaine.example INVITE_REDIRECT_URL=https://ton-domaine.example/app/home.html
supabase functions deploy admin-invite-user
```

Supabase fournit à la fonction les variables serveur `SUPABASE_URL`, `SUPABASE_ANON_KEY` et `SUPABASE_SERVICE_ROLE_KEY`. La fonction vérifie le JWT de l'appelant puis exige `app_metadata.role = admin` avant d'utiliser `auth.admin.inviteUserByEmail`. La clé `service_role` ne doit jamais être copiée dans l'application ou dans `app/supabase-config.js`.

## 4. Créer le premier admin

Crée un compte depuis le formulaire de l'application et confirme son adresse e-mail, puis exécute cette requête dans le SQL Editor en remplaçant l'adresse :

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', 'admin')
where lower(email) = lower('admin@ton-domaine.example');
```

Vérifie qu'une seule ligne a été modifiée, puis reconnecte ce compte pour rafraîchir son jeton. `app_metadata` est modifiable par l'administration Supabase, pas par le navigateur. Les admins pourront ensuite envoyer les invitations depuis le bouton **Administration** de l'application; les nouveaux utilisateurs définiront leur mot de passe depuis le lien reçu.

## 5. Renseigner la configuration publique

Dans `app/supabase-config.js`, renseigne l'URL du projet, sa clé `anon`/publishable publique et l'URL de la page d'accueil déployée :

```js
window.SUPABASE_CONFIG = {
	url: "https://<reference-du-projet>.supabase.co",
	anonKey: "<cle-publishable-ou-anon>",
	appUrl: "https://ton-domaine.example/app/home.html"
};
```

La clé publishable/anon est destinée au client; la sécurité des données vient des politiques RLS. N'ajoute jamais la clé `service_role` ici. L'application échoue volontairement de façon fermée tant que l'URL et la clé publique ne sont pas configurées.

## Modèle de sécurité

- La création publique de compte, la connexion et la récupération du mot de passe sont gérées par Supabase Auth; la confirmation e-mail doit rester activée.
- Les inscriptions publiques doivent être activées dans Supabase pour que le formulaire de création de compte fonctionne.
- La progression est cloisonnée par utilisateur dans PostgreSQL grâce à RLS.
- Les admins doivent valider un second facteur TOTP; la fonction serveur exige aussi un JWT de niveau `aal2`.
- Le bouton admin n'est qu'un contrôle d'interface; la fonction serveur revérifie toujours le JWT, le rôle admin et le second facteur.
- La clé `service_role` reste dans l'environnement Edge Functions, jamais dans les fichiers web.

La connexion réelle, l'envoi des e-mails et les politiques ne peuvent être testés tant que le projet Supabase n'est pas créé, configuré et déployé.

Les anciennes données de profils présentes dans `localStorage` ne sont ni importées dans un compte choisi arbitrairement ni supprimées automatiquement. Une migration de ces données doit être explicitement associée au compte voulu.