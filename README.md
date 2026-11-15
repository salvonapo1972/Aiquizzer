# Aiquizzer

Aiquizzer è un'applicazione web in italiano realizzata con **Next.js** e **React**. Offre un quiz interattivo generato con l'AI a partire da contenuti archiviati nel database: le domande includono opzioni di risposta e spiegazioni, e l'interfaccia consente di rispondere e vedere il punteggio.

Il progetto include inoltre un flusso di ingestion per estrarre testo da PDF, suddividerlo in frammenti, calcolarne gli embedding e salvarli nel database per renderli disponibili alla generazione dei quiz.

> Questo README descrive il branch `develop`. Il progetto è in sviluppo e alcune configurazioni, come lo schema del database e le credenziali dei servizi, devono essere predisposte separatamente.

## Stack

- Next.js 16, React 19 e TypeScript
- Vercel AI SDK con provider OpenAI per generazione quiz ed embedding
- Neon Postgres per i contenuti usati dal quiz
- Clerk per autenticazione e protezione delle route
- Contentful per i contenuti di tipo `song`
- Tailwind CSS

## Requisiti

- Node.js **20.9 o superiore**
- npm (il repository include `package-lock.json`)
- Credenziali per Clerk, OpenAI, Neon e Contentful

## Configurazione locale

1. Clona il repository e passa al branch `develop`:

   ```bash
   git clone https://github.com/salvonapo1972/Aiquizzer.git
   cd Aiquizzer
   git switch develop
   ```

2. Installa le dipendenze:

   ```bash
   npm ci
   ```

3. Crea `.env.local` nella cartella principale e configura le variabili usate dall'applicazione:

   ```dotenv
   OPENAI_API_KEY=
   DATABASE_URL=
   SPACE_ID=
   ACCESS_TOKEN=
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=
   ```

   Recupera i valori dai rispettivi account/provider. Il repository non contiene un file `.env.example`; non committare mai `.env.local` o credenziali reali.

4. Avvia l'app in sviluppo:

   ```bash
   npm run dev
   ```

   Apri [http://localhost:3000](http://localhost:3000).

## Database

Il codice si aspetta una connessione Neon tramite `DATABASE_URL` e una tabella `document_sections` con almeno i campi `content`, `embedding` e `knowledge_id`. L'ingestion salva gli embedding come vettori; prepara nel database lo schema e il supporto vettoriale richiesti prima di usare questa funzionalità. In questo repository non è presente una migrazione SQL che crei la tabella.

## Ingestion dei PDF

È disponibile lo script `ingest`:

```bash
npm run ingest -- <knowledgeid> <nomefile>
```

Lo script usa OpenAI per generare gli embedding e Neon per salvarli. **Nota:** allo stato attuale il percorso del PDF è costruito nel codice con il prefisso locale `D:/Progetti/NextJs/`; modifica `ingestion/run-ingestion.tsx` per adattarlo al percorso del tuo ambiente prima di eseguire lo script.

## Script disponibili

```bash
npm run dev      # server di sviluppo
npm run build    # build di produzione
npm run start    # avvia la build
npm run lint     # controlli ESLint
npm run ingest   # ingestion di un PDF (vedi sopra)
```

Per provare la build di produzione:

```bash
npm run build
npm run start
```

## Struttura principale

```text
app/
  api/quiz/          Endpoint per generare il quiz
  components/        Componenti React, incluso QuizWidget
  lib/               Connessioni e funzioni di supporto
  page.tsx           Pagina principale
ingestion/            Script di ingestion dei PDF
public/               Risorse statiche
```

## Contribuire

Apri una issue per segnalare un problema o proporre un miglioramento. Per contribuire, crea un branch dedicato e invia una pull request verso `develop`, includendo una descrizione delle modifiche e delle verifiche effettuate.

## Licenza

Nel repository non è attualmente specificata una licenza. Contatta il proprietario prima di riutilizzare o ridistribuire il codice.
