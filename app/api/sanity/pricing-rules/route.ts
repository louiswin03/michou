import { NextResponse } from 'next/server'
import { client } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

// GET - Récupérer toutes les règles de prix
export async function GET() {
  try {
    const rules = await client.fetch(
      `*[_type == "pricingRule"] | order(name asc)`
    )

    return NextResponse.json({ success: true, rules })
  } catch (error) {
    console.error('Error fetching pricing rules:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pricing rules' },
      { status: 500 }
    )
  }
}

// POST - Créer ou mettre à jour une règle
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { _id, name, pricePerNight, minimumNights, isAvailable, comment } = body

    if (!name || !pricePerNight) {
      return NextResponse.json(
        { error: 'name and pricePerNight are required' },
        { status: 400 }
      )
    }

    const doc = {
      _type: 'pricingRule',
      name,
      pricePerNight,
      minimumNights: minimumNights || undefined,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      comment: comment || undefined,
    }

    let result
    if (_id) {
      // Update existing
      result = await client.patch(_id).set(doc).commit()
    } else {
      // Create new
      result = await client.create(doc)
    }

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error('Error saving pricing rule:', error)
    return NextResponse.json(
      { error: 'Failed to save pricing rule' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une règle
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'id required' },
        { status: 400 }
      )
    }

    await client.delete(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting pricing rule:', error)
    return NextResponse.json(
      { error: 'Failed to delete pricing rule' },
      { status: 500 }
    )
  }
}
