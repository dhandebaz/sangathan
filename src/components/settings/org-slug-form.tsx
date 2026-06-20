'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { updateOrganisationSlug } from '@/actions/organisation/settings'
import { toast } from 'sonner'
import { AlertTriangle } from 'lucide-react'

const slugSchema = z.object({
  slug: z.string()
    .min(3, 'Slug must be at least 3 characters')
    .max(50, 'Slug must be at most 50 characters')
    .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and dashes allowed'),
  confirmation: z.string().regex(/^CHANGE$/, 'Please type CHANGE to confirm'),
})

type SlugFormValues = z.infer<typeof slugSchema>

interface OrgSlugFormProps {
  currentSlug: string
  lang: string
}

export function OrgSlugForm({ currentSlug, lang }: OrgSlugFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<SlugFormValues>({
    resolver: zodResolver(slugSchema),
    defaultValues: {
      slug: currentSlug,
      confirmation: '',
    },
  })

  async function onSubmit(data: SlugFormValues) {
    if (data.slug === currentSlug) {
      toast.error('No changes', {
        description: 'The new slug is the same as the current one.',
      })
      return
    }

    setIsLoading(true)

    const res = await updateOrganisationSlug({ slug: data.slug })

    setIsLoading(false)

    if (res.success) {
      toast.success('Slug Updated', {
        description: 'Your organisation slug has been successfully changed.',
      })
      form.reset({ slug: data.slug, confirmation: '' })
      // Optionally redirect to the new URL if we were on the public page, 
      // but we are in settings so it's fine.
    } else {
      toast.error('Failed to update slug', {
        description: res.error || 'Something went wrong.',
      })
      form.setError('slug', { message: res.error })
    }
  }

  const { formState: { errors } } = form

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 space-y-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
        <div>
          <h2 className="text-sm font-semibold text-red-700 uppercase tracking-wide">Danger Zone: Change Public Slug</h2>
          <p className="text-sm text-red-700 mt-1">
            Changing your slug will instantly break any existing links to your public page, events, and forms. 
            <strong> This action cannot be undone and old links will not redirect.</strong>
          </p>
        </div>
      </div>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-red-800">New Slug (Public URL Path)</label>
          <div className="flex items-center">
            <span className="bg-red-100 border border-r-0 border-red-200 text-red-700 px-3 py-2 rounded-l-md text-sm">
              sangathan.space/{lang}/org/
            </span>
            <input
              {...form.register('slug')}
              className="flex-1 border border-red-200 rounded-r-md px-3 py-2 text-sm focus:ring-red-500 focus:border-red-500"
              placeholder="my-org-slug"
            />
          </div>
          {errors.slug && <p className="text-xs text-red-600 font-medium">{errors.slug.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-red-800">Confirmation</label>
          <input
            {...form.register('confirmation')}
            className="w-full border border-red-200 rounded-md px-3 py-2 text-sm focus:ring-red-500 focus:border-red-500"
            placeholder="Type CHANGE to confirm"
          />
          {errors.confirmation && <p className="text-xs text-red-600 font-medium">{errors.confirmation.message}</p>}
        </div>

        <Button type="submit" variant="destructive" disabled={isLoading} className="w-full">
          {isLoading ? 'Updating...' : 'Change Organisation Slug'}
        </Button>
      </form>
    </div>
  )
}
