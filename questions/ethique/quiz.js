window.quizData = window.quizData || {};
window.quizData.ethique = {
	name: "Éthique numérique",
	icon: "⚖",
	series: [
		{
			id: "donnees",
			category: "Vie privée",
			name: "Données personnelles",
			questions: [
				{
					prompt: "Quelle donnée est considérée comme personnelle ?",
					choices: ["Une adresse e-mail nominative", "La météo d'une ville", "Le prix moyen d'un ordinateur", "Le nom d'un système d'exploitation"],
					answer: 0,
					accepted: ["une adresse e-mail nominative", "adresse e-mail", "email nominatif"],
					explanation: "Une adresse qui permet d'identifier une personne est une donnée personnelle."
				},
				{
					prompt: "À quoi sert le principe de minimisation des données ?",
					choices: ["Collecter uniquement les données nécessaires", "Conserver toutes les données sans limite", "Rendre les données publiques", "Supprimer le consentement"],
					answer: 0,
					accepted: ["collecter uniquement les données nécessaires", "ne collecter que le nécessaire", "collecter le minimum"],
					explanation: "La minimisation limite la collecte à ce qui est utile pour un objectif précis."
				},
				{
					prompt: "Quel est un bon réflexe avant de partager une photo d'un camarade ?",
					choices: ["Demander son accord", "Ajouter sa localisation", "La publier dans tous les groupes", "Retirer son prénom uniquement"],
					answer: 0,
					accepted: ["demander son accord", "obtenir son consentement", "demander l'autorisation"],
					explanation: "Demander l'accord de la personne respecte sa vie privée et son droit à l'image."
				},
				{
					prompt: "Que signifie le RGPD ?",
					choices: ["Règlement général sur la protection des données", "Réseau global des plateformes digitales", "Registre de gestion des profils", "Règle générale des publications"],
					answer: 0,
					accepted: ["règlement général sur la protection des données", "reglement general sur la protection des donnees"],
					explanation: "Le RGPD encadre le traitement des données personnelles dans l'Union européenne."
				},
				{
					prompt: "Quel réglage limite la visibilité des publications d'un compte social ?",
					choices: ["Choisir un public restreint dans les paramètres de confidentialité", "Rendre le profil public", "Partager son mot de passe", "Ajouter sa localisation à chaque publication"],
					answer: 0,
					accepted: ["choisir un public restreint dans les paramètres de confidentialité", "limiter le public des publications", "régler la confidentialité pour choisir qui peut voir les publications"],
					explanation: "Les paramètres d'audience permettent de limiter les personnes qui peuvent consulter une publication."
				}
			]
		},
		{
			id: "numerique-responsable",
			category: "Sobriété numérique",
			name: "Numérique responsable",
			questions: [
				{
					prompt: "Quel geste prolonge directement la durée de vie d'un appareil ?",
					choices: ["Le réparer quand c'est possible", "Le remplacer à chaque nouvelle version", "Le laisser constamment en veille", "Multiplier les accessoires jetables"],
					answer: 0,
					accepted: ["le réparer quand c'est possible", "le réparer", "réparer l'appareil"],
					explanation: "La réparation évite un remplacement prématuré et réduit les ressources consommées."
				},
				{
					prompt: "Pourquoi compresser une vidéo avant de l'envoyer ?",
					choices: ["Réduire le volume de données transférées", "Augmenter sa résolution", "La rendre automatiquement privée", "Supprimer ses métadonnées"],
					answer: 0,
					accepted: ["réduire le volume de données transférées", "réduire les données", "réduire la taille du fichier"],
					explanation: "Un fichier plus léger demande moins de stockage et de transfert réseau."
				},
				{
					prompt: "Quel choix aide à limiter l'impact du stockage en ligne ?",
					choices: ["Supprimer les doublons inutiles", "Sauvegarder chaque fichier plusieurs fois", "Garder toutes les pièces jointes", "Augmenter la résolution de chaque photo"],
					answer: 0,
					accepted: ["supprimer les doublons inutiles", "supprimer les doublons", "faire le tri"],
					explanation: "Faire le tri limite le stockage de données qui ne servent plus."
				},
				{
					prompt: "Quel geste peut réduire la consommation électrique d'un écran ?",
					choices: ["Adapter sa luminosité au besoin", "Le laisser à luminosité maximale en permanence", "Afficher une vidéo sans interruption", "Désactiver sa mise en veille"],
					answer: 0,
					accepted: ["adapter sa luminosité au besoin", "réduire la luminosité quand elle est inutilement élevée", "baisser la luminosité de l'écran"],
					explanation: "Une luminosité adaptée évite de consommer davantage d'énergie que nécessaire pour l'affichage."
				},
				{
					prompt: "Comment traiter un appareil électronique qui ne peut plus être réparé ?",
					choices: ["Le déposer dans une filière de collecte adaptée", "Le jeter avec les ordures ménagères", "Le laisser dans un espace public", "Le démonter sans précaution"],
					answer: 0,
					accepted: ["le déposer dans une filière de collecte adaptée", "le confier à une filière de recyclage des appareils électroniques", "le déposer dans un point de collecte spécialisé"],
					explanation: "Une filière spécialisée peut traiter les composants et récupérer certaines matières dans de bonnes conditions."
				}
			]
		},
		{
			id: "respect-en-ligne",
			category: "Relations en ligne",
			name: "Respect et échanges en ligne",
			questions: [
				{
					prompt: "Quel comportement aide à désamorcer un désaccord en ligne ?",
					choices: ["Répondre en attaquant la personne", "Prendre le temps de formuler une réponse respectueuse", "Publier le message dans d'autres groupes", "Écrire uniquement en majuscules"],
					answer: 1,
					accepted: ["prendre le temps de formuler une réponse respectueuse", "rester respectueux", "répondre calmement"],
					explanation: "Une réponse posée permet de discuter des idées sans transformer le désaccord en attaque personnelle."
				},
				{
					prompt: "Que faire si l'on est témoin de cyberharcèlement ?",
					choices: ["Relayer les messages pour les rendre viraux", "Encourager les auteurs", "Soutenir la personne ciblée et signaler les faits", "Répondre par des insultes"],
					answer: 2,
					accepted: ["soutenir la personne ciblée et signaler les faits", "signaler le contenu et aider la victime", "prévenir un adulte et soutenir la personne"],
					explanation: "Ne pas amplifier les attaques, soutenir la personne et utiliser les dispositifs de signalement aide à interrompre le harcèlement."
				},
				{
					prompt: "Pourquoi éviter d'écrire tout un message en majuscules ?",
					choices: ["Cela le rend moins lisible sur tous les écrans", "Cela peut être perçu comme un cri ou une agressivité", "Cela supprime automatiquement le message", "Cela protège le compte contre le spam"],
					answer: 1,
					accepted: ["cela peut être perçu comme un cri ou une agressivité", "les majuscules peuvent donner l'impression de crier", "cela ressemble à un cri"],
					explanation: "Dans les usages en ligne, les majuscules répétées sont souvent interprétées comme un cri."
				},
				{
					prompt: "Quelle pratique rend une discussion de groupe plus inclusive ?",
					choices: ["Réserver la parole aux personnes déjà d'accord", "Se moquer des questions débutantes", "Laisser chacun contribuer sans humiliation", "Exclure les nouveaux participants"],
					answer: 2,
					accepted: ["laisser chacun contribuer sans humiliation", "accueillir les contributions de chacun", "permettre à tout le monde de participer"],
					explanation: "Une discussion inclusive permet aux personnes de participer sans craindre les moqueries ou l'exclusion."
				},
				{
					prompt: "Que faire face à un commentaire haineux sur une plateforme ?",
					choices: ["Le partager pour s'en moquer", "Le signaler avec l'outil prévu", "Publier les coordonnées de son auteur", "Créer plusieurs comptes pour répondre"],
					answer: 1,
					accepted: ["le signaler avec l'outil prévu", "utiliser la fonction de signalement", "signaler le commentaire"],
					explanation: "Le signalement transmet le contenu à la plateforme sans exposer davantage les personnes concernées."
				}
			]
		},
		{
			id: "information-et-droits",
			category: "Information et droits",
			name: "Information et droits numériques",
			questions: [
				{
					prompt: "Quel réflexe aide à vérifier une information avant de la partager ?",
					choices: ["Vérifier sa source et la recouper avec d'autres sources fiables", "Se fier uniquement au nombre de partages", "Lire seulement le titre", "La partager si elle confirme son opinion"],
					answer: 0,
					accepted: ["vérifier sa source et la recouper avec d'autres sources fiables", "croiser les sources", "vérifier plusieurs sources fiables"],
					explanation: "La source et les recoupements aident à distinguer une information étayée d'une affirmation trompeuse."
				},
				{
					prompt: "Pourquoi vérifier la date d'un article avant de le repartager ?",
					choices: ["La date rend toujours l'article plus fiable", "Une ancienne information peut être présentée comme actuelle", "La date indique le nombre de lecteurs", "Les articles récents n'ont pas de sources"],
					answer: 1,
					accepted: ["une ancienne information peut être présentée comme actuelle", "pour savoir si l'information est encore d'actualité", "vérifier que l'information n'est pas ancienne"],
					explanation: "Un contenu ancien peut ressortir sans son contexte et donner une impression trompeuse sur la situation actuelle."
				},
				{
					prompt: "Que faut-il faire avant de réutiliser une image trouvée en ligne ?",
					choices: ["Vérifier sa licence et respecter les conditions d'utilisation", "Retirer le nom de son auteur", "Supposer qu'elle est libre parce qu'elle est accessible", "La modifier légèrement pour éviter toute règle"],
					answer: 0,
					accepted: ["vérifier sa licence et respecter les conditions d'utilisation", "vérifier les droits d'utilisation", "consulter sa licence"],
					explanation: "Une image accessible en ligne reste soumise aux droits de son auteur et aux conditions de sa licence."
				},
				{
					prompt: "Comment reconnaître une publication sponsorisée ?",
					choices: ["Elle contient nécessairement une faute", "Elle est toujours publiée la nuit", "Elle doit être signalée comme contenu commercial", "Elle ne peut contenir aucun lien"],
					answer: 2,
					accepted: ["elle doit être signalée comme contenu commercial", "elle porte une mention de partenariat ou de publicité", "chercher la mention publicité ou sponsorisé"],
					explanation: "Une mention visible permet au public de comprendre qu'il s'agit d'une communication commerciale."
				},
				{
					prompt: "À quoi sert de citer l'auteur d'une ressource réutilisée ?",
					choices: ["À faire croire que l'on a créé la ressource", "À attribuer correctement le travail et faciliter sa vérification", "À rendre automatiquement toute licence inutile", "À empêcher les autres de consulter la ressource"],
					answer: 1,
					accepted: ["à attribuer correctement le travail et faciliter sa vérification", "reconnaître le travail de l'auteur et retrouver la source", "créditer l'auteur et indiquer la source"],
					explanation: "Citer la source reconnaît le travail de l'auteur et aide les lecteurs à retrouver le contenu original."
				}
			]
		},
		{
			id: "ia-responsable",
			category: "Intelligence artificielle",
			name: "Intelligence artificielle responsable",
			questions: [
				{
					prompt: "Pourquoi une réponse générée par une IA doit-elle être vérifiée ?",
					choices: ["Elle peut sembler convaincante tout en contenant une erreur", "Elle provient toujours d'une source officielle", "Elle est automatiquement validée par un expert", "Elle ne peut jamais être mise à jour"],
					answer: 0,
					accepted: ["elle peut sembler convaincante tout en contenant une erreur", "l'ia peut produire des erreurs même si sa réponse paraît crédible", "une ia peut inventer ou se tromper"],
					explanation: "Un système génératif peut produire une réponse plausible mais inexacte; il faut la confronter à des sources fiables."
				},
				{
					prompt: "Quel risque existe si un système de recrutement apprend sur des exemples biaisés ?",
					choices: ["Il peut reproduire des discriminations présentes dans les exemples", "Il garantit une sélection parfaitement neutre", "Il supprime le besoin de définir des critères", "Il rend les décisions impossibles à contester"],
					answer: 0,
					accepted: ["il peut reproduire des discriminations présentes dans les exemples", "il risque de reproduire les biais des données", "il peut défavoriser certains groupes"],
					explanation: "Les données d'entraînement peuvent refléter des inégalités; les résultats doivent être évalués pour détecter ces effets."
				},
				{
					prompt: "Dans une décision importante assistée par une IA, quelle approche est la plus responsable ?",
					choices: ["Laisser le système décider sans recours", "Confier la décision à un contrôle humain informé", "Cacher l'utilisation du système aux personnes concernées", "Remplacer les critères par le hasard"],
					answer: 1,
					accepted: ["confier la décision à un contrôle humain informé", "prévoir une supervision humaine", "faire vérifier la décision par une personne compétente"],
					explanation: "Un contrôle humain permet d'examiner le contexte, de repérer des erreurs et de prévoir un recours."
				},
				{
					prompt: "Pourquoi signaler qu'un contenu a été généré ou modifié par une IA ?",
					choices: ["Pour aider le public à comprendre comment le contenu a été produit", "Pour garantir qu'il est forcément exact", "Pour empêcher toute discussion", "Pour remplacer la vérification des sources"],
					answer: 0,
					accepted: ["pour aider le public à comprendre comment le contenu a été produit", "indiquer clairement l'usage de l'ia", "informer les lecteurs de son origine"],
					explanation: "La transparence sur l'origine d'un contenu aide chacun à l'interpréter avec le bon contexte."
				},
				{
					prompt: "Que signifie rendre une décision algorithmique explicable ?",
					choices: ["Pouvoir présenter les principaux éléments qui ont conduit au résultat", "Publier toutes les données personnelles utilisées", "Promettre que le résultat ne changera jamais", "Remplacer toute décision par un calcul secret"],
					answer: 0,
					accepted: ["pouvoir présenter les principaux éléments qui ont conduit au résultat", "expliquer les critères importants de la décision", "rendre compréhensibles les raisons du résultat"],
					explanation: "Une explication compréhensible permet d'examiner les critères utilisés et de contester une erreur éventuelle."
				}
			]
		}
	]
};