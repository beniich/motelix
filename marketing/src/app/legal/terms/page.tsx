import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conditions Générales d\'Utilisation — Sapphire',
  description: 'Conditions générales d\'utilisation du logiciel Sapphire PMS.',
};

export default function TermsPage() {
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
            Conditions Générales d&apos;Utilisation
          </h1>
          <p className="text-midnight-400 text-sm">Dernière mise à jour : {lastUpdated}</p>
        </div>

        <div className="space-y-10 text-midnight-200 [&_ul]:list-disc [&_ul]:ml-5 [&_ul]:space-y-1">

          <Section title="1. Objet">
            <p>
              Les présentes Conditions Générales d&apos;Utilisation (&quot;CGU&quot;) régissent l&apos;accès et l&apos;utilisation
              du logiciel Sapphire (&quot;le Service&quot;), édité par <strong>Sapphire SAS</strong> (&quot;Sapphire&quot;,
              &quot;nous&quot;). En accédant au Service, vous acceptez sans réserve les présentes CGU.
            </p>
          </Section>

          <Section title="2. Description du Service">
            <p>
              Sapphire est un logiciel de gestion hôtelière (PMS — Property Management System) en mode SaaS,
              accessible via navigateur et application mobile, comprenant les modules suivants :
            </p>
            <ul>
              <li>Gestion des réservations et de la réception</li>
              <li>Channel Manager (synchronisation OTA)</li>
              <li>Housekeeping et gestion des tâches</li>
              <li>Facturation et paiements en ligne</li>
              <li>Business Intelligence et reporting</li>
              <li>API publique et webhooks</li>
            </ul>
          </Section>

          <Section title="3. Conditions d'accès">
            <ul>
              <li>Vous devez être une personne morale ou un professionnel indépendant dans le secteur hôtelier</li>
              <li>Vous devez avoir la capacité juridique pour conclure un contrat</li>
              <li>L&apos;accès est soumis à la création d&apos;un compte et au paiement d&apos;un abonnement</li>
            </ul>
          </Section>

          <Section title="4. Abonnements et facturation">
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-2">4.1 Plans disponibles</h3>
                <ul>
                  <li><strong>Starter</strong> (99€/mois HT) : jusqu&apos;à 20 chambres</li>
                  <li><strong>Pro</strong> (249€/mois HT) : jusqu&apos;à 100 chambres + Channel Manager</li>
                  <li><strong>Enterprise</strong> (799€/mois HT) : illimité + support dédié</li>
                </ul>
                <p className="mt-2">Tarifs annuels disponibles avec 20% de réduction.</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">4.2 Paiement</h3>
                <p>Le paiement s&apos;effectue par carte bancaire via Stripe. La facturation est mensuelle ou annuelle
                selon le plan choisi, prélèvement automatique en début de période.</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">4.3 Période d&apos;essai</h3>
                <p>Une période d&apos;essai gratuite de 14 jours est proposée sans engagement et sans CB requise.
                À l&apos;issue de la période d&apos;essai, l&apos;accès est suspendu si aucun abonnement n&apos;est souscrit.</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">4.4 Résiliation</h3>
                <p>Vous pouvez résilier à tout moment depuis votre espace de facturation. La résiliation
                prend effet à la fin de la période en cours. Aucun remboursement au prorata n&apos;est effectué.</p>
              </div>
            </div>
          </Section>

          <Section title="5. Obligations de l'utilisateur">
            <ul>
              <li>Ne pas partager ses identifiants de connexion</li>
              <li>Ne pas tenter de contourner les mesures de sécurité</li>
              <li>Ne pas utiliser le Service à des fins illicites</li>
              <li>Ne pas revendre ou sous-licencier l&apos;accès au Service</li>
              <li>Maintenir la confidentialité des clés d&apos;API générées</li>
              <li>Respecter les droits des personnes dont les données sont traitées (RGPD)</li>
            </ul>
          </Section>

          <Section title="6. Propriété intellectuelle">
            <p>
              Le Service, son code source, son design, ses algorithmes et sa documentation sont la propriété
              exclusive de Sapphire SAS. L&apos;abonnement vous confère uniquement un droit d&apos;utilisation personnel,
              non exclusif et non transférable.
            </p>
            <p>
              Vos données restent votre propriété. Sapphire n&apos;y accède que pour la fourniture du Service.
            </p>
          </Section>

          <Section title="7. SLA et disponibilité">
            <ul>
              <li><strong>Starter / Pro :</strong> disponibilité cible 99,5% (hors maintenance planifiée)</li>
              <li><strong>Enterprise :</strong> disponibilité cible 99,9% avec SLA contractuel</li>
              <li>Maintenances planifiées annoncées 48h à l&apos;avance par email</li>
              <li>Page de statut : <a href="https://status.sapphire.luxury" className="text-gold-400">status.sapphire.luxury</a></li>
            </ul>
          </Section>

          <Section title="8. Limitation de responsabilité">
            <p>
              Sapphire ne peut être tenu responsable des dommages indirects, pertes de données résultant
              d&apos;une utilisation non conforme, des interruptions de service dues à des tiers (hébergeur,
              opérateur réseau, etc.), ni des pertes de revenus liées à une indisponibilité du Service.
            </p>
            <p>
              La responsabilité de Sapphire est limitée au montant des abonnements payés au cours des 12 derniers mois.
            </p>
          </Section>

          <Section title="9. Droit applicable et litiges">
            <p>
              Les présentes CGU sont soumises au droit français. En cas de litige, les parties rechercheront
              une solution amiable avant tout recours judiciaire. À défaut, le Tribunal de Commerce de Paris
              sera seul compétent.
            </p>
          </Section>

          <Section title="10. Modifications">
            <p>
              Sapphire se réserve le droit de modifier les présentes CGU. Toute modification significative
              sera notifiée par email 30 jours à l&apos;avance. La poursuite de l&apos;utilisation du Service vaut acceptation.
            </p>
          </Section>

          <Section title="11. Contact">
            <p>
              Pour toute question relative aux présentes CGU :{' '}
              <a href="mailto:legal@sapphire.luxury" className="text-gold-400">legal@sapphire.luxury</a>
            </p>
            <p className="text-midnight-400 text-sm mt-4">
              Sapphire SAS — SIRET : [à compléter] — RCS Paris : [à compléter]<br />
              Siège social : [adresse à compléter]
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
      <div className="text-midnight-200 space-y-3">
        {children}
      </div>
    </section>
  );
}
