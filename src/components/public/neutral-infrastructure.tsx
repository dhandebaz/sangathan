'use client'

import { useState } from 'react'
import { ShieldCheck, Lock } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type FeatureKey =
  | 'isolation'
  | 'audit'
  | 'roles'
  | 'risk'
  | 'appeals'

type Feature = {
  key: FeatureKey
  title: string
  subtitle: string
  description: string
}

const features: Feature[] = [
  {
    key: 'isolation',
    title: 'Cryptographic Data Isolation',
    subtitle: 'Each organisation is sealed from the others.',
    description:
      'Every organisation lives in a logically isolated slice of the database. Row-Level Security and per-org scoping ensure that one organisation cannot see or query the data of another. Access to sensitive data always passes through audited, permission-aware paths.',
  },
  {
    key: 'audit',
    title: 'Immutable Audit Logging',
    subtitle: 'Decisions and changes leave a permanent trail.',
    description:
      'Key actions such as role changes, membership approvals, and critical configuration updates are designed to be logged immutably. This makes it possible to reconstruct “who did what, when” and to hold real people accountable for governance decisions.',
  },
  {
    key: 'roles',
    title: 'Granular Role Permissions',
    subtitle: 'Power is delegated intentionally, not by accident.',
    description:
      'Sangathan distinguishes between viewers, members, volunteers, core teams, editors, and admins. Each role is mapped to precise capabilities so sensitive actions such as mass messaging or membership edits are never available to everyone by default.',
  },
  {
    key: 'risk',
    title: 'Automated Risk Detection',
    subtitle: 'The system watches for abusive patterns.',
    description:
      'Behind the scenes, risk signals such as suspicious OTP patterns, unusual broadcast volume, or rapid role escalations can be surfaced to administrators. This reduces response time for abuse while keeping day-to-day operations smooth for legitimate organisers.',
  },
  {
    key: 'appeals',
    title: 'Transparent Appeals System',
    subtitle: 'Interventions are reviewable and reversible.',
    description:
      'When platform-level interventions are required, they are tied to explicit reasons and logged actions. Organisations have space to contest decisions, and administrators can review the same audit trail that automated systems used to flag the issue.',
  },
]

export function NeutralInfrastructureFeatures() {
  const [activeKey, setActiveKey] = useState<FeatureKey | null>(null)

  const activeFeature = activeKey ? features.find((f) => f.key === activeKey) ?? null : null

  return (
    <Dialog open={!!activeFeature} onOpenChange={(open) => (!open ? setActiveKey(null) : null)}>
      <ul className="space-y-4">
        {features.map((feature) => (
          <li key={feature.key} className="flex gap-3 items-center text-[var(--text-primary)]">
            <button
              type="button"
              onClick={() => setActiveKey(feature.key)}
              className="flex items-center gap-3 text-left w-full group"
            >
              <ShieldCheck
                size={20}
                className="text-[var(--accent)] group-hover:scale-110 group-hover:drop-shadow-sm transition-transform"
              />
              <span className="underline-offset-4 group-hover:underline">
                {feature.title}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {activeFeature && (
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck size={20} className="text-[var(--accent)]" />
              <span>{activeFeature.title}</span>
            </DialogTitle>
            <DialogDescription className="mt-2 text-[var(--text-secondary)]">
              {activeFeature.subtitle}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4 text-sm text-[var(--text-primary)]">
            <p>{activeFeature.description}</p>
            <div className="flex items-center gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-secondary)]/60 px-3 py-2">
              <Lock size={18} className="text-[var(--success)]" />
              <span className="text-xs font-medium text-[var(--text-secondary)]">
                Designed for governance, not advertising or data resale.
              </span>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  )
}
