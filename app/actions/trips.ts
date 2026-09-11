'use server'

import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { trips, tripExpenses, tripMembers, destinations, tripActivity } from '@/lib/db/schema'
import { and, desc, eq, sql } from 'drizzle-orm'

async function userId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function getTripData() {
  const id = await userId()
  const ownTrips = await db.select().from(trips).where(eq(trips.userId, id)).orderBy(desc(trips.createdAt))
  const trip = ownTrips[0]
  if (!trip) return { trips: [], expenses: [], members: [], places: [], activity: [] }
  const [expenses, members, places, activity] = await Promise.all([
    db.select().from(tripExpenses).where(and(eq(tripExpenses.userId, id), eq(tripExpenses.tripId, trip.id))).orderBy(desc(tripExpenses.createdAt)),
    db.select().from(tripMembers).where(and(eq(tripMembers.userId, id), eq(tripMembers.tripId, trip.id))),
    db.select().from(destinations).where(and(eq(destinations.userId, id), eq(destinations.tripId, trip.id))),
    db.select().from(tripActivity).where(and(eq(tripActivity.userId, id), eq(tripActivity.tripId, trip.id))).orderBy(desc(tripActivity.createdAt)),
  ])
  return { trips: ownTrips, expenses, members, places, activity }
}

export async function createTrip(form: { name: string; destination: string; budget: number }) {
  const id = await userId(); const tripId = crypto.randomUUID()
  await db.insert(trips).values({ id: tripId, userId: id, name: form.name.trim(), destination: form.destination.trim(), budget: String(Math.max(0, form.budget)) })
  await db.insert(tripActivity).values({ id: crypto.randomUUID(), userId: id, tripId, message: `Created ${form.name.trim()}` })
  revalidatePath('/workspace'); return tripId
}

export async function addExpense(form: { tripId: string; label: string; amount: number; category: string; payer: string }) {
  const id = await userId(); const amount = Number(form.amount)
  if (!form.label.trim() || !Number.isFinite(amount) || amount <= 0) throw new Error('Invalid expense')
  await db.insert(tripExpenses).values({ id: crypto.randomUUID(), userId: id, tripId: form.tripId, label: form.label.trim(), amount: String(amount), category: form.category, payer: form.payer.trim() })
  await db.insert(tripActivity).values({ id: crypto.randomUUID(), userId: id, tripId: form.tripId, message: `Added ${form.label.trim()} to the budget` })
  revalidatePath('/workspace')
}

export async function addMember(form: { tripId: string; name: string; email: string }) {
  const id = await userId()
  await db.insert(tripMembers).values({ id: crypto.randomUUID(), userId: id, tripId: form.tripId, name: form.name.trim(), email: form.email.trim() })
  revalidatePath('/workspace')
}

export async function savePlace(form: { tripId: string; name: string; city: string; note?: string }) {
  const id = await userId()
  await db.insert(destinations).values({ id: crypto.randomUUID(), userId: id, tripId: form.tripId, name: form.name.trim(), city: form.city.trim(), note: form.note?.trim() })
  revalidatePath('/workspace')
}

export async function seedFirstTrip() {
  const id = await userId(); const existing = await db.select({ id: trips.id }).from(trips).where(eq(trips.userId, id)).limit(1)
  if (existing.length) return
  await createTrip({ name: 'Dakar, slowly.', destination: 'Senegal · Aug 15–22', budget: 6000 })
}

void sql
