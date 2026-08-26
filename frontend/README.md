# Melodyc — Frontend

**Autore:** Andrea D'Ambrosio — [github.com/andrebuils](https://github.com/andrebuils)
**Studente:** Thomas Fortuna

Questa cartella contiene il frontend di **Melodyc**, costruito con il T3 Stack su Next.js 15.

---

## Stack tecnologico

| Tecnologia | Scopo |
|---|---|
| [Next.js 15](https://nextjs.org) | Framework React con App Router e Server Actions |
| [TypeScript](https://www.typescriptlang.org) | Type safety end-to-end |
| [Tailwind CSS 4](https://tailwindcss.com) | Styling utility-first |
| [ShadCN / Radix UI](https://ui.shadcn.com) | Componenti UI accessibili |
| [Prisma](https://prisma.io) | ORM per PostgreSQL |
| [Neon](https://neon.tech) | Database PostgreSQL serverless |
| [Better Auth](https://www.better-auth.com) | Autenticazione |
| [Inngest](https://inngest.com) | Queue e background jobs |
| [Polar.sh](https://polar.sh) | Pagamenti e crediti |
| [AWS S3](https://aws.amazon.com/s3/) | Storage audio e copertine |
| [Zustand](https://zustand-demo.pmnd.rs) | State management (player audio) |
| [Vercel](https://vercel.com) | Deployment |

---

## Guida completa

Per la documentazione dettagliata su come costruire questo frontend passo per passo, leggi:

**[come-iniziare.md](come-iniziare.md)**

Troverai istruzioni su:
1. Next.js — T3 Stack (inizializzazione, struttura, variabili d'ambiente)
2. Autenticazione con Better Auth
3. Database con Prisma e Neon
4. Queue con Inngest
5. Dashboard layout
6. Pagina generazione musica
7. Sound bar e player audio
8. Home page e feed community
9. Pagamenti con Polar.sh
10. Deployment su Vercel
11. 10 esercizi di ottimizzazione avanzata

---

## Comandi rapidi

```bash
# Installa dipendenze
npm install

# Avvia in sviluppo
npm run dev

# Avvia la queue Inngest (secondo terminale)
npx inngest-cli@latest dev

# Applica migrazioni database
npx prisma migrate dev

# Apri Prisma Studio (GUI database)
npx prisma studio

# Build di produzione
npm run build

# Type checking
npm run typecheck

# Lint
npm run lint
```

---

*Melodyc — Andrea D'Ambrosio — [github.com/andrebuils](https://github.com/andrebuils)*
