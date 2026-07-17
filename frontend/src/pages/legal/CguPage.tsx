import { motion } from 'framer-motion'
import { LegalLayout } from '@/pages/LegalLayout'

const sections = [
  {
    title: '1. Objet',
    content: [
      'Les présentes Conditions Générales d\'Utilisation (CGU) régissent l\'utilisation de la plateforme Contrôle Parental, un service de supervision numérique destiné aux parents pour protéger et accompagner leurs enfants dans leur usage d\'Internet et des appareils connectés.',
      'En créant un compte et en utilisant le service, vous acceptez pleinement et sans réserve les présentes conditions.',
    ],
  },
  {
    title: '2. Définitions',
    content: [
      '« Utilisateur » : toute personne physique disposant d\'un compte parent sur la plateforme.',
      '« Enfant » : toute personne mineure dont l\'activité numérique est supervisée via le service.',
      '« Appareil » : tout terminal (smartphone, tablette, ordinateur) sur lequel le service est installé.',
      '« Service » : l\'ensemble des fonctionnalités proposées par Contrôle Parental, incluant le filtrage, le temps d\'écran, la géolocalisation et les alertes.',
    ],
  },
  {
    title: '3. Inscription et compte',
    content: [
      'L\'inscription est réservée aux personnes majeures disposant de l\'autorité parentale ou d\'une délégation d\'autorité parentale sur l\'enfant concerné.',
      'L\'Utilisateur s\'engage à fournir des informations exactes lors de la création de son compte et à les maintenir à jour.',
      'L\'Utilisateur est responsable de la confidentialité de ses identifiants de connexion et de toute activité effectuée depuis son compte.',
    ],
  },
  {
    title: '4. Utilisation du service',
    content: [
      'Le service est destiné à un usage familial et domestique. L\'Utilisateur s\'engage à ne pas l\'utiliser à des fins commerciales ou de surveillance d\'adultes sans leur consentement.',
      'L\'Utilisateur reconnaît que le service est installé de manière transparente sur l\'appareil de l\'enfant, qui est informé de la présence du logiciel de supervision.',
      'L\'Utilisateur s\'engage à utiliser le service dans le respect des droits de l\'enfant, notamment son droit à la vie privée et son droit à l\'information.',
    ],
  },
  {
    title: '5. Responsabilité',
    content: [
      'Contrôle Parental met tout en œuvre pour assurer la disponibilité et la fiabilité du service, mais ne garantit pas une protection totale contre l\'ensemble des contenus en ligne.',
      'Le filtrage de contenu est basé sur des catégorisations automatisées qui peuvent, dans certains cas, ne pas détecter un contenu inapproprié ou bloquer un contenu légitime.',
      'L\'Utilisateur reste responsable de l\'éducation numérique de ses enfants et ne peut se substituer au dialogue familial par l\'usage exclusif du service.',
    ],
  },
  {
    title: '6. Données personnelles',
    content: [
      'Le traitement des données personnelles est détaillé dans notre Politique de Confidentialité, accessible séparément.',
      'L\'Utilisateur dispose d\'un droit d\'accès, de rectification et de suppression de ses données, exercable à tout moment depuis son espace parent ou par contact direct.',
    ],
  },
  {
    title: '7. Abonnement et facturation',
    content: [
      'Le service propose une formule gratuite et une formule Premium payante. Les tarifs en vigueur sont affichés sur la page de tarification.',
      'L\'abonnement Premium est sans engagement et peut être annulé à tout moment depuis l\'espace parent. L\'annulation prend effet à la fin de la période de facturation en cours.',
      'Un essai gratuit de 14 jours est proposé pour la formule Premium. À l\'issue de l\'essai, l\'abonnement est automatiquement converti en abonnement payant sauf annulation préalable.',
    ],
  },
  {
    title: '8. Résiliation',
    content: [
      'L\'Utilisateur peut résilier son compte à tout moment depuis son espace parent. La résiliation entraîne la suppression de l\'ensemble des données associées dans un délai de 30 jours.',
      'Contrôle Parental se réserve le droit de suspendre ou résilier un compte en cas de non-respect des présentes CGU.',
    ],
  },
  {
    title: '9. Modifications des CGU',
    content: [
      'Contrôle Parental se réserve le droit de modifier les présentes CGU à tout moment. Les Utilisateurs seront informés des modifications par email au moins 15 jours avant leur entrée en vigueur.',
      'L\'utilisation continue du service après l\'entrée en vigueur des modifications vaut acceptation des nouvelles CGU.',
    ],
  },
  {
    title: '10. Droit applicable',
    content: [
      'Les présentes CGU sont régies par le droit français. En cas de litige, les parties s\'engagent à rechercher une solution amiable avant toute action judiciaire.',
      'À défaut d\'accord amiable, les litiges seront portés devant les tribunaux français compétents.',
    ],
  },
]

export function CguPage() {
  return (
    <LegalLayout title="Conditions Générales d'Utilisation" lastUpdate="17 juillet 2026">
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
