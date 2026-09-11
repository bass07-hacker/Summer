import Link from 'next/link'
import { AuthForm } from '@/components/auth-form'

export default function SignInPage() {
  return <main className="flex min-h-screen items-center justify-center px-6 py-12"><div className="w-full max-w-md rounded-[2rem] border border-border bg-card p-7 shadow-sm"><Link href="/" className="text-sm font-semibold text-brand">← Back to Summer</Link><h1 className="mt-10 text-3xl font-semibold tracking-tight">Welcome back.</h1><p className="mt-2 text-muted-foreground">Pick up where your next trip left off.</p><div className="mt-8"><AuthForm mode="sign-in" /></div><p className="mt-6 text-center text-sm text-muted-foreground">New to Summer? <Link href="/sign-up" className="font-semibold text-brand">Create an account</Link></p></div></main>
}
