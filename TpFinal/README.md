# DataPress – POC conteneurs & Kubernetes

Ce dépôt contient un Proof of Concept (POC) complet visant à moderniser la plateforme interne de DataPress en utilisant des technologies de conteneurisation et d'orchestration. Il établit une architecture moderne basée sur une API FastAPI et un front-end statique servi par NGINX, avec une gestion du cycle de vie allant du développement local (Docker Compose) au déploiement en recette (Kubernetes), incluant un prélude à une chaîne CI/CD.

## Contenu du dépôt

- `app/api/` : code et Dockerfile de l'API FastAPI.
- `app/front/` : front statique, template HTML et image NGINX personnalisée.
- `k8s/` : manifests Kubernetes (namespace, ConfigMap, Secret, Deployments, Services).
- `.github/workflows/` : pipeline CI de build.
- `docs/` : documentation technique et présentation client.
- `docker-compose.yml` : exécution locale.

## Prérequis

- Docker Desktop
- Accès à un cluster Kubernetes et `kubectl`.
- Optionnel : GitHub Actions (ou autre) pour exécuter le workflow CI.

## Lancer le mode développement

```bash
docker compose up --build
```

Services exposés :

- API : http://localhost:8000
- Front : http://localhost:8080

Le front interroge l'API via le réseau Compose et affiche la réponse JSON en temps réel.

## Déploiement Kubernetes

1. Créez les images et poussez-les dans un registre accessible au cluster (ou utilisez `kubectl apply -k .` après avoir paramétré `imagePullPolicy: Never` sur un cluster local qui partage les images Docker Desktop).
2. Appliquez les manifests :

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -n datapress-recette -f k8s/configmap.yaml -f k8s/secret.yaml
kubectl apply -n datapress-recette -f k8s/api-deployment.yaml -f k8s/api-service.yaml
kubectl apply -n datapress-recette -f k8s/front-deployment.yaml -f k8s/front-service.yaml
```

3. Vérifiez l'état :

```bash
kubectl get all -n datapress-recette
kubectl get events -n datapress-recette --sort-by=.lastTimestamp
```

4. Accédez au front via le NodePort (`http://<node-ip>:30080`). L'interface consomme l'API via le Service interne `datapress-api`.

## CI/CD minimal

Le workflow `build-api.yml` (GitHub Actions) :

- s'exécute sur chaque `push` sur `main`,
- installe Python,
- installe les dépendances de l'API,
- construit l'image Docker pour valider le Dockerfile.

Ajoutez des secrets de registre si vous souhaitez pousser automatiquement l'image.

## Documentation

Les documents détaillés se trouvent dans `docs/` :

- `DocTechnique.md` : contexte, architecture, décisions et guide d'exploitation.
- `ClientPresentation.pptx` : support synthétique orienté DSI, prêt à projeter.

## Tests et vérifications

- `docker compose logs -f api front` pour suivre les services locaux.
- `uvicorn` embarqué expose `/health` utilisé par les probes Kubernetes.
- Sur Kubernetes : `kubectl logs -n datapress-recette deploy/datapress-api` et `kubectl port-forward service/datapress-api 8081:80` pour diagnostiquer.


## Étapes suivantes possibles

- Déployer un Ingress Controller avec TLS/HTTPS pour sécuriser l'accès externe de manière standardisée.
- Ajouter des outils d'Observabilité (Monitoring & Logging) pour permettre à l'équipe technique de superviser l'état des services et de centraliser les journaux d'erreurs (ex. Prometheus et Grafana).
- Mettre en place l'Autoscaling Horizontal (HPA) pour garantir la capacité de DataPress à absorber les pics de trafic sur l'API, en augmentant ou diminuant automatiquement le nombre de Pods.
- Étendre la CI/CD pour inclure des tests unitaires et des scans de sécurité des images avant le déploiement.


