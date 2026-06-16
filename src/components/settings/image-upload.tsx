'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { updateOrganisationImage } from '@/actions/organisation/settings'
import { toast } from 'sonner'
import Image from 'next/image'
import { UploadCloud, Loader2, X } from 'lucide-react'

interface ImageUploadProps {
  type: 'logo' | 'cover'
  currentUrl?: string | null
  orgId: string
}

export function ImageUpload({ type, currentUrl, orgId }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Basic validation
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file type', {
        description: 'Please select an image file (PNG, JPG, etc).',
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large', {
        description: 'Image must be less than 5MB.',
      })
      return
    }

    setIsUploading(true)

    try {
      const supabase = createClient()
      
      // Generate a unique file name to avoid cache issues
      const fileExt = file.name.split('.').pop()
      const fileName = `${type}_${Date.now()}.${fileExt}`
      const filePath = `${orgId}/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('organisation_assets')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw new Error(uploadError.message)

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('organisation_assets')
        .getPublicUrl(filePath)

      // Update database
      const res = await updateOrganisationImage(type, publicUrl)

      if (!res.success) {
        throw new Error(res.error)
      }

      toast.success('Image Updated', {
        description: `Your organisation ${type} has been successfully updated.`,
      })
    } catch (err: any) {
      toast.error('Upload failed', {
        description: err.message || 'Something went wrong during upload.',
      })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const aspectRatioClass = type === 'cover' ? 'aspect-[3/1] w-full' : 'aspect-square w-32 rounded-full'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700 capitalize">{type} Image</h3>
      </div>
      
      <div 
        className={`relative bg-gray-100 border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center ${aspectRatioClass} ${type === 'logo' ? 'mx-auto sm:mx-0' : ''}`}
      >
        {currentUrl ? (
          <Image 
            src={currentUrl} 
            alt={`Organisation ${type}`} 
            fill 
            className="object-cover"
            unoptimized // Useful for external supabase storage URLs if domains aren't configured
          />
        ) : (
          <div className="text-gray-400 flex flex-col items-center">
            <UploadCloud className="w-8 h-8 mb-2" />
            <span className="text-xs">No image</span>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={isUploading}
        />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full sm:w-auto"
        >
          {currentUrl ? 'Change Image' : 'Upload Image'}
        </Button>
      </div>
      <p className="text-xs text-gray-500">Recommended: JPG or PNG, max 5MB.</p>
    </div>
  )
}
