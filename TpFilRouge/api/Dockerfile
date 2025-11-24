# Utilise une image Node.js légère comme base
FROM node:18-alpine

# Crée le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copie les fichiers de configuration (package.json, package-lock.json)
# pour installer les dépendances
COPY package*.json ./

# Installe les dépendances (avec --production pour être plus léger)
RUN npm install --production

# Copie le reste du code source
COPY . .

# Expose le port par défaut de notre API
EXPOSE 3000

# Commande pour démarrer l'API (simule un script de démarrage)
CMD [ "node", "index.js" ]