import Link from "next/link";
import type { ReactNode } from "react";
import {
  LegalControllerCard,
  LegalExternalLink as ExternalLink,
  LegalList,
  LegalMail as Mail,
  LegalSection,
  LegalSubheading,
  LegalTable,
  legalLinkClass,
  legalStrongClass,
} from "~/components/legal/legal-layout";
import { legalEntity } from "~/lib/legal";

function Strong({ children }: { children: ReactNode }) {
  return <strong className={legalStrongClass}>{children}</strong>;
}

export function PrivacyContentIt() {
  return (
    <>
      <LegalControllerCard index={1} lang="it" />

      <LegalSection title="1. Introduzione" index={2}>
        <p>
          Benvenuti su <Strong>Melodyc</Strong> (&quot;noi&quot;, &quot;ci&quot;
          o &quot;nostro&quot;). La presente Informativa sulla privacy spiega
          come <Strong>{legalEntity.name}</Strong> raccoglie, utilizza,
          comunica e protegge i dati personali quando visitate{" "}
          <Strong>{legalEntity.website}</Strong> e utilizzate la piattaforma
          Melodyc per la generazione di musica con IA, inclusa la demo pubblica
          gratuita (congiuntamente, il &quot;Servizio&quot;).
        </p>
        <p>
          La presente informativa è resa ai sensi degli articoli 13 e 14 del
          Regolamento generale sulla protezione dei dati dell’Unione europea
          (GDPR, Regolamento (UE) 2016/679) ed è conforme al Codice della
          privacy (D.Lgs. 196/2003, come modificato dal D.Lgs. 101/2018) e ai
          provvedimenti del Garante per la protezione dei dati personali.
        </p>
      </LegalSection>

      <LegalSection title="2. Titolare del trattamento" index={3}>
        <p>
          Il titolare del trattamento è <Strong>{legalEntity.name}</Strong>, i
          cui dati sono indicati qui sopra. Per qualsiasi questione relativa ai
          vostri dati personali potete contattarci all’indirizzo{" "}
          <Mail address={legalEntity.privacyEmail} /> oppure tramite posta
          elettronica certificata (PEC) all’indirizzo{" "}
          <Mail address={legalEntity.pec} />.
        </p>
        {/* TODO: confirm with counsel that a DPO is not required (Art. 37 GDPR); if one is appointed, add their contact here. */}
        <p>
          Non abbiamo nominato un responsabile della protezione dei dati (RPD,
          o DPO), poiché tale nomina non è richiesta dall’articolo 37 GDPR per
          le nostre attività di trattamento.
        </p>
        {/* TODO: shown automatically once legalEntity.parentCompany is set to D'Ambrosio Holding S.r.l. */}
        {legalEntity.parentCompany && (
          <p>
            {legalEntity.name} è soggetta all’attività di direzione e
            coordinamento di <Strong>{legalEntity.parentCompany}</Strong> ai
            sensi dell’articolo 2497-bis del Codice civile italiano.{" "}
            {legalEntity.parentCompany} non gestisce il Servizio e non tratta i
            dati personali dei suoi utenti.
          </p>
        )}
      </LegalSection>

      <LegalSection title="3. Dati personali raccolti" index={4}>
        <p>
          Raccogliamo i dati personali che ci fornite e alcuni dati generati
          automaticamente durante l’utilizzo del Servizio. Raccogliamo solo
          quanto necessario per le finalità descritte nella presente
          informativa.
        </p>

        <LegalSubheading>3.1 Dati forniti dall’interessato</LegalSubheading>
        <LegalList>
          <li>
            <Strong>Dati dell’account:</Strong> nome, indirizzo email e
            password forniti al momento della registrazione, insieme alla data,
            all’ora e alla versione dei Termini e dell’Informativa sulla privacy
            accettati. Le password non vengono mai conservate in chiaro: viene
            memorizzato soltanto un hash crittografico sicuro. Potete inoltre
            scegliere un nome utente pubblico e caricare un’immagine del
            profilo dalle impostazioni dell’account. Le immagini del profilo
            vengono ritagliate, ridimensionate e conservate nel nostro spazio
            cloud privato.
          </li>
          <li>
            <Strong>Contenuti creativi:</Strong> descrizioni dei brani, istruzioni di generazione,
            testi, tag di stile, titoli e impostazioni di generazione che
            inviate, nonché i brani e le copertine generati a partire da tali
            contenuti.
          </li>
          <li>
            <Strong>Contenuti pubblicati e profilo pubblico:</Strong> quando
            scegliete di pubblicare un brano, il titolo, l’audio, la copertina,
            le categorie, il vostro nome, nome utente e immagine del profilo
            diventano visibili agli altri utenti Melodyc autenticati nella
            sezione Scopri, nel riproduttore audio e nella pagina del vostro profilo
            pubblico (/user/your-username), che elenca i brani pubblicati. Il
            prompt di generazione può essere utilizzato per rendere il brano
            ricercabile. Potete ritirare la pubblicazione di un brano,
            modificare il nome utente o rimuovere l’immagine del profilo in
            qualsiasi momento.
          </li>
          <li>
            <Strong>Istruzioni della demo gratuita:</Strong> la descrizione e le
            opzioni che inviate utilizzando la demo pubblica senza un account.
          </li>
          <li>
            <Strong>Comunicazioni:</Strong> contenuto delle email che ci
            inviate, ad esempio per chiedere assistenza o esercitare i vostri
            diritti.
          </li>
          <li>
            <Strong>Preferenze cookie:</Strong> le vostre scelte di consenso,
            come descritto nella nostra{" "}
            <Link href="/cookies" className={legalLinkClass}>
              Informativa sui cookie
            </Link>
            .
          </li>
        </LegalList>

        <LegalSubheading>3.2 Dati raccolti automaticamente</LegalSubheading>
        <LegalList>
          <li>
            <Strong>Dati di sessione:</Strong> identificativi di sessione, ora
            di accesso, indirizzo IP e user agent del browser associati alle
            sessioni attive, utilizzati per mantenere l’accesso e proteggere
            l’account.
          </li>
          <li>
            <Strong>Dati di utilizzo:</Strong> saldo dei crediti, Mi piace
            assegnati, artisti che seguite e che vi seguono, numero di ascolti
            dei brani pubblicati e notifiche in-app generate da queste attività
            (ad esempio, chi ha messo Mi piace a un vostro brano o ha iniziato
            a seguirvi).
          </li>
          <li>
            <Strong>Prevenzione degli abusi della demo:</Strong> per limitare
            la demo gratuita a una generazione per visitatore al giorno,
            calcoliamo un hash crittografico non reversibile del vostro
            indirizzo IP e dello user agent del browser, combinati con la data
            corrente. Per questa finalità non conserviamo l’indirizzo IP in
            chiaro.
          </li>
          <li>
            <Strong>Log tecnici:</Strong> il nostro fornitore di hosting
            registra automaticamente informazioni tecniche sulle richieste
            (come indirizzo IP, data e ora, pagina richiesta e tipo di browser)
            per erogare il Servizio e proteggerlo.
          </li>
          <li>
            <Strong>Analisi statistiche:</Strong> solo se prestate il
            consenso alla categoria Analitici nel banner dei cookie,
            utilizziamo Vercel Web Analytics e Vercel Speed Insights per
            misurare in forma aggregata le visite e le prestazioni delle pagine
            (pagine visitate, sito di provenienza, paese, tipo di dispositivo e
            browser, tempi di caricamento). Questi strumenti non utilizzano
            cookie e non vi tracciano su altri siti.
          </li>
        </LegalList>

        <LegalSubheading>3.3 Dati trattati mediante IA</LegalSubheading>
        <LegalList>
          <li>
            <Strong>Generazione musicale:</Strong> le vostre istruzioni e i vostri testi sono
              elaborati da modelli di IA a codice sorgente aperto (ACE-Step per la musica,
            Qwen2 per testi, tag di stile, titoli, categorie e descrizioni delle
            copertine, e FLUX.1-schnell per le immagini di copertina), eseguiti
            sulla nostra infrastruttura GPU dedicata ospitata da Modal.
          </li>
          <li>
            <Strong>Nessun fornitore di IA di terze parti:</Strong> i vostri
            contenuti non vengono inviati a servizi IA esterni come OpenAI o
            Google e non utilizziamo le vostre istruzioni, i testi o i brani per addestrare
            modelli di IA.
          </li>
          <li>
            <Strong>Cache dei prompt:</Strong> per ridurre i tempi di
            generazione, il testo prodotto dal modello linguistico per una
            determinata istruzione può essere conservato temporaneamente nella
            stessa infrastruttura GPU. La cache non contiene nome, email o
            identificativo dell’account.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="4. Finalità del trattamento" index={5}>
        <LegalList>
          <li>
            <Strong>Erogazione del Servizio:</Strong> creare e gestire il
            vostro account, generare brani, titoli e copertine, conservare la
            vostra libreria, consentire download in più formati audio,
            visualizzare il profilo pubblico e permettervi di pubblicare e
            scoprire musica.
          </li>
          <li>
            <Strong>Demo gratuita:</Strong> generare un brano demo senza
            account e prevenire abusi della quota gratuita.
          </li>
          <li>
            <Strong>Crediti:</Strong> gestire il saldo dei vostri crediti
            gratuiti e le eventuali ricariche manuali da voi richieste.
          </li>
          <li>
            <Strong>Email relative all’account:</Strong> verificare il vostro
            indirizzo email, inviarvi un messaggio di benvenuto dopo la
            conferma dell’account, reimpostare la password e inviare
            notifiche di servizio (brano pronto, generazione non riuscita,
            nuovo follower). Potete attivare o disattivare le email di
            notifica dalle relative impostazioni oppure tramite il link di
            disiscrizione presente in ogni notifica. Le email di verifica e
            reimpostazione della password non possono essere disattivate,
            perché necessarie alla sicurezza dell’account.
          </li>
          <li>
            <Strong>Sicurezza:</Strong> autenticarvi, proteggere gli account
            dagli accessi non autorizzati, prevenire frodi e abusi e mantenere
            disponibile il Servizio.
          </li>
          <li>
            <Strong>Assistenza:</Strong> rispondere alle vostre domande e
            richieste.
          </li>
          <li>
            <Strong>Adempimenti di legge:</Strong> rispettare gli obblighi
            legali, fiscali e contabili e accertare, esercitare o difendere un
            diritto in sede giudiziaria.
          </li>
        </LegalList>
        <p className="mt-3">
          Non vendiamo i vostri dati personali, non li utilizziamo per
          pubblicità e non effettuiamo attività di profilazione.
        </p>
      </LegalSection>

      <LegalSection title="5. Basi giuridiche del trattamento (art. 6 GDPR)" index={6}>
        <LegalTable
          headers={["Attività di trattamento", "Base giuridica"]}
          rows={[
            [
              "Creazione e gestione dell’account",
              "Esecuzione del contratto (art. 6, par. 1, lett. b) GDPR)",
            ],
            [
              "Generazione di brani, testi e copertine, libreria e pubblicazione",
              "Esecuzione del contratto (art. 6, par. 1, lett. b) GDPR)",
            ],
            [
              "Saldo crediti e ricariche manuali",
              "Esecuzione del contratto (art. 6, par. 1, lett. b) GDPR)",
            ],
            [
              "Verifica email, reimpostazione della password ed email di servizio",
              "Esecuzione del contratto (art. 6, par. 1, lett. b) GDPR)",
            ],
            [
              "Demo pubblica gratuita e relativo limite giornaliero",
              "Legittimo interesse a offrire una prova gratuita e prevenire abusi (art. 6, par. 1, lett. f) GDPR)",
            ],
            [
              "Sicurezza dell’account, gestione delle sessioni e log tecnici",
              "Legittimo interesse a mantenere sicuro il Servizio (art. 6, par. 1, lett. f) GDPR)",
            ],
            [
              "Richieste di assistenza",
              "Esecuzione del contratto (art. 6, par. 1, lett. b) GDPR) / legittimo interesse (art. 6, par. 1, lett. f) GDPR)",
            ],
            [
              "Registrazioni delle scelte sui cookie",
              "Obbligo legale (art. 6, par. 1, lett. c) GDPR)",
            ],
            [
              "Analisi statistiche (Vercel Web Analytics e Speed Insights)",
              "Consenso (art. 6, par. 1, lett. a) GDPR)",
            ],
            [
              "Adempimento degli obblighi fiscali e legali",
              "Obbligo legale (art. 6, par. 1, lett. c) GDPR)",
            ],
          ]}
        />
        <p>
          Quando ci basiamo sul legittimo interesse, lo bilanciamo con i vostri
          diritti e le vostre libertà. Potete opporvi a tale trattamento in
          qualsiasi momento, come descritto nella sezione 11.
        </p>
      </LegalSection>

      <LegalSection title="6. Il conferimento dei dati è obbligatorio?" index={7}>
        <p>
          Il conferimento di nome, indirizzo email e password è necessario per
          creare un account: senza tali dati non possiamo erogare il Servizio.
          Le istruzioni e i testi sono necessari per generare musica. Tutti gli
          altri dati sono facoltativi e il rifiuto dei cookie facoltativi non
          limita mai l’utilizzo del Servizio.
        </p>
      </LegalSection>

      <LegalSection title="7. Destinatari e responsabili del trattamento" index={8}>
        <p>
          Comunichiamo i dati personali soltanto ai fornitori necessari per
          erogare il Servizio. Salvo diversa indicazione, tali fornitori
          operano come responsabili del trattamento per nostro conto, in base
          a un accordo sul trattamento dei dati ai sensi dell’articolo 28 GDPR,
          e possono utilizzare i dati esclusivamente per prestarci i propri
          servizi.
        </p>

        <LegalSubheading>Hosting e infrastruttura</LegalSubheading>
        <LegalTable
          headers={["Servizio", "Finalità", "Ubicazione dei dati"]}
          rows={[
            [
              "Vercel",
              "Hosting dell’applicazione web, funzioni serverless, log tecnici e analisi statistiche previo consenso (Web Analytics, Speed Insights)",
              "CDN globale, Stati Uniti (DPF)",
            ],
            [
              "Neon (PostgreSQL)",
              "Database principale: account, sessioni, metadati dei brani, crediti, Mi piace e registrazioni del consenso",
              "UE (Francoforte)",
            ],
            [
              "Amazon Web Services (S3)",
              "Archiviazione dei file audio generati, delle copertine e delle immagini del profilo",
              "UE (Stoccolma)",
            ],
            [
              "Modal",
              "Infrastruttura GPU per l’esecuzione dei modelli IA di generazione musicale, dei testi e delle copertine",
              "Stati Uniti (SCC)",
            ],
            [
              "Inngest",
              "Orchestrazione dei processi in background per la generazione dei brani",
              "Stati Uniti (SCC)",
            ],
            [
              "Resend",
              "Invio delle email dell’account: verifica email, reimpostazione della password e notifiche di servizio",
              "Regione di invio UE (Irlanda), Stati Uniti (SCC)",
            ],
          ]}
        />

        <LegalSubheading>Altri destinatari</LegalSubheading>
        <LegalList>
          <li>
            <Strong>Altri utenti Melodyc:</Strong> nome, nome utente, immagine
            del profilo, elenchi e conteggi dei follower e degli account
            seguiti, nonché esclusivamente i brani che scegliete di
            pubblicare, come descritto nella sezione 3.1. Quando seguite una
            persona, questa potrebbe ricevere un’email con il vostro nome e un
            link al vostro profilo.
          </li>
          <li>
            <Strong>GitHub:</Strong> fornisce le immagini del profilo dei
            collaboratori del progetto mostrate nel piè di pagina in qualità di
            titolare autonomo del trattamento e potrebbe ricevere il vostro
            indirizzo IP quando il browser le carica.
          </li>
          <li>
            <Strong>Autorità:</Strong> autorità pubbliche, quando richiesto
            dalla legge o da un provvedimento vincolante.
          </li>
          <li>
            <Strong>Consulenti professionali:</Strong> commercialisti,
            revisori e avvocati vincolati alla riservatezza, ove necessario.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="8. Trasferimenti internazionali di dati" index={9}>
        <p>
          Alcuni fornitori si trovano al di fuori dello Spazio economico
          europeo (SEE). Quando i dati personali sono trasferiti fuori dal SEE,
          adottiamo garanzie adeguate ai sensi del capo V GDPR:
        </p>
        <LegalList>
          <li>
            <Strong>Data Privacy Framework (DPF) UE-USA:</Strong> per i
            fornitori statunitensi certificati DPF, sulla base della decisione
            di adeguatezza della Commissione europea (art. 45 GDPR).
          </li>
          <li>
            <Strong>Clausole contrattuali standard (SCC):</Strong> approvate
            dalla Commissione europea e applicate agli altri fornitori (art.
            46, par. 2, lett. c) GDPR).
          </li>
          <li>
            <Strong>Archiviazione nell’UE:</Strong> ove possibile, conserviamo
            i dati nell’UE. Il database è ospitato a Francoforte e i file audio
            generati sono conservati a Stoccolma.
          </li>
        </LegalList>
        <p className="mt-3">
          Potete richiedere una copia delle garanzie adottate contattandoci.
        </p>
      </LegalSection>

      <LegalSection title="9. Conservazione dei dati" index={10}>
        <p>
          Conserviamo i dati personali solo per il tempo necessario alle
          finalità descritte nella presente informativa:
        </p>
        <LegalTable
          headers={["Categoria di dati", "Periodo di conservazione"]}
          rows={[
            ["Dati dell’account", "Fino alla cancellazione dell’account"],
            [
              "Brani, istruzioni, testi e copertine",
              "Fino alla cancellazione del brano o dell’account",
            ],
            [
              "Nome utente e immagine del profilo",
              "Fino alla modifica o rimozione, oppure alla cancellazione dell’account",
            ],
            [
              "Notifiche in-app",
              "Visibili per 90 giorni; cancellate con l’account o con il brano correlato",
            ],
            [
              "Preferenze email di notifica",
              "Fino alla cancellazione dell’account",
            ],
            [
              "Log di invio delle email",
              "Secondo i tempi di conservazione dei log del nostro fornitore email",
            ],
            [
              "Sessioni attive",
              "7 giorni dall’ultima attività o fino alla disconnessione",
            ],
            [
              "Istruzioni della demo gratuita e audio generati",
              "Fino a 30 giorni dalla generazione",
            ],
            ["Hash del limite giornaliero della demo", "Fino a 30 giorni"],
            [
              "Registrazioni del consenso cookie",
              "12 mesi dalla scelta",
            ],
            [
              "Email di assistenza",
              "Fino a 24 mesi dalla chiusura della richiesta",
            ],
            [
              "Log tecnici",
              "Secondo i tempi di conservazione dei log del fornitore di hosting, normalmente pochi giorni",
            ],
            [
              "Documenti richiesti dalla normativa fiscale e contabile",
              "10 anni (art. 2220 del Codice civile italiano)",
            ],
          ]}
        />
        <p>
          Decorso tale periodo, i dati vengono cancellati o resi anonimi in
          modo irreversibile, salvo che sia necessario conservarli più a lungo
          per adempiere un obbligo legale o difendere un diritto.
        </p>
      </LegalSection>

      <LegalSection title="10. Sicurezza dei dati" index={11}>
        <p>
          Adottiamo misure tecniche e organizzative adeguate (art. 32 GDPR) per
          proteggere i vostri dati personali, tra cui:
        </p>
        <LegalList>
          <li>
            <Strong>Crittografia:</Strong> tutto il traffico è cifrato tramite
            HTTPS/TLS, le password sono conservate esclusivamente sotto forma
            di hash sicuri e i segreti sono custoditi in variabili di ambiente
            cifrate.
          </li>
          <li>
            <Strong>Autenticazione:</Strong> cookie di sessione sicuri e
            HTTP-only, con durata limitata, e limitazione della frequenza delle
            richieste sugli endpoint di autenticazione.
          </li>
          <li>
            <Strong>Controllo degli accessi:</Strong> ciascun utente può
            accedere solo ai propri brani privati. Le query al database
            passano attraverso l’ORM Prisma per prevenire le iniezioni SQL.
          </li>
          <li>
            <Strong>Archiviazione:</Strong> i file audio e le copertine sono
            conservati in un bucket privato e resi accessibili tramite link
            firmati di breve durata.
          </li>
          <li>
            <Strong>Infrastruttura:</Strong> i modelli IA vengono eseguiti in
            ambienti GPU isolati e l’accesso ai sistemi di produzione è
            limitato al personale autorizzato.
          </li>
        </LegalList>
        <p className="mt-3">
          Nessun metodo di trasmissione o archiviazione è completamente
          sicuro. Se è probabile che una violazione dei dati personali comporti
          un rischio per i vostri diritti, informeremo il Garante per la
          protezione dei dati personali entro 72 ore e, ove richiesto, vi
          informeremo senza ingiustificato ritardo (articoli 33 e 34 GDPR).
        </p>
      </LegalSection>

      <LegalSection title="11. I vostri diritti ai sensi del GDPR" index={12}>
        <p>In relazione ai vostri dati personali, avete diritto a:</p>
        <LegalList>
          <li>
            <Strong>Diritto di accesso</Strong> (art. 15): ottenere conferma
            che sia o meno in corso un trattamento dei vostri dati e riceverne
            copia.
          </li>
          <li>
            <Strong>Diritto di rettifica</Strong> (art. 16): correggere i dati
            inesatti o integrare quelli incompleti.
          </li>
          <li>
            <Strong>Diritto alla cancellazione</Strong> (art. 17): chiedere la
            cancellazione dei vostri dati. Potete cancellare autonomamente
            l’account in qualsiasi momento da Account &gt; Security: questa
            operazione rimuove definitivamente il profilo, i brani, i file
            audio, le copertine e le preferenze.
          </li>
          <li>
            <Strong>Diritto di limitazione del trattamento</Strong> (art. 18):
            ottenere la limitazione del trattamento nei casi previsti.
          </li>
          <li>
            <Strong>Diritto alla portabilità dei dati</Strong> (art. 20):
            ricevere in formato strutturato, di uso comune e leggibile da
            dispositivo automatico i dati che ci avete fornito.
          </li>
          <li>
            <Strong>Diritto di opposizione</Strong> (art. 21): opporvi in
            qualsiasi momento al trattamento basato sul legittimo interesse,
            per motivi connessi alla vostra situazione particolare.
          </li>
          <li>
            <Strong>Diritto di revocare il consenso</Strong> (art. 7, par. 3):
            in qualsiasi momento, senza pregiudicare la liceità del trattamento
            basata sul consenso prima della revoca.
          </li>
          <li>
            <Strong>Diritto di proporre reclamo</Strong> (art. 77): al Garante
            per la protezione dei dati personali, tramite{" "}
            <ExternalLink href="https://www.garanteprivacy.it">
              www.garanteprivacy.it
            </ExternalLink>
            , oppure all’autorità di controllo dello Stato membro dell’UE in
            cui risiedete, lavorate o in cui si è verificata la presunta
            violazione.
          </li>
        </LegalList>
        <p className="mt-3">
          Per esercitare i vostri diritti, scrivete a{" "}
          <Mail address={legalEntity.privacyEmail} />. Le richieste sono
          gratuite. Risponderemo senza ingiustificato ritardo e, in ogni caso,
          entro un mese dal ricevimento. Il termine può essere prorogato di
          ulteriori due mesi per le richieste complesse; in tal caso vi
          informeremo (art. 12, par. 3, GDPR). Prima di dare seguito alla
          richiesta potremmo chiedervi di verificare la vostra identità.
        </p>
      </LegalSection>

      <LegalSection title="12. Privacy dei minori" index={13}>
        <p>
          Il Servizio non è rivolto a persone di età inferiore a 16 anni e non
          raccogliamo consapevolmente i loro dati personali. Se veniamo a
          sapere di aver raccolto dati di una persona minore di 16 anni senza
          una valida autorizzazione genitoriale, li cancelleremo
          tempestivamente. Se ritenete che ciò sia avvenuto, contattateci.
        </p>
      </LegalSection>

      <LegalSection title="13. Processo decisionale automatizzato" index={14}>
        <p>
          Melodyc utilizza l’IA per generare musica, testi, tag di stile,
          categorie e copertine a partire dai dati da voi inseriti. Questo
          trattamento fornisce esclusivamente il servizio creativo richiesto:{" "}
          <Strong>non è utilizzato per la profilazione</Strong> e non produce
          decisioni che abbiano effetti giuridici o incidano in modo analogo
          significativamente sulla vostra persona (art. 22 GDPR). Siete sempre
          voi a decidere quali brani conservare, pubblicare o ritirare dalla
          pubblicazione.
        </p>
      </LegalSection>

      <LegalSection title="14. Cookie" index={15}>
        <p>
          Per informazioni dettagliate sui cookie e sulle tecnologie analoghe
          utilizzati e per sapere come gestire le preferenze, consultate la
          nostra{" "}
          <Link href="/cookies" className={legalLinkClass}>
            Informativa sui cookie
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="15. Modifiche alla presente informativa" index={16}>
        <p>
          Potremmo aggiornare la presente Informativa sulla privacy per
          riflettere modifiche alle nostre prassi, alla tecnologia o agli
          obblighi di legge. Pubblicheremo la versione aggiornata su questa
          pagina e modificheremo la data di &quot;Ultimo aggiornamento&quot;.
          In caso di modifiche sostanziali, vi informeremo tramite il Servizio
          o via email prima che diventino efficaci.
        </p>
      </LegalSection>

      <LegalSection title="16. Contatti" index={17}>
        <p>
          Per domande sulla presente Informativa sulla privacy o per esercitare
          i vostri diritti, potete contattarci:
        </p>
        <ul className="mt-3 space-y-2">
          <li>
            Email: <Mail address={legalEntity.privacyEmail} />
          </li>
          <li>
            PEC: <Mail address={legalEntity.pec} />
          </li>
          <li>
            Indirizzo: {legalEntity.address}, {legalEntity.city}
          </li>
        </ul>
      </LegalSection>
    </>
  );
}