import { createClient } from '@/lib/supabase/server'
import { getSelectedOrganisationId } from '@/lib/auth/context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DollarSign, ArrowUpRight, ArrowDownLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function FinancialsPage() {
  const supabase = await createClient()
  const orgId = await getSelectedOrganisationId()

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('organisation_id', orgId)
    .order('created_at', { ascending: false })

  const income = transactions?.filter(t => t.type === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0) || 0
  const expenses = transactions?.filter(t => t.type === 'expense').reduce((acc, curr) => acc + Number(curr.amount), 0) || 0

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financial Ledger</h1>
        <p className="text-muted-foreground mt-1">Track income and expenses for your organisation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800 uppercase">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">₹{income.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-800 uppercase">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">₹{expenses.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Net Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(income - expenses).toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions?.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${t.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {t.type === 'income' ? <ArrowUpRight size={20} /> : <ArrowDownLeft size={20} />}
                  </div>
                  <div>
                    <div className="font-semibold">{t.description || t.category}</div>
                    <div className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleDateString()} • {t.category}</div>
                  </div>
                </div>
                <div className={`font-bold ${t.type === 'income' ? 'text-green-700' : 'text-red-700'}`}>
                  {t.type === 'income' ? '+' : '-'} ₹{Number(t.amount).toLocaleString()}
                </div>
              </div>
            ))}
            {(!transactions || transactions.length === 0) && (
              <div className="text-center py-12 text-muted-foreground italic border-2 border-dashed rounded-lg">
                No transactions recorded yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
