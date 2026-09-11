import { boolean, date, numeric, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const user = pgTable('user', { id: text('id').primaryKey(), name: text('name').notNull(), email: text('email').notNull().unique(), emailVerified: boolean('emailVerified').notNull().default(false), image: text('image'), createdAt: timestamp('createdAt').notNull().defaultNow(), updatedAt: timestamp('updatedAt').notNull().defaultNow() })
export const session = pgTable('session', { id: text('id').primaryKey(), expiresAt: timestamp('expiresAt').notNull(), token: text('token').notNull().unique(), createdAt: timestamp('createdAt').notNull(), updatedAt: timestamp('updatedAt').notNull(), ipAddress: text('ipAddress'), userAgent: text('userAgent'), userId: text('userId').notNull() })
export const account = pgTable('account', { id: text('id').primaryKey(), accountId: text('accountId').notNull(), providerId: text('providerId').notNull(), userId: text('userId').notNull(), accessToken: text('accessToken'), refreshToken: text('refreshToken'), idToken: text('idToken'), accessTokenExpiresAt: timestamp('accessTokenExpiresAt'), refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'), scope: text('scope'), password: text('password'), createdAt: timestamp('createdAt').notNull(), updatedAt: timestamp('updatedAt').notNull() })
export const verification = pgTable('verification', { id: text('id').primaryKey(), identifier: text('identifier').notNull(), value: text('value').notNull(), expiresAt: timestamp('expiresAt').notNull(), createdAt: timestamp('createdAt'), updatedAt: timestamp('updatedAt') })
export const trips = pgTable('trips', { id: text('id').primaryKey(), userId: text('userId').notNull(), name: text('name').notNull(), destination: text('destination').notNull(), startDate: date('startDate'), endDate: date('endDate'), budget: numeric('budget').notNull().default('0'), status: text('status').notNull().default('planning'), createdAt: timestamp('created_at').notNull().defaultNow(), updatedAt: timestamp('updated_at').notNull().defaultNow() })
export const tripMembers = pgTable('trip_members', { id: text('id').primaryKey(), userId: text('userId').notNull(), tripId: text('tripId').notNull(), name: text('name').notNull(), email: text('email').notNull(), role: text('role').notNull().default('traveler'), createdAt: timestamp('created_at').notNull().defaultNow() })
export const tripExpenses = pgTable('trip_expenses', { id: text('id').primaryKey(), userId: text('userId').notNull(), tripId: text('tripId').notNull(), label: text('label').notNull(), amount: numeric('amount').notNull(), category: text('category').notNull().default('other'), payer: text('payer').notNull(), createdAt: timestamp('created_at').notNull().defaultNow() })
export const destinations = pgTable('destinations', { id: text('id').primaryKey(), userId: text('userId').notNull(), tripId: text('tripId').notNull(), name: text('name').notNull(), city: text('city').notNull(), note: text('note'), saved: boolean('saved').notNull().default(true), createdAt: timestamp('created_at').notNull().defaultNow() })
export const tripActivity = pgTable('trip_activity', { id: text('id').primaryKey(), userId: text('userId').notNull(), tripId: text('tripId').notNull(), message: text('message').notNull(), createdAt: timestamp('created_at').notNull().defaultNow() })

export type Trip = typeof trips.$inferSelect
export type Expense = typeof tripExpenses.$inferSelect
export type Member = typeof tripMembers.$inferSelect
export type Destination = typeof destinations.$inferSelect
export type Activity = typeof tripActivity.$inferSelect

export const summerTables = { trips, tripMembers, tripExpenses, destinations, tripActivity }
