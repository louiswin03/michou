"use client"

import { useState, useEffect } from "react"
import { Calendar, Users, Check, ChevronRight, ChevronLeft, FileText, User, Loader2, Send } from "lucide-react"
import { useSanityAvailability, useSanityQuote } from "@/hooks/useSanityCalendar"
import { toast } from "sonner"
import { type ContractData } from "@/lib/generateContractDoc"

const steps = [
  { id: 1, title: "Séjour", icon: Calendar },
  { id: 2, title: "Vos infos", icon: User },
]

// Fonction pour formater les dates sans décalage de fuseau horaire
const formatDateSafe = (dateStr: string, options?: Intl.DateTimeFormatOptions) => {
  if (!dateStr) return ''
  const parts = dateStr.split('-')
  const year = parseInt(parts[0])
  const month = parseInt(parts[1]) - 1
  const day = parseInt(parts[2])
  return new Date(year, month, day).toLocaleDateString('fr-FR', options)
}

export default function QuoteCalculator() {
  const [currentStep, setCurrentStep] = useState(1)
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [isSending, setIsSending] = useState(false)
  const [requestSent, setRequestSent] = useState(false)

  // Client information
  const [clientFirstName, setClientFirstName] = useState("")
  const [clientLastName, setClientLastName] = useState("")
  const [clientAddress, setClientAddress] = useState("")
  const [clientPhone, setClientPhone] = useState("")
  const [clientEmail, setClientEmail] = useState("")

  // Utiliser Sanity pour vérifier la disponibilité
  const { availability, loading: availabilityLoading } = useSanityAvailability(checkIn, checkOut)

  // Utiliser Sanity pour calculer le devis
  const { quote: sanityQuote, loading: quoteLoading, calculateQuote } = useSanityQuote()

  // Calculer le devis automatiquement quand les données changent
  useEffect(() => {
    if (checkIn && checkOut && adults >= 1) {
      calculateQuote({
        arrival: checkIn,
        departure: checkOut,
        adults,
        children,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkIn, checkOut, adults, children])

  // Adapter le format du devis pour le reste du composant
  const quote = sanityQuote ? {
    nights: sanityQuote.nights,
    baseTotal: sanityQuote.pricing.total,
    basePrice: sanityQuote.pricing.accommodation,
    perNight: Math.round(sanityQuote.pricing.accommodation / sanityQuote.nights),
    cleaningFee: sanityQuote.pricing.cleaningFee || 60,
    touristTax: sanityQuote.pricing.touristTax,
    discount: 0,
    currency: 'EUR',
    loading: quoteLoading,
    depositAmount: sanityQuote.pricing.deposit,
    balanceAmount: sanityQuote.pricing.balance,
    securityDeposit: sanityQuote.pricing.securityDeposit,
    nightsBreakdown: sanityQuote.nightsBreakdown, // Détail nuit par nuit
  } : null

  // Vérifier si les prix sont différents
  const hasDifferentPrices = quote?.nightsBreakdown
    ? new Set(quote.nightsBreakdown.map(n => n.price)).size > 1
    : false

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return (
          checkIn &&
          checkOut &&
          availability &&
          availability.available &&
          quote &&
          quote.nights > 0 &&
          !quoteLoading &&
          !availabilityLoading &&
          adults > 0 && adults + children <= 4
        )
      case 2:
        return (
          clientFirstName.trim() !== "" &&
          clientLastName.trim() !== "" &&
          clientAddress.trim() !== "" &&
          clientPhone.trim() !== "" &&
          clientEmail.trim() !== "" &&
          clientEmail.includes("@")
        )
      default:
        return false
    }
  }

  const handleSendRequest = async () => {
    if (!quote || !checkIn || !checkOut) return

    setIsSending(true)
    const contractData: ContractData = {
      clientFirstName,
      clientLastName,
      clientAddress,
      clientPhone,
      clientEmail,
      checkInDate: new Date(checkIn).toLocaleDateString("fr-FR"),
      checkOutDate: new Date(checkOut).toLocaleDateString("fr-FR"),
      totalPrice: quote.baseTotal,
      depositAmount: quote.depositAmount,
      balanceAmount: quote.balanceAmount,
      contractDate: new Date().toLocaleDateString("fr-FR"),
      nights: quote.nights,
      cleaningFee: quote.cleaningFee,
      touristTax: quote.touristTax,
      adults: adults,
      children: children,
    }

    try {
      const response = await fetch('/api/send-contract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contractData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setRequestSent(true)
      } else {
        throw new Error(data.message || "Erreur lors de l'envoi")
      }
    } catch (error) {
      console.error(error)
      toast.error("Une erreur est survenue lors de l'envoi de la demande.")
    } finally {
      setIsSending(false)
    }
  }

  if (requestSent) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-0">
        <div className="bg-card rounded-3xl shadow-xl p-8 sm:p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h3 className="font-serif text-3xl text-slate mb-4">Demande envoyée !</h3>
          <p className="text-taupe text-lg mb-8">
            Votre demande de réservation a bien été prise en compte. <br />
            Vous recevrez une réponse ainsi que votre contrat de location dans les plus brefs délais.
          </p>
          <div className="p-6 bg-cream rounded-xl border border-border inline-block text-left w-full max-w-md">
            <h4 className="font-serif text-xl text-slate mb-4">Récapitulatif</h4>
            <div className="space-y-2 text-taupe">
              <p><span className="font-medium text-slate">Dates :</span> Du {new Date(checkIn).toLocaleDateString("fr-FR")} au {new Date(checkOut).toLocaleDateString("fr-FR")}</p>
              <p><span className="font-medium text-slate">Voyageurs :</span> {adults} adultes, {children} enfants</p>
              <p><span className="font-medium text-slate">Total estimé :</span> {quote?.baseTotal}€</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-0">
      {/* Progress Steps */}
      <div className="mb-8 sm:mb-12 overflow-x-auto -mx-4 sm:mx-0">
        <div className="flex items-center justify-center min-w-max px-4 sm:px-0">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-shrink-0">
              <button
                onClick={() => {
                  // Allow clicking on current step or previous completed steps
                  if (step.id <= currentStep) {
                    setCurrentStep(step.id)
                  }
                }}
                disabled={step.id > currentStep}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-full transition-all whitespace-nowrap ${currentStep === step.id
                  ? "bg-gold text-cream"
                  : currentStep > step.id
                    ? "bg-gold/20 text-gold cursor-pointer hover:bg-gold/30"
                    : "bg-cream text-taupe opacity-50 cursor-not-allowed"
                  }`}
              >
                <step.icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium">{step.title}</span>
              </button>
              {index < steps.length - 1 && (
                <div className={`w-4 sm:w-12 h-0.5 mx-1 sm:mx-2 flex-shrink-0 ${currentStep > step.id ? "bg-gold" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-card rounded-3xl shadow-xl p-6 sm:p-8 md:p-12">
        {/* Step 1: Dates */}
        {currentStep === 1 && (
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h3 className="font-serif text-xl sm:text-2xl text-slate mb-2">Sélectionnez vos dates</h3>
              <p className="text-taupe text-sm mb-6">Choisissez votre période de séjour (minimum 2 nuits)</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate mb-2">
                    Date d'arrivée
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-2 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-base border-2 border-border rounded-xl focus:border-gold focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate mb-2">
                    Date de départ
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    className="w-full px-2 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-base border-2 border-border rounded-xl focus:border-gold focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Guests Selection (Previously Step 2) */}
            <div className="mt-8 border-t border-border pt-8">
              <h3 className="font-serif text-xl text-slate mb-6">Voyageurs</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-border">
                  <div>
                    <p className="font-medium text-slate">Adultes</p>
                    <p className="text-xs text-taupe">13 ans +</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-cream-dark transition-colors"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-medium text-slate">{adults}</span>
                    <button
                      onClick={() => setAdults(Math.min(4 - children, adults + 1))}
                      className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-cream-dark transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-border">
                  <div>
                    <p className="font-medium text-slate">Enfants</p>
                    <p className="text-xs text-taupe">2-12 ans</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-cream-dark transition-colors"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-medium text-slate">{children}</span>
                    <button
                      onClick={() => setChildren(Math.min(4 - adults, children + 1))}
                      className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-cream-dark transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              {/* Warning about Capacity */}
              {adults + children > 4 && (
                <p className="text-red-500 text-sm mt-2">Maximum 4 personnes autorisées.</p>
              )}
              <p className="text-xs text-taupe mt-2">Capacité stricte : 4 personnes.</p>
            </div>

            {/* Loading state */}
            {checkIn && checkOut && (availabilityLoading || quoteLoading) && (
              <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                  </div>
                  <div>
                    <p className="text-blue-900 font-semibold text-base">Vérification en cours...</p>
                    <p className="text-blue-700 text-sm mt-1">
                      Nous vérifions la disponibilité et calculons votre devis.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Validation messages - Non disponible */}
            {checkIn && checkOut && !availabilityLoading && availability && !availability.available && (
              <div className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-red-900 font-semibold text-base">Dates non disponibles</p>
                    <p className="text-red-700 text-sm mt-1">
                      {availability.reason || 'La période sélectionnée n\'est pas disponible. Veuillez choisir d\'autres dates.'}
                    </p>
                    {availability.minimumNights && (
                      <p className="text-red-600 text-xs mt-2">
                        Séjour minimum requis : {availability.minimumNights} nuit{availability.minimumNights > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Success message - Disponible */}
            {checkIn && checkOut && !availabilityLoading && availability && availability.available && quote && (
              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-green-900 font-semibold text-base mb-1">✓ Dates disponibles !</p>
                    <p className="text-green-700 text-sm mb-4">
                      {quote.nights} nuit{quote.nights > 1 ? "s" : ""} du {formatDateSafe(checkIn, { day: 'numeric', month: 'long' })} au {formatDateSafe(checkOut, { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>

                    {quote.baseTotal > 0 && (
                      <div className="space-y-3 mt-4 pt-4 border-t border-green-200">
                        {/* Détail du prix par nuit */}
                        {hasDifferentPrices && quote.nightsBreakdown ? (
                          <div className="space-y-2">
                            <p className="text-xs text-slate font-semibold mb-2">Détail par nuit :</p>
                            {quote.nightsBreakdown.map((night: any, index: number) => (
                              <div key={index} className="flex items-center justify-between text-xs pl-2">
                                <span className="text-slate">
                                  {formatDateSafe(night.date, { day: 'numeric', month: 'short' })}
                                </span>
                                <span className="text-slate font-medium">{night.price}€</span>
                              </div>
                            ))}
                            <div className="flex items-center justify-between text-sm pt-2 mt-2 border-t border-green-100">
                              <span className="text-slate font-semibold">Sous-total hébergement</span>
                              <span className="text-slate font-medium">{quote.basePrice}€</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate">
                              {quote.nights} nuit{quote.nights > 1 ? "s" : ""} × {quote.perNight}€
                            </span>
                            <span className="text-slate font-medium">{quote.basePrice}€</span>
                          </div>
                        )}

                        {/* Frais de ménage */}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate">Frais de ménage</span>
                          <span className="text-slate font-medium">{quote.cleaningFee}€</span>
                        </div>

                        {/* Taxe de séjour */}
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate">
                            Taxe de séjour ({adults + children} personne{adults + children > 1 ? "s" : ""} × {quote.nights} nuit{quote.nights > 1 ? "s" : ""})
                          </span>
                          <span className="text-slate font-medium">{quote.touristTax.toFixed(2)}€</span>
                        </div>

                        {/* Total */}
                        <div className="pt-3 mt-3 border-t border-green-200">
                          <div className="flex items-center justify-between">
                            <span className="text-slate font-semibold">Prix total</span>
                            <span className="text-gold font-serif font-bold text-2xl">
                              {quote.baseTotal}€
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2 (formerly 3): Client Information */}
        {currentStep === 2 && (
          <div className="space-y-6 sm:space-y-8">
            <h3 className="font-serif text-xl sm:text-2xl text-slate mb-6">Vos coordonnées</h3>
            <p className="text-taupe text-sm mb-6">
              Remplissez vos informations pour envoyer votre demande de réservation et recevoir le contrat.
            </p>
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-taupe mb-2">Nom *</label>
                  <input
                    type="text"
                    value={clientLastName}
                    onChange={(e) => setClientLastName(e.target.value)}
                    placeholder="Dupont"
                    className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 bg-cream"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-taupe mb-2">Prénom *</label>
                  <input
                    type="text"
                    value={clientFirstName}
                    onChange={(e) => setClientFirstName(e.target.value)}
                    placeholder="Jean"
                    className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 bg-cream"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-taupe mb-2">Adresse complète *</label>
                <input
                  type="text"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  placeholder="12 Rue de la Paix, 75000 Paris"
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 bg-cream"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-taupe mb-2">Téléphone *</label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+33 6 12 34 56 78"
                    className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 bg-cream"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-taupe mb-2">Email *</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="jean.dupont@exemple.fr"
                    className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-gold/50 bg-cream"
                  />
                </div>
              </div>
            </div>
          </div>
        )
        }

        {/* Quote Summary */}
        {
          quote && currentStep === 2 && (
            <div className="mt-8 p-6 bg-anthracite rounded-2xl text-white">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white/70">Estimation totale</span>
                <span className="font-serif text-3xl">{quote.baseTotal}€</span>
              </div>
              <div className="text-sm text-white/60 space-y-1">
                {hasDifferentPrices && quote.nightsBreakdown ? (
                  <div className="space-y-1 mb-2">
                    <p className="text-white/80 font-semibold mb-1">Détail par nuit :</p>
                    {quote.nightsBreakdown.map((night: any, index: number) => (
                      <p key={index} className="pl-2 text-xs">
                        {formatDateSafe(night.date, { day: 'numeric', month: 'short' })} : {night.price}€
                      </p>
                    ))}
                  </div>
                ) : (
                  <p>
                    {quote.nights} nuit{quote.nights > 1 ? "s" : ""} × ~{quote.perNight}€/nuit
                  </p>
                )}
                <p>
                  {adults} adulte{adults > 1 ? "s" : ""}
                  {children > 0 ? `, ${children} enfant${children > 1 ? "s" : ""}` : ""}
                </p>
                <p>Frais de ménage : {quote.cleaningFee}€</p>
                <p>Taxe de séjour : {quote.touristTax.toFixed(2)}€</p>
                <p>Jacuzzi privatif inclus gratuitement</p>
                <div className="border-t border-white/20 my-3 pt-3">
                  <p className="text-white/80">Arrhes (30%) : {quote.depositAmount}€</p>
                  <p className="text-white/80">Solde : {quote.balanceAmount}€</p>
                  <p className="text-white/80">Dépôt de garantie : {quote.securityDeposit}€</p>
                </div>
              </div>
            </div>
          )
        }

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep((s) => s - 1)}
              className="flex items-center gap-2 px-6 py-3 text-taupe hover:text-slate transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Retour
            </button>
          ) : (
            <div />
          )}

          {currentStep < 2 ? (
            <button
              onClick={() => setCurrentStep((s) => s + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-8 py-3 bg-gold text-cream rounded-full hover:bg-gold-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continuer
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSendRequest}
              disabled={!canProceed() || isSending}
              className="flex items-center gap-2 px-8 py-3 bg-gold text-cream rounded-full hover:bg-gold-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <>
                  Envoi en cours...
                  <Loader2 className="w-4 h-4 animate-spin" />
                </>
              ) : (
                <>
                  Envoyer la demande
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
