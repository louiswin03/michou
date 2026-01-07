import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

// GET - Récupérer les jours d'un mois
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const start = searchParams.get('start')
    const end = searchParams.get('end')

    if (!start || !end) {
      return NextResponse.json(
        { error: 'start and end dates required' },
        { status: 400 }
      )
    }

    const allDays = await client.fetch(
      `*[_type == "dayPricing" && date >= $start && date <= $end] | order(_updatedAt desc)`,
      { start, end }
    )

    // Dédupliquer : garder seulement la version la plus récente de chaque date
    const daysMap = new Map()
    for (const day of allDays) {
      if (!daysMap.has(day.date)) {
        daysMap.set(day.date, day)
      }
    }

    const days = Array.from(daysMap.values())

    return NextResponse.json({ success: true, days })
  } catch (error) {
    console.error('Error fetching days:', error)
    return NextResponse.json(
      { error: 'Failed to fetch days' },
      { status: 500 }
    )
  }
}

// POST - Créer ou mettre à jour un ou plusieurs jours
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { days } = body // Array de jours à créer/modifier

    if (!Array.isArray(days) || days.length === 0) {
      return NextResponse.json(
        { error: 'days array required' },
        { status: 400 }
      )
    }

    // Récupérer toutes les dates concernées
    const dates = days.map((d: any) => d.date)

    // 1. Trouver tous les documents existants pour ces dates (en une seule requête)
    const existingDocs = await client.fetch(
      `*[_type == "dayPricing" && date in $dates]`,
      { dates }
    )

    // 2. Préparer la transaction
    const transaction = client.transaction()

    // 3. Supprimer les documents existants
    existingDocs.forEach((doc: any) => {
      transaction.delete(doc._id)
    })

    // 4. Créer les nouveaux documents
    days.forEach((dayData: any) => {
      const { date, pricePerNight, minimumNights, isAvailable, comment, highlightColor, blockReason } = dayData

      const doc = {
        _type: 'dayPricing',
        date,
        pricePerNight: pricePerNight || undefined,
        minimumNights: minimumNights || undefined,
        isAvailable: isAvailable !== undefined ? isAvailable : true,
        comment: comment || undefined,
        highlightColor: highlightColor || 'none',
        blockReason: blockReason || undefined,
      }

      transaction.create(doc)
    })

    // 5. Exécuter la transaction
    const result = await transaction.commit()

    return NextResponse.json({ success: true, count: days.length, transactionId: result.transactionId })
  } catch (error) {
    console.error('Error saving days:', error)
    return NextResponse.json(
      { error: 'Failed to save days' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un ou plusieurs jours
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const ids = searchParams.get('ids') // Support pour suppression multiple

    if (!id && !ids) {
      return NextResponse.json(
        { error: 'id or ids required' },
        { status: 400 }
      )
    }

    const transaction = client.transaction()

    if (ids) {
      const idsList = ids.split(',')
      idsList.forEach(idToDelete => {
        if (idToDelete) transaction.delete(idToDelete)
      })
    } else if (id) {
      transaction.delete(id)
    }

    await transaction.commit()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting day:', error)
    return NextResponse.json(
      { error: 'Failed to delete day' },
      { status: 500 }
    )
  }
}
