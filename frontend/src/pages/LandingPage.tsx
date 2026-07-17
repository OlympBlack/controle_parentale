import { Link } from 'react-router-dom'
import {
  Shield,
  Clock,
  Eye,
  MapPin,
  Bell,
  BarChart3,
  Smartphone,
  Globe,
  Check,
  ArrowRight,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

const features = [
  {
    icon: Eye,
    title: 'Filtrage de contenu',
    description: 'Bloquez les sites inappropriés et catégorisez automatiquement le contenu selon l\'âge de votre enfant.',
  },
  {
    icon: Clock,
    title: 'Temps d\'écran',
    description: 'Définissez des limites quotidiennes et des plages horaires pour un usage équilibré des appareils.',
  },
  {
    icon: MapPin,
    title: 'Géolocalisation',
    description: 'Suivez la position de votre enfant en temps réel et recevez des alertes de zone.',
  },
  {
    icon: Bell,
    title: 'Alertes intelligentes',
    description: 'Soyez notifié instantanément en cas de comportement à risque ou de tentative d\'accès interdit.',
  },
  {
    icon: BarChart3,
    title: 'Rapports détaillés',
    description: 'Visualisez l\'activité numérique de votre enfant avec des statistiques hebdomadaires et mensuelles.',
  },
  {
    icon: Smartphone,
    title: 'Multi-appareils',
    description: 'Gérez smartphones, tablettes et ordinateurs depuis une seule interface unifiée.',
  },
]

const plans = [
  {
    name: 'Gratuit',
    price: '0€',
    period: '/mois',
    description: 'Pour découvrir les fonctionnalités essentielles',
    features: ['1 enfant', '1 appareil', 'Filtrage de base', 'Rapports hebdomadaires'],
    cta: 'Commencer',
    highlighted: false,
  },
  {
    name: 'Premium',
    price: '9,99€',
    period: '/mois',
    description: 'Pour une protection complète de toute la famille',
    features: [
      'Enfants illimités',
      'Appareils illimités',
      'Filtrage avancé',
      'Géolocalisation temps réel',
      'Alertes intelligentes',
      'Rapports détaillés',
      'Support prioritaire',
    ],
    cta: 'Essai gratuit 14 jours',
    highlighted: true,
  },
]

const faqs = [
  {
    q: 'Comment fonctionne le filtrage de contenu ?',
    a: 'Notre système analyse automatiquement les sites web et applications consultés par votre enfant et les catégorise selon des critères d\'âge. Vous pouvez aussi bloquer manuellement des domaines spécifiques.',
  },
  {
    q: 'Mes enfants sauront-ils qu\'ils sont surveillés ?',
    a: 'L\'application de supervision est installée sur l\'appareil de l\'enfant et visible. Nous croyons à une approche transparente et éducative plutôt qu\'à une surveillance cachée.',
  },
  {
    q: 'Quels appareils sont compatibles ?',
    a: 'Notre solution fonctionne sur iOS, Android, Windows et macOS. Vous pouvez gérer tous les appareils depuis un seul tableau de bord.',
  },
  {
    q: 'Puis-je annuler à tout moment ?',
    a: 'Oui, vous pouvez annuler votre abonnement à tout moment depuis votre espace parent. Aucun engagement n\'est requis.',
  },
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="brand" className="mb-6">
              <Shield className="mr-1 h-3 w-3" />
              Protection numérique pour vos enfants
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Gardez vos enfants{' '}
              <span className="bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">
                en sécurité
              </span>{' '}
              dans le monde numérique
            </h1>
            <p className="mt-6 text-lg text-gray-600 sm:text-xl">
              Supervisez le temps d'écran, filtrez les contenus inappropriés, suivez la localisation
              et recevez des alertes intelligentes — le tout depuis une seule interface.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Démarrer l'essai gratuit
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Se connecter
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Aucune carte requise · Annulez à tout moment
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Tout ce dont vous avez besoin
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Une suite complète d'outils pour accompagner vos enfants dans leur usage du numérique.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="p-6 transition-shadow hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100">
                  <feature.icon className="h-6 w-6 text-brand-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
            {[
              { value: '50K+', label: 'Familles protégées' },
              { value: '120K+', label: 'Appareils supervisés' },
              { value: '99.9%', label: 'Disponibilité' },
              { value: '24/7', label: 'Support' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-white sm:text-4xl">{stat.value}</div>
                <div className="mt-2 text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Des tarifs simples</h2>
            <p className="mt-4 text-lg text-gray-600">
              Choisissez la formule adaptée à votre famille.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:mx-auto lg:max-w-4xl">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`p-8 ${plan.highlighted ? 'border-brand-600 ring-2 ring-brand-600' : ''}`}
              >
                {plan.highlighted && (
                  <Badge variant="brand" className="mb-4">Le plus populaire</Badge>
                )}
                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-sm text-gray-500">{plan.period}</span>
                </div>
                <ul className="mt-8 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-gray-700">
                      <Check className="h-4 w-4 flex-shrink-0 text-green-600" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className="mt-8 block">
                  <Button
                    variant={plan.highlighted ? 'primary' : 'outline'}
                    className="w-full"
                    size="lg"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-gray-50 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Questions fréquentes</h2>
          </div>
          <div className="mt-12 space-y-6">
            {faqs.map((faq) => (
              <Card key={faq.q} className="p-6">
                <h3 className="font-semibold text-gray-900">{faq.q}</h3>
                <p className="mt-2 text-sm text-gray-600">{faq.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-brand-600 to-accent-600 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Globe className="mx-auto h-12 w-12 text-white" />
          <h2 className="mt-6 text-3xl font-bold text-white sm:text-4xl">
            Prêt à protéger vos enfants ?
          </h2>
          <p className="mt-4 text-lg text-brand-100">
            Rejoignez des milliers de familles qui font confiance à Contrôle Parental.
          </p>
          <Link to="/register" className="mt-8 inline-block">
            <Button size="lg" variant="secondary">
              Créer un compte gratuit
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
