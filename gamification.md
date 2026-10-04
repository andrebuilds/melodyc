# Melodyc — AI Instructions

## Panoramica del progetto

Melodyc è una piattaforma SaaS **open source** per la generazione musicale tramite intelligenza artificiale. È un progetto sociale e di community, non orientato al profitto diretto — l'obiettivo principale è la crescita della community e la visibilità del progetto.

**Co-creatori:**
- Andrea D'Ambrosio — [github.com/andrebuilds](https://github.com/andrebuilds)
- Thomas Fortuna — [github.com/fortunathomas](https://github.com/fortunathomas)

---

## Stack tecnologico

| Area | Tecnologie |
|---|---|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS 4, ShadCN |
| Autenticazione | BetterAuth |
| Pagamenti | ~~Polar.sh~~ → **rimosso** (vedi sezione pagamenti) |
| Database | PostgreSQL (Neon) + Prisma ORM |
| Queue / Workflow | Inngest |
| Storage | AWS S3 |
| AI Backend | Python 3.12, Modal (GPU L40S) |
| Modello musica | ACE-Step v1 3.5B |
| Modello testo | Qwen2-7B-Instruct |
| Modello immagini | SDXL-Turbo |

---

## Stato attuale delle funzionalità

### ✅ Già implementate
- Generazione musicale AI (3 modalità: descrizione libera, lyrics custom, lyrics descritte)
- Opzione tracce strumentali
- Sistema crediti base
- Autenticazione utente con BetterAuth
- Feed community (Discovery) — ascoltare, mettere like alle tracce
- Dashboard personale — gestire, ascoltare, pubblicare tracce
- **Profilo utente pubblico** — username, canzoni prodotte, like ricevuti
- **Sistema follow/unfollow** tra utenti
- Navigazione dal feed Discovery al profilo dell'utente che ha pubblicato

### 🚧 Da implementare (roadmap prioritaria)
1. **Rimozione sistema pagamenti** (priorità immediata)
2. **Gamification completa** (missioni, badge, sfide, punti)
3. **Algoritmo Trend** per le musiche più popolari
4. **Verifica Artista** (paywall futuro)

---

## Sistema crediti — istruzioni importanti

### Modello attuale (in transizione)
- NON esiste più un sistema di acquisto crediti
- Polar.sh è stato **rimosso completamente** — non aggiungere nulla che lo riguardi
- Stripe è **rimosso** per ora — non implementare acquisto crediti tramite Stripe

### Modello da implementare
- I crediti si guadagnano **esclusivamente tramite gamification**
- Alla registrazione ogni nuovo utente riceve **100 crediti** (aggiornato da 20)
- Chi esaurisce i crediti può contattare gli admin che li aggiungono manualmente (gestione temporanea finché la gamification non è completa)
- In futuro i crediti si guadagneranno tramite: missioni giornaliere, sfide, streak, badge

### Se trovi riferimenti a Polar o all'acquisto crediti nel codice
- Rimuovi o commenta tutto ciò che riguarda Polar.sh
- Rimuovi le UI per l'acquisto di pacchetti crediti
- Mantieni la logica di scalare i crediti (decrementare quando si genera una canzone)

---

## Gamification — specifiche

Il sistema di gamification è la feature centrale del prossimo sviluppo. Implementala in questo ordine:

### Fase 1 — Algoritmo Trend
- Calcola le tracce di tendenza basandosi su: numero di like, numero di ascolti, velocità di crescita dei like nelle ultime 24/48h, numero di share/interazioni
- Sezione "Trending" visibile nella pagina Discovery
- Aggiornamento periodico tramite Inngest (job schedulato)

### Fase 2 — Sistema Badge e Punti
- Ogni azione sulla piattaforma assegna punti esperienza (XP)
- I badge si sbloccano al raggiungimento di soglie specifiche
- Esempi di badge da implementare:
  - 🎵 Prima canzone generata
  - 🔥 Streak 7 giorni consecutivi
  - ❤️ Prima canzone con 10 like
  - 🎤 Primo follower
  - 🏆 Canzone in trending
  - ⭐ 100 canzoni generate
- I badge sono visibili sul profilo pubblico dell'utente

### Fase 3 — Missioni e Sfide
- **Missioni giornaliere**: piccoli obiettivi che si resettano ogni 24h (es. "genera una canzone oggi", "metti like a 3 tracce")
- **Sfide settimanali**: obiettivi più impegnativi con ricompense maggiori
- **Sfide community**: sfide globali aperte a tutti gli utenti contemporaneamente
- Completare missioni/sfide assegna crediti e XP

### Fase 4 — Verifica Artista
- Badge speciale "Artista Verificato" (equivalente alla spunta)
- Unico elemento a pagamento della piattaforma (paywall futuro, non implementare ora)
- Chiamarlo internamente `ARTIST_VERIFIED` nel codice

---

## Sistema Referral — specifiche e anti-abuse

Il referral è un meccanismo per far crescere la community premiando chi porta nuovi utenti, ma va implementato con attenzione per evitare abusi.

### Regole anti-abuse
- I crediti all'invitante scattano **solo quando l'invitato completa la sua prima canzone**, non alla semplice registrazione
- Un account può referrare **massimo 10 persone al mese**
- L'email dell'invitato deve essere **verificata** prima che scattino i crediti
- Un singolo IP non può generare più di **3 account referral** (controllo anti-account fake)
- Un account con meno di 24h di vita non può generare link referral

### Ricompense
- **Invitante**: +20 crediti per ogni amico che completa la prima canzone
- **Invitato**: riceve 150 crediti alla registrazione invece dei 100 standard

### Implementazione tecnica
- Generare un codice referral univoco per ogni utente (es. `ref_[userId]`)
- Salvare su DB il mapping `referredBy` sull'utente invitato
- Usare Inngest per processare in modo asincrono l'assegnazione dei crediti quando scatta il trigger "prima canzone completata"

---

## Missioni giornaliere — specifiche

Le missioni si resettano ogni 24h. Privilegiare azioni social (costo zero) rispetto ad azioni generative (costo GPU).

### Missioni social (costo zero per la piattaforma)
- Ascolta 3 canzoni nel feed → **+2 crediti**
- Metti like a 2 canzoni → **+1 credito**
- Lascia un commento → **+2 crediti**
- Segui un nuovo artista → **+1 credito**
- Pubblica una canzone (rendila pubblica) → **+3 crediti**

### Missioni generative (limitate, quasi break-even)
- Genera la tua prima canzone della giornata → **+1 credito**

---

## Streak — specifiche

Lo streak si azzera se l'utente salta un giorno di login.

- 3 giorni consecutivi → **+5 crediti**
- 7 giorni consecutivi → **+15 crediti**
- 30 giorni consecutivi → **+50 crediti**

---

## Sfide settimanali — specifiche

Le sfide si resettano ogni lunedì. Sono più impegnative delle missioni giornaliere e hanno ricompense maggiori.

- Genera 5 canzoni questa settimana → **+10 crediti**
- Ricevi 20 like totali questa settimana → **+15 crediti**
- Ottieni 3 nuovi follower → **+10 crediti**
- Pubblica almeno una canzone al giorno per 3 giorni → **+20 crediti**

---

## Badge con crediti una tantum — specifiche

I badge vengono assegnati **una volta sola**, quindi non sono abusabili. Ogni badge assegna crediti al momento dello sblocco.

| Badge | Trigger | Crediti |
|---|---|---|
| 🎵 Prima canzone pubblicata | Prima pubblicazione | +5 |
| ❤️ Prima canzone con 10 like | 10 like su una traccia | +10 |
| 🎤 Primo follower | Primo follower ricevuto | +5 |
| 👥 10 follower | 10 follower raggiunti | +20 |
| 🌟 50 follower | 50 follower raggiunti | +50 |
| 🏆 Canzone in trending | Traccia entra in trending | +30 |
| 📅 Account attivo da 30 giorni | 30 giorni dalla registrazione | +20 |
| ⭐ 100 canzoni generate | 100 generazioni totali | +40 |
| 🔥 Streak 7 giorni | 7 giorni consecutivi di login | +15 |

---

## Profilo utente — specifiche

Il profilo utente pubblico è già implementato e include:
- Username
- Canzoni prodotte dall'utente
- Like totali ricevuti
- Sistema follow/unfollow

**Da aggiungere al profilo quando si implementa la gamification:**
- Badge ottenuti (visibili pubblicamente)
- Livello/XP dell'utente
- Contatore follower e seguiti

---

## Flusso di sviluppo

Questo progetto usa un flusso **branch → Pull Request → review → merge**:
- Non pushare mai direttamente su `main`
- Ogni feature va su un branch dedicato (es. `feature/gamification-badges`)
- Aprire una PR e attendere la review prima del merge
- Il branch `main` è protetto

---

## Note generali per l'AI

- Questo è un progetto **open source**, mantieni il codice pulito, leggibile e ben commentato
- Non aggiungere dipendenze inutili — preferisci soluzioni native o già presenti nello stack
- Quando modifichi il database (Prisma), genera sempre la migration corrispondente
- Per le code di background usa sempre **Inngest**
- Per lo storage file usa sempre **AWS S3**
- Non toccare la cartella `backend/ACE-Step/` — è un submodule e non va modificato
- Commenta in **inglese** nel codice, la documentazione può essere in italiano o inglese
