\# Runbook de Sauvegarde et Restauration - PostgreSQL (TP S5)



Ce runbook décrit la procédure de sauvegarde et de restauration logique de la base de données PostgreSQL déployée via StatefulSet dans le namespace `workshop`.



\## Objectifs du TP S5

\* \*\*Manifests StatefulSet+PVC\*\* (5 pts) : Fournis dans `s5-postgres.yaml`.

\* \*\*Backup\*\* (3 pts) et \*\*Restore\*\* (1 pt) : Procédures détaillées ci-dessous.

\* \*\*Documentation\*\* (1 pt).



\## 1. Préparation (Définition du Pod Cible)



Le Pod PostgreSQL est géré par un StatefulSet, il est donc nommé `postgres-0`.



1\.  \*\*Définir la variable du Pod :\*\*

&nbsp;   ```bash

&nbsp;   export POD=$(kubectl -n workshop get po -l app=postgres -o jsonpath='{.items\[0].metadata.name}')

&nbsp;   echo "Pod cible pour les opérations : $POD"

&nbsp;   ```



\## 2. Sauvegarde Logique (Backup - pg\_dumpall)



Cette procédure crée un dump complet de la base de données (dump logique) et le télécharge sur la machine hôte.



1\.  \*\*Exécuter `pg\_dumpall -U postgres`\*\* à l'intérieur du conteneur et enregistrer la sortie dans un fichier SQL local :

&nbsp;   ```bash

&nbsp;   kubectl -n workshop exec $POD -- bash -c 'pg\_dumpall -U postgres' > backup-S5-$(date +%F).sql

&nbsp;   echo "Sauvegarde enregistrée localement sous : backup-S5-AAAA-MM-JJ.sql"

&nbsp;   ```



\## 3. Restauration Logique (Restore - psql)



Cette procédure utilise le client `psql` dans le Pod pour injecter le fichier de dump (sauvegardé localement) et restaurer les données.



1\.  \*\*Définir la variable du fichier de dump :\*\* (À adapter avec le nom de votre fichier de sauvegarde.)

&nbsp;   ```bash

&nbsp;   FICHIER\_DUMP="backup-S5-AAAA-MM-JJ.sql" 

&nbsp;   ```



2\.  \*\*Exécuter la Restauration :\*\* Le contenu du fichier est streamé dans la commande `psql` exécutée dans le Pod.

&nbsp;   ```bash

&nbsp;   kubectl -n workshop exec -i $POD -- bash -c 'psql -U postgres' < $FICHIER\_DUMP

&nbsp;   echo "Restauration terminée."

&nbsp;   ```



---



Votre TP S5 est maintenant complet avec le manifeste YAML et le Runbook de documentation. Voulez-vous que nous passions au \*\*TP S6 : Scalabilité \& résilience\*\* ?

