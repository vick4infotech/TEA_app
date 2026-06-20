import Image from 'next/image';
import { APP_NAME, CHURCH_NAME } from '@/lib/constants';

export default function AuthShell({ children }) {
  return <main className="min-h-screen bg-gradient-to-br from-teaPurple-900 via-teaPurple-800 to-teaPurple-700 p-4">
    <section className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl items-center gap-8 md:grid-cols-2">
      <div className="text-white">
        <div className="mb-8 inline-flex rounded-3xl bg-white p-5 shadow-soft"><Image src="/tea-logo.png" alt="The Edifying Assembly" width={210} height={120} priority /></div>
        <h1 className="text-4xl font-bold tracking-tight md:text-6xl">{APP_NAME}</h1>
        <p className="mt-4 max-w-xl text-lg text-purple-100">{CHURCH_NAME}</p>
      </div>
      <div>{children}</div>
    </section>
  </main>;
}
