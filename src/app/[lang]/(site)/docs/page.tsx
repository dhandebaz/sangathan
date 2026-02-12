import Link from 'next/link'
import { ArrowRight, Book } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ lang: string }>
}

const DOCS_CATEGORIES = [
  {
    title: 'Essentials',
    items: [
       { title: 'Getting Started', slug: 'getting-started' },
       { title: 'Security & Privacy', slug: 'security' },
    ]
  },
  {
    title: 'Core Modules',
    items: [
       { title: 'Managing Members', slug: 'members' },
       { title: 'Public Forms', slug: 'forms' },
       { title: 'Meetings', slug: 'meetings' },
       { title: 'Donations Ledger', slug: 'donations' },
    ]
  },
  {
    title: 'Advanced',
    items: [
       { title: 'Supporter Plan', slug: 'supporter-plan' },
       { title: 'System Admin', slug: 'system-admin' },
    ]
  }
]

export default async function DocsIndex({ params }: PageProps) {
  const { lang } = await params

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
         <h1 className="text-4xl font-bold mb-4">Documentation</h1>
         <p className="text-gray-500 max-w-2xl mx-auto">Everything you need to know about running your organisation on Sangathan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
         {DOCS_CATEGORIES.map((category) => (
            <div key={category.title} className="content-card rounded-xl p-6">
               <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Book className="text-orange-600" size={20} />
                  {category.title}
               </h2>
               <ul className="space-y-3">
                  {category.items.map((item) => (
                     <li key={item.slug}>
                        <Link 
                           href={`/${lang}/docs/${item.slug}`} 
                           className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 group transition-colors"
                        >
                           <span className="font-medium text-gray-700 group-hover:text-black">{item.title}</span>
                           <ArrowRight size={16} className="text-gray-300 group-hover:text-orange-500" />
                        </Link>
                     </li>
                  ))}
               </ul>
            </div>
         ))}
      </div>
    </div>
  )
}
