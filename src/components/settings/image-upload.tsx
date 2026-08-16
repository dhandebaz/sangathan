'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { updateOrganisationImage } from '@/actions/organisation/settings'
import { toast } from 'sonner'
import Image from 'next/image'
import { UploadCloud, Loader2, Sparkles } from 'lucide-react'
import { OrgType } from '@/lib/org-types'
import { LogoGeneratorModal } from '@/components/logo-generator/logo-generator-modal'

interface ImageUploadProps {
  type: 'logo' | 'cover'
  currentUrl?: string | null
  orgId: string
  orgName?: string
  orgType?: OrgType
  orgSlug?: string
  lang?: string
}

export function ImageUpload({
  type,
  currentUrl,
  orgId,
  orgName = 'My Organisation',
  orgType = 'civic_collective',
  orgSlug = 'org',
  lang = 'en',
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [displayUrl, setDisplayUrl] = useState<string | null>(currentUrl || null)
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isHindi = lang === 'hi'

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Basic validation
    if (!file.type.startsWith('image/')) {
      toast.error(isHindi ? 'अमान्य फ़ाइल प्रकार' : 'Invalid file type', {
        description: isHindi ? 'कृपया एक मान्य छवि फ़ाइल (PNG, JPG आदि) चुनें।' : 'Please select an image file (PNG, JPG, etc).',
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(isHindi ? 'फ़ाइल बहुत बड़ी है' : 'File too large', {
        description: isHindi ? 'छवि का आकार 5MB से कम होना चाहिए।' : 'Image must be less than 5MB.',
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
      const res = await updateOrganisationImage({ type, url: publicUrl })

      if (!res.success) {
        throw new Error(res.error)
      }

      setDisplayUrl(publicUrl)

      toast.success(isHindi ? 'छवि अपडेट हो गई' : 'Image Updated', {
        description: isHindi ? `आपके संगठन का ${type} सफलतापूर्वक अपडेट हो गया है।` : `Your organisation ${type} has been successfully updated.`,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong during upload.'
      toast.error(isHindi ? 'अपलोड विफल' : 'Upload failed', {
        description: message,
      })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const aspectRatioClass = type === 'cover' ? 'aspect-[3/1] w-full' : 'aspect-square w-32 rounded-2xl'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800 capitalize">
          {type === 'logo' ? (isHindi ? 'आधिकारिक लोगो (Logo)' : 'Official Logo') : (isHindi ? 'कवर बैनर (Cover)' : 'Cover Banner')}
        </h3>
      </div>
      
      <div 
        className={`relative bg-slate-50 border-2 border-dashed border-slate-300 overflow-hidden flex items-center justify-center ${aspectRatioClass} ${type === 'logo' ? 'mx-auto sm:mx-0' : ''}`}
      >
        {displayUrl ? (
          <Image 
            src={displayUrl} 
            alt={`Organisation ${type}`} 
            fill 
            className="object-cover"
            unoptimized // Useful for external supabase storage URLs
          />
        ) : (
          <div className="text-slate-400 flex flex-col items-center">
            <UploadCloud className="w-8 h-8 mb-2" />
            <span className="text-xs">{isHindi ? 'कोई छवि नहीं' : 'No image'}</span>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <Loader2 className="w-6 h-6 animate-spin text-slate-900" />
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={isUploading}
        />
        
        <Button 
          type="button"
          variant="outline" 
          size="sm" 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="text-xs font-semibold rounded-sm"
        >
          {displayUrl ? (isHindi ? 'छवि बदलें' : 'Change Image') : (isHindi ? 'छवि अपलोड करें' : 'Upload Image')}
        </Button>

        {type === 'logo' && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsGeneratorOpen(true)}
            className="text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-900 border-slate-300 rounded-sm gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>{isHindi ? 'लोगो बनाएं (Generate Logo)' : 'Generate My Logo'}</span>
          </Button>
        )}
      </div>

      <p className="text-[11px] text-slate-500">
        {type === 'logo'
          ? (isHindi ? 'PNG, JPG या AI जनरेटेड वेक्टर लोगो (अधिकतम 5MB)' : 'PNG, JPG or AI Generated Vector Logo (Max 5MB)')
          : (isHindi ? 'कवर बैनर के लिए 3:1 अनुपात की छवि अनुशंसित' : 'Recommended 3:1 ratio cover banner')}
      </p>

      {/* Logo Generator Modal */}
      {type === 'logo' && (
        <LogoGeneratorModal
          isOpen={isGeneratorOpen}
          onClose={() => setIsGeneratorOpen(false)}
          orgName={orgName}
          orgType={orgType}
          orgId={orgId}
          orgSlug={orgSlug}
          lang={lang}
          onLogoSelected={(newUrl) => {
            setDisplayUrl(newUrl)
          }}
        />
      )}
    </div>
  )
}
