import http from 'k6/http';
import { check } from 'k6';

export const options = {
  // Configuration pour générer une charge constante (500 requêtes/seconde)
  scenarios: {
    rps: { 
      executor: 'constant-arrival-rate', 
      rate: 500, // 👈 CHANGEMENT : 500 requêtes par seconde
      timeUnit: '1s',
      duration: '1m', // Réduit la durée pour le test
      preAllocatedVUs: 20, 
      maxVUs: 50
    }
  },
  // CRITIQUE: Ignorer la vérification du certificat auto-signé
  insecureSkipTLSVerify: true,
  // Définition des seuils (Thresholds) basés sur les SLO pour valider le test
  thresholds: { 
    // Latence P95 < 380ms
    http_req_duration: ['p(95)<380'], 
    // Taux d'échec < 1%
    http_req_failed: ['rate<0.01'] 
  }
};

export default () => {
  // Envoi d'une requête HTTPS vers l'API
  const res = http.get('https://workshop.local/api/status/200'); 
  check(res, { 'status 200': r => r.status === 200 });
};
