import AppShell from '@/components/AppShell';
import AdminResourcePage from '@/components/AdminResourcePage';
export default function Page({ params }){ return <AppShell><AdminResourcePage resource={params.resource} /></AppShell>; }
