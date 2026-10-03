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
import { subscriptionPlans } from "~/lib/pricing";
import { repositoryUrl } from "~/lib/site-config";

function Strong({ children }: { children: ReactNode }) {
  return <strong className={legalStrongClass}>{children}</strong>;
}

export function TermsContentIt() {
  return (
    <>
      <LegalControllerCard lang="it" index={1} title="Fornitore del servizio" />

      <LegalSection title="1. Introduzione e definizioni" index={2}>
        <p>
          I presenti Termini e condizioni (i «Termini») disciplinano l’accesso e l’utilizzo di <Strong>Melodyc</Strong>, la piattaforma di generazione musicale tramite intelligenza artificiale disponibile all’indirizzo <Strong>{legalEntity.website}</Strong>, inclusa la demo pubblica gratuita (il «Servizio»), gestita da <Strong>{legalEntity.name}</Strong> («noi» o «nostro»).
        </p>
        <p>
          Creando un account o utilizzando il Servizio, l’Utente dichiara di aver letto, compreso e accettato i presenti Termini. In caso di mancata accettazione, non è consentito utilizzare il Servizio.
        </p>
        <p>
          I presenti Termini sono redatti in conformità agli artt. 1341 e 1342 c.c., al Codice del Consumo (D.Lgs. 206/2005), al D.Lgs. 70/2003 sul commercio elettronico, al Regolamento (UE) 2016/679 (GDPR), al Regolamento (UE) 2024/1689 (AI Act) e a ogni altra disposizione italiana ed europea applicabile.
        </p>
        <LegalSubheading>Definizioni</LegalSubheading>
        <LegalList>
          <li><Strong>«Utente»</Strong>: qualsiasi persona fisica o giuridica che utilizza il Servizio, con o senza account.</li>
          <li><Strong>«Consumatore»</Strong>: l’Utente persona fisica che agisce per scopi estranei alla propria attività commerciale, imprenditoriale, artigianale o professionale.</li>
          <li><Strong>«Crediti»</Strong>: unità che consentono all’Utente di generare brani. Per ogni brano generato con successo viene utilizzato un credito.</li>
          <li><Strong>«Input»</Strong>: descrizioni, prompt, testi, tag di stile, titoli e impostazioni inviati dall’Utente.</li>
          <li><Strong>«Output»</Strong>: brani, testi, tag di stile, categorie e immagini di copertina generati dal Servizio a partire dall’Input.</li>
          <li><Strong>«Contenuti pubblicati»</Strong>: gli Output che l’Utente sceglie di rendere visibili agli altri utenti nella sezione Scopri.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="2. Descrizione del Servizio" index={3}>
        <p>Melodyc è una piattaforma basata sull’intelligenza artificiale che consente di:</p>
        <LegalList>
          <li>Generare brani originali a partire da una descrizione testuale, da testi scritti dall’Utente o da testi elaborati dall’intelligenza artificiale.</li>
          <li>Creare tracce vocali o strumentali e orientare il risultato scegliendo stili, generi e impostazioni di generazione.</li>
          <li>Archiviare i brani in una libreria personale, riprodurli e scaricarli in formato WAV, MP3 o FLAC insieme alla copertina.</li>
          <li>Pubblicare i brani su Discover, esplorare la musica creata dalla community e apprezzare i brani preferiti.</li>
          <li>Creare un profilo pubblico con nome utente e immagine del profilo, seguire altri creatori ed essere seguiti.</li>
          <li>Provare una demo gratuita limitata senza creare un account.</li>
        </LegalList>
        <p className="mt-3">
          <Strong>Trasparenza sull’intelligenza artificiale:</Strong> tutta la musica, i testi e le immagini prodotti dal Servizio sono generati da sistemi di intelligenza artificiale. I risultati sono probabilistici, possono variare a parità di Input e potrebbero non corrispondere sempre alle aspettative dell’Utente.
        </p>
      </LegalSection>

      <LegalSection title="3. Registrazione e account" index={4}>
        <LegalList>
          <li>La registrazione è gratuita e richiede nome, indirizzo email valido e password. Prima di accedere è necessario verificare l’indirizzo email.</li>
          <li>È possibile scegliere un nome utente pubblico e caricare un’immagine del profilo. L’Utente deve esserne titolare o avere il diritto di utilizzarla; entrambi devono rispettare la sezione 6.</li>
          <li>Per utilizzare il Servizio occorre avere almeno <Strong>16 anni</Strong>. Gli acquisti sono riservati agli Utenti maggiorenni secondo la legge del proprio Paese oppure autorizzati da un genitore o tutore legale.</li>
          <li>Al momento della registrazione vengono assegnati <Strong>20 crediti gratuiti</Strong>, senza necessità di fornire dati di pagamento.</li>
          <li>L’Utente è responsabile della riservatezza delle credenziali e di ogni attività svolta tramite il proprio account. Qualsiasi uso non autorizzato deve essere comunicato tempestivamente.</li>
          <li>L’Utente si impegna a fornire informazioni veritiere, accurate e aggiornate e a mantenere un solo account personale.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="4. Crediti, piani e pagamenti" index={5}>
        <LegalSubheading>4.1 Sistema dei crediti</LegalSubheading>
        <LegalList>
          <li><Strong>Un credito equivale a un brano generato con successo.</Strong> Se la generazione non riesce, il credito non viene scalato.</li>
          <li>I crediti non hanno valore monetario, non possono essere convertiti in denaro né trasferiti ad altri account.</li>
          <li>I crediti non utilizzati si trasferiscono al periodo di fatturazione successivo e restano disponibili finché l’account è attivo.</li>
        </LegalList>

        <LegalSubheading>4.2 Piani disponibili</LegalSubheading>
        <LegalTable
          headers={["Piano", "Prezzo", "Crediti al mese"]}
          rows={subscriptionPlans.map((plan) => [
            plan.name,
            `${plan.price} / mese`,
            String(plan.credits),
          ])}
        />
        <p>
          I piani sono abbonamenti mensili con rinnovo automatico fino alla disdetta. I crediti vengono accreditati dopo il primo pagamento andato a buon fine e dopo ogni rinnovo completato. Prezzi e condizioni applicabili sono sempre quelli indicati nella{" "}
          <Link href="/#pricing" className={legalLinkClass}>pagina dei prezzi</Link>{" "}
          e nella procedura di acquisto al momento dell’acquisto.
        </p>

        <LegalSubheading>4.3 Pagamenti e fatturazione</LegalSubheading>
        <LegalList>
          <li>Gli acquisti sono elaborati da <Strong>Polar</Strong>, che opera come Merchant of Record: Polar vende l’abbonamento all’Utente, incassa il pagamento, calcola e versa le imposte applicabili (come l’IVA) in base al Paese dell’Utente ed emette la relativa fattura o ricevuta. All’acquisto si applicano anche le <ExternalLink href="https://polar.sh/legal/terms">condizioni contrattuali</ExternalLink> di Polar.</li>
          <li>Le eventuali imposte dovute sono indicate prima della conferma del pagamento. Non riceviamo né conserviamo i dati della carta.</li>
          <li>L’Utente può consultare i pagamenti e <Strong>disdire l’abbonamento in qualsiasi momento</Strong> dalla pagina Fatturazione, tramite il portale clienti Polar. La disdetta interrompe i rinnovi futuri; i crediti già accreditati restano disponibili.</li>
          <li>Se il pagamento di un rinnovo non va a buon fine, non vengono accreditati nuovi crediti fino al completamento del pagamento.</li>
        </LegalList>

        <LegalSubheading>4.4 Diritto di recesso e rimborsi</LegalSubheading>
        <p>
          Se l’Utente è un Consumatore, può esercitare il diritto di recesso da ciascun acquisto entro <Strong>14 giorni</Strong> dal pagamento, senza indicarne il motivo e senza penali (artt. 52-59 del Codice del Consumo).
        </p>
        <LegalList>
          <li>Durante la procedura di acquisto, l’Utente chiede che il Servizio inizi immediatamente, così da rendere subito disponibili i crediti acquistati.</li>
          <li>Se esercita il recesso e <Strong>non ha utilizzato alcun credito</Strong> relativo all’acquisto, ha diritto al rimborso integrale.</li>
          <li>Se ha già utilizzato una parte dei crediti, riceve un rimborso proporzionale ai crediti non utilizzati, poiché il Servizio è stato eseguito parzialmente su sua richiesta (art. 57, comma 3, Codice del Consumo).</li>
          <li>Il diritto di recesso non si applica dopo l’utilizzo di tutti i crediti dell’acquisto, poiché il Servizio è stato interamente eseguito previo consenso espresso e riconoscimento dell’Utente (art. 59, comma 1, lett. a, Codice del Consumo).</li>
          <li>Per recedere, l’Utente deve inviare una dichiarazione esplicita a <Mail address={legalEntity.email} /> oppure via PEC a <Mail address={legalEntity.pec} />, indicando l’email associata all’account e l’acquisto interessato. È possibile utilizzare anche il modulo tipo di recesso dell’allegato I, parte B, del Codice del Consumo, ma non è obbligatorio.</li>
          <li>I rimborsi sono effettuati tramite Polar entro <Strong>14 giorni</Strong> dal ricevimento della richiesta, utilizzando lo stesso metodo di pagamento impiegato per l’acquisto e senza costi per l’Utente. I relativi crediti sono rimossi dall’account.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="5. Contenuti dell’Utente e musica generata dall’intelligenza artificiale" index={6}>
        <LegalSubheading>5.1 Input</LegalSubheading>
        <LegalList>
          <li>L’Utente conserva tutti i diritti di cui è titolare sui propri Input, compresi i testi scritti personalmente.</li>
          <li>L’Utente ci concede una licenza limitata, non esclusiva e gratuita per utilizzare gli Input esclusivamente al fine di generare gli Output e fornire il Servizio.</li>
          <li>Non utilizziamo gli Input o gli Output dell’Utente per addestrare modelli di intelligenza artificiale.</li>
        </LegalList>

        <LegalSubheading>5.2 Output</LegalSubheading>
        <LegalList>
          <li>Nei rapporti tra l’Utente e noi, <Strong>non rivendichiamo diritti di proprietà</Strong> sugli Output generati a partire dai suoi Input e, nella misura in cui vantassimo diritti sugli stessi, li trasferiamo all’Utente. L’Utente può utilizzare gli Output per qualsiasi finalità lecita, anche commerciale, nel rispetto dei presenti Termini.</li>
          <li>Secondo la normativa italiana ed europea, il diritto d’autore tutela le opere che costituiscono il risultato della creatività intellettuale umana. Gli Output generati interamente dall’intelligenza artificiale potrebbero pertanto non essere tutelati dal diritto d’autore; non possiamo garantire che siano registrabili o che i relativi diritti siano opponibili a terzi.</li>
          <li>Per la natura dell’intelligenza artificiale, altri utenti potrebbero ottenere Output simili o identici. Non garantiamo che un Output sia unico o esclusivo.</li>
          <li>L’Utente è l’unico responsabile dell’utilizzo e della distribuzione degli Output, compreso il rispetto delle regole applicabili ai contenuti generati con intelligenza artificiale da parte delle piattaforme di riproduzione in streaming, dei distributori e degli organismi di gestione collettiva.</li>
        </LegalList>

        <LegalSubheading>5.3 Contenuti pubblicati</LegalSubheading>
        <LegalList>
          <li>Quando pubblica un brano, l’Utente concede a noi e agli altri utenti del Servizio una licenza non esclusiva, valida in tutto il mondo e gratuita per ospitare, trasmettere in streaming, mostrare e rendere ricercabile il brano all’interno del Servizio, per tutto il periodo in cui rimane pubblicato.</li>
          <li>I brani pubblicati mostrano il nome, il nome utente e l’immagine del profilo dell’Utente e compaiono nella relativa pagina pubblica. L’Utente può rimuovere la pubblicazione in qualsiasi momento; da quel momento il brano non sarà più visibile agli altri utenti.</li>
          <li>Possiamo rimuovere Contenuti pubblicati, immagini del profilo o nomi utente che violano i presenti Termini o la legge, oppure che ci vengono segnalati come lesivi di diritti di terzi.</li>
        </LegalList>

        <LegalSubheading>5.4 Piattaforma Melodyc e software a codice aperto</LegalSubheading>
        <LegalList>
          <li>Il codice sorgente di Melodyc è pubblicato con licenza{" "}<ExternalLink href={`${repositoryUrl}/blob/main/LICENSE.MD`}>MIT License</ExternalLink>, che disciplina l’utilizzo del codice. I presenti Termini disciplinano l’utilizzo del Servizio ospitato all’indirizzo {legalEntity.website}.</li>
          <li>La MIT License non concede diritti sul nome Melodyc, sul logo o sugli altri segni distintivi, che restano di proprietà esclusiva di {legalEntity.name} e sono tutelati dalla normativa italiana e internazionale (D.Lgs. 30/2005). Le versioni installate autonomamente non possono essere presentate come servizio ufficiale Melodyc.</li>
          <li>I modelli di intelligenza artificiale utilizzati dal Servizio sono forniti da terzi secondo le rispettive licenze.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="6. Uso consentito" index={7}>
        <p>Utilizzando il Servizio, l’Utente si impegna a non:</p>
        <LegalList>
          <li>Inviare testi o altri Input di cui non è titolare o che non è autorizzato a utilizzare, oppure che violano diritti d’autore, marchi o altri diritti di terzi.</li>
          <li>Generare o pubblicare contenuti illeciti, diffamatori, osceni, violenti, discriminatori, istigatori all’odio o lesivi della dignità umana o dei diritti dei minori.</li>
          <li>Utilizzare il Servizio per imitare la voce, il nome o l’identità di artisti o persone reali, oppure creare deepfake o contenuti ingannevoli in violazione dell’AI Act o di altre norme applicabili.</li>
          <li>Presentare un Output generato dall’intelligenza artificiale come interamente creato da una persona quando la legge impone di dichiararne l’origine, né rimuovere indicazioni che lo identificano come generato dall’intelligenza artificiale.</li>
          <li>Utilizzare un nome utente o un’immagine del profilo che impersoni un’altra persona o un marchio, violi diritti di terzi o sia offensivo, osceno o ingannevole.</li>
          <li>Rivendere, concedere in sublicenza o condividere con terzi l’accesso all’account o ai crediti.</li>
          <li>Creare più account o utilizzare strumenti automatizzati per abusare dei crediti gratuiti o della demo gratuita.</li>
          <li>Accedere o tentare di accedere agli account di altri utenti o a brani privati, né compromettere la sicurezza del Servizio.</li>
          <li>Sovraccaricare il Servizio con richieste eccessive o automatizzate, incluse attività di estrazione automatizzata di dati e attacchi di negazione del servizio.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="7. Disponibilità del Servizio" index={8}>
        <LegalList>
          <li>Ci impegniamo a mantenere disponibile il Servizio, senza tuttavia garantirne il funzionamento ininterrotto o privo di errori.</li>
          <li>Il Servizio può essere temporaneamente sospeso per manutenzione, aggiornamenti o cause al di fuori del nostro controllo.</li>
          <li>I tempi di generazione dipendono dal carico del sistema e dalle impostazioni selezionate. I brani vengono elaborati in coda.</li>
          <li>La demo gratuita è limitata a una breve generazione al giorno per visitatore e può essere modificata o interrotta in qualsiasi momento.</li>
          <li>Possiamo modificare, aggiornare o rimuovere funzionalità del Servizio. Se una modifica riduce in misura significativa le funzionalità di un piano a pagamento, ne daremo comunicazione preventiva e l’Utente potrà disdire l’abbonamento.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="8. Limitazione di responsabilità" index={9}>
        <p>Nella misura massima consentita dalla legge (artt. 1218 e 1229 c.c.):</p>
        <LegalList>
          <li>Non rispondiamo di danni indiretti o consequenziali, come perdita di profitti, perdita di opportunità o interruzione dell’attività.</li>
          <li>La nostra responsabilità complessiva nei confronti degli Utenti che agiscono per finalità professionali o imprenditoriali, per qualsiasi pretesa relativa al Servizio, non supera l’importo pagato dall’Utente nei <Strong>12 mesi</Strong> precedenti l’evento che ha dato origine alla pretesa.</li>
          <li>Consigliamo di scaricare e conservare una copia dei brani importanti. Non rispondiamo della perdita di Output dovuta a eventi al di fuori del nostro ragionevole controllo.</li>
          <li>Non rispondiamo di malfunzionamenti o interruzioni di servizi di terzi (come Polar, AWS o Modal) che siano al di fuori del nostro ragionevole controllo.</li>
          <li>Nessuna disposizione dei presenti Termini esclude o limita la responsabilità per dolo o colpa grave (art. 1229 c.c.), per morte o lesioni personali, né i diritti inderogabili riconosciuti ai Consumatori, compresi quelli previsti dal Codice del Consumo.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="9. Garanzie" index={10}>
        <p>
          Il Servizio è fornito «così com’è» e «secondo disponibilità». Resta ferma la garanzia legale di conformità dei contenuti e servizi digitali riconosciuta ai Consumatori (artt. 135-octies e seguenti del Codice del Consumo). Non garantiamo che gli Output soddisfino le aspettative dell’Utente, corrispondano a uno stile o a una qualità specifici o siano idonei a una particolare finalità.
        </p>
      </LegalSection>

      <LegalSection title="10. Sospensione e cessazione" index={11}>
        <LegalSubheading>10.1 Da parte dell’Utente</LegalSubheading>
        <LegalList>
          <li>L’Utente può interrompere l’utilizzo del Servizio ed eliminare l’account in qualsiasi momento da Account &gt; Sicurezza oppure scrivendo a <Mail address={legalEntity.email} />.</li>
          <li>L’eliminazione dell’account rimuove definitivamente i brani, le copertine e gli eventuali crediti residui e annulla ogni abbonamento attivo. Prima dell’eliminazione è possibile scaricare i brani e richiedere una copia dei propri dati (art. 20 GDPR).</li>
          <li>Per interrompere i rinnovi futuri, ricordarsi di disdire ogni abbonamento attivo.</li>
        </LegalList>

        <LegalSubheading>10.2 Da parte nostra</LegalSubheading>
        <LegalList>
          <li>Possiamo sospendere o chiudere l’account in caso di violazione dei presenti Termini, previa comunicazione scritta dei motivi e, ove possibile, concessione di un termine per porvi rimedio.</li>
          <li>In caso di violazioni gravi (attività illecite, frode, abuso dei sistemi o lesione di diritti di terzi), la sospensione può essere immediata.</li>
          <li>Se chiudiamo l’account in assenza di violazioni imputabili all’Utente, rimborseremo i crediti acquistati e non utilizzati negli ultimi 12 mesi.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="11. Manleva" index={12}>
        <p>
          Se utilizza il Servizio per finalità professionali o imprenditoriali, l’Utente si impegna a manlevare e tenere indenne {legalEntity.name}, i suoi amministratori, dipendenti e collaboratori da pretese, danni e spese (comprese ragionevoli spese legali) derivanti dalla violazione dei presenti Termini, da Input o Contenuti pubblicati lesivi di diritti di terzi o dall’utilizzo del Servizio in violazione della legge. Nei confronti dei Consumatori si applicano le regole generali sulla responsabilità previste dalla legge italiana.
        </p>
      </LegalSection>

      <LegalSection title="12. Protezione dei dati" index={13}>
        <p>
          Il trattamento dei dati personali è descritto nella nostra{" "}
          <Link href="/privacy" className={legalLinkClass}>Informativa privacy</Link>{" "}
          e nella{" "}
          <Link href="/cookies" className={legalLinkClass}>Informativa sui cookie</Link>, che invitiamo a leggere attentamente.
        </p>
      </LegalSection>

      <LegalSection title="13. Modifiche ai presenti Termini" index={14}>
        <LegalList>
          <li>Possiamo aggiornare i presenti Termini per riflettere modifiche al Servizio, alla legge o alla nostra attività. La versione aggiornata viene pubblicata su questa pagina con una nuova data di «Ultimo aggiornamento».</li>
          <li>In caso di modifiche sostanziali, ne daremo comunicazione tramite il Servizio o via email almeno <Strong>15 giorni</Strong> prima della loro entrata in vigore.</li>
          <li>Se l’Utente non accetta le modifiche, può disdire l’abbonamento e chiudere l’account prima della loro entrata in vigore. L’uso del Servizio successivo a tale data implica l’accettazione dei Termini aggiornati.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="14. Disposizioni generali" index={15}>
        <LegalList>
          <li><Strong>Intero accordo:</Strong> i presenti Termini, insieme all’Informativa privacy e alla Cookie Policy, costituiscono l’intero accordo tra l’Utente e {legalEntity.name} in relazione al Servizio.</li>
          <li><Strong>Cessione:</Strong> l’Utente non può cedere diritti o obblighi derivanti dai presenti Termini senza il nostro previo consenso scritto. Possiamo cedere i Termini a una società del gruppo o a terzi in caso di fusione, acquisizione o trasferimento dell’attività, purché i diritti dell’Utente non siano ridotti.</li>
          <li><Strong>Clausola di salvaguardia:</Strong> se una disposizione è dichiarata invalida o inefficace, sarà sostituita dalla norma applicabile e le restanti disposizioni rimarranno in vigore.</li>
          <li><Strong>Mancata rinuncia:</Strong> il mancato esercizio di un diritto o di una disposizione non costituisce rinuncia agli stessi.</li>
          <li><Strong>Forza maggiore:</Strong> non rispondiamo di inadempimenti o ritardi causati da eventi al di fuori del nostro ragionevole controllo, quali calamità naturali, guasti alle infrastrutture, attacchi informatici o provvedimenti delle autorità pubbliche.</li>
          <li><Strong>Lingua:</Strong> i presenti Termini sono redatti in inglese. In caso di traduzione, prevale la versione inglese, salvo quanto diversamente imposto da norme inderogabili.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="15. Legge applicabile e controversie" index={16}>
        <LegalList>
          <li>I presenti Termini sono disciplinati dalla <Strong>legge italiana</Strong>. Se il Consumatore risiede in un altro Paese dell’UE, conserva anche la protezione garantita dalle disposizioni inderogabili della legge del Paese di residenza (art. 6 del Regolamento (CE) 593/2008).</li>
          <li>Per le controversie con i <Strong>Consumatori</Strong>, è competente il foro del luogo di residenza o domicilio del Consumatore (art. 66-bis del Codice del Consumo).</li>
          <li>Per le controversie con Utenti che agiscono per finalità professionali o imprenditoriali, è competente in via esclusiva il <Strong>foro di {legalEntity.court}</Strong>.</li>
          <li>Prima di adire l’autorità giudiziaria, invitiamo l’Utente a contattarci all’indirizzo <Mail address={legalEntity.email} /> per tentare una soluzione amichevole. I Consumatori possono inoltre rivolgersi a un organismo di risoluzione alternativa delle controversie (ADR) ai sensi degli artt. 141 e seguenti del Codice del Consumo.</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="16. Specifica approvazione delle clausole (artt. 1341 e 1342 c.c.)" index={17}>
        <p>
          Ai sensi degli artt. 1341 e 1342 c.c., l’Utente dichiara di aver letto e di approvare specificamente le seguenti clausole:
        </p>
        <LegalList>
          <li>Art. 4.4: diritto di recesso e rimborsi parziali</li>
          <li>Art. 5.3: licenza sui Contenuti pubblicati e relativa rimozione</li>
          <li>Art. 7: disponibilità del Servizio e modifiche alle funzionalità</li>
          <li>Art. 8: limitazione di responsabilità</li>
          <li>Art. 9: garanzie</li>
          <li>Art. 10.2: sospensione e cessazione da parte nostra</li>
          <li>Art. 11: manleva</li>
          <li>Art. 13: modifiche ai presenti Termini</li>
          <li>Art. 15: foro competente per gli Utenti professionali o imprenditoriali</li>
        </LegalList>
      </LegalSection>

      <LegalSection title="17. Contatti" index={18}>
        <p>Per qualsiasi domanda sui presenti Termini, è possibile contattarci:</p>
        <ul className="mt-3 space-y-2">
          <li>Email: <Mail address={legalEntity.email} /></li>
          <li>PEC: <Mail address={legalEntity.pec} /></li>
          <li>Indirizzo: {legalEntity.address}, {legalEntity.city}</li>
        </ul>
      </LegalSection>
    </>
  );
}