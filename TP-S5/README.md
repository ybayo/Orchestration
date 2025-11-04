\# 💾 README - TP S5 : Persistance \& Workloads avec état



Ce document résume le travail effectué pour la \*\*Séance S5\*\*, couvrant le \*\*déploiement de PostgreSQL\*\* et la \*\*documentation du Runbook de gestion des données\*\*.



---



\## 1. Objectifs \& Évaluation de la Séance 🎯



Le but était de \*\*maîtriser le modèle PV/PVC/SC pour la persistance\*\* et de \*\*déployer une application avec état (PostgreSQL)\*\* via un \*\*StatefulSet\*\*.



\### 📋 Livrable



| Élément | Fichier | Points |

|:--|:--|:--:|

| Manifests StatefulSet + PVC | `s5-postgres.yaml` | 5 pts |

| Runbook Backup (Dump) | `runbook.md` | 3 pts |

| Runbook Restore | `runbook.md` | 1 pt |

| Documentation | `runbook.md` | 1 pt |



---



\## 2. Déploiement de PostgreSQL



Le déploiement utilise un \*\*StatefulSet\*\* pour l'identité stable et un \*\*VolumeClaimTemplate\*\* pour le provisioning dynamique.



\### 2.1. Application des Manifests



Assurez-vous d'être dans le répertoire \*\*TP-S5\*\* et que le \*\*Namespace `workshop`\*\* existe.



```bash

\# Application des manifests S5

kubectl apply -f s5-postgres.yaml



2.2. Vérification du Déploiement



Vérifiez que le Pod PostgreSQL est en état Running et que le PVC dynamique est Bound.



kubectl get pods -n workshop -l app=postgres

kubectl get pvc -n workshop





3\. Procédure Opérationnelle (Runbook)



Le détail des commandes de sauvegarde et de restauration est documenté ci-dessous.



3.1. Sauvegarde (Backup Logique)



Procédure pour exporter la base de données entière via pg\_dumpall.



\# 1. Définir le Pod cible

export POD=$(kubectl -n workshop get po -l app=postgres -o jsonpath='{.items\[0].metadata.name}')



\# 2. Exécuter le dump (la sauvegarde est locale)

kubectl -n workshop exec $POD -- bash -c 'pg\_dumpall -U postgres' > backup-S5-$(date +%F).sql





3.2. Restauration (Restore Logique)



Procédure pour réinjecter le dump SQL via psql.



\# Assurez-vous que FICHIER\_DUMP est défini (ex: "backup-S5-2025-11-04.sql")

FICHIER\_DUMP="backup-S5-AAAA-MM-JJ.sql" 

kubectl -n workshop exec -i $POD -- bash -c 'psql -U postgres' < $FICHIER\_DUMP



