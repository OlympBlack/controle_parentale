import { motion } from 'framer-motion'
import { LegalLayout } from '@/pages/LegalLayout'

const sections = [
  {
    title: '1. Responsable du traitement',
    content: [
      'Le responsable du traitement des données personnelles est Contrôle Parental, éditeur de la plateforme du même nom.',
      'Pour toute question relative à la protection des données, vous pouvez nous contacter à l\'adresse : privacy@controle-parental.fr',
    ],
  },
  {
    title: '2. Données collectées',
    content: [
      'Données du compte parent : nom, prénom, adresse email, mot de passe (haché).',
      'Données de l\'enfant : prénom, âge, niveau de maturité (enfant, pré-ado, ado).',
      'Données d\'activité : historique de navigation, temps d\'écran par application, localisation GPS (si activée), tentatives d\'accès à des sites bloqués.',
      'Données techniques : identifiants des appareils, système d\'exploitation, version de l\'application.',
    ],
  },
  {
    title: '3. Finalités du traitement',
    content: [
      'Filtrage de contenu : catégorisation et blocage des sites inappropriés selon l\'âge de l\'enfant.',
      'Gestion du temps d\'écran : application des quotas et plages horaires définis par le parent.',
      'Géolocalisation : affichage de la position de l\'enfant en temps réel et historique des déplacements.',
      'Alertes : notification au parent en cas de comportement à risque ou de tentative d\'accès interdit.',
      'Rapports : génération de statistiques d\'activité et de scores de santé numérique.',
      'Gestion du compte : authentification, facturation et support technique.',
    ],
  },
  {
    title: '4. Base légale',
    content: [
      'Le traitement des données du compte parent est basé sur l\'exécution du contrat (article 6.1.b du RGPD).',
      'Le traitement des données d\'activité de l\'enfant est basé sur l\'intérêt légitime du parent à protéger son enfant (article 6.1.f du RGPD), dans le respect de l\'article 8 du RGPD relatif aux mineurs.',
      'L\'utilisateur est informé que le traitement respecte les recommandations de la CNIL concernant la supervision parentale.',
    ],
  },
  {
    title: '5. Durée de conservation',
    content: [
      'Données du compte parent : conservées pendant toute la durée d\'utilisation du service, puis supprimées dans un délai de 30 jours après la résiliation.',
      'Données d\'activité de l\'enfant : conservées pendant 12 mois glissants, puis automatiquement supprimées.',
      'Données de géolocalisation : conservées pendant 30 jours, puis supprimées. L\'historique des déplacements peut être désactivé à tout moment.',
      'Données de facturation : conservées 10 ans pour respecter les obligations comptables légales.',
    ],
  },
  {
    title: '6. Destinataires des données',
    content: [
      'Les données sont accessibles uniquement à l\'Utilisateur parent et aux équipes techniques de Contrôle Parental pour le support et la maintenance.',
      'Aucune donnée personnelle n\'est vendue ou partagée avec des tiers à des fins commerciales.',
      'Certaines données techniques (système d\'exploitation, version) peuvent être traitées par nos prestataires d\'infrastructure (hébergeur, services de notification push), agissant en qualité de sous-traitants et soumis à des accords de confidentialité stricts.',
    ],
  },
  {
    title: '7. Sécurité',
    content: [
      'Les données sont chiffrées en transit (TLS 1.3) et au repos (AES-256).',
      'Les mots de passe sont hachés avec l\'algorithme bcrypt.',
      'L\'accès aux données d\'activité est restreint par authentification à deux facteurs pour les équipes internes.',
      'En cas de violation de données, nous nous engageons à notifier l\'Utilisateur et la CNIL dans un délai de 72 heures conformément à l\'article 33 du RGPD.',
    ],
  },
  {
    title: '8. Vos droits',
    content: [
      'Conformément au RGPD, vous disposez des droits suivants :',
      'Droit d\'accès : obtenir une copie de vos données personnelles.',
      'Droit de rectification : corriger des données inexactes ou incomplètes.',
      'Droit à l\'effacement : demander la suppression de vos données (« droit à l\'oubli »).',
      'Droit à la limitation : restreindre temporairement le traitement de vos données.',
      'Droit à la portabilité : recevoir vos données dans un format structuré et lisible par machine.',
      'Droit d\'opposition : vous opposer au traitement pour des raisons légitimes.',
      'Ces droits peuvent être exercés depuis votre espace parent ou par email à privacy@controle-parental.fr. Vous pouvez également déposer une réclamation auprès de la CNIL (www.cnil.fr).',
    ],
  },
  {
    title: '9. Cookies',
    content: [
      'La plateforme utilise des cookies strictement nécessaires à son fonctionnement (session d\'authentification, préférences de langue).',
      'Aucun cookie de tracking ou publicitaire n\'est utilisé.',
      'Les cookies de session sont supprimés à la fermeture du navigateur.',
    ],
  },
  {
    title: '10. Transferts hors UE',
    content: [
      'Les données sont hébergées exclusivement sur des serveurs situés dans l\'Union Européenne (France et Irlande).',
      'Aucun transfert de données vers des pays tiers n\'est effectué.',
    ],
  },
]

export function PrivacyPage() {
  return (
    <LegalLayout title="Politique de Confidentialité" lastUpdate="17 juillet 2026">
      {sections.map((section, i) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
        >
          <h2 className="text-xl font-bold text-gray-900">{section.title}</h2>
          <div className="mt-3 space-y-3">
            {section.content.map((paragraph, j) => (
              <p key={j} className="text-sm leading-relaxed text-gray-600">{paragraph}</p>
            ))}
          </div>
        </motion.div>
      ))}
    </LegalLayout>
  )
}
