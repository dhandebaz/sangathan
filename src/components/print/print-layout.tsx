import { ReactNode } from 'react'

interface PrintLayoutProps {
  title: string
  orgName: string
  meta?: ReactNode
  children: ReactNode
}

export function PrintLayout({ title, orgName, meta, children }: PrintLayoutProps) {
  return (
    <div className="p-8 bg-white min-h-screen text-black font-sans">
      <div className="mb-8 border-b-2 border-black pb-4">
        <div className="flex justify-between items-start">
           <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-1">{orgName}</h2>
              <h1 className="text-3xl font-bold">{title}</h1>
           </div>
           <div className="text-right text-sm text-gray-500">
              {new Date().toLocaleDateString()}
           </div>
        </div>
        {meta && <div className="mt-4 text-sm">{meta}</div>}
      </div>

      <div className="print-content">
        {children}
      </div>

      <div className="mt-12 pt-4 border-t text-xs text-center text-gray-400">
        Generated via Sangathan Platform • {new Date().toLocaleString()}
      </div>

      <style>{`
        @media print {
          @page { margin: 1cm; }
          body { -webkit-print-color-adjust: exact; }
          .print-content table { width: 100%; border-collapse: collapse; }
          .print-content th { border-bottom: 2px solid black; text-align: left; padding: 8px 4px; font-size: 12px; text-transform: uppercase; }
          .print-content td { border-bottom: 1px solid #eee; padding: 8px 4px; font-size: 12px; }
        }
      `}</style>
      
      <script dangerouslySetInnerHTML={{__html: `window.print();`}} />
    </div>
  )
}
