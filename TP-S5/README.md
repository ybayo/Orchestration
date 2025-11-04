# **💾 ⚙️ TP S5 : PERSISTANCE & WORKLOADS AVEC ÉTAT**

## **✨ Synthèse de la Séance**

Ce document récapitule le travail effectué pour la Séance S5, couvrant le déploiement persistant de PostgreSQL et la documentation associée (Runbook).

## **1\. Objectifs & Évaluation de la Séance 🎯**

Le but de ce TP était de maîtriser la gestion des applications avec état (StatefulSet) et la persistance dynamique (PVC).

### **📋 Barème et Livrables**

| Livrable | Manifests / Documentation | Points |
| :---- | :---- | :---- |
| Manifests StatefulSet \+ PVC | s5-postgres.yaml | 5 pts |
| Runbook Backup (Dump) | runbook.md | 3 pts |
| Runbook Restore | runbook.md | 1 pt |
| Documentation Générale | runbook.md / README.md | 1 pt |

## **2\. Déploiement de PostgreSQL (StatefulSet)**

Le StatefulSet gère l'identité stable, le Secret les identifiants, et le VolumeClaimTemplate la persistance des données.

### **2.1. Application des Manifests**

Assurez-vous que les fichiers sont dans le répertoire TP-S5 et que le Namespace workshop existe.

\# Application des manifests S5  
kubectl apply \-f s5-postgres.yaml

### **2.2. Vérification du Déploiement**

La vérification confirme que le Pod est Running et que le stockage est lié.

\# Vérification des Pods (doit être 1/1 Running)  
kubectl get pods \-n workshop \-l app=postgres

\# Vérification du PVC (doit être Bound)  
kubectl get pvc \-n workshop

## **3\. Procédure Opérationnelle (Runbook) 📑**

Les commandes détaillées pour la gestion des données sont le livrable clé de ce TP.

### **3.1. Sauvegarde (Backup Logique)**

Procédure pour exporter la base de données entière via pg\_dumpall vers la machine hôte.

\# 1\. Définir le Pod cible (postgres-0)  
export POD=$(kubectl \-n workshop get po \-l app=postgres \-o jsonpath='{.items\[0\].metadata.name}')

\# 2\. Exécuter le dump et sauvegarder localement  
kubectl exec $POD \-n workshop \-- bash \-c 'pg\_dumpall \-U postgres' \> backup-S5-$(date \+%F).sql

### **3.2. Restauration (Restore Logique)**

Procédure pour réinjecter le dump SQL dans le conteneur via psql.

\# Définir le nom du fichier de dump  
FICHIER\_DUMP="backup-S5-AAAA-MM-JJ.sql" 

\# Exécuter la restauration  
kubectl exec \-i $POD \-n workshop \-- bash \-c 'psql \-U postgres' \< $FICHIER\_DUMP  
