import Link from 'next/link'
import { Metadata } from 'next'
import { ArrowRight, BookOpen, CheckCircle2, CircleHelp, ClipboardList, ShieldCheck, Users } from 'lucide-react'
import { docsConfig } from '@/lib/docs-config'
import { DocsSearch } from '@/components/docs/docs-search'

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params
  const isHindi = lang === 'hi'
  return {
    title: isHindi ? 'दस्तावेज़ | संगठन' : 'Documentation | Sangathan',
    description: isHindi
      ? 'संगठन को स्थापित करने, चलाने और सुरक्षित रूप से बढ़ाने के लिए पूर्ण मार्गदर्शिका।'
      : 'Complete handbook for setting up, running, and safely scaling organisations on Sangathan.',
  }
}

const rolePaths = [
  {
    title: 'Organisation administrator',
    description: 'Set up the organisation, roles, security, and governance.',
    href: 'getting-started',
    icon: ShieldCheck,
  },
  {
    title: 'Coordinator or operator',
    description: 'Run members, forms, meetings, donations, and everyday work.',
    href: 'members',
    icon: ClipboardList,
  },
  {
    title: 'Member or volunteer',
    description: 'Understand participation, meetings, access, and common questions.',
    href: 'faq',
    icon: Users,
  },
]

const commonTasks = [
  { label: 'Create and verify an organisation', href: 'getting-started' },
  { label: 'Add, approve, or update members', href: 'members' },
  { label: 'Build and publish a form', href: 'forms' },
  { label: 'Record meetings and minutes', href: 'meetings' },
  { label: 'Record and review donations', href: 'donations' },
  { label: 'Fix login, permission, or data issues', href: 'troubleshooting' },
]

export default async function DocsIndex({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const searchItems = docsConfig.flatMap((category) =>
    category.items.map((item) => ({
      title: item.title.en,
      category: category.title.en,
      slug: item.slug,
    })),
  )

  return (
    <div className="max-w-5xl">
      <section className="border-b border-slate-200 pb-10">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-orange-700">Sangathan handbook</p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">Find an answer and keep moving.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Practical guidance for setting up, operating, governing, and troubleshooting Sangathan without waiting for customer support.
          </p>
        </div>
        <div className="mt-8 max-w-3xl">
          <DocsSearch lang={lang} items={searchItems} />
          <p className="mt-3 text-sm text-slate-600">Search by task, feature, role, or problem.</p>
        </div>
      </section>

      <section className="py-10" aria-labelledby="quick-start-heading">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="quick-start-heading" className="text-2xl font-bold text-slate-950">New to Sangathan?</h2>
            <p className="mt-2 text-slate-600">Use this order to reach a working organisation quickly.</p>
          </div>
          <Link href={`/${lang}/docs/getting-started`} className="inline-flex min-h-11 items-center gap-2 font-semibold text-orange-700 hover:text-orange-800">
            Open quickstart <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <ol className="mt-6 grid gap-0 overflow-hidden rounded-xl border border-slate-200 bg-white md:grid-cols-3">
          {[
            ['1', 'Create and verify', 'Create the account, verify access, and select your organisation.'],
            ['2', 'Set roles and members', 'Define responsibilities before importing or inviting people.'],
            ['3', 'Run one real workflow', 'Publish a form, record a meeting, or create your first member process.'],
          ].map(([number, title, description], index) => (
            <li key={number} className={`p-5 ${index > 0 ? 'border-t border-slate-200 md:border-l md:border-t-0' : ''}`}>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-sm font-bold text-orange-800">{number}</span>
              <h3 className="mt-4 font-bold text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-slate-200 py-10" aria-labelledby="role-heading">
        <h2 id="role-heading" className="text-2xl font-bold text-slate-950">Start from your role</h2>
        <p className="mt-2 text-slate-600">Go directly to the material that matches your responsibilities.</p>
        <div className="mt-6 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
          {rolePaths.map(({ title, description, href, icon: Icon }) => (
            <Link key={title} href={`/${lang}/docs/${href}`} className="group flex min-h-20 items-center gap-4 px-4 py-4 hover:bg-orange-50 sm:px-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 group-hover:bg-orange-100 group-hover:text-orange-800">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-bold text-slate-950">{title}</span>
                <span className="mt-1 block text-sm text-slate-600">{description}</span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 text-slate-400 group-hover:text-orange-700" />
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-8 border-t border-slate-200 py-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <h2 className="text-2xl font-bold text-slate-950">Common tasks</h2>
          <p className="mt-2 text-slate-600">Direct instructions for the work people do most often.</p>
          <ul className="mt-5 space-y-2">
            {commonTasks.map((task) => (
              <li key={task.href}>
                <Link href={`/${lang}/docs/${task.href}`} className="flex min-h-11 items-center gap-3 rounded-lg px-2 font-semibold text-slate-700 hover:bg-orange-50 hover:text-orange-800">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-orange-700" />
                  {task.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-950">Browse every module</h2>
          <p className="mt-2 text-slate-600">The complete operating manual, grouped by responsibility.</p>
          <div className="mt-5 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
            {docsConfig.map((category) => (
              <div key={category.title.en} className="p-5">
                <div className="flex items-center gap-3">
                  {category.icon ? <category.icon className="h-5 w-5 text-orange-700" /> : <BookOpen className="h-5 w-5 text-orange-700" />}
                  <h3 className="font-bold text-slate-950">{category.title.en}</h3>
                </div>
                <ul className="mt-3 grid gap-1 sm:grid-cols-2">
                  {category.items.map((item) => (
                    <li key={item.slug}>
                      <Link href={`/${lang}/docs/${item.slug}`} className="flex min-h-10 items-center rounded-md px-2 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-orange-800">
                        {item.title.en}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-4 flex flex-col gap-5 rounded-xl border border-orange-200 bg-orange-50 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-4">
          <CircleHelp className="mt-0.5 h-6 w-6 shrink-0 text-orange-800" />
          <div>
            <h2 className="text-lg font-bold text-slate-950">Something is not working?</h2>
            <p className="mt-1 text-sm leading-6 text-slate-700">The troubleshooting guide covers login, permissions, missing data, forms, and common operational errors.</p>
          </div>
        </div>
        <Link href={`/${lang}/docs/troubleshooting`} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-orange-700 px-4 font-semibold text-white hover:bg-orange-800">
          Troubleshoot <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </div>
  )
}
