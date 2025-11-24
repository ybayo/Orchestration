# Documentation technique – POC DataPress

## 1. Résumé du contexte

DataPress exploite aujourd'hui une plateforme monolithique hébergée sur un seul serveur. Le front, l'API, la base et divers scripts y cohabitent, ce qui complique les mises à jour et crée des indisponibilités lors des incidents. Le DSI souhaite préparer une migration progressive vers une architecture conteneurisée avec Docker et Kubernetes, disposant d'un environnement de recette fiable et d'un premier jalon CI/CD. Le POC présenté ici illustre cette trajectoire en séparant front et API, en décrivant les artefacts de déploiement et en fournissant un guide d'exploitation.

## 2. Architecture proposée

### 2.1 Mode développement (Docker Compose)

- Services : `api` (FastAPI) et `front` (NGINX statique).
- Réseau : réseau bridge `datapress` dédié, résolutions DNS (`api`, `front`).
- Volumétrie : pas de stockage persistant requis pour le POC.
- Commande : `docker compose up --build`.

Le front consomme l'API via `http://api:8000`, configuré via la variable `API_BASE_URL`. Le développeur obtient ainsi un environnement reproductible sans installer Python ni NGINX sur sa machine.

### 2.2 Mode recette (Kubernetes)

- Namespace dédié : `datapress-recette`.
- API : Deployment (2 réplicas) + Service ClusterIP `datapress-api` exposé sur le port 80 (cible 8000).
- Front : Deployment (1+ réplique) + Service NodePort `datapress-front` (port 30080) qui rend l'interface accessible depuis l'extérieur du cluster.
- ConfigMap `datapress-config` : porte les variables non sensibles (`APP_MESSAGE`, `APP_ENV`, `API_BASE_URL`).
- Secret `datapress-secret` : stocke `APP_TOKEN`, injecté côté API.

La communication interne s'appuie sur la résolution DNS Kubernetes (`datapress-api.datapress-recette.svc.cluster.local`), ce qui supprime les dépendances aux IP fixes.

### 2.3 Pourquoi Docker + Kubernetes ?

- Docker garantit des environnements isolés et reproductibles pour les développeurs.
- Kubernetes offre la haute disponibilité (plusieurs réplicas, redémarrage automatique), la supervision via probes et la séparation entre front et backend.
- Les deux outils facilitent l'évolution vers de la CI/CD complète, l'observabilité et la scalabilité horizontale.

## 3. Décisions techniques

- **API FastAPI** : légère, asynchrone, simple à containeriser.
- **Dockerfile multi-stage** : étape builder + runtime Python slim, exécution sous utilisateur non-root (`appuser`).
- **Front statique** : rendu par NGINX avec template HTML dynamique (envsubst) pour injecter l'URL de l'API sans rebuild.
- **Probes Kubernetes** : `readinessProbe` et `livenessProbe` basées sur `/health` pour l'API et `/` pour le front.
- **Resources** : requests/limits mémoire garantissent un minimum d'isolation, cohérent avec un cluster de recette.
- **ConfigMap / Secret** : séparation nette entre données publiques (messages, URL) et sensibles (token fictif).
- **NodePort** : solution simple pour exposer le front dans un cluster local ou de recette, en attendant un Ingress + TLS.
- **CI/CD** : GitHub Actions vérifie que l'image de l'API se construit, premier garde-fou avant d'ajouter tests et scans.

## 4. Guide d'exploitation

### 4.1 Docker Compose

1. Construire et lancer :
   ```bash
   docker compose up --build
   ```
2. Vérifier :
   - API : `curl http://localhost:8000/health`
   - Front : navigateur sur `http://localhost:8080`
3. Arrêter : `docker compose down`

### 4.2 Kubernetes

1. Préparer les images (`docker build -t <registry>/datapress-api:latest app/api`, idem pour le front, puis `docker push`).
2. Appliquer les manifests :
   ```bash
   kubectl apply -f k8s/namespace.yaml
   kubectl apply -n datapress-recette -f k8s/configmap.yaml -f k8s/secret.yaml
   kubectl apply -n datapress-recette -f k8s/api-deployment.yaml -f k8s/api-service.yaml
   kubectl apply -n datapress-recette -f k8s/front-deployment.yaml -f k8s/front-service.yaml
   ```
3. Contrôler :
   - `kubectl get all -n datapress-recette`
   - `kubectl get events -n datapress-recette --sort-by=.lastTimestamp`
   - `kubectl logs -n datapress-recette deploy/datapress-api`
4. Accéder au front : `http://<node-ip>:30080` (via port-forward si nécessaire).
5. Tester l'API via le Service : `kubectl port-forward -n datapress-recette svc/datapress-api 8081:80` puis `curl http://localhost:8081/`.

## 5. Limites et pistes d'amélioration

- **Ingress + TLS** : mettre en place un IngressController (NGINX, Traefik) avec certificats ACME pour un accès plus réaliste.
- **Base de données** : ajouter un service de données (PostgreSQL managé ou StatefulSet) et configurer des volumes persistants.
- **Observabilité** : intégrer Prometheus/Grafana ou OpenTelemetry, fournir des dashboards et des alertes basiques.
- **Sécurité** : activer des NetworkPolicies, scanner les images (Trivy), signer les artefacts (Cosign).
- **CI/CD avancé** : exécuter des tests unitaires, lints, publis d'images signées et déploiements automatisés vers l'environnement de recette.
- **Autoscaling** : configurer un HorizontalPodAutoscaler basé sur la charge CPU ou les requêtes HTTP de l'API.

