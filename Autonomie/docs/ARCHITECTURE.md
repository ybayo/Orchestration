# Architecture Stack-IA

<div align="center">

![Version](https://img.shields.io/badge/version-1.0-blue.svg)
![Docker](https://img.shields.io/badge/docker-compose-2496ED?logo=docker&logoColor=white)
![Traefik](https://img.shields.io/badge/traefik-v2.10-24A1C1?logo=traefikproxy&logoColor=white)
![GPU](https://img.shields.io/badge/NVIDIA-CUDA-76B900?logo=nvidia&logoColor=white)

</div>

---

## Vue d'ensemble

Stack-IA est une architecture microservices complète pour l'intelligence artificielle locale, orchestrée via Docker Compose et Traefik.

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'background':'#e3f2fd','mainBkg':'#e3f2fd','primaryTextColor':'#000','secondaryTextColor':'#000','tertiaryTextColor':'#000','lineColor':'#000','textColor':'#000'}}}%%
graph TB
    subgraph LAYER1["<b>🌐 Couche Accès - Port 80/443</b>"]
        TRAEFIK["<b>Traefik</b><br/>Reverse Proxy<br/>🔀"]
    end
    
    subgraph LAYER2["<b>💻 Couche Interface Utilisateur</b>"]
        WEBUI["<b>Open WebUI</b><br/>Chat IA<br/>💬"]
        ANYTHING["<b>AnythingLLM</b><br/>RAG & Docs<br/>📚"]
        N8N["<b>n8n</b><br/>Automation<br/>⚙️"]
        ADMINER["<b>Adminer</b><br/>DB Manager<br/>🗄️"]
    end
    
    subgraph LAYER3["<b>🤖 Couche IA & Traitement</b>"]
        OLLAMA["<b>Ollama</b><br/>LLM Engine<br/>🧠"]
        QDRANT["<b>Qdrant</b><br/>Vector DB<br/>🔍"]
    end
    
    subgraph LAYER4["<b>💾 Couche Données</b>"]
        POSTGRES[("<b>PostgreSQL</b><br/>Relational DB<br/>🐘")]
        REDIS[("<b>Redis</b><br/>Cache<br/>⚡")]
    end
    
    subgraph INFRA["<b>🏗️ Infrastructure</b>"]
        GPU["<b>NVIDIA GPU</b><br/>CUDA<br/>🚀"]
        VOLUMES["<b>Docker Volumes</b><br/>Storage<br/>💿"]
    end
    
    TRAEFIK ==> WEBUI
    TRAEFIK ==> ANYTHING
    TRAEFIK ==> N8N
    TRAEFIK ==> ADMINER
    TRAEFIK ==> OLLAMA
    TRAEFIK ==> QDRANT
    
    WEBUI --> OLLAMA
    ANYTHING --> OLLAMA
    ANYTHING --> QDRANT
    N8N --> OLLAMA
    N8N --> POSTGRES
    
    OLLAMA ==> GPU
    
    WEBUI -.Cache.-> REDIS
    N8N -.Cache.-> REDIS
    
    POSTGRES -.Persist.-> VOLUMES
    QDRANT -.Persist.-> VOLUMES
    OLLAMA -.Persist.-> VOLUMES
    REDIS -.Persist.-> VOLUMES
    
    style TRAEFIK fill:#326ce5,stroke:#1e4d8b,stroke-width:3px,color:#fff,rx:10,ry:10
    style OLLAMA fill:#ff6b6b,stroke:#cc3333,stroke-width:3px,color:#fff,rx:10,ry:10
    style QDRANT fill:#ff9f43,stroke:#cc7a2e,stroke-width:3px,color:#fff,rx:10,ry:10
    style POSTGRES fill:#336791,stroke:#234a6d,stroke-width:3px,color:#fff,rx:10,ry:10
    style REDIS fill:#dc382d,stroke:#a82820,stroke-width:3px,color:#fff,rx:10,ry:10
    style GPU fill:#76b900,stroke:#5a8c00,stroke-width:3px,color:#fff,rx:10,ry:10
    style WEBUI fill:#4CAF50,stroke:#2e7d32,stroke-width:3px,color:#fff,rx:10,ry:10
    style ANYTHING fill:#9C27B0,stroke:#6a1b7f,stroke-width:3px,color:#fff,rx:10,ry:10
    style N8N fill:#FF5722,stroke:#cc3d18,stroke-width:3px,color:#fff,rx:10,ry:10
    style ADMINER fill:#00BCD4,stroke:#0097a7,stroke-width:3px,color:#fff,rx:10,ry:10
    style VOLUMES fill:#607D8B,stroke:#455a64,stroke-width:3px,color:#fff,rx:10,ry:10
    
    classDef layerStyle fill:#ffffff,stroke:#333,stroke-width:2px,color:#333
    class LAYER1,LAYER2,LAYER3,LAYER4,INFRA layerStyle
    
    linkStyle default stroke:#333,stroke-width:2px
```

---

## Composants Principaux

### Couche Reverse Proxy

#### Traefik v2.10
**Rôle** : Point d'entrée unique pour tous les services

| Caractéristique | Valeur |
|----------------|--------|
| Port HTTP | 80 |
| Port HTTPS | 443 |
| Port Dashboard | 8081 |
| Discovery | Automatique via Docker labels |
| SSL | Let's Encrypt (optionnel) |
| Network | stack-ia-network (bridge) |

**Fonctionnalités** :
- Routage basé sur les noms de domaine
- Load balancing automatique
- Génération de certificats SSL
- Dashboard de monitoring temps réel
- Health checks automatiques

---

### Couche Intelligence Artificielle

#### Ollama
**Rôle** : Moteur d'inférence pour les modèles LLM

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'background':'#ffe0b2','mainBkg':'#ffe0b2','primaryTextColor':'#000','secondaryTextColor':'#000','tertiaryTextColor':'#000','lineColor':'#000','textColor':'#000'}}}%%
graph LR
    A["🌐 Client Request"] --> B["🦙 Ollama API<br/>:11434"]
    B --> C{"GPU<br/>Available?"}
    C -->|"✅ Yes"| D["⚡ CUDA<br/>Acceleration"]
    C -->|"❌ No"| E["💻 CPU<br/>Processing"]
    D --> F["🧠 Model<br/>Inference"]
    E --> F
    F --> G["📤 Response"]
    
    style A fill:#e3f2fd,stroke:#1976d2,stroke-width:3px,color:#000
    style B fill:#ff6b6b,stroke:#cc3333,stroke-width:3px,color:#fff
    style C fill:#fff3e0,stroke:#f57c00,stroke-width:3px,color:#000
    style D fill:#76b900,stroke:#5a8c00,stroke-width:3px,color:#fff
    style E fill:#90caf9,stroke:#1976d2,stroke-width:3px,color:#000
    style F fill:#ba68c8,stroke:#7b1fa2,stroke-width:3px,color:#fff
    style G fill:#66bb6a,stroke:#388e3c,stroke-width:3px,color:#fff
    
    linkStyle default stroke:#333,stroke-width:2px
```

| Caractéristique | Valeur |
|----------------|--------|
| Port | 11434 |
| GPU Support | NVIDIA CUDA (optionnel) |
| Stockage modèles | `/root/.ollama` |
| Format API | REST JSON |
| Modèles supportés | Llama, Mistral, CodeLlama, etc. |

**Modèles recommandés** :
```
llama3.2        (8GB)  - Usage général
mistral         (4GB)  - Optimisé français
codellama       (4GB)  - Génération de code
nomic-embed-text(274MB)- Embeddings (RAG)
phi3            (2.3GB)- Léger et rapide
```

#### Qdrant
**Rôle** : Base de données vectorielle pour RAG (Retrieval Augmented Generation)

| Caractéristique | Valeur |
|----------------|--------|
| Port HTTP | 6333 |
| Port gRPC | 6334 |
| Stockage | `/qdrant/storage` |
| API | REST + gRPC |
| Dashboard | Intégré |

**Utilisation** :
- Stockage des embeddings de documents
- Recherche sémantique
- Similarité vectorielle
- Context enrichment pour LLM

---

### Couche Interface Utilisateur

#### Open WebUI
**Rôle** : Interface de chat moderne similaire à ChatGPT

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'background':'#f0f0f0','mainBkg':'#f0f0f0','noteBkgColor':'#fff','actorBkg':'#2196F3','actorBorder':'#1565c0','actorTextColor':'#fff','actorLineColor':'#000','signalColor':'#000','signalTextColor':'#000','labelTextColor':'#000','loopTextColor':'#000','activationBkgColor':'#ffd54f','activationBorderColor':'#e65100','sequenceNumberColor':'#fff'}}}%%
sequenceDiagram
    participant U as 👤 Utilisateur
    participant W as 💬 Open WebUI
    participant O as 🦙 Ollama
    participant R as ⚡ Redis
    
    U->>+W: Message
    W->>+R: Check cache
    alt Cache hit
        R-->>W: Cached response
    else Cache miss
        W->>+O: POST /api/generate
        O-->>-W: Streaming response
        W->>R: Store in cache
    end
    deactivate R
    W-->>-U: Display response
```

| Caractéristique | Valeur |
|----------------|--------|
| Port | 3000 (interne: 8080) |
| Authentification | Oui (WEBUI_AUTH) |
| Sessions | Stockées localement |
| Multi-utilisateurs | Oui |

#### AnythingLLM
**Rôle** : Plateforme RAG complète

**Architecture RAG** :
```
Document → Chunking → Embedding (Ollama) → Vector DB (Qdrant)
                                                     ↓
User Query → Embedding → Similarity Search → Context → LLM → Response
```

| Caractéristique | Valeur |
|----------------|--------|
| Port | 3001 |
| LLM Provider | Ollama |
| Embedding Engine | Ollama (nomic-embed-text) |
| Vector DB | Qdrant |
| Documents supportés | PDF, TXT, DOCX, MD, etc. |

**Flux de traitement** :
1. Upload de documents
2. Chunking intelligent
3. Génération d'embeddings
4. Stockage dans Qdrant
5. Requête utilisateur
6. Recherche vectorielle
7. Augmentation du contexte
8. Génération de réponse

#### n8n
**Rôle** : Plateforme d'automatisation no-code/low-code

| Caractéristique | Valeur |
|----------------|--------|
| Port | 5678 |
| Base de données | PostgreSQL |
| Encryption | AES-256 (N8N_ENCRYPTION_KEY) |
| Webhooks | Supportés |
| Timezone | Europe/Paris |

**Intégrations disponibles** :
- HTTP Request vers Ollama
- PostgreSQL
- Redis
- Webhooks
- 300+ nodes pré-configurés

---

### Couche Données

#### PostgreSQL 16 Alpine
**Rôle** : Base de données relationnelle principale

```mermaid
erDiagram
    N8N-WORKFLOWS ||--o{ N8N-EXECUTIONS : contains
    N8N-WORKFLOWS ||--o{ N8N-CREDENTIALS : uses
    N8N-WORKFLOWS {
        int id PK
        string name
        json nodes
        json connections
        boolean active
    }
    N8N-EXECUTIONS {
        int id PK
        int workflow_id FK
        timestamp started_at
        json data
        string status
    }
    N8N-CREDENTIALS {
        int id PK
        string name
        string type
        blob encrypted_data
    }
```

| Caractéristique | Valeur |
|----------------|--------|
| Port | 5432 |
| Version | 16-alpine |
| Users | stackia (admin), n8n (app) |
| Database | n8n |
| Health check | pg_isready |

#### Redis 7 Alpine
**Rôle** : Cache et stockage clé-valeur

| Caractéristique | Valeur |
|----------------|--------|
| Port | 6379 |
| Persistence | AOF (Append-Only File) |
| Max Memory | 512 MB |
| Eviction Policy | allkeys-lru |
| Health check | redis-cli ping |

**Cas d'usage** :
- Cache de sessions utilisateurs
- Cache de réponses LLM
- Files d'attente de tâches
- Rate limiting

---

## Architecture Réseau

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'background':'#e8f5e9','mainBkg':'#e8f5e9','primaryTextColor':'#000','secondaryTextColor':'#000','tertiaryTextColor':'#000','lineColor':'#000','textColor':'#000'}}}%%
graph LR
    subgraph EXT["🌍 Réseau Externe"]
        CLIENT["👤 Client<br/>Browser"]
        DNS["📝 DNS Local<br/>hosts file"]
    end
    
    subgraph DOCKER["🐳 Docker: stack-ia-network"]
        subgraph PORTS["🚪 Ports Exposés"]
            direction TB
            P80[":80 → HTTP"]
            P443[":443 → HTTPS"]
            P3000[":3000 → WebUI"]
            P3001[":3001 → AnythingLLM"]
            P5678[":5678 → n8n"]
        end
        
        subgraph SERVICES["🔧 Services Internes"]
            direction TB
            OLLAMA["🦙 ollama:11434"]
            POSTGRES["🐘 postgres:5432"]
            REDIS["⚡ redis:6379"]
            QDRANT["🔍 qdrant:6333"]
        end
    end
    
    CLIENT --> DNS
    DNS ==> P80
    DNS ==> P443
    CLIENT -.direct.-> P3000
    CLIENT -.direct.-> P3001
    
    P80 ==> OLLAMA
    P80 ==> QDRANT
    P3000 --> OLLAMA
    P3001 --> OLLAMA
    P3001 --> QDRANT
    P5678 --> POSTGRES
    P5678 --> REDIS
    
    style CLIENT fill:#e1f5fe,stroke:#01579b,stroke-width:3px,color:#000
    style DNS fill:#f3e5f5,stroke:#4a148c,stroke-width:3px,color:#000
    style P80 fill:#326ce5,stroke:#1e4d8b,stroke-width:3px,color:#fff
    style P443 fill:#1e88e5,stroke:#0d47a1,stroke-width:3px,color:#fff
    style P3000 fill:#4CAF50,stroke:#2e7d32,stroke-width:2px,color:#fff
    style P3001 fill:#9C27B0,stroke:#6a1b7f,stroke-width:2px,color:#fff
    style P5678 fill:#FF5722,stroke:#cc3d18,stroke-width:2px,color:#fff
    style OLLAMA fill:#ff6b6b,stroke:#cc3333,stroke-width:3px,color:#fff
    style POSTGRES fill:#336791,stroke:#234a6d,stroke-width:3px,color:#fff
    style REDIS fill:#dc382d,stroke:#a82820,stroke-width:3px,color:#fff
    style QDRANT fill:#ff9f43,stroke:#cc7a2e,stroke-width:3px,color:#fff
    style EXT fill:#ffffff,stroke:#333,stroke-width:3px
    style DOCKER fill:#ffffff,stroke:#333,stroke-width:3px
    style PORTS fill:#f8f9fa,stroke:#666,stroke-width:2px
    style SERVICES fill:#f8f9fa,stroke:#666,stroke-width:2px
    
    linkStyle default stroke:#333,stroke-width:2px
```

### Résolution DNS

**Externe (via /etc/hosts ou C:\Windows\System32\drivers\etc\hosts)** :
```
127.0.0.1    traefik.stack-ia.local
127.0.0.1    webui.stack-ia.local
127.0.0.1    n8n.stack-ia.local
127.0.0.1    anythingllm.stack-ia.local
127.0.0.1    qdrant.stack-ia.local
127.0.0.1    adminer.stack-ia.local
127.0.0.1    ollama.stack-ia.local
```

**Interne (Docker DNS)** :
- Chaque conteneur est accessible par son nom de service
- Exemple : `http://ollama:11434` depuis n8n
- Exemple : `http://postgres:5432` depuis n8n
- Résolution automatique via le réseau bridge

---

## Persistance des Données

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'background':'#fff3e0','mainBkg':'#fff3e0','primaryTextColor':'#000','secondaryTextColor':'#000','tertiaryTextColor':'#000','lineColor':'#000','textColor':'#000'}}}%%
graph TB
    subgraph VOLUMES["💿 Docker Volumes"]
        direction TB
        V1["🔒 traefik_letsencrypt<br/>Certificats SSL"]
        V2["📋 traefik_logs<br/>Logs"]
        V3["🦙 ollama_data<br/>Modèles LLM"]
        V4["💬 webui_data<br/>Sessions"]
        V5["🐘 postgres_data<br/>Database"]
        V6["⚙️ n8n_data<br/>Workflows"]
        V7["📚 anythingllm_data<br/>Configs"]
        V8["📄 anythingllm_docs<br/>Documents"]
        V9["📤 anythingllm_out<br/>Outputs"]
        V10["🔍 qdrant_data<br/>Vectors"]
        V11["⚡ redis_data<br/>Cache"]
    end
    
    subgraph HOST["🗄️ Système Hôte"]
        PHYSICAL["/var/lib/docker/volumes/"]
    end
    
    V1 -.-> PHYSICAL
    V2 -.-> PHYSICAL
    V3 ==> PHYSICAL
    V4 -.-> PHYSICAL
    V5 ==> PHYSICAL
    V6 ==> PHYSICAL
    V7 -.-> PHYSICAL
    V8 ==> PHYSICAL
    V9 -.-> PHYSICAL
    V10 ==> PHYSICAL
    V11 ==> PHYSICAL
    
    style V1 fill:#9C27B0,stroke:#6a1b7f,stroke-width:2px,color:#fff
    style V2 fill:#607D8B,stroke:#455a64,stroke-width:2px,color:#fff
    style V3 fill:#ff6b6b,stroke:#cc3333,stroke-width:3px,color:#fff
    style V4 fill:#4CAF50,stroke:#2e7d32,stroke-width:2px,color:#fff
    style V5 fill:#336791,stroke:#234a6d,stroke-width:3px,color:#fff
    style V6 fill:#FF5722,stroke:#cc3d18,stroke-width:3px,color:#fff
    style V7 fill:#9C27B0,stroke:#6a1b7f,stroke-width:2px,color:#fff
    style V8 fill:#795548,stroke:#4e342e,stroke-width:3px,color:#fff
    style V9 fill:#9E9E9E,stroke:#616161,stroke-width:2px,color:#fff
    style V10 fill:#ff9f43,stroke:#cc7a2e,stroke-width:3px,color:#fff
    style V11 fill:#dc382d,stroke:#a82820,stroke-width:3px,color:#fff
    style PHYSICAL fill:#263238,stroke:#000,stroke-width:3px,color:#fff
    style VOLUMES fill:#ffffff,stroke:#333,stroke-width:3px
    style HOST fill:#ffffff,stroke:#333,stroke-width:3px
    
    linkStyle default stroke:#333,stroke-width:2px
```

### Espace disque typique

| Volume | Taille estimée | Croissance |
|--------|---------------|------------|
| ollama_data | 5-50 GB | Par modèle téléchargé |
| postgres_data | 100-500 MB | Workflows & executions |
| qdrant_data | 1-10 GB | Documents indexés |
| anythingllm_documents | 1-100 GB | Documents uploadés |
| redis_data | 50-512 MB | Cache (limité) |
| Autres | < 1 GB | Configuration |

---

## Flux de Données

### Scénario 1 : Chat Simple (Open WebUI)

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'background':'#e8f5e9','mainBkg':'#e8f5e9','noteBkgColor':'#c8e6c9','actorBkg':'#4CAF50','actorBorder':'#2e7d32','actorTextColor':'#fff','actorLineColor':'#1b5e20','signalColor':'#000','signalTextColor':'#000','labelTextColor':'#000','loopTextColor':'#000','activationBkgColor':'#ffeb3b','activationBorderColor':'#e65100','sequenceNumberColor':'#000'}}}%%
sequenceDiagram
    autonumber
    participant U as 👤 Utilisateur
    participant T as 🔀 Traefik
    participant W as 💬 Open WebUI
    participant O as 🦙 Ollama
    participant G as 🚀 GPU
    
    U->>+T: GET webui.stack-ia.local
    T->>+W: Forward request
    W-->>-U: Page HTML
    
    Note over U,W: Session établie
    
    U->>+W: POST /api/chat<br/>{"model": "llama3.2", "message": "..."}
    W->>+O: POST /api/generate
    activate O
    O->>+G: CUDA inference
    G-->>-O: Tokens générés
    O-->>-W: Stream tokens
    deactivate O
    W-->>-U: Display response
    
    Note over U,O: Conversation complète
```

### Scénario 2 : RAG avec AnythingLLM

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'background':'#f3e5f5','mainBkg':'#f3e5f5','noteBkgColor':'#e1bee7','actorBkg':'#9C27B0','actorBorder':'#6a1b7f','actorTextColor':'#fff','actorLineColor':'#4a148c','signalColor':'#000','signalTextColor':'#000','labelTextColor':'#000','loopTextColor':'#000','activationBkgColor':'#ffeb3b','activationBorderColor':'#e65100','sequenceNumberColor':'#000'}}}%%
sequenceDiagram
    autonumber
    participant U as 👤 User
    participant A as 📚 AnythingLLM
    participant O as 🦙 Ollama
    participant Q as 🔍 Qdrant
    
    rect rgb(255, 243, 224)
        Note over U,Q: 📥 Phase 1: Indexation Document
        U->>+A: Upload PDF
        A->>A: Extract & Chunk text
        loop 📄 Pour chaque chunk
            A->>+O: POST /api/embeddings<br/>model: nomic-embed-text
            O-->>-A: Vector [768 dim]
            A->>Q: Store vector + metadata
        end
        Note over A,Q: ✅ Document indexé
    end
    
    rect rgb(232, 245, 233)
        Note over U,Q: 🔍 Phase 2: Recherche & Génération
        U->>+A: Question: "..."
        A->>+O: Generate query embedding
        O-->>-A: Query vector
        A->>+Q: Similarity search (top 5)
        Q-->>-A: 📎 Relevant chunks
        A->>A: 🔗 Build context
        A->>+O: Generate with context
        O-->>-A: 💬 Final answer
        A-->>-U: Response + sources
        Note over U,A: ✨ RAG complet
    end
```

### Scénario 3 : Workflow n8n

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'background':'#fff3e0','mainBkg':'#fff3e0','noteBkgColor':'#ffe0b2','actorBkg':'#FF5722','actorBorder':'#cc3d18','actorTextColor':'#fff','actorLineColor':'#bf360c','signalColor':'#000','signalTextColor':'#000','labelTextColor':'#000','loopTextColor':'#000','activationBkgColor':'#ffeb3b','activationBorderColor':'#e65100','sequenceNumberColor':'#000'}}}%%
sequenceDiagram
    autonumber
    participant W as 🌐 Webhook
    participant N as ⚙️ n8n
    participant O as 🦙 Ollama
    participant P as 🐘 PostgreSQL
    participant E as 📧 Email/API
    
    Note over W,N: 🔔 Déclenchement
    W->>+N: POST /webhook/xyz<br/>Trigger event
    
    activate N
    N->>P: 📝 Log execution start
    
    Note over N,O: 🤖 Traitement IA
    N->>+O: Generate summary
    O-->>-N: 💬 LLM response
    
    Note over N: 🔄 Transformation
    N->>N: Process data
    
    Note over N,E: 📤 Notification
    N->>E: Send notification
    
    N->>P: ✅ Log success
    deactivate N
    
    N-->>-W: 200 OK
    
    Note over W,E: ✨ Workflow terminé
```

---

## Stack Technique

### Technologies Principales

| Composant | Technologie | Version | Langage |
|-----------|-------------|---------|---------|
| Reverse Proxy | Traefik | 2.10 | Go |
| LLM Engine | Ollama | latest | Go |
| Chat UI | Open WebUI | main | Python/Svelte |
| RAG Platform | AnythingLLM | latest | Node.js/React |
| Automation | n8n | latest | Node.js/Vue |
| Vector DB | Qdrant | latest | Rust |
| Relational DB | PostgreSQL | 16-alpine | C |
| Cache | Redis | 7-alpine | C |
| DB Admin | Adminer | latest | PHP |

### Orchestration

```yaml
Docker Compose v3.8
├── Services: 9
├── Volumes: 11
├── Networks: 1 (bridge)
└── Deployment: docker compose up -d
```

---

## Patterns & Bonnes Pratiques

### 1. Microservices Architecture
Chaque service est isolé, scalable indépendamment, et communique via APIs REST.

### 2. Reverse Proxy Pattern
Traefik comme single entry point avec routing dynamique.

### 3. Service Discovery
Découverte automatique via labels Docker - pas de configuration manuelle.

### 4. Health Checks
```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U stackia"]
  interval: 10s
  timeout: 5s
  retries: 5
```

### 5. Separation of Concerns
- **Presentation** : Open WebUI, AnythingLLM, n8n UI
- **Business Logic** : n8n workflows, AnythingLLM RAG
- **Data** : PostgreSQL, Qdrant, Redis
- **Infrastructure** : Traefik, Docker

### 6. Configuration Externe
Toutes les configurations sensibles dans `.env`, jamais hardcodées.

### 7. Volumes Named
Persistance explicite avec volumes nommés pour faciliter backup/restore.

---

## Sécurité

### Authentification

| Service | Auth Méthode | Default |
|---------|--------------|---------|
| Open WebUI | Local users | Premier = admin |
| AnythingLLM | Local users | Workspace-based |
| n8n | Local users | Premier = owner |
| Adminer | PostgreSQL creds | Aucun user par défaut |
| Traefik Dashboard | None | Accessible localement |

### Encryption

```
├── n8n credentials : AES-256 (N8N_ENCRYPTION_KEY)
├── Open WebUI sessions : WEBUI_SECRET_KEY
├── PostgreSQL password : Plain text (docker network isolé)
└── Traefik SSL : Let's Encrypt (optionnel)
```

### Réseau

- Réseau Docker bridge isolé
- Pas d'exposition directe des DBs (postgres, redis)
- Firewall au niveau de l'hôte recommandé
- Traefik comme seul point d'entrée

---

## Scalabilité

### Horizontale (Future)

```mermaid
graph TB
    LB[Load Balancer]
    
    subgraph "Instance 1"
        O1[Ollama]
        W1[WebUI]
    end
    
    subgraph "Instance 2"
        O2[Ollama]
        W2[WebUI]
    end
    
    subgraph "Shared"
        P[(PostgreSQL)]
        Q[(Qdrant)]
        R[(Redis)]
    end
    
    LB --> O1
    LB --> O2
    W1 --> O1
    W2 --> O2
    W1 --> R
    W2 --> R
    O1 -.-> Q
    O2 -.-> Q
```

### Verticale (Actuelle)

- Augmenter RAM Docker : Settings → Resources → Memory
- Ajouter GPU plus puissant
- Utiliser SSD pour volumes
- Augmenter `max_memory` Redis si besoin

---

## Monitoring & Observabilité

### Logs

```bash
# Tous les services
docker compose logs -f

# Service spécifique
docker compose logs -f ollama

# Avec timestamps
docker compose logs -f --timestamps
```

### Métriques

```bash
# Ressources temps réel
docker stats

# Espace disque
docker system df -v

# Santé des services
docker compose ps
```

### Traefik Dashboard

Accès : `http://traefik.stack-ia.local` ou `http://localhost:8081`

Informations disponibles :
- Services actifs
- Routes configurées
- Middlewares appliqués
- Santé des backends
- Métriques HTTP

---

## Évolutions Futures

### Court terme
- [ ] Ajout de Prometheus + Grafana pour métriques
- [ ] Backup automatisé des volumes
- [ ] SSL Let's Encrypt en production
- [ ] Authentication centralisée (OAuth2)

### Moyen terme
- [ ] Kubernetes migration
- [ ] Multi-GPU support
- [ ] Model serving distribué
- [ ] CI/CD pipeline

### Long terme
- [ ] Multi-région deployment
- [ ] Auto-scaling basé sur charge
- [ ] ML Ops pipeline complet
- [ ] Fine-tuning infrastructure

---

## Vue Système Complète

### Diagramme 1 : Flux Utilisateur vers Services

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'background':'#f3e5f5','mainBkg':'#f3e5f5','primaryTextColor':'#000','secondaryTextColor':'#000','tertiaryTextColor':'#000','lineColor':'#000','textColor':'#000'}}}%%
graph TB
    USER["👤 Utilisateur"]
    BROWSER["🌐 Navigateur"]
    HOSTS["📝 /etc/hosts<br/>DNS Local"]
    TRAEFIK["🔀 Traefik<br/>:80, :443"]
    
    subgraph SERVICES["Services Web"]
        WEBUI["💬 Open WebUI<br/>:3000"]
        ANYTHING["📚 AnythingLLM<br/>:3001"]
        N8N["⚙️ n8n<br/>:5678"]
        ADMINER["🗄️ Adminer<br/>:8080"]
        QDRANT_UI["🔍 Qdrant<br/>:6333"]
    end
    
    USER --> BROWSER
    BROWSER --> HOSTS
    HOSTS --> TRAEFIK
    TRAEFIK ==> WEBUI
    TRAEFIK ==> ANYTHING
    TRAEFIK ==> N8N
    TRAEFIK ==> ADMINER
    TRAEFIK ==> QDRANT_UI
    
    style USER fill:#e1f5fe,stroke:#01579b,stroke-width:3px,color:#000
    style BROWSER fill:#fff3e0,stroke:#e65100,stroke-width:3px,color:#000
    style HOSTS fill:#f3e5f5,stroke:#4a148c,stroke-width:3px,color:#000
    style TRAEFIK fill:#326ce5,stroke:#1e4d8b,stroke-width:4px,color:#fff
    style WEBUI fill:#4CAF50,stroke:#2e7d32,stroke-width:3px,color:#fff
    style ANYTHING fill:#9C27B0,stroke:#6a1b7f,stroke-width:3px,color:#fff
    style N8N fill:#FF5722,stroke:#cc3d18,stroke-width:3px,color:#fff
    style ADMINER fill:#00BCD4,stroke:#0097a7,stroke-width:3px,color:#fff
    style QDRANT_UI fill:#ff9f43,stroke:#cc7a2e,stroke-width:3px,color:#fff
    style SERVICES fill:#ffffff,stroke:#333,stroke-width:3px
    
    linkStyle default stroke:#333,stroke-width:2px
```

### Diagramme 2 : Communication Backend

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'background':'#e1f5fe','mainBkg':'#e1f5fe','primaryTextColor':'#000','secondaryTextColor':'#000','tertiaryTextColor':'#000','lineColor':'#000','textColor':'#000'}}}%%
graph LR
    subgraph UI["🖥️ Frontend"]
        WEBUI["Open WebUI"]
        ANYTHING["AnythingLLM"]
        N8N["n8n"]
    end
    
    subgraph BACKEND["🧠 Backend IA"]
        OLLAMA["Ollama<br/>LLM"]
        QDRANT["Qdrant<br/>Vectors"]
    end
    
    subgraph DATA["💾 Données"]
        POSTGRES[("PostgreSQL")]
        REDIS[("Redis")]
    end
    
    WEBUI --> OLLAMA
    WEBUI -.cache.-> REDIS
    
    ANYTHING --> OLLAMA
    ANYTHING --> QDRANT
    
    N8N --> OLLAMA
    N8N --> POSTGRES
    N8N -.cache.-> REDIS
    
    style WEBUI fill:#4CAF50,stroke:#2e7d32,stroke-width:3px,color:#fff
    style ANYTHING fill:#9C27B0,stroke:#6a1b7f,stroke-width:3px,color:#fff
    style N8N fill:#FF5722,stroke:#cc3d18,stroke-width:3px,color:#fff
    style OLLAMA fill:#ff6b6b,stroke:#cc3333,stroke-width:3px,color:#fff
    style QDRANT fill:#ff9f43,stroke:#cc7a2e,stroke-width:3px,color:#fff
    style POSTGRES fill:#336791,stroke:#234a6d,stroke-width:3px,color:#fff
    style REDIS fill:#dc382d,stroke:#a82820,stroke-width:3px,color:#fff
    style UI fill:#ffffff,stroke:#333,stroke-width:3px
    style BACKEND fill:#ffffff,stroke:#333,stroke-width:3px
    style DATA fill:#ffffff,stroke:#333,stroke-width:3px
    
    linkStyle default stroke:#333,stroke-width:2px
```

### Diagramme 3 : Infrastructure & Persistance

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'background':'#fff9c4','mainBkg':'#fff9c4','primaryTextColor':'#000','secondaryTextColor':'#000','tertiaryTextColor':'#000','lineColor':'#000','textColor':'#000'}}}%%
graph TB
    subgraph COMPUTE["⚡ Compute"]
        GPU["🚀 NVIDIA GPU<br/>CUDA Cores"]
        CPU["💻 CPU<br/>Multi-thread"]
    end
    
    subgraph APPS["📦 Applications"]
        OLLAMA["Ollama"]
        POSTGRES["PostgreSQL"]
        QDRANT["Qdrant"]
        REDIS["Redis"]
    end
    
    subgraph STORAGE["💿 Docker Volumes"]
        VOL1["ollama_data<br/>5-50 GB"]
        VOL2["postgres_data<br/>100-500 MB"]
        VOL3["qdrant_data<br/>1-10 GB"]
        VOL4["redis_data<br/>50-512 MB"]
    end
    
    subgraph DISK["🗄️ Système Hôte"]
        PHYSICAL["/var/lib/docker/volumes"]
    end
    
    OLLAMA ==> GPU
    OLLAMA --> CPU
    
    OLLAMA -.persist.-> VOL1
    POSTGRES -.persist.-> VOL2
    QDRANT -.persist.-> VOL3
    REDIS -.persist.-> VOL4
    
    VOL1 --> PHYSICAL
    VOL2 --> PHYSICAL
    VOL3 --> PHYSICAL
    VOL4 --> PHYSICAL
    
    style GPU fill:#76b900,stroke:#5a8c00,stroke-width:4px,color:#fff
    style CPU fill:#2196F3,stroke:#1565c0,stroke-width:3px,color:#fff
    style OLLAMA fill:#ff6b6b,stroke:#cc3333,stroke-width:3px,color:#fff
    style POSTGRES fill:#336791,stroke:#234a6d,stroke-width:3px,color:#fff
    style QDRANT fill:#ff9f43,stroke:#cc7a2e,stroke-width:3px,color:#fff
    style REDIS fill:#dc382d,stroke:#a82820,stroke-width:3px,color:#fff
    style VOL1 fill:#ffeb3b,stroke:#f57f17,stroke-width:2px,color:#000
    style VOL2 fill:#8bc34a,stroke:#558b2f,stroke-width:2px,color:#000
    style VOL3 fill:#ff9800,stroke:#e65100,stroke-width:2px,color:#000
    style VOL4 fill:#f44336,stroke:#b71c1c,stroke-width:2px,color:#fff
    style PHYSICAL fill:#607D8B,stroke:#37474f,stroke-width:3px,color:#fff
    style COMPUTE fill:#ffffff,stroke:#333,stroke-width:3px
    style APPS fill:#ffffff,stroke:#333,stroke-width:3px
    style STORAGE fill:#ffffff,stroke:#333,stroke-width:3px
    style DISK fill:#ffffff,stroke:#333,stroke-width:3px
    
    linkStyle default stroke:#333,stroke-width:2px
```

### Diagramme 4 : Architecture Réseau Docker

```mermaid
%%{init: {'theme':'base', 'themeVariables': {'background':'#e0f2f1','mainBkg':'#e0f2f1','primaryTextColor':'#000','secondaryTextColor':'#000','tertiaryTextColor':'#000','lineColor':'#000','textColor':'#000'}}}%%
graph TB
    EXTERNAL["🌍 Internet<br/>Client"]
    
    subgraph BRIDGE["🌉 stack-ia-network (bridge)"]
        direction TB
        TRAEFIK["Traefik<br/>Gateway"]
        
        subgraph MICROSERVICES["Microservices"]
            direction LR
            S1["WebUI"]
            S2["n8n"]
            S3["Ollama"]
            S4["Qdrant"]
        end
        
        DNS["Docker DNS<br/>Service Discovery"]
    end
    
    EXTERNAL --> TRAEFIK
    TRAEFIK --> S1
    TRAEFIK --> S2
    
    S1 -.Internal.-> S3
    S2 -.Internal.-> S3
    S2 -.Internal.-> S4
    
    DNS -.Resolve.-> S1
    DNS -.Resolve.-> S2
    DNS -.Resolve.-> S3
    DNS -.Resolve.-> S4
    
    style EXTERNAL fill:#e1f5fe,stroke:#01579b,stroke-width:3px,color:#000
    style TRAEFIK fill:#326ce5,stroke:#1e4d8b,stroke-width:4px,color:#fff
    style S1 fill:#4CAF50,stroke:#2e7d32,stroke-width:2px,color:#fff
    style S2 fill:#FF5722,stroke:#cc3d18,stroke-width:2px,color:#fff
    style S3 fill:#ff6b6b,stroke:#cc3333,stroke-width:2px,color:#fff
    style S4 fill:#ff9f43,stroke:#cc7a2e,stroke-width:2px,color:#fff
    style DNS fill:#9C27B0,stroke:#6a1b7f,stroke-width:3px,color:#fff
    style BRIDGE fill:#ffffff,stroke:#333,stroke-width:3px
    style MICROSERVICES fill:#f8f9fa,stroke:#666,stroke-width:2px
    
    linkStyle default stroke:#333,stroke-width:2px
```

---

## Références

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Traefik Documentation](https://doc.traefik.io/traefik/)
- [Ollama Documentation](https://github.com/ollama/ollama)
- [Qdrant Documentation](https://qdrant.tech/documentation/)
- [n8n Documentation](https://docs.n8n.io/)

---

**Dernière mise à jour** : 2025-01-06  
**Version** : 1.0  
**Auteur** : Stack-IA Project

