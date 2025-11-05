#  **TP S6 : SCALABILITÉ & RÉSILIENCE**

Ce document récapitule les livrables pour la Séance S6, couvrant l'élasticité (HPA), la protection (PDB) et la démonstration de la performance (SLO/SLI et k6).

## **1\. Objectifs et Barème** 

| Livrable | Manifests / Documentation | Points |
| :---- | :---- | :---- |
| **Manifests HPA** | s6-hpa-pdb.yaml | 3 pts |
| **Manifests PDB** | s6-hpa-pdb.yaml | 2 pts |
| **Fiche SLO/SLI** | README.md | 3 pts |
| **Démonstration de Charge** | s6-load-test.js & Résultats | 2 pts |
| *Note : La mise à l'échelle automatique (HPA) valide la majorité de ces points.* |  |  |

## **2\. Déploiement et Résilience**

### **2.1. Manifests Appliqués**

Les fichiers s6-hpa-pdb.yaml ont été appliqués pour créer les ressources suivantes :

* **HPA (api-hpa)** : Cible 60% d'utilisation CPU, met à l'échelle de 2 à 6 réplicas.  
* **PDB (api-pdb)** : Assure un minimum de 2 Pods disponibles pour l'API en cas d'éviction.

\# Application du HPA et du PDB  
kubectl apply \-f s6-hpa-pdb.yaml

### 

### 

### **2.2. Fiche SLO/SLI (Livrable)**

Voici les objectifs de performance définis pour l'application API (contenu de s6-slo-sli.md):

| Service | SLI (Indicateur) | Cible (SLO) | Fenêtre | Méthode de Mesure |
| :---- | :---- | :---- | :---- | :---- |
| **API** | Latence P95 | \< 300 ms | 30 jours | Prometheus histogram\_quantile |
| **API** | Taux d'Erreur (5xx) | \< 1% | 30 jours | Prometheus rate(5xx)/rate(total) |
| **API** | Disponibilité | ≥ 99.5% | 30 jours | Uptime Probe / Taux d'erreur |
| **API** | Saturation CPU | \< 80% | 30 jours | container\_cpu\_usage\_seconds\_total |

## **3\. Démonstration de la Mise à l'Échelle (k6)**

La démonstration prouve que le HPA réagit à une surcharge simulée par le script s6-load-test.js.

### **3.1. Procédure de Test**

1. **Surveillance** : Lancer la surveillance du HPA pour observer l'évolution de la colonne **REPLICAS**.  
   kubectl get hpa api-hpa \-n workshop \-w

2. **Surcharge** : Lancer le test k6 qui envoie 500 requêtes/seconde.  
   k6 run s6-load-test.js

### **3.2. Validation du Scaling**

L'augmentation des réplicas (de 2 à 3, 4, 5 ou 6\) pendant l'exécution du test valide le fonctionnement du HPA.

* **Target** passe de unknown/60% à une valeur numérique \> 60%.  
* **REPLICAS** augmente pour absorber la charge.

