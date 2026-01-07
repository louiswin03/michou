import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

// GET - Récupérer les paramètres de réservation
export async function GET() {
  try {
    const rules = await client.fetch(
      `*[_type == "bookingRules" && _id == "bookingRules"][0]`
    )

    return NextResponse.json({ success: true, rules })
  } catch (error) {
    console.error('Error fetching booking rules:', error)
    return NextResponse.json(
      { error: 'Failed to fetch booking rules' },
      { status: 500 }
    )
  }
}

// POST - Créer ou mettre à jour les paramètres
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { _id, defaultPricePerNight, defaultMinimumNights } = body

    const doc = {
      _type: 'bookingRules',
      defaultPricePerNight: defaultPricePerNight || 150,
      defaultMinimumNights: defaultMinimumNights || 2,
    }

    let result
    if (_id) {
      // Update existing
      result = await client.patch(_id).set(doc).commit()
    } else {
      // Create new with fixed ID
      result = await client.create({
        ...doc,
        _id: 'bookingRules',
      })
    }

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error('Error saving booking rules:', error)
    return NextResponse.json(
      { error: 'Failed to save booking rules' },
      { status: 500 }
    )
  }
}
