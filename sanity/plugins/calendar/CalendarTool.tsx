'use client'

import { useEffect, useState } from 'react'
import { Card, Button, Flex, Stack, Text, Dialog, Box, Label, TextInput, Checkbox, Select, Badge } from '@sanity/ui'

interface DayData {
  date: string
  price?: number
  isAvailable: boolean
  comment?: string
  color?: string
  _id?: string
  minimumNights?: number
}

interface PricingRule {
  _id: string
  name: string
  pricePerNight: number
  minimumNights?: number
  isAvailable: boolean
  comment?: string
  color?: string
}

export default function CalendarTool() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [days, setDays] = useState<Map<string, DayData>>(new Map())
  const [selectedDays, setSelectedDays] = useState<Set<string>>(new Set())
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [multiSelectMode, setMultiSelectMode] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [feesOpen, setFeesOpen] = useState(false)
  const [rulesOpen, setRulesOpen] = useState(false)

  // Formulaire
  const [price, setPrice] = useState<number | undefined>()
  const [isAvailable, setIsAvailable] = useState(true)
  const [comment, setComment] = useState('')
  const [minimumNights, setMinimumNights] = useState<number | undefined>()
  const [color, setColor] = useState<string>('none')
  const [rangeStart, setRangeStart] = useState<string | null>(null)

  // Paramètres globaux
  const [defaultPrice, setDefaultPrice] = useState<number>(150)
  const [defaultMinNights, setDefaultMinNights] = useState<number>(2)
  const [cleaningFee, setCleaningFee] = useState<number>(60)
  const [bookingRulesId, setBookingRulesId] = useState<string | null>(null)

  // Règles de prix
  const [pricingRules, setPricingRules] = useState<PricingRule[]>([])
  const [selectedRule, setSelectedRule] = useState<string>('')

  // Formulaire règle
  const [editingRule, setEditingRule] = useState<string | null>(null)
  const [ruleName, setRuleName] = useState('')
  const [rulePrice, setRulePrice] = useState<number>(150)
  const [ruleMinNights, setRuleMinNights] = useState<number | undefined>()
  const [ruleAvailable, setRuleAvailable] = useState(true)
  const [ruleComment, setRuleComment] = useState('')

  useEffect(() => {
    fetchDays()
  }, [currentMonth])

  useEffect(() => {
    fetchSettings()
    fetchPricingRules()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchPricingRules = async () => {
    try {
      const response = await fetch('/api/sanity/pricing-rules')
      const result = await response.json()
      if (result.success && result.rules) {
        setPricingRules(result.rules)
      }
    } catch (error) {
      console.error('Erreur chargement règles:', error)
    }
  }

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/sanity/booking-rules')
      const result = await response.json()
      if (result.success && result.rules) {
        setDefaultPrice(result.rules.defaultPricePerNight || 150)
        setDefaultMinNights(result.rules.defaultMinimumNights || 2)
        setCleaningFee(result.rules.cleaningFee || 60)
        setBookingRulesId(result.rules._id)
      }
    } catch (error) {
      console.error('Erreur chargement paramètres:', error)
    }
  }

  const saveSettings = async () => {
    try {
      const response = await fetch('/api/sanity/booking-rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: bookingRulesId,
          defaultPricePerNight: defaultPrice,
          defaultMinimumNights: defaultMinNights,
          cleaningFee,
        }),
      })
      const result = await response.json()
      if (result.success) {
        alert('Paramètres sauvegardés !')
        setSettingsOpen(false)
      } else {
        alert('Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Erreur sauvegarde paramètres:', error)
      alert('Erreur lors de la sauvegarde')
    }
  }

  const resetCalendar = async () => {
    if (!confirm('⚠️ Êtes-vous sûr de vouloir réinitialiser TOUT le calendrier ? Toutes les personnalisations seront supprimées.')) {
      return
    }

    try {
      const response = await fetch('/api/sanity/days/reset', {
        method: 'DELETE',
      })
      const result = await response.json()
      if (result.success) {
        alert('Calendrier réinitialisé !')
        await fetchDays()
      } else {
        alert('Erreur lors de la réinitialisation')
      }
    } catch (error) {
      console.error('Erreur réinitialisation:', error)
      alert('Erreur lors de la réinitialisation')
    }
  }

  const applyRule = () => {
    if (!selectedRule) {
      alert('Sélectionnez une règle à appliquer')
      return
    }

    const rule = pricingRules.find(r => r._id === selectedRule)
    if (!rule) return

    setPrice(rule.pricePerNight)
    setMinimumNights(rule.minimumNights)
    setIsAvailable(rule.isAvailable)
    setComment(rule.comment || '')
  }

  const openNewRule = () => {
    setEditingRule('new')
    setRuleName('')
    setRulePrice(150)
    setRuleMinNights(undefined)
    setRuleAvailable(true)
    setRuleComment('')
  }

  const openEditRule = (rule: PricingRule) => {
    setEditingRule(rule._id)
    setRuleName(rule.name)
    setRulePrice(rule.pricePerNight)
    setRuleMinNights(rule.minimumNights)
    setRuleAvailable(rule.isAvailable)
    setRuleComment(rule.comment || '')
  }

  const saveRule = async () => {
    if (!ruleName.trim()) {
      alert('Le nom de la règle est requis')
      return
    }

    try {
      const response = await fetch('/api/sanity/pricing-rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: editingRule === 'new' ? undefined : editingRule,
          name: ruleName,
          pricePerNight: rulePrice,
          minimumNights: ruleMinNights,
          isAvailable: ruleAvailable,
          comment: ruleComment,
        }),
      })
      const result = await response.json()
      if (result.success) {
        await fetchPricingRules()
        setEditingRule(null)
        alert('Règle sauvegardée !')
      } else {
        alert('Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Erreur sauvegarde règle:', error)
      alert('Erreur lors de la sauvegarde')
    }
  }

  const deleteRule = async (ruleId: string) => {
    if (!confirm('Supprimer cette règle ?')) return

    try {
      const response = await fetch(`/api/sanity/pricing-rules?id=${ruleId}`, {
        method: 'DELETE',
      })
      const result = await response.json()
      if (result.success) {
        await fetchPricingRules()
        alert('Règle supprimée !')
      } else {
        alert('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Erreur suppression règle:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const fetchDays = async () => {
    try {
      setLoading(true)
      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
      const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

      const start = startOfMonth.toISOString().split('T')[0]
      const end = endOfMonth.toISOString().split('T')[0]

      const response = await fetch(`/api/sanity/days?start=${start}&end=${end}`)
      const result = await response.json()

      if (result.success) {
        const daysMap = new Map<string, DayData>()
        result.days.forEach((day: any) => {
          daysMap.set(day.date, {
            date: day.date,
            price: day.pricePerNight,
            isAvailable: day.isAvailable,
            comment: day.comment,
            color: day.highlightColor,
            _id: day._id,
            minimumNights: day.minimumNights,
          })
        })
        setDays(daysMap)
      }
    } catch (error) {
      console.error('Erreur chargement jours:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDayClick = (dateStr: string) => {
    if (multiSelectMode) {
      // Mode sélection par intervalle (2 clics)
      if (!rangeStart) {
        // Premier clic : définir le début de l'intervalle
        setRangeStart(dateStr)
        const newSelected = new Set<string>()
        newSelected.add(dateStr)
        setSelectedDays(newSelected)
      } else {
        // Deuxième clic : sélectionner tous les jours entre les deux
        // Parser les dates sans timezone
        const startParts = rangeStart.split('-')
        const endParts = dateStr.split('-')

        const start = new Date(parseInt(startParts[0]), parseInt(startParts[1]) - 1, parseInt(startParts[2]))
        const end = new Date(parseInt(endParts[0]), parseInt(endParts[1]) - 1, parseInt(endParts[2]))

        // S'assurer que start <= end
        const [startDate, endDate] = start <= end ? [start, end] : [end, start]

        const newSelected = new Set<string>()
        let currentDate = new Date(startDate)

        while (currentDate <= endDate) {
          const year = currentDate.getFullYear()
          const month = String(currentDate.getMonth() + 1).padStart(2, '0')
          const day = String(currentDate.getDate()).padStart(2, '0')
          newSelected.add(`${year}-${month}-${day}`)
          currentDate.setDate(currentDate.getDate() + 1)
        }

        setSelectedDays(newSelected)
        setRangeStart(null) // Reset pour la prochaine sélection
      }
    } else {
      // Mode simple - éditer un jour
      const newSelected = new Set<string>()
      newSelected.add(dateStr)
      setSelectedDays(newSelected)

      const dayData = days.get(dateStr)

      if (dayData) {
        setPrice(dayData.price)
        setIsAvailable(dayData.isAvailable)
        setComment(dayData.comment || '')
        setColor(dayData.color || 'none')
        setMinimumNights(dayData.minimumNights)
      } else {
        setPrice(undefined)
        setIsAvailable(true)
        setComment('')
        setColor('none')
        setMinimumNights(undefined)
      }

      setSelectedRule('')
      setDialogOpen(true)
    }
  }

  const handleOpenMultiEdit = () => {
    if (selectedDays.size === 0) {
      alert('Sélectionnez au moins un jour')
      return
    }

    // Réinitialiser le formulaire
    setPrice(undefined)
    setIsAvailable(true)
    setComment('')
    setColor('none')
    setMinimumNights(undefined)
    setSelectedRule('')

    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (selectedDays.size === 0) return

    try {
      const daysToSave = Array.from(selectedDays).map(dateStr => {
        const dayData = days.get(dateStr)
        return {
          _id: dayData?._id,
          date: dateStr,
          // Préserver le prix existant si aucun nouveau prix n'est spécifié
          pricePerNight: price !== undefined ? price : dayData?.price,
          minimumNights: minimumNights !== undefined ? minimumNights : dayData?.minimumNights,
          isAvailable,
          comment,
          highlightColor: color,
        }
      })

      const response = await fetch('/api/sanity/days', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days: daysToSave }),
      })

      const result = await response.json()

      if (result.success) {
        await fetchDays()
        setDialogOpen(false)
        setSelectedDays(new Set())
        setMultiSelectMode(false)
        setRangeStart(null)
      } else {
        alert('Erreur lors de la sauvegarde')
      }
    } catch (error) {
      console.error('Erreur sauvegarde:', error)
      alert('Erreur lors de la sauvegarde')
    }
  }

  const handleDelete = async () => {
    if (selectedDays.size === 0) return

    const daysWithIds = Array.from(selectedDays)
      .map(dateStr => days.get(dateStr))
      .filter(day => day?._id)

    if (daysWithIds.length === 0) {
      alert('Aucun jour à supprimer')
      return
    }

    if (confirm(`Supprimer ${daysWithIds.length} jour(s) ?`)) {
      try {
        const idsToDelete = daysWithIds.map(d => d?._id).filter(Boolean).join(',')

        if (idsToDelete) {
          await fetch(`/api/sanity/days?ids=${idsToDelete}`, { method: 'DELETE' })
        }

        await fetchDays()
        setDialogOpen(false)
        setSelectedDays(new Set())
        setMultiSelectMode(false)
        setRangeStart(null)
      } catch (error) {
        console.error('Erreur suppression:', error)
      }
    }
  }

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const daysArray: Date[] = []

    // Jours précédents pour compléter la semaine
    const firstDayOfWeek = firstDay.getDay()
    const startPadding = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

    for (let i = startPadding; i > 0; i--) {
      const date = new Date(year, month, 1 - i)
      daysArray.push(date)
    }

    // Jours du mois
    for (let i = 1; i <= lastDay.getDate(); i++) {
      daysArray.push(new Date(year, month, i))
    }

    // Jours suivants pour compléter
    const endPadding = 7 - (daysArray.length % 7)
    if (endPadding < 7) {
      for (let i = 1; i <= endPadding; i++) {
        daysArray.push(new Date(year, month + 1, i))
      }
    }

    return daysArray
  }

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const getDayColor = (dateStr: string, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return '#f0f0f0'

    const dayData = days.get(dateStr)
    if (!dayData) return '#ffffff'

    // Rouge clair uniquement si indisponible
    if (!dayData.isAvailable) return '#fee2e2'

    // Couleurs personnalisées (jours fériés etc)
    if (dayData.color && dayData.color !== 'none') {
      const colors: Record<string, string> = {
        green: '#dcfce7',
        yellow: '#fef9c3',
        orange: '#ffedd5',
        red: '#fee2e2',
        blue: '#dbeafe',
        purple: '#f3e8ff',
      }
      return colors[dayData.color] || '#ffffff'
    }

    return '#ffffff'
  }

  const getDayEmoji = (dateStr: string) => {
    const dayData = days.get(dateStr)
    if (!dayData) return ''

    // Afficher 🔒 uniquement si indisponible
    if (!dayData.isAvailable) return '🔒'

    return ''
  }

  const monthName = currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })

  return (
    <Card padding={4}>
      <Stack space={4}>
        {/* Header amélioré */}
        <Card padding={4} radius={3} shadow={2} tone="transparent" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <Flex justify="space-between" align="center">
            <Button text="←" onClick={previousMonth} mode="ghost" style={{ color: 'white' }} />
            <Text size={4} weight="bold" style={{ textTransform: 'capitalize', color: 'white', textAlign: 'center' }}>
              📅 {monthName}
            </Text>
            <Button text="→" onClick={nextMonth} mode="ghost" style={{ color: 'white' }} />
          </Flex>
        </Card>

        {/* Multi-select controls et boutons */}
        <Card padding={3} radius={2} shadow={1}>
          <Flex gap={3} align="center" wrap="wrap" justify="space-between">
            <Flex gap={3} align="center" wrap="wrap">
              <Button
                text={multiSelectMode ? '✓ Mode sélection par intervalle' : 'Sélectionner plusieurs jours'}
                tone={multiSelectMode ? 'primary' : 'default'}
                onClick={() => {
                  setMultiSelectMode(!multiSelectMode)
                  setSelectedDays(new Set())
                  setRangeStart(null)
                }}
              />
              {selectedDays.size > 0 && (
                <>
                  <Badge tone="primary">{selectedDays.size} jour(s) sélectionné(s)</Badge>
                  <Button
                    text="Modifier la sélection"
                    tone="positive"
                    onClick={handleOpenMultiEdit}
                  />
                  <Button
                    text="Annuler"
                    mode="ghost"
                    onClick={() => {
                      setSelectedDays(new Set())
                      setMultiSelectMode(false)
                      setRangeStart(null)
                    }}
                  />
                </>
              )}
            </Flex>
            <Flex gap={2}>
              <Button text="🧹 Frais" onClick={() => setFeesOpen(true)} mode="ghost" tone="default" />
              <Button text="📋 Règles" onClick={() => setRulesOpen(true)} mode="ghost" tone="positive" />
              <Button text="⚙️ Config" onClick={() => setSettingsOpen(true)} mode="ghost" tone="primary" />
            </Flex>
          </Flex>
          {multiSelectMode && rangeStart && (
            <Box paddingTop={3}>
              <Badge tone="primary" padding={2}>
                📍 1er jour sélectionné : {new Date(rangeStart).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - Cliquez maintenant sur le dernier jour de l'intervalle
              </Badge>
            </Box>
          )}
        </Card>

        {/* Calendrier amélioré */}
        <Card padding={4} radius={3} shadow={2}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
            {/* Jours de la semaine */}
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
              <Box key={day} padding={2} style={{
                backgroundColor: '#f1f5f9',
                borderRadius: '6px'
              }}>
                <Text size={1} weight="bold" align="center" style={{
                  color: '#1e293b'
                }}>{day}</Text>
              </Box>
            ))}

            {/* Jours */}
            {getDaysInMonth().map((date, index) => {
              // Formater la date sans timezone pour éviter les décalages
              const year = date.getFullYear()
              const month = String(date.getMonth() + 1).padStart(2, '0')
              const day = String(date.getDate()).padStart(2, '0')
              const dateStr = `${year}-${month}-${day}`

              const today = new Date()
              const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

              const isCurrentMonth = date.getMonth() === currentMonth.getMonth()
              const isToday = dateStr === todayStr
              const dayData = days.get(dateStr)
              const isSelected = selectedDays.has(dateStr)

              return (
                <Card
                  key={index}
                  padding={3}
                  radius={2}
                  shadow={isCurrentMonth ? 1 : 0}
                  style={{
                    backgroundColor: getDayColor(dateStr, isCurrentMonth),
                    border: isSelected ? '3px solid #3b82f6' : isToday ? '3px solid #10b981' : '1px solid #e2e8f0',
                    cursor: isCurrentMonth ? 'pointer' : 'default',
                    opacity: isCurrentMonth ? 1 : 0.4,
                    minHeight: '110px',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    boxShadow: isCurrentMonth && !isSelected ? '0 1px 3px rgba(0,0,0,0.12)' : undefined,
                  }}
                  onClick={() => isCurrentMonth && handleDayClick(dateStr)}
                  onMouseEnter={(e) => {
                    if (isCurrentMonth && !isSelected) {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (isCurrentMonth && !isSelected) {
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }
                  }}
                >
                  {isSelected && (
                    <div style={{
                      position: 'absolute',
                      top: 2,
                      right: 2,
                      backgroundColor: '#3b82f6',
                      color: 'white',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                    }}>
                      ✓
                    </div>
                  )}
                  <Stack space={3}>
                    <Flex justify="space-between" align="center">
                      <Text size={1} weight="bold" style={{
                        color: isToday ? '#10b981' : '#1e293b',
                        fontSize: isToday ? '16px' : '14px'
                      }}>
                        {date.getDate()}
                      </Text>
                      {getDayEmoji(dateStr) && (
                        <span style={{ fontSize: '16px' }}>{getDayEmoji(dateStr)}</span>
                      )}
                    </Flex>
                    {isCurrentMonth && dayData?.isAvailable !== false && (
                      <Stack space={2}>
                        <Text size={1} weight="bold" style={{
                          color: '#059669',
                          fontSize: '14px',
                          marginTop: '4px'
                        }}>
                          {dayData?.price || defaultPrice}€
                        </Text>
                        <Text size={0} style={{
                          fontSize: '11px',
                          color: '#64748b'
                        }}>
                          {dayData?.minimumNights || defaultMinNights} nuits min
                        </Text>
                        {dayData?.comment && (
                          <Text size={0} style={{
                            fontSize: '11px',
                            color: '#334155',
                            fontWeight: '500',
                            fontStyle: 'italic',
                            marginTop: '3px'
                          }}>
                            {dayData.comment.substring(0, 12)}
                            {dayData.comment.length > 12 ? '...' : ''}
                          </Text>
                        )}
                      </Stack>
                    )}
                  </Stack>
                </Card>
              )
            })}
          </div>
        </Card>

        {/* Légende */}
        <Card padding={3} radius={2} shadow={1} tone="transparent">
          <Stack space={3}>
            <Text size={1} weight="semibold" style={{ color: '#64748b' }}>Légende :</Text>
            <Flex gap={4} wrap="wrap" align="center">
              <Flex gap={2} align="center">
                <div style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: '#ffffff',
                  border: '2px solid #e2e8f0',
                  borderRadius: '4px'
                }} />
                <Text size={1}>Disponible</Text>
              </Flex>
              <Flex gap={2} align="center">
                <div style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: '#fee2e2',
                  border: '2px solid #fecaca',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px'
                }}>🔒</div>
                <Text size={1}>Indisponible</Text>
              </Flex>
              <Flex gap={2} align="center">
                <div style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: '#ffffff',
                  border: '3px solid #10b981',
                  borderRadius: '4px'
                }} />
                <Text size={1}>Aujourd'hui</Text>
              </Flex>
              <Flex gap={2} align="center">
                <div style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: '#ffffff',
                  border: '3px solid #3b82f6',
                  borderRadius: '4px'
                }} />
                <Text size={1}>Sélectionné</Text>
              </Flex>
            </Flex>
          </Stack>
        </Card>

        {/* Dialog */}
        {dialogOpen && selectedDays.size > 0 && (
          <Dialog
            id="day-dialog"
            header={selectedDays.size === 1
              ? `📅 ${new Date(Array.from(selectedDays)[0]).toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}`
              : `📅 Modifier ${selectedDays.size} jours`
            }
            onClose={() => {
              setDialogOpen(false)
              if (!multiSelectMode) setSelectedDays(new Set())
            }}
            width={1}
          >
            <Box padding={4}>
              <Stack space={4}>
                {/* Sélecteur de règles */}
                {pricingRules.length > 0 && (
                  <Card padding={3} radius={2} shadow={1} tone="primary">
                    <Stack space={3}>
                      <Label>⚡ Appliquer une règle rapide</Label>
                      <Flex gap={2}>
                        <Box flex={1}>
                          <Select
                            value={selectedRule}
                            onChange={(e) => setSelectedRule(e.currentTarget.value)}
                          >
                            <option value="">-- Choisir une règle --</option>
                            {pricingRules.map(rule => (
                              <option key={rule._id} value={rule._id}>
                                {rule.name} - {rule.pricePerNight}€/nuit
                              </option>
                            ))}
                          </Select>
                        </Box>
                        <Button
                          text="Appliquer"
                          tone="primary"
                          onClick={applyRule}
                          disabled={!selectedRule}
                        />
                      </Flex>
                      <Text size={1} muted>
                        Ou remplissez manuellement ci-dessous
                      </Text>
                    </Stack>
                  </Card>
                )}

                <Card padding={3} radius={2} tone="transparent" style={{ border: '1px solid #e2e8f0' }}>
                  <Stack space={4}>
                    <Stack space={3}>
                      <Label>💶 Prix par nuit (€)</Label>
                      <TextInput
                        type="number"
                        value={price || ''}
                        onChange={(e) => setPrice(e.currentTarget.value ? Number(e.currentTarget.value) : undefined)}
                        placeholder={`Défaut: ${defaultPrice}€`}
                      />
                      <Text size={0} muted style={{ marginTop: '-8px' }}>
                        💡 Laisser vide pour conserver le prix existant ou utiliser le prix par défaut
                      </Text>
                    </Stack>

                    <Stack space={3}>
                      <Label>🌙 Nuits minimum</Label>
                      <TextInput
                        type="number"
                        value={minimumNights || ''}
                        onChange={(e) => setMinimumNights(e.currentTarget.value ? Number(e.currentTarget.value) : undefined)}
                        placeholder={`Défaut: ${defaultMinNights} nuits`}
                      />
                      <Text size={0} muted style={{ marginTop: '-8px' }}>
                        💡 Laisser vide pour conserver le minimum existant ou utiliser le minimum par défaut
                      </Text>
                    </Stack>

                    <Card padding={3} radius={2} tone={isAvailable ? 'positive' : 'caution'}>
                      <Flex align="center" gap={2}>
                        <Checkbox
                          checked={isAvailable}
                          onChange={(e) => setIsAvailable(e.currentTarget.checked)}
                        />
                        <Label>{isAvailable ? '✅ Disponible à la réservation' : '🔒 Indisponible'}</Label>
                      </Flex>
                      <Text size={0} muted style={{ marginTop: '8px', marginLeft: '28px' }}>
                        {isAvailable
                          ? 'Les clients peuvent réserver ce jour'
                          : '⚠️ Le prix sera conservé même si indisponible'}
                      </Text>
                    </Card>

                    <Stack space={3}>
                      <Label>Couleur (Jours Fériés / Vacances)</Label>
                      <Select
                        value={color}
                        onChange={(e) => setColor(e.currentTarget.value)}
                      >
                        <option value="none">Aucune</option>
                        <option value="orange">Orange (Jours Fériés)</option>
                        <option value="blue">Bleu (Vacances)</option>
                      </Select>
                    </Stack>

                    <Stack space={3}>
                      <Label>💬 Commentaire interne</Label>
                      <TextInput
                        value={comment}
                        onChange={(e) => setComment(e.currentTarget.value)}
                        placeholder="Ex: Maintenance, Réservation privée..."
                      />
                    </Stack>
                  </Stack>
                </Card>

                <Flex gap={2} justify="space-between">
                  <Button
                    text={`Supprimer ${selectedDays.size > 1 ? `(${selectedDays.size})` : ''}`}
                    tone="critical"
                    onClick={handleDelete}
                  />
                  <Flex gap={2}>
                    <Button text="Annuler" mode="ghost" onClick={() => {
                      setDialogOpen(false)
                      if (!multiSelectMode) setSelectedDays(new Set())
                    }} />
                    <Button
                      text={`💾 Enregistrer ${selectedDays.size > 1 ? `(${selectedDays.size})` : ''}`}
                      tone="primary"
                      onClick={handleSave}
                    />
                  </Flex>
                </Flex>
              </Stack>
            </Box>
          </Dialog>
        )}

        {/* Dialog Frais de Ménage */}
        {feesOpen && (
          <Dialog
            id="fees-dialog"
            header="🧹 Frais de Ménage"
            onClose={() => setFeesOpen(false)}
            width={1}
          >
            <Box padding={4}>
              <Stack space={4}>
                <Text size={1} muted>
                  Modifiez ici les frais de ménage appliqués à chaque séjour.
                </Text>

                <Stack space={3}>
                  <Label>Montant des frais (€)</Label>
                  <TextInput
                    type="number"
                    value={cleaningFee}
                    onChange={(e) => setCleaningFee(Number(e.currentTarget.value))}
                    placeholder="60"
                  />
                </Stack>

                <Flex gap={2} justify="flex-end">
                  <Button text="Annuler" mode="ghost" onClick={() => setFeesOpen(false)} />
                  <Button
                    text="💾 Enregistrer"
                    tone="primary"
                    onClick={() => {
                      saveSettings()
                      setFeesOpen(false)
                    }}
                  />
                </Flex>
              </Stack>
            </Box>
          </Dialog>
        )}

        {/* Dialog Paramètres */}
        {settingsOpen && (
          <Dialog
            id="settings-dialog"
            header="⚙️ Paramètres Globaux"
            onClose={() => setSettingsOpen(false)}
            width={1}
          >
            <Box padding={4}>
              <Stack space={4}>
                <Text size={1} muted>
                  Ces paramètres sont utilisés par défaut lorsqu'aucun prix spécifique n'est défini pour un jour.
                </Text>

                <Stack space={3}>
                  <Label>💶 Prix par nuit par défaut (€)</Label>
                  <TextInput
                    type="number"
                    value={defaultPrice}
                    onChange={(e) => setDefaultPrice(Number(e.currentTarget.value))}
                    placeholder="150"
                  />
                </Stack>

                <Stack space={3}>
                  <Label>🌙 Nombre de nuits minimum par défaut</Label>
                  <TextInput
                    type="number"
                    value={defaultMinNights}
                    onChange={(e) => setDefaultMinNights(Number(e.currentTarget.value))}
                    placeholder="2"
                  />
                </Stack>

                <Box paddingTop={4} style={{ borderTop: '1px solid #e5e7eb' }}>
                  <Stack space={3}>
                    <Label style={{ color: '#dc2626' }}>⚠️ Zone dangereuse</Label>
                    <Text size={1} muted>
                      Cette action supprime toutes les personnalisations du calendrier et réinitialise tous les jours aux valeurs par défaut.
                    </Text>
                    <Button
                      text="🗑️ Réinitialiser tout le calendrier"
                      tone="critical"
                      onClick={resetCalendar}
                    />
                  </Stack>
                </Box>

                <Flex gap={2} justify="flex-end">
                  <Button text="Annuler" mode="ghost" onClick={() => setSettingsOpen(false)} />
                  <Button
                    text="💾 Enregistrer"
                    tone="primary"
                    onClick={saveSettings}
                  />
                </Flex>
              </Stack>
            </Box>
          </Dialog>
        )}

        {/* Dialog Règles de prix */}
        {rulesOpen && (
          <Dialog
            id="rules-dialog"
            header="📋 Règles de Prix"
            onClose={() => {
              setRulesOpen(false)
              setEditingRule(null)
            }}
            width={2}
          >
            <Box padding={4}>
              <Stack space={4}>
                {/* Liste des règles */}
                {editingRule === null && (
                  <>
                    <Flex justify="space-between" align="center">
                      <Text size={2} weight="semibold">Règles existantes</Text>
                      <Button
                        text="➕ Nouvelle règle"
                        tone="primary"
                        onClick={openNewRule}
                      />
                    </Flex>

                    {pricingRules.length === 0 ? (
                      <Card padding={4} tone="transparent">
                        <Text size={1} muted align="center">
                          Aucune règle créée. Créez votre première règle pour gagner du temps !
                        </Text>
                      </Card>
                    ) : (
                      <Stack space={3}>
                        {pricingRules.map(rule => (
                          <Card key={rule._id} padding={3} radius={2} shadow={1}>
                            <Flex justify="space-between" align="center">
                              <Stack space={2}>
                                <Text weight="semibold">{rule.name}</Text>
                                <Flex gap={3}>
                                  <Text size={1}>💶 {rule.pricePerNight}€/nuit</Text>
                                  {rule.minimumNights && (
                                    <Text size={1}>🌙 {rule.minimumNights} nuits min</Text>
                                  )}
                                  <Text size={1}>{rule.isAvailable ? '✅ Dispo' : '🔒 Bloqué'}</Text>
                                </Flex>
                                {rule.comment && (
                                  <Text size={1} muted>{rule.comment}</Text>
                                )}
                              </Stack>
                              <Flex gap={2}>
                                <Button
                                  text="✏️"
                                  mode="ghost"
                                  onClick={() => openEditRule(rule)}
                                />
                                <Button
                                  text="🗑️"
                                  mode="ghost"
                                  tone="critical"
                                  onClick={() => deleteRule(rule._id)}
                                />
                              </Flex>
                            </Flex>
                          </Card>
                        ))}
                      </Stack>
                    )}
                  </>
                )}

                {/* Formulaire création/édition */}
                {editingRule !== null && (
                  <Stack space={4}>
                    <Flex justify="space-between" align="center">
                      <Text size={2} weight="semibold">
                        {editingRule === 'new' ? 'Nouvelle règle' : 'Modifier la règle'}
                      </Text>
                      <Button
                        text="← Retour"
                        mode="ghost"
                        onClick={() => setEditingRule(null)}
                      />
                    </Flex>

                    <Stack space={3}>
                      <Label>📛 Nom de la règle *</Label>
                      <TextInput
                        value={ruleName}
                        onChange={(e) => setRuleName(e.currentTarget.value)}
                        placeholder="Ex: Week-end, Haute saison..."
                      />
                    </Stack>

                    <Stack space={3}>
                      <Label>💶 Prix par nuit (€) *</Label>
                      <TextInput
                        type="number"
                        value={rulePrice}
                        onChange={(e) => setRulePrice(Number(e.currentTarget.value))}
                      />
                    </Stack>

                    <Stack space={3}>
                      <Label>🌙 Nuits minimum</Label>
                      <TextInput
                        type="number"
                        value={ruleMinNights || ''}
                        onChange={(e) => setRuleMinNights(e.currentTarget.value ? Number(e.currentTarget.value) : undefined)}
                        placeholder="Optionnel"
                      />
                    </Stack>

                    <Stack space={3}>
                      <Flex align="center" gap={2}>
                        <Checkbox
                          checked={ruleAvailable}
                          onChange={(e) => setRuleAvailable(e.currentTarget.checked)}
                        />
                        <Label>✅ Disponible à la réservation</Label>
                      </Flex>
                    </Stack>

                    <Stack space={3}>
                      <Label>💬 Commentaire</Label>
                      <TextInput
                        value={ruleComment}
                        onChange={(e) => setRuleComment(e.currentTarget.value)}
                        placeholder="Notes internes..."
                      />
                    </Stack>

                    <Flex gap={2} justify="flex-end">
                      <Button
                        text="Annuler"
                        mode="ghost"
                        onClick={() => setEditingRule(null)}
                      />
                      <Button
                        text="💾 Enregistrer"
                        tone="primary"
                        onClick={saveRule}
                      />
                    </Flex>
                  </Stack>
                )}
              </Stack>
            </Box>
          </Dialog>
        )}
      </Stack>
    </Card>
  )
}
