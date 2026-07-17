import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  Clock,
  Eye,
  MapPin,
  Bell,
  BarChart3,
  Smartphone,
  Check,
  ArrowRight,
  Star,
  Quote,
  Heart,
  Lock,
} from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

const features = [
  {
    icon: Eye,
    title: 'Filtrage intelligent',
    description: 'Catégorisation automatique du web selon l\'âge. Bloquez des domaines en un clic.',
    color: 'bg-brand-600',
  },
  {
    icon: Clock,
    title: 'Temps d\'écran',
    description: 'Quotas quotidiens, plages horaires et jours de la semaine personnalisables.',
    color: 'bg-brand-600',
  },
  {
    icon: MapPin,
    title: 'Géolocalisation',
    description: 'Position en temps réel avec zones de sécurité et historique des déplacements.',
    color: 'bg-brand-600',
  },
  {
    icon: Bell,
    title: 'Alertes temps réel',
    description: 'Notifications instantanées pour les comportements à risque ou accès interdits.',
    color: 'bg-brand-600',
  },
  {
    icon: BarChart3,
    title: 'Rapports détaillés',
    description: 'Statistiques hebdomadaires et mensuelles avec score de santé numérique.',
    color: 'bg-brand-600',
  },
  {
    icon: Smartphone,
    title: 'Multi-appareils',
    description: 'iOS, Android, Windows, macOS — un seul tableau de bord pour tout gérer.',
    color: 'bg-brand-600',
  },
]

const testimonials = [
  {
    name: 'Sophie Martin',
    role: 'Mère de 2 enfants',
    content: 'Enfin un outil qui ne espionne pas mais qui éduque. Mes enfants comprennent mieux leurs limites d\'écran.',
    rating: 5,
  },
  {
    name: 'Karim Benali',
    role: 'Père de 3 enfants',
    content: 'Le filtrage est bluffant. Il bloque réellement les sites inappropriés sans tout couper.',
    rating: 5,
  },
  {
    name: 'Laura Dubois',
    role: 'Mère de 1 enfant',
    content: 'La géolocalisation me rassure. Je sais où est ma fille sans avoir à l\'appeler toutes les heures.',
    rating: 5,
  },
]

const plans = [
  {
    name: 'Gratuit',
    price: '0€',
    period: '/mois',
    description: 'Pour découvrir l\'essentiel',
    features: ['1 enfant', '1 appareil', 'Filtrage de base', 'Rapports hebdomadaires'],
    cta: 'Commencer',
    highlighted: false,
  },
  {
    name: 'Premium',
    price: '9,99€',
    period: '/mois',
    description: 'Pour toute la famille',
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
    a: 'L\'application de supervision est visible sur l\'appareil. Nous croyons à une approche transparente et éducative plutôt qu\'à une surveillance cachée.',
  },
  {
    q: 'Quels appareils sont compatibles ?',
    a: 'Notre solution fonctionne sur iOS, Android, Windows et macOS. Vous gérez tous les appareils depuis un seul tableau de bord.',
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

      {/* Hero — light, security-inspired with animated shield */}
      <section className="relative overflow-hidden bg-brand-50">
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Left — copy with staggered animations */}
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="text-4xl font-extrabold leading-[1.05] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl"
              >
                Vos enfants
                <br />
                explorent le web.
                <br />
                <span className="text-brand-600">
                  Vous veillez.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
                className="mt-6 max-w-lg text-lg text-gray-600"
              >
                Bloquez les contenus dangereux, maîtrisez le temps d'écran, suivez la position.
                Et dormez tranquille.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
                className="mt-10 flex flex-col gap-4 sm:flex-row"
              >
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Protéger mes enfants
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Se connecter
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="mt-8 flex items-center gap-6 text-sm text-gray-500"
              >
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-brand-600" />
                  Sans carte
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-brand-600" />
                  Sans engagement
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-brand-600" />
                  RGPD
                </div>
              </motion.div>
            </div>

            {/* Right — animated security shield with orbiting protection icons */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="relative hidden items-center justify-center lg:flex"
            >
              {/* Concentric protection rings */}
              <div className="relative flex h-[420px] w-[420px] items-center justify-center">
                {/* Outer ring — rotating slowly */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border border-brand-200"
                >
                  {/* Orbiting icon: Lock */}
                  <div className="absolute -top-3 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-lg">
                    <Lock className="h-5 w-5 text-brand-600" />
                  </div>
                </motion.div>

                {/* Middle ring — rotating reverse */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-12 rounded-full border border-brand-200"
                >
                  {/* Orbiting icon: Eye */}
                  <div className="absolute -top-3 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-lg">
                    <Eye className="h-5 w-5 text-brand-600" />
                  </div>
                </motion.div>

                {/* Inner ring — rotating faster */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-24 rounded-full border border-brand-200"
                >
                  {/* Orbiting icon: MapPin */}
                  <div className="absolute -top-3 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-lg">
                    <MapPin className="h-5 w-5 text-brand-600" />
                  </div>
                </motion.div>

                {/* Pulsing glow behind shield */}
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.05, 0.15] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute h-40 w-40 rounded-full bg-brand-600 blur-3xl"
                />

                {/* Central shield — pulsing */}
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative flex h-32 w-32 items-center justify-center rounded-3xl border border-brand-600 bg-brand-600 shadow-xl"
                >
                  <ShieldCheck className="h-14 w-14 text-white" strokeWidth={1.5} />
                </motion.div>

                {/* Status text below shield */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                  <div className="flex items-center justify-center gap-2 text-xs font-medium text-brand-600">
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="h-2 w-2 rounded-full bg-brand-600"
                    />
                    Protection active
                  </div>
                  <div className="mt-1 text-[10px] text-gray-500">3 appareils · 2 enfants</div>
                </div>
              </div>

              {/* Floating notification card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute -left-6 top-8 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
                    <Bell className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-900">Site bloqué</div>
                    <div className="text-[10px] text-gray-500">Il y a 12 min · Lucas</div>
                  </div>
                </div>
              </motion.div>

              {/* Floating score card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="absolute -right-6 bottom-12 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-pink-100">
                    <Heart className="h-4 w-4 text-pink-600" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-gray-900">Score 85/100</div>
                    <div className="text-[10px] text-gray-500">Santé numérique</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-b border-gray-100 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
            {[
              { value: '50K+', label: 'Familles protégées' },
              { value: '120K+', label: 'Appareils supervisés' },
              { value: '99.9%', label: 'Disponibilité' },
              { value: '4.9/5', label: 'Note moyenne' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-extrabold text-gray-900">{stat.value}</div>
                <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features — bento grid */}
      <section id="features" className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="brand" className="mb-4">Fonctionnalités</Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Une protection complète, pas juste un bloqueur
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Chaque fonctionnalité est pensée pour éduquer, pas seulement restreindre.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-gray-300 hover:shadow-lg ${
                  i === 0 ? 'sm:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${feature.color} shadow-lg`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{feature.description}</p>
                <div className={`absolute -bottom-12 -right-12 h-32 w-32 rounded-full ${feature.color} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-10`} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase — alternating sections */}
      <section className="bg-brand-50 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl space-y-24 px-4 sm:px-6 lg:px-8">
          {/* Block 1 */}
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-600">
                <Eye className="h-3.5 w-3.5" />
                Filtrage
              </div>
              <h3 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
                Un filtrage qui s'adapte à l'âge, pas un filtre universel
              </h3>
              <p className="mt-4 text-gray-600">
                Notre moteur de catégorisation analyse le contenu en temps réel et ajuste
                automatiquement les restrictions selon le niveau de maturité de votre enfant :
                enfant, pré-ado ou ado.
              </p>
              <ul className="mt-6 space-y-3">
                {['Catégorisation IA en temps réel', 'Bloquage par domaine, mot-clé ou catégorie', 'Liste blanche personnalisée'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100">
                      <Check className="h-3 w-3 text-brand-600" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="space-y-3">
                {[
                  { domain: 'youtube.com', category: 'Vidéo', status: 'Autorisé', color: 'text-green-600' },
                  { domain: 'tiktok.com', category: 'Réseaux sociaux', status: 'Limité 30min/j', color: 'text-amber-600' },
                  { domain: 'site-adulte.com', category: 'Adulte', status: 'Bloqué', color: 'text-red-600' },
                  { domain: 'wikipedia.org', category: 'Éducation', status: 'Autorisé', color: 'text-green-600' },
                ].map((item) => (
                  <div key={item.domain} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.domain}</div>
                      <div className="text-xs text-gray-500">{item.category}</div>
                    </div>
                    <span className={`text-xs font-medium ${item.color}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Block 2 — reversed */}
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="order-2 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:order-1">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Aujourd'hui</span>
                <span className="text-xs text-gray-500">2h 15min utilisées</span>
              </div>
              {/* Time bar */}
              <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                <div className="h-full w-[45%] rounded-full bg-brand-600" />
              </div>
              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>0h</span>
                <span>5h max</span>
              </div>
              {/* Schedule */}
              <div className="mt-6 space-y-2">
                {[
                  { day: 'Lundi', time: '08:00 - 20:00', quota: '2h' },
                  { day: 'Mardi', time: '08:00 - 20:00', quota: '2h' },
                  { day: 'Mercredi', time: '08:00 - 18:00', quota: '1h30' },
                ].map((s) => (
                  <div key={s.day} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-2.5">
                    <span className="text-sm text-gray-900">{s.day}</span>
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>{s.time}</span>
                      <span className="text-brand-600">{s.quota}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-600">
                <Clock className="h-3.5 w-3.5" />
                Temps d'écran
              </div>
              <h3 className="mt-4 text-2xl font-bold text-gray-900 sm:text-3xl">
                Des limites claires, pas des punitions
              </h3>
              <p className="mt-4 text-gray-600">
                Définissez des quotas quotidiens, des plages horaires autorisées et des règles
                différentes pour chaque jour de la semaine. Vos enfants visualisent leur temps
                restant en temps réel.
              </p>
              <ul className="mt-6 space-y-3">
                {['Quotas par jour et par app', 'Plages horaires personnalisables', 'Mode "devoirs" qui bloque les distractions'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-100">
                      <Check className="h-3 w-3 text-brand-600" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="brand" className="mb-4">Témoignages</Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Les parents nous font confiance
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <Quote className="absolute right-6 top-6 h-8 w-8 text-gray-100" />
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-gray-700">"{t.content}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-gray-50 py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="brand" className="mb-4">Tarifs</Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Simple et transparent
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Commencez gratuitement, passez à Premium quand vous voulez.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 lg:mx-auto lg:max-w-4xl lg:grid-cols-2">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative overflow-hidden rounded-2xl border p-8 ${
                  plan.highlighted
                    ? 'border-brand-600 bg-white shadow-xl ring-2 ring-brand-600/20'
                    : 'border-gray-200 bg-white shadow-sm'
                }`}
              >
                {plan.highlighted && (
                  <>
                    <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand-600/5 blur-3xl" />
                    <div className="absolute right-6 top-6">
                      <span className="rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
                        Populaire
                      </span>
                    </div>
                  </>
                )}
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                  <span className="text-sm text-gray-500">{plan.period}</span>
                </div>
                <ul className="mt-8 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-gray-700">
                      <div className={`flex h-5 w-5 items-center justify-center rounded-full ${plan.highlighted ? 'bg-brand-600' : 'bg-gray-200'}`}>
                        <Check className={`h-3 w-3 ${plan.highlighted ? 'text-white' : 'text-gray-600'}`} />
                      </div>
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
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 lg:py-32">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="brand" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Questions fréquentes
            </h2>
          </div>
          <div className="mt-12 space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-2xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-md"
              >
                <h3 className="font-semibold text-gray-900">{faq.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — light with solid brand color */}
      <section className="bg-brand-600 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
            Prêt à protéger vos enfants ?
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Rejoignez plus de 50 000 familles. Configuration en 2 minutes.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/register">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Créer un compte gratuit
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full border-white/30 bg-transparent text-white hover:bg-white/10 sm:w-auto">
                J'ai déjà un compte
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
