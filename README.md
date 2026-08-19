 # Aiquizzer

Applicazione web basata su **Next.js** per creare, gestire e svolgere quiz con il supporto dell’intelligenza artificiale.

## Requisiti

- [Node.js](https://nodejs.org/) 18.18 o superiore
- npm, pnpm o yarn
- Una chiave API del provider AI utilizzato dal progetto, se richiesta

## Installazione

1. Clona il repository e accedi alla cartella del progetto:

	```bash
	git clone <URL_DEL_REPOSITORY>
	cd Aiquizzer
	```

2. Installa le dipendenze:

	```bash
	npm install
	```

	In alternativa:

	```bash
	pnpm install
	# oppure
	yarn install
	```

3. Crea il file delle variabili d’ambiente:

	```bash
	cp .env.example .env.local
	```

	Su Windows PowerShell:

	```powershell
	Copy-Item .env.example .env.local
	```

	Compila `.env.local` con i valori richiesti dal progetto, ad esempio la chiave del servizio AI. Non pubblicare mai questo file né le relative chiavi.

## Avvio in sviluppo

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

## Script disponibili

Gli script sono definiti nel file `package.json`:

```bash
npm run dev      # avvia il server di sviluppo
npm run build    # crea la build di produzione
npm run start    # avvia la build di produzione
npm run lint     # verifica il codice con il linter
```

## Build e produzione

```bash
npm run build
npm run start
```

Prima dell’avvio in produzione assicurati di configurare tutte le variabili d’ambiente necessarie nell’ambiente di deployment.

## Struttura del progetto

La struttura può variare in base alla configurazione Next.js adottata. Le directory principali sono generalmente:

```text
app/ o pages/     Pagine e routing dell’applicazione
components/       Componenti React riutilizzabili
public/            Risorse statiche
lib/ o utils/      Funzioni di supporto e integrazioni
```

## Configurazione

Le impostazioni locali devono essere inserite in `.env.local`. Usa nomi coerenti con quelli presenti in `.env.example` e riavvia il server dopo ogni modifica alle variabili d’ambiente.

## Risoluzione dei problemi

- Se una dipendenza non viene trovata, elimina `node_modules` e il lockfile, quindi esegui nuovamente `npm install`.
- Se la porta 3000 è occupata, avvia Next.js con `npm run dev -- -p 3001`.
- Se le funzionalità AI non rispondono, verifica la chiave API e i relativi permessi nel file `.env.local`.

## Contributi

1. Crea un branch dedicato.
2. Implementa e verifica le modifiche.
3. Esegui lint e build.
4. Apri una pull request descrivendo il cambiamento.

## Licenza

Inserire qui la licenza del progetto.
