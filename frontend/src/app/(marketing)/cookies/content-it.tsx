import Link from "next/link";
import {
  LegalControllerCard,
  LegalExternalLink as ExternalLink,
  LegalList,
  LegalMail as Mail,
  LegalSection,
  LegalTable,
  legalLinkClass,
  legalStrongClass,
} from "~/components/legal/legal-layout";
import { legalEntity } from "~/lib/legal";

export function CookieContentIt() {
  return (
    <>
      <LegalControllerCard index={1} lang="it" />

      <LegalSection title="1. Cosa sono i cookie" index={2}>
        <p>
          I cookie sono piccoli file di testo memorizzati sul tuo dispositivo
          (computer, tablet o smartphone) quando visiti un sito web. Anche
          tecnologie analoghe, come il local storage del browser, funzionano
          in modo simile e sono disciplinate da questa informativa.
        </p>
        <p>
          La presente Cookie Policy si applica al sito web{" "}
          <strong className={legalStrongClass}>{legalEntity.website}</strong>{" "}
          e all’applicazione web Melodyc (insieme, il
          &quot;Servizio&quot;), gestiti da{" "}
          <strong className={legalStrongClass}>{legalEntity.name}</strong>{" "}
          (&quot;Melodyc&quot;, &quot;noi&quot; o &quot;nostro&quot;). È
          redatta in conformità al Regolamento generale sulla protezione dei
          dati dell’Unione europea (GDPR, Regolamento (UE) 2016/679), alla
          Direttiva ePrivacy (2002/58/CE), al Codice in materia di protezione
          dei dati personali (D.Lgs. 196/2003, come modificato dal D.Lgs.
          101/2018) e alle Linee guida cookie e altri strumenti di
          tracciamento del Garante per la protezione dei dati personali
          (provvedimento n. 231 del 10 giugno 2021). Costituisce
          l’informativa richiesta dagli articoli 13 e 14 del GDPR per i dati
          trattati tramite cookie e tecnologie analoghe.
        </p>
      </LegalSection>

      <LegalSection title="2. Chi è responsabile dei tuoi dati" index={3}>
        <p>
          Il titolare del trattamento dei dati relativi al Servizio è{" "}
          <strong className={legalStrongClass}>{legalEntity.name}</strong>,
          i cui dati sono indicati sopra.
        </p>
        {/* TODO: confirm with counsel that a DPO is not required (Art. 37 GDPR); if one is appointed, add their contact here. */}
        <p>
          Non abbiamo nominato un responsabile della protezione dei dati
          (RPD o DPO), poiché tale nomina non è richiesta dall’articolo 37 del
          GDPR per le nostre attività di trattamento. Per qualsiasi richiesta
          relativa alla privacy puoi contattarci direttamente all’indirizzo{" "}
          <Mail address={legalEntity.privacyEmail} />.
        </p>
        {/* TODO: shown automatically once legalEntity.parentCompany is set to D'Ambrosio Holding S.r.l. */}
        {legalEntity.parentCompany && (
          <>
            <p>
              {legalEntity.name} appartiene a un gruppo di società controllato
              da{" "}
              <strong className={legalStrongClass}>
                {legalEntity.parentCompany}
              </strong>
              , che esercita su di essa attività di direzione e coordinamento
              ai sensi dell’articolo 2497-bis del Codice civile.
            </p>
            <p>
              {legalEntity.parentCompany} non gestisce il Servizio e non
              accede ai dati raccolti tramite i cookie su questo sito web. Se
              la situazione dovesse cambiare, aggiorneremo questa informativa
              per descrivere il ruolo di ciascuna società prima dell’inizio di
              qualsiasi trattamento di questo tipo.
            </p>
          </>
        )}
      </LegalSection>

      <LegalSection title="3. Basi giuridiche per l’uso dei cookie" index={4}>
        <p>
          Ai sensi dell’articolo 122 del Codice privacy e delle Linee guida
          sopra citate, utilizziamo i cookie in base alle seguenti basi
          giuridiche:
        </p>
        <LegalList>
          <li>
            <strong className={legalStrongClass}>
              Cookie strettamente necessari:
            </strong>{" "}
            non è richiesto il consenso (articolo 122, comma 1, del Codice
            privacy). Sono indispensabili per fornire il Servizio che hai
            esplicitamente richiesto (ad esempio, mantenere attiva la tua
            sessione) e non possono essere disabilitati. Il relativo
            trattamento si basa sull’esecuzione di un contratto (art. 6,
            par. 1, lett. b, GDPR) e sul nostro legittimo interesse a mantenere
            il Servizio sicuro e funzionante (art. 6, par. 1, lett. f, GDPR).
          </li>
          <li>
            <strong className={legalStrongClass}>Cookie analitici:</strong>{" "}
            è richiesto un consenso preventivo, informato e specifico (art. 6,
            par. 1, lett. a, GDPR). Si attivano solo dopo che li hai accettati
            tramite il banner cookie.
          </li>
          <li>
            <strong className={legalStrongClass}>Cookie di marketing:</strong>{" "}
            è richiesto un consenso preventivo, informato e specifico (art. 6,
            par. 1, lett. a, GDPR). Si attivano solo dopo che li hai accettati
            tramite il banner cookie.
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="4. Cookie strettamente necessari" index={5}>
        <p>
          Questi cookie consentono le funzioni essenziali, come
          l’autenticazione, la sicurezza dell’account e la memorizzazione
          delle tue scelte sui cookie. Quando il Servizio è fornito tramite
          HTTPS, i nomi dei cookie di autenticazione possono avere il prefisso{" "}
          <code className="font-mono text-sm">__Secure-</code>. Sono tutti
          cookie di prima parte, installati da Melodyc sul proprio dominio e
          non vengono mai utilizzati per finalità di profilazione.
        </p>
        <LegalTable
          monoFirstColumn
          headers={["Nome del cookie", "Fornitore", "Finalità", "Durata"]}
          rows={[
            [
              "better-auth.session_token",
              "Melodyc (Better Auth)",
              "Mantiene attiva e sicura la sessione del tuo account",
              "7 giorni, rinnovato durante l’uso del Servizio",
            ],
            [
              "better-auth.dont_remember",
              "Melodyc (Better Auth)",
              "Termina la sessione alla chiusura del browser se non hai selezionato l’opzione ricordami",
              "Sessione",
            ],
            [
              "cookie_consent_id",
              "Melodyc",
              "Collega le tue preferenze sui cookie alla registrazione che prova il consenso",
              "12 mesi",
            ],
            [
              "sidebar_state",
              "Melodyc",
              "Memorizza se la barra laterale della dashboard è espansa o compressa",
              "7 giorni",
            ],
            [
              "legal_lang",
              "Melodyc",
              "Memorizza la lingua (italiano o inglese) scelta per le pagine legali",
              "12 mesi",
            ],
          ]}
        />
      </LegalSection>

      <LegalSection title="5. Local storage" index={6}>
        <p>
          Memorizziamo inoltre alcuni valori tecnici nel local storage del
          browser. Non vengono mai trasmessi a terzi e servono soltanto a far
          funzionare il Servizio come previsto.
        </p>
        <LegalTable
          monoFirstColumn
          headers={["Chiave", "Fornitore", "Finalità", "Durata"]}
          rows={[
            [
              "melodyc-cookie-consent",
              "Melodyc",
              "Memorizza le preferenze sui cookie per non mostrare di nuovo il banner",
              "Fino alla cancellazione, rinnovato ogni 12 mesi",
            ],
            [
              "theme",
              "Melodyc",
              "Memorizza la preferenza per la modalità chiara o scura",
              "Fino alla cancellazione",
            ],
            [
              "melodyc-demo-generation",
              "Melodyc",
              "Consente di ritrovare il brano generato con la demo pubblica gratuita",
              "Fino alla cancellazione",
            ],
          ]}
        />
      </LegalSection>

      <LegalSection title="6. Cookie analitici" index={7}>
        <p>
          Gli strumenti di analisi ci aiutano a capire come i visitatori
          utilizzano il Servizio, per poterlo migliorare. Con il tuo consenso
          alla categoria{" "}
          <strong className={legalStrongClass}>Analitici</strong> carichiamo{" "}
          <strong className={legalStrongClass}>Vercel Web Analytics</strong>{" "}
          (pagine visitate, sito di provenienza, paese, tipo di dispositivo e
          browser) e{" "}
          <strong className={legalStrongClass}>Vercel Speed Insights</strong>{" "}
          (prestazioni di caricamento delle pagine). Entrambi sono forniti da
          Vercel Inc. e funzionano senza cookie: non memorizzano identificativi
          sul tuo dispositivo e non ti tracciano su altri siti. I dati sono
          aggregati e l’identificativo basato sulla richiesta viene eliminato
          entro 24 ore. Senza il tuo consenso, o se lo revochi, questi
          strumenti non vengono caricati.
        </p>
      </LegalSection>

      <LegalSection title="7. Cookie di marketing" index={8}>
        <p>
          I cookie di marketing servono a tracciare i visitatori sui diversi
          siti web e a mostrare contenuti pertinenti ai loro interessi. Al
          momento Melodyc{" "}
          <strong className={legalStrongClass}>
            non utilizza cookie di marketing né cookie di profilazione
          </strong>
          . Se dovessimo introdurli, aggiorneremo questa informativa e
          chiederemo il tuo consenso prima della loro attivazione.
        </p>
      </LegalSection>

      <LegalSection title="8. Servizi di terze parti e trasferimenti di dati" index={9}>
        <p>
          Il Servizio si avvale dei seguenti fornitori. Alcuni trattano dati
          al di fuori dello Spazio economico europeo (SEE) o possono
          installare propri cookie sui rispettivi domini (ad esempio durante
          il pagamento).
        </p>
        <LegalTable
          headers={["Servizio", "Finalità", "Ubicazione dei dati", "Base giuridica"]}
          rows={[
            [
              "Vercel",
              "Hosting del sito web e distribuzione dei contenuti",
              "CDN globale, Stati Uniti (DPF)",
              "Legittimo interesse",
            ],
            [
              "Vercel Web Analytics e Speed Insights",
              "Statistiche di visita senza cookie e prestazioni delle pagine",
              "Stati Uniti (DPF)",
              "Consenso",
            ],
            [
              "Neon (PostgreSQL)",
              "Database per account, brani, crediti e registrazioni dei consensi",
              "UE (Francoforte)",
              "Esecuzione del contratto / Obbligo di legge",
            ],
            [
              "Amazon Web Services (S3)",
              "Archiviazione e distribuzione dell’audio generato e delle immagini di copertina",
              "UE (Stoccolma)",
              "Esecuzione del contratto",
            ],
            [
              "Modal",
              "Infrastruttura cloud GPU che esegue i modelli musicali di AI",
              "Stati Uniti (SCC)",
              "Esecuzione del contratto",
            ],
            [
              "Inngest",
              "Elaborazione in background delle richieste di generazione dei brani",
              "Stati Uniti (SCC)",
              "Esecuzione del contratto",
            ],
            [
              "Polar",
              "Pagamento, abbonamenti e fatturazione in qualità di Merchant of Record",
              "Stati Uniti / UE (SCC)",
              "Esecuzione del contratto",
            ],
            [
              "GitHub",
              "Immagini del profilo dei collaboratori del progetto mostrate nel footer",
              "Stati Uniti (DPF)",
              "Legittimo interesse",
            ],
          ]}
        />
        <p>
          Quando i dati sono trasferiti al di fuori del SEE, facciamo
          affidamento su garanzie adeguate: decisioni di adeguatezza ai sensi
          dell’articolo 45 del GDPR (come il Data Privacy Framework UE-USA,
          &quot;DPF&quot;) oppure clausole contrattuali standard
          (&quot;SCC&quot;) ai sensi dell’articolo 46, paragrafo 2, lettera c,
          del GDPR. Puoi richiederne una copia contattandoci.
        </p>
        <p>
          Salvo diversa indicazione, questi fornitori agiscono come
          responsabili del trattamento per nostro conto, sulla base di un
          accordo ai sensi dell’articolo 28 del GDPR, e possono utilizzare i
          dati solo per prestarci i loro servizi. GitHub fornisce le immagini
          dei collaboratori in qualità di titolare autonomo e può ricevere il
          tuo indirizzo IP quando il browser le carica.
        </p>
        <p>
          Quando concludi un acquisto, vieni reindirizzato alla pagina di
          pagamento di Polar, che agisce come titolare autonomo e applica la
          propria{" "}
          <ExternalLink href="https://polar.sh/legal/privacy">
            Informativa sulla privacy
          </ExternalLink>
          .
        </p>
      </LegalSection>

      <LegalSection title="9. Il consenso è obbligatorio?" index={10}>
        <p>
          No. I cookie strettamente necessari sono indispensabili per il
          funzionamento del Servizio e sono quindi sempre attivi. Il consenso
          ai cookie analitici e di marketing è facoltativo: se lo rifiuti o
          chiudi il banner senza scegliere, vengono utilizzati soltanto i
          cookie strettamente necessari e puoi continuare a usare tutte le
          funzionalità del Servizio senza limitazioni.
        </p>
        <p>
          Non utilizziamo cookie wall. Lo scorrimento della pagina o la
          prosecuzione della navigazione non sono mai considerati una forma di
          consenso e nessun cookie non necessario viene installato prima che
          tu abbia effettuato una scelta.
        </p>
      </LegalSection>

      <LegalSection title="10. Come gestire le preferenze sui cookie" index={11}>
        <p>
          Alla prima visita del Servizio, un banner ti consente di accettare
          tutti i cookie, rifiutare quelli non necessari oppure scegliere per
          categoria. Accettare e rifiutare sono operazioni ugualmente
          semplici. Chiudendo il banner con il pulsante &quot;X&quot;,
          mantieni le impostazioni predefinite: vengono utilizzati soltanto i
          cookie strettamente necessari.
        </p>
        <p>
          La scelta viene memorizzata per 12 mesi. Mostreremo di nuovo il
          banner solo dopo tale periodo, se una modifica a questa informativa
          incide sul tuo consenso oppure se cancelli i dati del browser.
        </p>
        <p>
          Puoi modificare o revocare il consenso in qualsiasi momento facendo
          clic sulla scheda <strong className={legalStrongClass}>Cookie</strong>{" "}
          sul lato sinistro della pagina. Revocare il consenso è semplice
          quanto prestarlo e non pregiudica la liceità del trattamento
          effettuato prima della revoca.
        </p>
        <p>
          Puoi anche bloccare o cancellare i cookie dalle impostazioni del
          browser. Disabilitare i cookie strettamente necessari potrebbe
          impedire il corretto funzionamento di alcune parti del Servizio,
          come l’accesso all’account.
        </p>
        <LegalList>
          <li>
            <ExternalLink href="https://support.google.com/chrome/answer/95647">
              Google Chrome
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop">
              Mozilla Firefox
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://support.apple.com/en-us/105082">
              Safari
            </ExternalLink>
          </li>
          <li>
            <ExternalLink href="https://support.microsoft.com/en-us/microsoft-edge/manage-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09">
              Microsoft Edge
            </ExternalLink>
          </li>
        </LegalList>
      </LegalSection>

      <LegalSection title="11. Prova del consenso" index={12}>
        <p>
          Per dimostrare che il consenso è stato prestato, come richiesto
          dall’articolo 7, paragrafo 1, del GDPR, conserviamo una registrazione
          della tua scelta che contiene soltanto: un identificativo casuale
          (memorizzato anche nel cookie{" "}
          <code className="font-mono text-sm">cookie_consent_id</code>), le
          categorie accettate o rifiutate, la versione di questa informativa,
          la data e l’ora della scelta e, se hai effettuato l’accesso, il
          collegamento al tuo account. A questo scopo non conserviamo il tuo
          indirizzo IP né altri identificativi.
        </p>
      </LegalSection>

      <LegalSection title="12. I tuoi diritti ai sensi del GDPR" index={13}>
        <p>
          Ai sensi del GDPR e del Codice privacy, hai i seguenti diritti
          riguardo ai dati personali trattati tramite cookie:
        </p>
        <LegalList>
          <li>
            <strong className={legalStrongClass}>Diritto di accesso</strong>{" "}
            (art. 15): ottenere conferma del trattamento e una copia dei tuoi
            dati.
          </li>
          <li>
            <strong className={legalStrongClass}>
              Diritto di rettifica
            </strong>{" "}
            (art. 16): correggere i dati inesatti.
          </li>
          <li>
            <strong className={legalStrongClass}>Diritto alla cancellazione</strong>{" "}
            (art. 17): chiedere la cancellazione dei tuoi dati.
          </li>
          <li>
            <strong className={legalStrongClass}>
              Diritto di limitazione del trattamento
            </strong>{" "}
            (art. 18): limitare le modalità con cui trattiamo i tuoi dati.
          </li>
          <li>
            <strong className={legalStrongClass}>
              Diritto alla portabilità dei dati
            </strong>{" "}
            (art. 20): ricevere i tuoi dati in un formato strutturato e
            leggibile da dispositivo automatico.
          </li>
          <li>
            <strong className={legalStrongClass}>Diritto di opposizione</strong>{" "}
            (art. 21): opporti al trattamento basato sul legittimo interesse.
          </li>
          <li>
            <strong className={legalStrongClass}>
              Diritto di revocare il consenso
            </strong>{" "}
            (art. 7, par. 3): in qualsiasi momento, senza pregiudicare i
            trattamenti precedenti.
          </li>
          <li>
            <strong className={legalStrongClass}>
              Diritto di proporre reclamo
            </strong>{" "}
            al Garante per la protezione dei dati personali all’indirizzo{" "}
            <ExternalLink href="https://www.garanteprivacy.it">
              www.garanteprivacy.it
            </ExternalLink>
            , oppure all’autorità di controllo dello Stato membro dell’UE in
            cui risiedi, lavori o in cui si è verificata la presunta
            violazione (art. 77).
          </li>
        </LegalList>
        <p className="mt-3">
          Per esercitare questi diritti, scrivi a{" "}
          <Mail address={legalEntity.privacyEmail} />. Le richieste sono
          gratuite e risponderemo senza ingiustificato ritardo e comunque
          entro un mese dalla ricezione. Il termine può essere prorogato di
          altri due mesi per le richieste complesse; in tal caso ti
          informeremo (art. 12, par. 3, GDPR). Potremmo chiederti di
          verificare la tua identità prima di dare seguito alla richiesta.
        </p>
        <p>
          I cookie descritti in questa informativa non determinano decisioni
          basate unicamente sul trattamento automatizzato, compresa la
          profilazione, che producano effetti giuridici o incidano in modo
          analogamente significativo sulla tua persona (art. 22 GDPR).
        </p>
      </LegalSection>

      <LegalSection title="13. Conservazione dei dati" index={14}>
        <p>
          Le preferenze sui cookie e la relativa registrazione del consenso
          sono conservate per un massimo di{" "}
          <strong className={legalStrongClass}>12 mesi</strong>{" "}
          dalla data della scelta; trascorso tale periodo ti chiederemo di
          confermarle. I cookie di sessione vengono eliminati alla chiusura
          del browser, mentre i cookie persistenti scadono secondo quanto
          indicato nelle tabelle precedenti.
        </p>
      </LegalSection>

      <LegalSection title="14. Modifiche a questa informativa" index={15}>
        <p>
          Potremmo aggiornare questa Cookie Policy per riflettere modifiche
          alle nostre pratiche, alla tecnologia o agli obblighi di legge. La
          data riportata in cima alla pagina indica l’ultimo aggiornamento.
          Se una modifica riguarda cookie per i quali è necessario il tuo
          consenso, te lo chiederemo nuovamente.
        </p>
      </LegalSection>

      <LegalSection title="15. Contatti" index={16}>
        <p>
          Per qualsiasi domanda su questa Cookie Policy o sul trattamento dei
          tuoi dati, puoi contattarci:
        </p>
        <ul className="mt-3 space-y-2">
          <li>
            Email: <Mail address={legalEntity.privacyEmail} />
          </li>
          <li>
            PEC: <Mail address={legalEntity.pec} />
          </li>
          <li>
            Maggiori dettagli:{" "}
            <Link href="/privacy" className={legalLinkClass}>
              Informativa sulla privacy
            </Link>
          </li>
        </ul>
      </LegalSection>
    </>
  );
}