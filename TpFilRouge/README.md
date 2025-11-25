# **🚀 Projet Docker Avancé : Architecture Microservices Poll API**

Ce projet démontre la maîtrise de l'orchestration avancée en utilisant **Docker Swarm** pour déployer une architecture microservices résiliente et mise à l'échelle. L'application simule un service de vote simple basé sur une stack de 5 services hétérogènes.

## **🎯 Objectifs Clés Démontrés**

* **Haute Disponibilité (HA)** : Mise à l'échelle du service API (replicas: 3).
* **Qualité de Service (QoS)** : Gestion des ressources CPU/Mémoire pour garantir la stabilité de la pile.
* **Résilience** : Implémentation des Healthchecks conditionnels et des Mises à Jour Progressives (Rolling Updates).
* **Architecture** : Orchestration de 5 services hétérogènes (Node.js, PostgreSQL, Redis, Adminer, Frontend).

## **📂 Structure du Dépôt Git**

La structure du projet est organisée en modules clairs, chacun contenant les fichiers nécessaires à la conteneurisation et à la logique métier :

.  
├── api/                   # Microservice Backend (Node.js/Express)  
│   ├── Dockerfile         # Construction de l'image de l'API  
│   ├── index.js           # Logique métier (connexions DB/Redis, routes /vote, /results, /status)  
│   └── package.json       # Dépendances Node.js (express, pg, redis)  
├── frontend/              # Service Frontend (HTML/CSS statique + HTTP Server)  
│   ├── Dockerfile.frontend # Construction de l'image du serveur HTTP  
│   ├── index.html         # Interface de validation (liens rapides)  
│   └── package.json       # Dépendance http-server  
├── docker-compose.yml     # Fichier de Déploiement (Définition des 5 services, réseaux, volumes, orchestration Swarm)  
├── README.md              # Ce document  
└── Rapport de Projet Fil Rouge.docx # Document de synthèse et d'analyse  
└── documents/             # Fichiers de documentation et de présentation  
├── Rapport de Projet Fil Rouge.docx  # Compte rendu du projet  
└── Projet-Microservices-Poll-API.pptx # Support de présentation (PPTX)

## **🏗️ Architecture des Microservices (Stack de 5 Services)**

Le déploiement est géré par un unique docker-compose.yml qui définit cinq services interconnectés :

| Service | Technologie / Rôle | Statut dans le Cluster | Port Exposé (Hôte) |  
| api | Node.js (Logique métier/Votes) | Mise à l'échelle (3 Réplicas) | 8081 |  
| db | PostgreSQL | Persistance des données (Volume nommé) | 5432 (Interne) |  
| redis | Redis | Cache en temps réel (Décompte des votes) | 6379 (Interne) |  
| adminer | Outil d'Administration DB | Supervision et monitoring | 8085 |  
| app\_frontend | Node.js (HTTP Server) | Interface de validation | 8088 |

## **⚙️ Déploiement du Projet (Mode Orchestration Swarm)**

Pour exécuter cette architecture en mode orchestré, suivez les étapes ci-dessous.

### **Prérequis**

* **Docker Desktop** (ou Docker Engine) installé et fonctionnel.
* Être à la racine du dossier du projet (docker\_poll\_api).

### **Étape 1 : Initialiser le Docker Swarm**

Si ce n'est pas déjà fait, transformez votre machine en un nœud Manager pour l'orchestration :

docker swarm init

### **Étape 2 : Déployer l'Architecture (Stack)**

Cette commande lit le docker-compose.yml et déploie les 5 services avec les règles d'orchestration (scaling, QoS, rolling updates) :

docker stack deploy -c docker-compose.yml poll\_stack

### **Étape 3 : Vérifier la Mise à l'Échelle (Preuve HA)**

Vérifiez que les trois réplicas du service API sont bien actifs :

docker stack ps poll\_stack

**Résultat attendu :** Les tâches poll\_stack\_api.1, .2, et .3 doivent être en état **Running**.

## **✅ Validation et Points de Preuve**

Une fois le déploiement stable, utilisez les liens suivants pour valider les fonctionnalités et les contraintes d'orchestration :

1. **Preuve de Robustesse et Réseautage** (Confirme DB: UP et Cache: UP) :

   * [http://localhost:8081/status](https://www.google.com/search?q=http://localhost:8081/status)

2. **Accès à l'Application Frontend** (Validation visuelle) :

   * [http://localhost:8088](https://www.google.com/search?q=http://localhost:8088)

3. **Supervision de la Base de Données (Adminer)** :

   * [http://localhost:8085](https://www.google.com/search?q=http://localhost:8085)
   * *(Serveur: db, Utilisateur: poll\_user, Mot de passe: supersecretpassword)*

### **Test de la Logique Métier**

Pour tester l'interaction Redis/API :

\# Simuler un vote pour 'Paris'  
Invoke-WebRequest -Uri http://localhost:8081/vote -Method POST -Headers @{"Content-Type" = "application/json"} -Body '{"option": "Paris"}'

\# Voir les résultats du sondage  
http://localhost:8081/results

## **🛑 Nettoyage (Arrêt du Stack)**

Pour arrêter et supprimer l'intégralité de l'architecture orchestrée :

docker stack rm poll\_stack



## **Documents**



"Rapport de Projet Fil Rouge.docx" Pour voir le compte rendu avec les screens.

"FilRouge.pptx" Pour voir le PPTX



