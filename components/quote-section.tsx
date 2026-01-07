import QuoteCalculator from "./quote-calculator"

export default function QuoteSection() {
  return (
    <section id="devis" className="py-24 lg:py-32 bg-cream-dark">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-gold font-medium tracking-[0.2em] uppercase text-sm">Réservation</span>
          <h2 className="mt-4 font-serif text-3xl md:text-4xl lg:text-5xl text-slate">Calculez votre estimation</h2>
          <p className="mt-6 text-taupe text-lg">
            Sélectionnez vos dates et options pour obtenir une estimation instantanée. Le ménage de fin de séjour et la
            taxe de séjour sont inclus.
          </p>
        </div>

        <QuoteCalculator />
      </div>
    </section>
  )
}
