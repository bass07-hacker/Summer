import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Workspace } from '@/components/workspace'

export default async function WorkspacePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  return <main className="min-h-screen px-6 py-10 lg:px-10"><div className="mx-auto max-w-7xl"><div className="mb-8"><p className="text-sm font-semibold text-brand">Your Summer workspace</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">Plan it together, {session.user.name.split(' ')[0]}.</h1></div><Workspace /></div></main>
}
