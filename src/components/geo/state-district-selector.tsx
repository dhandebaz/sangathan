'use client'

import { useState, useMemo } from 'react'
import { getAllStates, getDistrictsByState } from '@/lib/geo/india'
import { Label } from '@/components/ui/label'
import { MapPin } from 'lucide-react'

interface StateDistrictSelectorProps {
  selectedState?: string
  selectedDistrict?: string
  onStateChange: (stateCode: string, stateName: string) => void
  onDistrictChange: (district: string) => void
  lang?: string
  required?: boolean
  className?: string
}

export function StateDistrictSelector({
  selectedState = '',
  selectedDistrict = '',
  onStateChange,
  onDistrictChange,
  lang = 'en',
  required = false,
  className = '',
}: StateDistrictSelectorProps) {
  const isHindi = lang === 'hi'
  const states = useMemo(() => getAllStates(), [])

  // Find matching state code or name
  const currentStateObj = states.find(
    (s) =>
      s.code.toLowerCase() === selectedState.toLowerCase() ||
      s.name.toLowerCase() === selectedState.toLowerCase()
  )

  const currentStateCode = currentStateObj?.code || selectedState

  const districts = useMemo(() => {
    return currentStateCode ? getDistrictsByState(currentStateCode) : []
  }, [currentStateCode])

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${className}`}>
      {/* State / UT Selector */}
      <div className="space-y-1.5">
        <Label className="text-xs font-bold text-slate-900 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-orange-700" />
          {isHindi ? 'राज्य / केंद्र शासित प्रदेश' : 'State / Union Territory'}
          {required && <span className="text-red-500">*</span>}
        </Label>
        <select
          value={currentStateCode}
          onChange={(e) => {
            const code = e.target.value
            const match = states.find((s) => s.code === code)
            onStateChange(code, match ? match.name : '')
            onDistrictChange('') // Reset district when state changes
          }}
          className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-orange-600 font-medium text-slate-800"
          required={required}
        >
          <option value="">
            -- {isHindi ? 'राज्य चुनें' : 'Select State / UT'} --
          </option>
          {states.map((s) => (
            <option key={s.code} value={s.code}>
              {isHindi ? s.nameHi : s.name} ({s.code.replace('IN-', '')})
            </option>
          ))}
        </select>
      </div>

      {/* District Selector */}
      <div className="space-y-1.5">
        <Label className="text-xs font-bold text-slate-900 flex items-center gap-1">
          {isHindi ? 'जिला' : 'District'}
          {required && <span className="text-red-500">*</span>}
        </Label>
        <select
          value={selectedDistrict}
          disabled={!currentStateCode || districts.length === 0}
          onChange={(e) => onDistrictChange(e.target.value)}
          className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-orange-600 font-medium text-slate-800 disabled:bg-slate-100 disabled:text-slate-400"
          required={required}
        >
          <option value="">
            {currentStateCode
              ? `-- ${isHindi ? 'जिला चुनें' : 'Select District'} (${districts.length} उपलब्ध) --`
              : `-- ${isHindi ? 'पहले राज्य चुनें' : 'Select State First'} --`}
          </option>
          {districts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
