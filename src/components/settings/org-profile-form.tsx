'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { updateOrganisationProfile } from '@/actions/organisation/settings'
import { toast } from 'sonner'

const profileSchema = z.object({
  description: z.string().max(2000, 'Description too long').optional().nullable(),
  contact_email: z.string().email('Invalid email').optional().or(z.literal('')).nullable(),
  contact_phone: z.string().max(20, 'Phone too long').optional().nullable(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')).nullable(),
  address: z.string().max(500, 'Address too long').optional().nullable(),
  social_twitter: z.string().url('Invalid URL').optional().or(z.literal('')).nullable(),
  social_instagram: z.string().url('Invalid URL').optional().or(z.literal('')).nullable(),
  social_facebook: z.string().url('Invalid URL').optional().or(z.literal('')).nullable(),
  social_linkedin: z.string().url('Invalid URL').optional().or(z.literal('')).nullable(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

interface OrgProfileFormProps {
  initialData: {
    description?: string | null
    contact_email?: string | null
    contact_phone?: string | null
    website?: string | null
    address?: string | null
    social_links?: Record<string, string> | null
  }
}

export function OrgProfileForm({ initialData }: OrgProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      description: initialData.description || '',
      contact_email: initialData.contact_email || '',
      contact_phone: initialData.contact_phone || '',
      website: initialData.website || '',
      address: initialData.address || '',
      social_twitter: initialData.social_links?.twitter || '',
      social_instagram: initialData.social_links?.instagram || '',
      social_facebook: initialData.social_links?.facebook || '',
      social_linkedin: initialData.social_links?.linkedin || '',
    },
  })

  async function onSubmit(data: ProfileFormValues) {
    setIsLoading(true)
    
    // Process social links into a JSONB structure
    const social_links: Record<string, string> = {}
    if (data.social_twitter) social_links.twitter = data.social_twitter
    if (data.social_instagram) social_links.instagram = data.social_instagram
    if (data.social_facebook) social_links.facebook = data.social_facebook
    if (data.social_linkedin) social_links.linkedin = data.social_linkedin

    const payload = {
      description: data.description || undefined,
      contact_email: data.contact_email || undefined,
      contact_phone: data.contact_phone || undefined,
      website: data.website || undefined,
      address: data.address || undefined,
      social_links,
    }

    try {
      const res = await updateOrganisationProfile(payload)
      setIsLoading(false)

      if (res.success) {
        toast.success('Profile updated', {
          description: 'Your organisation profile has been successfully updated.',
        })
      } else {
        toast.error('Failed to update profile', {
          description: res.error || 'Something went wrong.',
        })
      }
    } catch (error) {
      setIsLoading(false)
      toast.error('Error', {
        description: 'Failed to update profile. Please try again.',
      })
    }
  }

  const { formState: { errors } } = form

  return (
    <div className="bg-white border rounded-lg shadow-sm p-6 space-y-4">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Public Profile Information</h2>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">About Us / Description</label>
          <textarea
            {...form.register('description')}
            className="w-full border rounded-md px-3 py-2 text-sm min-h-[120px]"
            placeholder="Describe your organisation's mission and vision..."
          />
          {errors.description && <p className="text-xs text-red-600">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Contact Email</label>
            <input
              {...form.register('contact_email')}
              type="email"
              className="w-full border rounded-md px-3 py-2 text-sm"
              placeholder="contact@org.com"
            />
            {errors.contact_email && <p className="text-xs text-red-600">{errors.contact_email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Contact Phone</label>
            <input
              {...form.register('contact_phone')}
              type="tel"
              className="w-full border rounded-md px-3 py-2 text-sm"
              placeholder="+1234567890"
            />
            {errors.contact_phone && <p className="text-xs text-red-600">{errors.contact_phone.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Website URL</label>
          <input
            {...form.register('website')}
            type="url"
            className="w-full border rounded-md px-3 py-2 text-sm"
            placeholder="https://www.our-org.com"
          />
          {errors.website && <p className="text-xs text-red-600">{errors.website.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Physical Address</label>
          <input
            {...form.register('address')}
            className="w-full border rounded-md px-3 py-2 text-sm"
            placeholder="123 Main St, City, Country"
          />
          {errors.address && <p className="text-xs text-red-600">{errors.address.message}</p>}
        </div>

        <div className="border-t pt-6 mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600">Twitter URL</label>
              <input
                {...form.register('social_twitter')}
                type="url"
                className="w-full border rounded-md px-3 py-2 text-sm"
                placeholder="https://twitter.com/..."
              />
              {errors.social_twitter && <p className="text-xs text-red-600">{errors.social_twitter.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600">Instagram URL</label>
              <input
                {...form.register('social_instagram')}
                type="url"
                className="w-full border rounded-md px-3 py-2 text-sm"
                placeholder="https://instagram.com/..."
              />
              {errors.social_instagram && <p className="text-xs text-red-600">{errors.social_instagram.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600">Facebook URL</label>
              <input
                {...form.register('social_facebook')}
                type="url"
                className="w-full border rounded-md px-3 py-2 text-sm"
                placeholder="https://facebook.com/..."
              />
              {errors.social_facebook && <p className="text-xs text-red-600">{errors.social_facebook.message}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600">LinkedIn URL</label>
              <input
                {...form.register('social_linkedin')}
                type="url"
                className="w-full border rounded-md px-3 py-2 text-sm"
                placeholder="https://linkedin.com/..."
              />
              {errors.social_linkedin && <p className="text-xs text-red-600">{errors.social_linkedin.message}</p>}
            </div>
          </div>
        </div>

        <Button type="submit" disabled={isLoading} className="w-full mt-4">
          {isLoading ? 'Saving...' : 'Save Profile Information'}
        </Button>
      </form>
    </div>
  )
}
