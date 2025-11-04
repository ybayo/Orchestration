\# 💾 README - TP S5 : Persistance \& Workloads avec état



Ce document résume le travail effectué pour la \*\*Séance S5\*\*, couvrant le \*\*déploiement de PostgreSQL\*\* et la \*\*documentation du Runbook de gestion des données\*\*.



---



\## 1. Objectifs \& Évaluation de la Séance 🎯



Le but était de \*\*maîtriser le modèle PV/PVC/SC pour la persistance\*\* et de \*\*déployer une application avec état (PostgreSQL)\*\* via un \*\*StatefulSet\*\*.



\### 🧾 Livrable



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



