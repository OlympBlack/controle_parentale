import { motion } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export function LegalLayout({ title, lastUpdate, children }: { title: string; lastUpdate: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="bg-brand-50 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 text-sm text-gray-500"
          >
            Dernière mise à jour : {lastUpdate}
          </motion.p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </section>

      <Footer />
    </div>
  )
}
