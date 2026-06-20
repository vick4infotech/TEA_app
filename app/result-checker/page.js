import Image from 'next/image';
import ResultChecker from '@/components/ResultChecker';
import { APP_NAME, CHURCH_NAME } from '@/lib/constants';
export default function Page(){ return <main className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-4"><header className="mx-auto flex max-w-5xl items-center justify-between py-5"><div className="flex items-center gap-3"><Image src="/tea-logo.png" alt={CHURCH_NAME} width={120} height={70}/><div><div className="font-bold text-teaPurple-900">{APP_NAME}</div><div className="text-xs text-gray-500">{CHURCH_NAME}</div></div></div><a href="/login" className="btn-primary">Admin Login</a></header><ResultChecker /></main>; }
