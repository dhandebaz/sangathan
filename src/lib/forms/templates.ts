import { FormTemplate } from '@/types/forms'

export const FORM_TEMPLATES: FormTemplate[] = [
  // --- NGO / Trust Templates ---
  {
    id: 'ngo_volunteer_intake',
    title: 'Volunteer Onboarding & Skills Intake',
    description: 'Collect volunteer availability, domain skills, and emergency contact details for social impact drives.',
    category: 'ngo',
    orgTypeLabel: 'NGO / Trust',
    fields: [
      { id: 'sec_personal', label: 'Personal Information', type: 'heading', required: false, description: 'Basic identification and contact details' },
      { id: 'full_name', label: 'Full Name', type: 'text', required: true, placeholder: 'e.g. Ananya Roy' },
      { id: 'phone', label: 'WhatsApp / Mobile Number', type: 'phone', required: true, placeholder: '+91 9876543210' },
      { id: 'email', label: 'Email Address', type: 'email', required: false, placeholder: 'ananya@example.com' },
      { id: 'city_area', label: 'Current City / District', type: 'text', required: true, placeholder: 'e.g. Pune, Maharashtra' },
      { id: 'sec_skills', label: 'Skills & Availability', type: 'heading', required: false, description: 'How you would like to contribute' },
      {
        id: 'skills',
        label: 'Domain Expertise / Skills',
        type: 'checkbox',
        required: true,
        options: ['Field Outreach & Relief Distribution', 'Content Writing & Social Media', 'Legal Aid & Documentation', 'Teaching & Child Tutoring', 'Fundraising & Event Coordination', 'Tech & Web Support'],
      },
      {
        id: 'availability_hours',
        label: 'Weekly Available Hours',
        type: 'radio',
        required: true,
        options: ['1-3 hours / week', '4-7 hours / week', '8-15 hours / week', 'Full-time / Intensive campaigns'],
      },
      { id: 'prior_experience', label: 'Briefly describe any prior social work experience', type: 'textarea', required: false, placeholder: 'Tell us about past NGO, student, or community initiatives you participated in...' },
      { id: 'motivation_rating', label: 'How excited are you to participate in our upcoming outreach?', type: 'rating', required: true, maxRating: 5 },
    ],
  },
  {
    id: 'ngo_beneficiary_needs',
    title: 'Community Relief & Beneficiary Needs Assessment',
    description: 'Ground survey to assess family income, ration needs, healthcare requirements, and relief priority.',
    category: 'ngo',
    orgTypeLabel: 'NGO / Trust',
    fields: [
      { id: 'sec_family', label: 'Family Profile', type: 'heading', required: false, description: 'Head of household identification' },
      { id: 'head_name', label: 'Head of Household Name', type: 'text', required: true, placeholder: 'e.g. Rameshwar Sahni' },
      { id: 'contact_phone', label: 'Contact Phone Number', type: 'phone', required: true, placeholder: '+91 9876543210' },
      { id: 'settlement_area', label: 'Slum / Basti / Village Name', type: 'text', required: true, placeholder: 'e.g. Sanjay Basti, Sector 4' },
      { id: 'family_members_count', label: 'Total Family Members (including children)', type: 'number', required: true, placeholder: 'e.g. 5' },
      { id: 'sec_requirements', label: 'Immediate Relief Needs', type: 'heading', required: false, description: 'Categorized essential support' },
      {
        id: 'relief_categories',
        label: 'Immediate Relief Required',
        type: 'checkbox',
        required: true,
        options: ['Dry Ration & Food Kits', 'Medical Aid & Essential Medicines', 'Children School Books & Stationery', 'Winter Blankets & Clothes', 'Livelihood Tool Kit (Cart, Sewing, etc.)'],
      },
      {
        id: 'urgency_level',
        label: 'Urgency Priority Level',
        type: 'scale',
        required: true,
        minLabel: '1 - Low / Routine',
        maxLabel: '5 - Critical Emergency',
      },
      { id: 'ration_card_available', label: 'Do you have an active Ration Card / Ayushman Card?', type: 'yes_no', required: true },
      { id: 'field_notes', label: 'Surveyor Field Observations / Notes', type: 'textarea', required: false, placeholder: 'Special medical conditions, housing structural risks, etc.' },
    ],
  },

  // --- Civic Collective / Grassroots Movement ---
  {
    id: 'civic_townhall_survey',
    title: 'Community Townhall & Public Issue Prioritization Poll',
    description: 'Democratic polling to identify top community struggles, local infrastructure priorities, and citizen mobilization.',
    category: 'civic_collective',
    orgTypeLabel: 'Civic Collective',
    fields: [
      { id: 'citizen_name', label: 'Citizen / Organizer Name', type: 'text', required: true, placeholder: 'e.g. Bilal Ahmed' },
      { id: 'ward_area', label: 'Ward / Mohalla / Neighborhood', type: 'text', required: true, placeholder: 'e.g. Ward 32, Shahdara' },
      { id: 'phone', label: 'WhatsApp Number for Campaign Updates', type: 'phone', required: true, placeholder: '+91 9876543210' },
      {
        id: 'top_issue',
        label: 'Most Pressing Issue in Your Ward',
        type: 'radio',
        required: true,
        options: ['Contaminated Drinking Water & Low Pressure', 'Broken Roads & Open Drains / Waterlogging', 'Lack of Public Park / Children Playground', 'Irregular Power Cuts & Voltage Fluctuations', 'Women Safety & Non-Functional Street Lights'],
      },
      {
        id: 'rep_satisfaction',
        label: 'Satisfaction with Local MLA / Councillor Response',
        type: 'scale',
        required: true,
        minLabel: '1 - Zero Action / Ignored',
        maxLabel: '5 - Responsive & Helpful',
      },
      { id: 'rally_attendance', label: 'Will you join our upcoming peaceful delegation to the Municipal Office?', type: 'yes_no', required: true },
      { id: 'citizen_voice', label: 'Share your personal experience / message for the joint petition', type: 'textarea', required: true, placeholder: 'How long has this issue persisted and how has it affected your family?' },
    ],
  },
]
