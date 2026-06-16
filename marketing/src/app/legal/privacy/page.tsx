import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité — Sapphire',
  description: 'Comment Sapphire collecte, utilise et protège vos données personnelles.',
};

export default function PrivacyPage() {
  const lastUpdated = '13 juin 2025';

  return (
    <main className="min-h-screen bg-midnight-900 font-sans text-midnight-100">
      <div className="max-w-3xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="mb-12">
          <a href="/" className="text-gold-400 text-sm font-medium tracking-wider uppercase hover:text-gold-300 transition-colors">
            ← Retour à Sapphire
          </a>
          <h1 className="text-4xl font-display font-bold text-white mt-6 mb-4">
            Politique de Confidentialité
          </h1>
          <p className="text-midnight-400 text-sm">Dernière mise à jour : {lastUpdated}</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert prose-gold max-w-none space-y-10">

          <Section title="1. Qui sommes-nous ?">
            <p>
              Sapphire est un logiciel de gestion hôtelière (PMS) édité par <strong>Sapphire SAS</strong>,
              société immatriculée en France. Le responsable du traitement est joignable à :{' '}
              <a href="mailto:privacy@sapphire.luxury" className="text-gold-400">privacy@sapphire.luxury</a>.
            </p>
          </Section>

          <Section title="2. Données collectées">
            <SubSection title="2.1 Données des administrateurs hôteliers">
              <ul>
                <li>Identité : nom, prénom, adresse email professionnelle</li>
                <li>Données de connexion : adresse IP, dates de connexion, token JWT (durée 7 jours)</li>
                <li>Données de facturation : coordonnées de paiement (traitées par Stripe, non stockées par Sapphire)</li>
              </ul>
            </SubSection>
            <SubSection title="2.2 Données des clients finaux (guests)">
              <ul>
                <li>Données de réservation : nom, email, téléphone, numéro de document d'identité (optionnel)</li>
                <li>Préférences de séjour (allergies, chambre préférée)</li>
                <li>Données de facturation : montants, méthodes de paiement</li>
              </ul>
            </SubSection>
            <SubSection title="2.3 Données d'usage">
              <ul>
                <li>Événements d'utilisation du produit (clics, pages visitées) via PostHog</li>
                <li>Erreurs techniques via Sentry</li>
              </ul>
            </SubSection>
          </Section>

          <Section title="3. Finalités et bases légales">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-midnight-700">
                  <th className="text-left py-2 pr-4 text-midnight-300">Finalité</th>
                  <th className="text-left py-2 text-midnight-300">Base légale</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                {[
                  ['Fourniture du service PMS', 'Exécution du contrat'],
                  ['Facturation et comptabilité', 'Obligation légale'],
                  ['Amélioration du produit', 'Intérêt légitime'],
                  ['Emails de support et onboarding', 'Exécution du contrat'],
                  ['Emails marketing', 'Consentement'],
                  ['Sécurité et prévention fraude', 'Intérêt légitime'],
                ].map(([finalite, base]) => (
                  <tr key={finalite} className="border-b border-midnight-800">
                    <td className="py-2 pr-4">{finalite}</td>
                    <td className="py-2 text-gold-400">{base}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Section>

          <Section title="4. Conservation des données">
            <ul>
              <li><strong>Données de compte :</strong> 3 ans après la fin de l'abonnement</li>
              <li><strong>Données de facturation :</strong> 10 ans (obligation légale française)</li>
              <li><strong>Logs d'audit :</strong> 12 mois glissants</li>
              <li><strong>Données guests :</strong> 3 ans après la fin du séjour</li>
              <li><strong>Cookies analytiques :</strong> 13 mois maximum</li>
            </ul>
          </Section>

          <Section title="5. Partage des données">
            <p>Nous ne vendons jamais vos données. Nous les partageons uniquement avec :</p>
            <ul>
              <li><strong>Stripe</strong> : traitement des paiements (USA — Standard Contractual Clauses)</li>
              <li><strong>Resend</strong> : envoi des emails transactionnels (UE)</li>
              <li><strong>PostHog</strong> : analytics d'usage (EU Cloud)</li>
              <li><strong>Sentry</strong> : monitoring des erreurs (USA — SCC)</li>
              <li><strong>Render</strong> : hébergement de la base de données (Francfort, EU)</li>
            </ul>
          </Section>

          <Section title="6. Vos droits (RGPD)">
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul>
              <li><strong>Droit d'accès</strong> : obtenir une copie de vos données</li>
              <li><strong>Droit de rectification</strong> : corriger des données inexactes</li>
              <li><strong>Droit à l'effacement</strong> : supprimer vos données (sous conditions)</li>
              <li><strong>Droit à la portabilité</strong> : export CSV de vos données</li>
              <li><strong>Droit d'opposition</strong> : aux traitements basés sur l'intérêt légitime</li>
              <li><strong>Droit de retrait du consentement</strong> : pour les emails marketing</li>
            </ul>
            <p>Pour exercer ces droits :{' '}
              <a href="mailto:privacy@sapphire.luxury" className="text-gold-400">privacy@sapphire.luxury</a>
              . Réponse sous 30 jours.
            </p>
            <p>Vous pouvez également déposer une réclamation auprès de la CNIL :
              {' '}<a href="https://www.cnil.fr" className="text-gold-400" target="_blank" rel="noreferrer">cnil.fr</a>
            </p>
          </Section>

          <Section title="7. Cookies">
            <p>Nous utilisons les cookies suivants :</p>
            <ul>
              <li><strong>Cookies essentiels</strong> : session, authentification (pas de consentement requis)</li>
              <li><strong>Cookies analytiques</strong> : PostHog (avec votre consentement)</li>
              <li><strong>Cookies de tracking marketing</strong> : utm_* (avec votre consentement)</li>
            </ul>
            <p>Vous pouvez gérer vos préférences à tout moment via le bandeau de cookies.</p>
          </Section>

          <Section title="8. Sécurité">
            <ul>
              <li>Transmission chiffrée TLS 1.3 (HTTPS partout)</li>
              <li>Mots de passe hashés bcrypt (coût 12)</li>
              <li>Base de données chiffrée at-rest</li>
              <li>Clés API préfixées et hashées SHA256 (jamais stockées en clair)</li>
              <li>Authentification JWT avec expiration 7 jours</li>
            </ul>
          </Section>

          <Section title="9. Contact">
            <p>
              <strong>DPO / Responsable protection des données :</strong><br />
              Sapphire SAS — privacy@sapphire.luxury<br />
              Pour les demandes urgentes : <a href="tel:+33000000000" className="text-gold-400">+33 (0)x xx xx xx xx</a>
            </p>
          </Section>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-gold-400 mb-4 pb-2 border-b border-midnight-700">{title}</h2>
      <div className="text-midnight-200 space-y-3 [&_ul]:list-disc [&_ul]:ml-5 [&_ul]:space-y-1 [&_li]:text-midnight-300">
        {children}
      </div>
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
      {children}
    </div>
  );
}
