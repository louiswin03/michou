import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

// DELETE - Réinitialiser tout le calendrier (supprimer toutes les personnalisations)
export async function DELETE() {
  try {
    // Récupérer tous les IDs des jours personnalisés (plus léger)
    const ids = await client.fetch<string[]>(
      `*[_type == "dayPricing"]._id`
    )

    if (ids.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Aucun jour à supprimer'
      })
    }

    // Utiliser des transactions par lots pour tout supprimer efficacement
    const BATCH_SIZE = 500
    let deletedCount = 0

    for (let i = 0; i < ids.length; i += BATCH_SIZE) {
      const batch = ids.slice(i, i + BATCH_SIZE)
      const transaction = client.transaction()

      batch.forEach(id => transaction.delete(id))

      await transaction.commit()
      deletedCount += batch.length
    }

    return NextResponse.json({
      success: true,
      message: `${deletedCount} jour(s) supprimé(s)`
    })
  } catch (error) {
    console.error('Error resetting calendar:', error)
    return NextResponse.json(
      { error: 'Failed to reset calendar' },
      { status: 500 }
    )
  }
}
