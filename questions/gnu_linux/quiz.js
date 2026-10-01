window.quizData = window.quizData || {};
window.quizData.gnu_linux = {
	name: "GNU/Linux",
	icon: "⌘",
	series: [
		{
			id: "bases",
			category: "Fondamentaux",
			name: "Les bases du système",
			questions: [
				{
					prompt: "Quelle commande affiche le répertoire courant dans un terminal ?",
					choices: ["pwd", "cd", "ls", "mkdir"],
					answer: 0,
					accepted: ["pwd"],
					explanation: "pwd signifie « print working directory » et affiche le chemin du répertoire courant."
				},
				{
					prompt: "Quelle commande liste les fichiers d'un répertoire ?",
					choices: ["ls", "rm", "pwd", "touch"],
					answer: 0,
					accepted: ["ls"],
					explanation: "La commande ls affiche le contenu d'un répertoire."
				},
				{
					prompt: "Que fait généralement la commande cd ?",
					choices: ["Changer de répertoire", "Créer un fichier", "Afficher la date", "Supprimer un utilisateur"],
					answer: 0,
					accepted: ["changer de répertoire", "se déplacer dans un répertoire", "naviguer entre les répertoires"],
					explanation: "cd, pour « change directory », permet de se déplacer dans l'arborescence."
				},
				{
					prompt: "Quel symbole désigne le répertoire personnel d'un utilisateur ?",
					choices: ["~", "#", "&", "|"],
					answer: 0,
					accepted: ["~", "tilde", "le tilde"],
					explanation: "Le tilde ~ est une notation courante du répertoire personnel."
				},
				{
					prompt: "Quelle commande affiche la valeur de la variable d'environnement PATH ?",
					choices: ["printenv PATH", "setpath --show", "path -list", "env -remove PATH"],
					answer: 0,
					accepted: ["printenv path", "printenv suivi de path", "la commande printenv PATH"],
					explanation: "printenv affiche la valeur d'une variable d'environnement donnée, ici PATH."
				}
			]
		},
		{
			id: "terminal",
			category: "Fondamentaux",
			name: "Fichiers et terminal",
			questions: [
				{
					prompt: "Quelle commande crée un nouveau répertoire ?",
					choices: ["mkdir", "rmdir", "grep", "echo"],
					answer: 0,
					accepted: ["mkdir"],
					explanation: "mkdir, pour « make directory », crée un répertoire."
				},
				{
					prompt: "À quoi sert la commande man ?",
					choices: ["Consulter le manuel d'une commande", "Renommer un fichier", "Monter un disque", "Mesurer la mémoire"],
					answer: 0,
					accepted: ["consulter le manuel d'une commande", "afficher le manuel", "lire la documentation"],
					explanation: "man ouvre la page de manuel qui documente une commande."
				},
				{
					prompt: "Quelle commande copie un fichier depuis le terminal ?",
					choices: ["cp", "mv", "rm", "cat"],
					answer: 0,
					accepted: ["cp"],
					explanation: "cp copie des fichiers ou des répertoires."
				},
				{
					prompt: "Quelle commande déplace ou renomme un fichier ?",
					choices: ["mv", "cp", "cat", "pwd"],
					answer: 0,
					accepted: ["mv"],
					explanation: "mv déplace un fichier vers un autre emplacement ou le renomme."
				},
				{
					prompt: "Quelle commande supprime un fichier nommé brouillon.txt ?",
					choices: ["rm brouillon.txt", "rmdir brouillon.txt", "erase-dir brouillon.txt", "unlink-folder brouillon.txt"],
					answer: 0,
					accepted: ["rm brouillon.txt", "rm suivi du nom du fichier", "la commande rm"],
					explanation: "rm supprime des entrées de fichiers; il faut vérifier soigneusement son chemin et ses arguments avant de l'utiliser."
				}
			]
		},
		{
			id: "permissions",
			category: "Système",
			name: "Permissions et propriété",
			questions: [
				{
					prompt: "Dans la sortie de ls -l, que signifie la lettre x pour un fichier ?",
					choices: ["Le droit d'exécution", "Le droit de suppression", "Le droit de partage réseau", "Le droit de compression"],
					answer: 0,
					accepted: ["le droit d'exécution", "l'autorisation d'exécuter", "exécution"],
					explanation: "La lettre x indique le droit d'exécuter un fichier ou de traverser un répertoire."
				},
				{
					prompt: "Que fait chmod u+x script.sh ?",
					choices: ["Ajoute le droit d'exécution au propriétaire", "Retire tous les droits au groupe", "Change le propriétaire du script", "Exécute le script immédiatement"],
					answer: 0,
					accepted: ["ajoute le droit d'exécution au propriétaire", "donne le droit d'exécution à l'utilisateur propriétaire", "ajoute x pour le propriétaire"],
					explanation: "Dans cette notation symbolique, u désigne le propriétaire et +x ajoute le droit d'exécution."
				},
				{
					prompt: "Quels droits représente le mode numérique 640 ?",
					choices: ["Propriétaire lecture-écriture, groupe lecture, autres aucun", "Tout le monde lecture-écriture", "Propriétaire exécution, groupe aucun, autres lecture", "Propriétaire lecture seule, groupe écriture, autres exécution"],
					answer: 0,
					accepted: ["propriétaire lecture écriture, groupe lecture, autres aucun", "rw pour le propriétaire, r pour le groupe, rien pour les autres", "lecture écriture propriétaire, lecture groupe"],
					explanation: "6 vaut lecture et écriture, 4 vaut lecture seule et 0 n'accorde aucun droit."
				},
				{
					prompt: "Quelle commande change le propriétaire et le groupe d'un fichier ?",
					choices: ["chown alice:dev fichier", "chmod alice:dev fichier", "usermod fichier", "own -g dev fichier"],
					answer: 0,
					accepted: ["chown alice:dev fichier", "la commande chown", "chown"],
					explanation: "chown modifie le propriétaire et, avec la syntaxe utilisateur:groupe, le groupe associé."
				},
				{
					prompt: "Pour traverser un répertoire, quel droit est nécessaire ?",
					choices: ["Le droit x", "Le droit w uniquement", "Le droit r uniquement", "Aucun droit"],
					answer: 0,
					accepted: ["le droit x", "le droit d'exécution", "x"],
					explanation: "Sur un répertoire, x autorise la traversée et l'accès aux entrées dont on connaît le nom."
				}
			]
		},
		{
			id: "comptes-utilisateurs",
			category: "Système",
			name: "Comptes et privilèges",
			questions: [
				{
					prompt: "Quelle commande affiche l'identité de l'utilisateur courant ?",
					choices: ["whoami", "hostname", "uname", "groupsadd"],
					answer: 0,
					accepted: ["whoami"],
					explanation: "whoami affiche le nom associé à l'identité utilisateur effective du processus."
				},
				{
					prompt: "Quelle information fournit la commande id ?",
					choices: ["Les identifiants utilisateur et groupes", "La version du noyau", "L'espace disque disponible", "La liste des paquets à mettre à jour"],
					answer: 0,
					accepted: ["les identifiants utilisateur et groupes", "l'uid et les groupes de l'utilisateur", "les groupes et identifiants du compte"],
					explanation: "id affiche notamment l'UID, le GID principal et les groupes supplémentaires d'un compte."
				},
				{
					prompt: "À quoi sert sudo dans une commande ?",
					choices: ["À lancer une commande avec des privilèges autorisés", "À créer une sauvegarde automatique", "À chiffrer le répertoire personnel", "À démarrer un autre noyau"],
					answer: 0,
					accepted: ["à lancer une commande avec des privilèges autorisés", "exécuter une commande avec des droits élevés", "lancer temporairement une commande comme administrateur"],
					explanation: "sudo exécute une commande avec une autre identité, souvent celle de l'administrateur, selon les règles configurées."
				},
				{
					prompt: "Quel fichier contient les informations publiques des comptes locaux ?",
					choices: ["/etc/passwd", "/etc/hosts", "/var/log/auth.log", "/boot/grub.cfg"],
					answer: 0,
					accepted: ["/etc/passwd", "etc passwd", "le fichier passwd dans /etc"],
					explanation: "/etc/passwd contient des entrées de comptes, comme leur UID et leur répertoire personnel; les secrets sont stockés séparément."
				},
				{
					prompt: "Quelle commande permet à un utilisateur de modifier son mot de passe ?",
					choices: ["passwd", "password-set", "usermod -prompt", "login --change"],
					answer: 0,
					accepted: ["passwd", "la commande passwd"],
					explanation: "Sans argument particulier, passwd permet à l'utilisateur courant de changer son mot de passe."
				}
			]
		},
		{
			id: "processus",
			category: "Système",
			name: "Processus et tâches",
			questions: [
				{
					prompt: "Quelle commande affiche un instantané des processus en cours ?",
					choices: ["ps", "free", "df", "uname"],
					answer: 0,
					accepted: ["ps", "la commande ps"],
					explanation: "ps affiche les processus; ses options permettent d'élargir la liste et les informations présentées."
				},
				{
					prompt: "Quel outil affiche les processus et actualise régulièrement leur activité ?",
					choices: ["top", "touch", "tee", "type"],
					answer: 0,
					accepted: ["top"],
					explanation: "top fournit une vue interactive et actualisée des processus et de l'utilisation des ressources."
				},
				{
					prompt: "Quel est l'effet habituel de kill PID sans option de signal ?",
					choices: ["Demander l'arrêt du processus avec SIGTERM", "Redémarrer le système", "Supprimer le fichier du processus", "Envoyer un signal réseau au PID"],
					answer: 0,
					accepted: ["demander l'arrêt du processus avec sigterm", "envoyer sigterm au processus", "envoyer le signal de terminaison"],
					explanation: "Par défaut, kill envoie SIGTERM, qui demande au processus de se terminer proprement."
				},
				{
					prompt: "Que montre la commande jobs dans un shell ?",
					choices: ["Les tâches lancées en arrière-plan par ce shell", "Tous les comptes utilisateurs", "Les tâches planifiées du système", "Les paquets installés"],
					answer: 0,
					accepted: ["les tâches lancées en arrière-plan par ce shell", "les travaux du shell courant", "les jobs du shell"],
					explanation: "jobs liste les tâches que le shell courant suit, notamment celles suspendues ou exécutées en arrière-plan."
				},
				{
					prompt: "Que signifie le & à la fin d'une commande shell ?",
					choices: ["Lancer la commande en arrière-plan", "Rediriger son erreur vers un fichier", "Enchaîner uniquement si elle réussit", "Exécuter la commande comme administrateur"],
					answer: 0,
					accepted: ["lancer la commande en arrière-plan", "exécuter en arrière-plan", "mettre la tâche en arrière-plan"],
					explanation: "Le shell rend la main et suit la commande comme une tâche d'arrière-plan."
				}
			]
		},
		{
			id: "paquets-logiciels",
			category: "Logiciels",
			name: "Paquets et logiciels",
			questions: [
				{
					prompt: "Sous Debian ou Ubuntu, que fait apt update ?",
					choices: ["Actualiser l'index des paquets disponibles", "Mettre à niveau tous les paquets installés", "Effacer le cache du navigateur", "Redémarrer les services"],
					answer: 0,
					accepted: ["actualiser l'index des paquets disponibles", "mettre à jour la liste des paquets", "rafraîchir les listes des dépôts"],
					explanation: "apt update récupère les métadonnées des dépôts; il n'installe pas à lui seul les mises à niveau."
				},
				{
					prompt: "Après apt update, à quoi sert généralement apt upgrade ?",
					choices: ["Installer les mises à niveau disponibles", "Rechercher un fichier par son nom", "Créer un nouvel utilisateur", "Modifier les partitions"],
					answer: 0,
					accepted: ["installer les mises à niveau disponibles", "mettre à niveau les paquets installés", "mettre à jour les logiciels"],
					explanation: "apt upgrade met à niveau les paquets installés en utilisant les informations récupérées depuis les dépôts."
				},
				{
					prompt: "Quelle commande installe le paquet nommé exemple avec APT ?",
					choices: ["sudo apt install exemple", "sudo apt search exemple --remove", "dpkg --format exemple", "install --kernel exemple"],
					answer: 0,
					accepted: ["sudo apt install exemple", "apt install exemple", "la commande apt install"],
					explanation: "apt install demande au gestionnaire APT d'installer le paquet et ses dépendances nécessaires."
				},
				{
					prompt: "Quelle différence distingue apt remove de apt purge ?",
					choices: ["purge retire aussi les fichiers de configuration du paquet", "remove met à jour le noyau", "purge conserve le programme mais efface les journaux", "remove ne fonctionne qu'en mode graphique"],
					answer: 0,
					accepted: ["purge retire aussi les fichiers de configuration du paquet", "purge supprime les configurations résiduelles", "apt purge enlève les fichiers de configuration"],
					explanation: "remove désinstalle le paquet, alors que purge supprime aussi ses fichiers de configuration gérés par le paquet."
				},
				{
					prompt: "Quel outil de bas niveau gère les paquets .deb sur Debian ?",
					choices: ["dpkg", "systemctl", "cron", "mount"],
					answer: 0,
					accepted: ["dpkg"],
					explanation: "dpkg installe et interroge les paquets .deb; APT ajoute notamment la gestion des dépôts et des dépendances."
				}
			]
		},
		{
			id: "stockage-systemes-fichiers",
			category: "Fichiers et stockage",
			name: "Stockage et systèmes de fichiers",
			questions: [
				{
					prompt: "Quelle commande affiche l'espace disponible des systèmes de fichiers ?",
					choices: ["df -h", "du -sh", "free -m", "lsblk -fichier"],
					answer: 0,
					accepted: ["df -h", "df en format lisible", "la commande df -h"],
					explanation: "df rapporte l'espace utilisé et disponible des systèmes de fichiers montés; -h rend les unités lisibles."
				},
				{
					prompt: "Comment mesurer la taille totale d'un répertoire avec une sortie synthétique ?",
					choices: ["du -sh dossier", "df -h dossier", "mount -s dossier", "stat -free dossier"],
					answer: 0,
					accepted: ["du -sh dossier", "la commande du avec s et h", "du -sh"],
					explanation: "du estime l'espace occupé par les fichiers; -s résume et -h adapte l'unité à l'affichage."
				},
				{
					prompt: "Que fait mount ?",
					choices: ["Rendre un système de fichiers accessible à un point de montage", "Créer un compte utilisateur", "Compresser un répertoire", "Afficher les processus actifs"],
					answer: 0,
					accepted: ["rendre un système de fichiers accessible à un point de montage", "attacher un système de fichiers à l'arborescence", "monter un système de fichiers"],
					explanation: "Le montage relie un système de fichiers à un répertoire de l'arborescence."
				},
				{
					prompt: "Quel est le rôle courant de /etc/fstab ?",
					choices: ["Décrire des systèmes de fichiers à monter", "Stocker l'historique des commandes", "Lister les processus à fermer", "Contenir les mots de passe en clair"],
					answer: 0,
					accepted: ["décrire des systèmes de fichiers à monter", "configurer les montages de systèmes de fichiers", "définir les montages persistants"],
					explanation: "/etc/fstab décrit des systèmes de fichiers et des options de montage, souvent utilisés au démarrage."
				},
				{
					prompt: "Que désigne un inode dans un système de fichiers Unix ?",
					choices: ["La structure qui contient les métadonnées d'un fichier", "Le nom affiché dans le terminal", "Une partition de mémoire vive", "Un protocole de téléchargement"],
					answer: 0,
					accepted: ["la structure qui contient les métadonnées d'un fichier", "les métadonnées du fichier", "l'identifiant et les métadonnées d'un fichier"],
					explanation: "Un inode stocke les métadonnées et références aux blocs; le nom est conservé séparément dans le répertoire."
				}
			]
		},
		{
			id: "flux-redirections",
			category: "Commandes et scripts",
			name: "Flux, tubes et redirections",
			questions: [
				{
					prompt: "Que fait le symbole > dans une commande shell ?",
					choices: ["Rediriger la sortie standard en remplaçant le fichier cible", "Ajouter la sortie à la fin du fichier", "Envoyer la sortie vers l'entrée standard", "Masquer les erreurs sans créer de fichier"],
					answer: 0,
					accepted: ["rediriger la sortie standard en remplaçant le fichier cible", "écraser le fichier avec la sortie", "rediriger stdout vers un fichier"],
					explanation: "La redirection > écrit stdout dans le fichier et remplace son contenu s'il existe déjà."
				},
				{
					prompt: "Quel opérateur ajoute la sortie standard à la fin d'un fichier ?",
					choices: [">>", ">", "<", "|"],
					answer: 0,
					accepted: [">>", "deux chevrons", "la redirection >>"],
					explanation: ">> ajoute à la fin du fichier au lieu de remplacer son contenu."
				},
				{
					prompt: "À quoi sert le tube | entre deux commandes ?",
					choices: ["Transmettre la sortie standard de la première à l'entrée de la seconde", "Exécuter la seconde uniquement si la première réussit", "Fusionner deux fichiers sur le disque", "Envoyer les erreurs dans un fichier"],
					answer: 0,
					accepted: ["transmettre la sortie standard de la première à l'entrée de la seconde", "relier la sortie d'une commande à l'entrée d'une autre", "envoyer stdout dans stdin de la commande suivante"],
					explanation: "Un tube connecte stdout d'un processus à stdin du processus suivant."
				},
				{
					prompt: "Quelle redirection envoie uniquement les erreurs vers erreurs.log ?",
					choices: ["2> erreurs.log", "> erreurs.log", "1< erreurs.log", "| erreurs.log"],
					answer: 0,
					accepted: ["2> erreurs.log", "rediriger le descripteur 2", "la redirection stderr avec 2>"],
					explanation: "Le descripteur 2 correspond à stderr, le flux d'erreur standard."
				},
				{
					prompt: "Quel outil affiche la sortie d'une commande tout en l'écrivant dans un fichier ?",
					choices: ["tee", "cut", "sort", "head"],
					answer: 0,
					accepted: ["tee", "la commande tee"],
					explanation: "tee duplique son entrée vers stdout et vers le ou les fichiers indiqués."
				}
			]
		},
		{
			id: "archives-compression",
			category: "Fichiers et stockage",
			name: "Archives et compression",
			questions: [
				{
					prompt: "Quelle commande crée une archive tar compressée avec gzip ?",
					choices: ["tar -czf archive.tar.gz dossier", "tar -xzf archive.tar.gz", "gzip -d dossier", "zip -r dossier archive.tar.gz"],
					answer: 0,
					accepted: ["tar -czf archive.tar.gz dossier", "tar avec c z f", "tar czf"],
					explanation: "Avec tar, c crée l'archive, z active gzip et f indique le nom du fichier d'archive."
				},
				{
					prompt: "Quelle option tar sert à extraire une archive gzip nommée archive.tar.gz ?",
					choices: ["-xzf", "-czf", "-tzc", "-rwx"],
					answer: 0,
					accepted: ["-xzf", "xzf", "l'option xzf"],
					explanation: "x extrait, z traite la compression gzip et f désigne le fichier d'archive."
				},
				{
					prompt: "Quelle commande décompresse un fichier fichier.gz sans créer une archive tar ?",
					choices: ["gunzip fichier.gz", "untar fichier.gz", "unzip -tar fichier.gz", "decompress --mount fichier.gz"],
					answer: 0,
					accepted: ["gunzip fichier.gz", "gunzip", "gzip -d fichier.gz"],
					explanation: "gunzip décompresse un flux gzip; gzip -d est une autre forme courante pour cette opération."
				},
				{
					prompt: "Quel outil peut lister le contenu d'une archive tar sans l'extraire ?",
					choices: ["tar -tf archive.tar", "tar -xf archive.tar", "gzip -l archive.tar", "mount -l archive.tar"],
					answer: 0,
					accepted: ["tar -tf archive.tar", "tar tf", "l'option t de tar"],
					explanation: "L'option t affiche la liste des membres de l'archive, tandis que f indique le fichier tar."
				},
				{
					prompt: "Quelle commande crée une archive ZIP récursive d'un répertoire ?",
					choices: ["zip -r archive.zip dossier", "gzip -r archive.zip dossier", "tar -r zip dossier", "unzip -r dossier archive.zip"],
					answer: 0,
					accepted: ["zip -r archive.zip dossier", "zip avec l'option récursive", "zip -r"],
					explanation: "L'option -r demande à zip d'inclure récursivement le contenu des sous-répertoires."
				}
			]
		},
		{
			id: "reseau",
			category: "Réseau",
			name: "Réseau et connectivité",
			questions: [
				{
					prompt: "Quelle commande ip affiche les adresses des interfaces réseau ?",
					choices: ["ip addr", "ip route del", "ip user", "ip package"],
					answer: 0,
					accepted: ["ip addr", "ip address", "ip a"],
					explanation: "ip addr affiche les interfaces et les adresses qui leur sont associées."
				},
				{
					prompt: "Que teste principalement ping ?",
					choices: ["La possibilité d'échanger des requêtes ICMP avec une machine", "La validité d'un mot de passe local", "La vitesse d'un disque", "La présence d'un paquet dans le dépôt"],
					answer: 0,
					accepted: ["la possibilité d'échanger des requêtes icmp avec une machine", "la connectivité réseau avec une machine", "si une machine répond aux requêtes icmp"],
					explanation: "ping envoie des requêtes ICMP; l'absence de réponse ne prouve pas toujours que la machine est hors ligne, car le trafic peut être filtré."
				},
				{
					prompt: "Quelle commande affiche les sockets en écoute avec ss ?",
					choices: ["ss -l", "ss --edit", "ss -rmdir", "ss --packages"],
					answer: 0,
					accepted: ["ss -l", "ss avec l'option l", "la commande ss -l"],
					explanation: "L'option -l de ss limite l'affichage aux sockets en écoute; -t ou -u peut préciser le type."
				},
				{
					prompt: "Quel service traduit habituellement un nom de domaine en adresse IP ?",
					choices: ["DNS", "SSH", "DHCP", "NTP"],
					answer: 0,
					accepted: ["dns", "le système dns", "le service dns"],
					explanation: "Le DNS permet notamment de rechercher les enregistrements associés à un nom de domaine."
				},
				{
					prompt: "Quel usage courant a curl ?",
					choices: ["Effectuer une requête vers une URL depuis le terminal", "Modifier les permissions d'un dossier", "Créer une archive compressée", "Lister les utilisateurs connectés"],
					answer: 0,
					accepted: ["effectuer une requête vers une url depuis le terminal", "envoyer une requête http", "récupérer le contenu d'une url"],
					explanation: "curl transfère des données avec des URL et permet notamment de tester ou d'appeler des services HTTP."
				}
			]
		},
		{
			id: "services-journaux",
			category: "Système",
			name: "Services et journaux système",
			questions: [
				{
					prompt: "Quelle commande vérifie l'état d'un service avec systemd ?",
					choices: ["systemctl status service", "journalctl enable service", "service --kernel service", "systemd list-file service"],
					answer: 0,
					accepted: ["systemctl status service", "systemctl status suivi du nom du service", "la commande systemctl status"],
					explanation: "systemctl status affiche l'état et quelques informations récentes sur une unité systemd."
				},
				{
					prompt: "Quelle commande redémarre un service nommé nginx avec systemd ?",
					choices: ["sudo systemctl restart nginx", "sudo systemctl status nginx", "journalctl --restart nginx", "nginx --systemd reload-user"],
					answer: 0,
					accepted: ["sudo systemctl restart nginx", "systemctl restart nginx", "systemctl restart suivi du service"],
					explanation: "systemctl restart demande à systemd d'arrêter puis de relancer l'unité indiquée."
				},
				{
					prompt: "Quel outil consulte le journal géré par systemd ?",
					choices: ["journalctl", "syslogctl", "logname", "dmesgctl"],
					answer: 0,
					accepted: ["journalctl", "la commande journalctl"],
					explanation: "journalctl interroge le journal systemd et permet de filtrer par unité, période ou priorité."
				},
				{
					prompt: "Comment afficher les journaux récents de l'unité ssh avec journalctl ?",
					choices: ["journalctl -u ssh", "journalctl -p ssh", "systemctl log ssh --all", "tail -u ssh /etc/passwd"],
					answer: 0,
					accepted: ["journalctl -u ssh", "journalctl avec l'option u pour ssh", "journalctl -u suivi du nom de l'unité"],
					explanation: "L'option -u sélectionne les entrées associées à une unité systemd."
				},
				{
					prompt: "Quel est le rôle principal d'un service système ?",
					choices: ["Exécuter un processus de fond pour fournir une fonction", "Afficher uniquement des icônes sur le bureau", "Remplacer le système de fichiers", "Traduire tous les programmes en langage machine à chaque lancement"],
					answer: 0,
					accepted: ["exécuter un processus de fond pour fournir une fonction", "fournir une fonction en arrière-plan", "faire fonctionner un processus de fond"],
					explanation: "Un service est un processus ou groupe de processus géré pour assurer une fonction, souvent sans interaction directe."
				}
			]
		},
		{
			id: "demarrage-noyau",
			category: "Système",
			name: "Démarrage et noyau",
			questions: [
				{
					prompt: "Quel composant est chargé en mémoire pour gérer les ressources matérielles et les processus ?",
					choices: ["Le noyau", "Le gestionnaire de fichiers", "Le shell interactif", "Le serveur DNS"],
					answer: 0,
					accepted: ["le noyau", "kernel", "le kernel"],
					explanation: "Le noyau gère notamment le matériel, la mémoire, les processus et les appels système."
				},
				{
					prompt: "À quoi sert principalement GRUB sur de nombreuses distributions ?",
					choices: ["Choisir et lancer un système au démarrage", "Installer les applications graphiques", "Gérer les connexions Wi-Fi", "Compresser les journaux système"],
					answer: 0,
					accepted: ["choisir et lancer un système au démarrage", "charger le noyau au démarrage", "servir de chargeur d'amorçage"],
					explanation: "GRUB est un chargeur d'amorçage qui peut proposer des entrées puis charger un noyau."
				},
				{
					prompt: "Quelle commande affiche la version du noyau actuellement utilisé ?",
					choices: ["uname -r", "kernel --list-users", "versionctl -k", "cat /etc/fstab"],
					answer: 0,
					accepted: ["uname -r", "uname avec l'option r", "la commande uname -r"],
					explanation: "uname -r affiche la release du noyau en cours d'exécution."
				},
				{
					prompt: "Quel type d'informations trouve-t-on sous /proc ?",
					choices: ["Des informations virtuelles sur les processus et le noyau", "Uniquement les documents personnels", "Les archives des paquets téléchargés", "Les fichiers permanents du chargeur de démarrage"],
					answer: 0,
					accepted: ["des informations virtuelles sur les processus et le noyau", "des informations sur les processus", "des données exposées par le noyau"],
					explanation: "/proc est un système de fichiers virtuel qui expose des informations sur les processus et l'état du noyau."
				},
				{
					prompt: "À quoi sert généralement l'initramfs au début du démarrage ?",
					choices: ["Fournir un environnement temporaire pour préparer l'accès au système racine", "Remplacer définitivement le noyau", "Stocker les mots de passe des comptes", "Lancer uniquement le navigateur web"],
					answer: 0,
					accepted: ["fournir un environnement temporaire pour préparer l'accès au système racine", "charger les pilotes et préparer le montage de la racine", "préparer le système de fichiers racine au démarrage"],
					explanation: "L'initramfs contient des outils et pilotes temporaires nécessaires avant que le système racine soit prêt."
				}
			]
		},
		{
			id: "scripts-shell",
			category: "Commandes et scripts",
			name: "Scripts et environnement shell",
			questions: [
				{
					prompt: "À quoi sert la ligne #!/bin/sh au début d'un script ?",
					choices: ["Indiquer l'interpréteur à utiliser", "Commenter tout le fichier", "Définir le propriétaire du script", "Demander des privilèges administrateur"],
					answer: 0,
					accepted: ["indiquer l'interpréteur à utiliser", "désigner le shell qui exécutera le script", "définir l'interpréteur avec un shebang"],
					explanation: "Cette ligne, appelée shebang, indique au système quel interpréteur doit lire le script."
				},
				{
					prompt: "Comment référencer la valeur d'une variable shell nommée dossier ?",
					choices: ["$dossier", "@dossier", "#dossier", "&dossier"],
					answer: 0,
					accepted: ["$dossier", "dollar dossier", "avec le signe dollar"],
					explanation: "Le signe $ permet au shell de développer la valeur d'une variable."
				},
				{
					prompt: "Pourquoi entourer une variable par des guillemets doubles dans \"$fichier\" ?",
					choices: ["Pour préserver les espaces dans sa valeur lors du découpage des mots", "Pour chiffrer automatiquement son contenu", "Pour empêcher toute expansion de variable", "Pour rendre le fichier exécutable"],
					answer: 0,
					accepted: ["pour préserver les espaces dans sa valeur lors du découpage des mots", "éviter que les espaces séparent la valeur en plusieurs mots", "protéger les espaces dans la valeur"],
					explanation: "Les guillemets doubles empêchent le découpage des espaces issus de l'expansion, tout en laissant les variables s'évaluer."
				},
				{
					prompt: "Que contient généralement la variable $? juste après une commande ?",
					choices: ["Son code de sortie", "Son identifiant utilisateur", "Le chemin du répertoire personnel", "Le nombre d'arguments du shell"],
					answer: 0,
					accepted: ["son code de sortie", "le code de retour de la dernière commande", "le statut de sortie de la commande"],
					explanation: "$? vaut généralement 0 si la commande précédente a réussi et une autre valeur si elle a signalé un échec."
				},
				{
					prompt: "Quel est l'effet courant de set -e dans un script shell ?",
					choices: ["Quitter le script après une commande qui échoue dans les cas concernés", "Exécuter toutes les commandes comme root", "Afficher chaque fichier du disque", "Ignorer toutes les erreurs"],
					answer: 0,
					accepted: ["quitter le script après une commande qui échoue dans les cas concernés", "arrêter le script à la première erreur", "interrompre le script si une commande échoue"],
					explanation: "set -e demande au shell d'arrêter le script sur certains statuts non nuls; son comportement dépend du contexte syntaxique."
				}
			]
		},
		{
			id: "diagnostic-outils",
			category: "Commandes et scripts",
			name: "Diagnostic et outils système",
			questions: [
				{
					prompt: "Quelle commande identifie le type réel d'un fichier sans se fier à son extension ?",
					choices: ["file", "suffix", "which", "basename"],
					answer: 0,
					accepted: ["file", "la commande file"],
					explanation: "file examine le contenu et les signatures d'un fichier pour en déterminer le type probable."
				},
				{
					prompt: "Quel outil interactif permet de modifier un fichier texte dans un terminal ?",
					choices: ["nano", "ping", "df", "uname"],
					answer: 0,
					accepted: ["nano", "un éditeur de texte comme nano", "la commande nano"],
					explanation: "nano est un éditeur de texte utilisable directement dans un terminal."
				},
				{
					prompt: "Quelle commande affiche le chemin de l'exécutable lancé pour une commande ?",
					choices: ["which", "whereis-user", "locate-run", "pathshow"],
					answer: 0,
					accepted: ["which", "la commande which"],
					explanation: "which recherche dans le PATH le programme qui sera trouvé pour le nom indiqué."
				},
				{
					prompt: "Quel fichier de configuration du shell est souvent lu à l'ouverture d'une session Bash interactive ?",
					choices: ["~/.bashrc", "/etc/fstab", "/proc/cpuinfo", "/var/cache/apt"],
					answer: 0,
					accepted: ["~/.bashrc", "le fichier bashrc du répertoire personnel", "bashrc"],
					explanation: "~/.bashrc contient souvent la configuration des sessions Bash interactives non-login; le détail dépend du type de session."
				},
				{
					prompt: "Comment afficher les dernières lignes d'un fichier journal en continu ?",
					choices: ["tail -f journal.log", "head -r journal.log", "cat -watch journal.log", "less --write journal.log"],
					answer: 0,
					accepted: ["tail -f journal.log", "tail avec l'option f", "la commande tail -f"],
					explanation: "tail -f suit l'ajout de nouvelles lignes au fichier et les affiche au fur et à mesure."
				}
			]
		},
		{
			id: "distributions-logiciels-libres",
			category: "Logiciels",
			name: "Distributions et logiciels libres",
			questions: [
				{
					prompt: "Qu'est-ce qu'une distribution GNU/Linux ?",
					choices: ["Un ensemble cohérent comprenant un noyau, des outils et des logiciels", "Un autre nom pour le terminal", "Un format unique de fichier texte", "Une commande de gestion des utilisateurs"],
					answer: 0,
					accepted: ["un ensemble cohérent comprenant un noyau des outils et des logiciels", "un système assemblé autour du noyau linux avec des logiciels", "un ensemble de logiciels et d'outils basé sur linux"],
					explanation: "Une distribution assemble un noyau, des outils, des applications et des choix de configuration pour fournir un système utilisable."
				},
				{
					prompt: "Quel rôle joue généralement le noyau Linux dans une distribution ?",
					choices: ["Gérer les ressources et fournir des services aux programmes", "Éditer les documents de l'utilisateur", "Remplacer tous les logiciels GNU", "Gérer uniquement les thèmes graphiques"],
					answer: 0,
					accepted: ["gérer les ressources et fournir des services aux programmes", "gérer le matériel la mémoire et les processus", "faire le lien entre logiciels et matériel"],
					explanation: "Le noyau Linux gère les ressources matérielles et expose des mécanismes utilisés par les programmes."
				},
				{
					prompt: "Que garantit principalement une licence de logiciel libre ?",
					choices: ["Des libertés d'utilisation, d'étude, de modification et de redistribution selon ses conditions", "L'absence obligatoire de tout coût", "Un support technique permanent de l'auteur", "L'absence de toute règle de redistribution"],
					answer: 0,
					accepted: ["des libertés d'utilisation d'étude de modification et de redistribution selon ses conditions", "les libertés d'utiliser étudier modifier et partager le logiciel", "la liberté d'étudier modifier et redistribuer selon la licence"],
					explanation: "Le logiciel libre concerne les libertés accordées par la licence, pas nécessairement la gratuité ou l'absence de conditions."
				},
				{
					prompt: "Pourquoi une distribution fournit-elle des dépôts de paquets ?",
					choices: ["Pour proposer des logiciels et leurs mises à jour de façon organisée", "Pour héberger uniquement les répertoires personnels", "Pour remplacer le système de fichiers local", "Pour empêcher toute vérification des logiciels"],
					answer: 0,
					accepted: ["pour proposer des logiciels et leurs mises à jour de façon organisée", "distribuer les paquets et leurs mises à jour", "fournir des paquets vérifiables et maintenus"],
					explanation: "Les dépôts regroupent des paquets que le gestionnaire peut télécharger, vérifier et mettre à jour."
				},
				{
					prompt: "À quoi sert une image live GNU/Linux ?",
					choices: ["Démarrer un système utilisable sans l'installer immédiatement sur le disque", "Compresser automatiquement tous les fichiers", "Créer obligatoirement un compte en ligne", "Mettre à jour le BIOS à chaque lancement"],
					answer: 0,
					accepted: ["démarrer un système utilisable sans l'installer immédiatement sur le disque", "essayer ou utiliser linux depuis un support sans installation", "lancer un système temporaire depuis une clé usb"],
					explanation: "Un média live permet de démarrer un environnement temporaire, souvent depuis une clé USB, avant une éventuelle installation."
				}
			]
		}
	]
};