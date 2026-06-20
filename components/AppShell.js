import Image from 'next/image';
import Link from 'next/link';
import { NAV_GROUPS, RESOURCE_CONFIG, SPECIAL_PAGE_ROLES, APP_NAME, CHURCH_NAME } from '@/lib/constants';
import { requirePageUser } from '@/lib/auth';

function canSee(user, slug) {
  const roles = RESOURCE_CONFIG[slug]?.roles || SPECIAL_PAGE_ROLES[slug];
  return !roles || roles.includes(user.role);
}

function itemHref(item) {
  if (item.href) return item.href;
  return item.slug === 'dashboard' ? '/dashboard' : `/admin/${item.slug}`;
}

function visibleGroups(user) {
  return NAV_GROUPS.map(group => ({
    ...group,
    items: group.items.filter(item => canSee(user, item.slug))
  })).filter(group => group.items.length > 0);
}

export default async function AppShell({ children, user: suppliedUser }) {
  const user = suppliedUser || await requirePageUser();
  const groups = visibleGroups(user);

  return <div className="min-h-screen bg-[#fbf7ff] lg:flex">
    <aside className="bg-teaPurple-900 text-white lg:fixed lg:inset-y-0 lg:w-72">
      <div className="flex items-center gap-3 border-b border-white/10 p-5">
        <Image src="/tea-logo-compact.png" alt={CHURCH_NAME} width={92} height={50} className="rounded bg-white p-1"/>
        <div>
          <div className="font-bold">{APP_NAME}</div>
          <div className="text-xs text-purple-200">{CHURCH_NAME}</div>
        </div>
      </div>

      <nav className="max-h-[calc(100vh-92px)] space-y-2 overflow-y-auto p-4">
        {groups.map((group, index) => <details key={group.title} open={index < 4} className="group rounded-2xl border border-white/10 bg-white/[0.03]">
          <summary className="flex cursor-pointer list-none items-center justify-between rounded-2xl px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-teaGold-200 hover:bg-white/10">
            <span>{group.title}</span>
            <span className="text-purple-200 transition group-open:rotate-90">›</span>
          </summary>
          <div className="space-y-1 px-2 pb-2">
            {group.items.map((item, itemIndex) => <Link key={`${group.title}-${item.slug}-${item.label}-${itemIndex}`} href={itemHref(item)} className="block rounded-xl px-3 py-2 text-sm font-medium text-purple-100 hover:bg-white/10 hover:text-white">
              {item.label}
            </Link>)}
          </div>
        </details>)}
      </nav>
    </aside>

    <main className="flex-1 lg:ml-72">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-purple-100 bg-white/90 px-5 py-4 backdrop-blur">
        <div>
          <p className="text-xs uppercase tracking-[.25em] text-teaGold-700">{CHURCH_NAME}</p>
          <h1 className="font-bold text-teaPurple-900">{APP_NAME}</h1>
        </div>
        <div className="text-right text-sm">
          <div className="font-semibold">{user.name}</div>
          <div className="text-xs text-gray-500">{user.role.replaceAll('_',' ')}</div>
          <form action="/api/auth/logout" method="post"><button className="mt-1 text-xs font-semibold text-teaPurple-700">Sign out</button></form>
        </div>
      </header>
      <div className="p-4 md:p-8">{children}</div>
    </main>
  </div>;
}
