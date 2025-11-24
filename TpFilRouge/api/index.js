// C'est le fichier principal de l'API (simulé)
const express = require('express');
const { Pool } = require('pg');
const redis = require('redis');

const app = express();
const port = 3000;

// **********************************************
// FIX CORS AVANCE : Accepte toutes les requêtes (y compris celles du Frontend sur un autre port)
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    // Permet au navigateur de faire des requêtes POST, GET, etc.
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    next();
});
app.use(express.json()); // Permet de lire le corps des requêtes POST
// **********************************************


// Connexion à PostgreSQL via les variables d'environnement du docker-compose
const pgPool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connexion à Redis
const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

redisClient.on('error', err => console.log('Redis Client Error', err));

// --- NOUVELLES ROUTES DE SONDA GE ---

// Route pour voter (incrémente le compteur dans Redis)
app.post('/vote', async (req, res) => {
    try {
        if (!redisClient.isReady) {
             await redisClient.connect();
        }
        
        // Simule un vote pour l'option 'Rome', 'Berlin' ou 'Paris'
        const rawOption = req.body.option;
        // MODIFICATION ICI : Remplacement de Tokyo par Paris
        const allowedOptions = ['Rome', 'Berlin', 'Paris'];
        
        // Valide l'option ou utilise 'Rome' par défaut
        const option = allowedOptions.includes(rawOption) ? rawOption : 'Rome'; 
        
        // Incrémente le compteur de vote dans Redis
        await redisClient.incr(`votes:${option}`);
        
        res.status(200).json({ message: `Vote enregistré pour l'option ${option}`, status: 'OK' });
    } catch (err) {
        console.error("Erreur de vote:", err);
        res.status(500).json({ error: 'Erreur lors de l\'enregistrement du vote' });
    }
});

// Route pour obtenir les résultats (lit le compteur dans Redis)
app.get('/results', async (req, res) => {
    try {
        if (!redisClient.isReady) {
             await redisClient.connect();
        }
        
        // Lit les compteurs pour les options Rome, Berlin, et Paris
        const votesRome = await redisClient.get('votes:Rome') || 0;
        const votesBerlin = await redisClient.get('votes:Berlin') || 0;
        // MODIFICATION ICI : Lit le vote pour Paris
        const votesParis = await redisClient.get('votes:Paris') || 0;
        
        res.status(200).json({
            question: "Quelle est la capitale de la France ?",
            results: {
                Rome: parseInt(votesRome),
                Berlin: parseInt(votesBerlin),
                // MODIFICATION ICI : Ajout de Paris
                Paris: parseInt(votesParis)
            }
        });
    } catch (err) {
        console.error("Erreur de résultats:", err);
        res.status(500).json({ error: 'Erreur lors de la récupération des résultats' });
    }
});

// Route de statut existante (pour vérifier la connexion DB/Cache)
app.get('/status', async (req, res) => {
    let pgStatus = 'DOWN';
    let redisStatus = 'DOWN';
    
    // Vérification de PostgreSQL
    try {
        const result = await pgPool.query('SELECT NOW()');
        pgStatus = `UP (Time: ${result.rows[0].now})`;
    } catch (err) {
        pgStatus = `DOWN (Error: ${err.message})`;
    }

    // Vérification de Redis
    try {
        if (!redisClient.isReady) {
             await redisClient.connect();
        }
        // Test de connexion rapide
        await redisClient.ping();
        redisStatus = 'UP';
    } catch (err) {
        redisStatus = `DOWN (Error: ${err.message})`;
    }
    
    res.json({
        service: 'API',
        database: pgStatus,
        cache: redisStatus
    });
});


(async () => {
    // Tente de connecter Redis au démarrage
    try {
        await redisClient.connect();
        console.log('Redis client connecté.');
    } catch (e) {
        console.error('Échec de la connexion à Redis:', e.message);
    }
    
    // Démarrage de l'API
    app.listen(port, () => {
        console.log(`API Poll écoutant sur le port ${port}`);
        console.log(`Le service API est démarré. Nouvelles routes: /vote et /results`);
    });
})();
