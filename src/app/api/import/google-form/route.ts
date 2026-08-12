import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { FormField } from '@/types/forms'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!session.provider_token) {
      return NextResponse.json({ 
        error: 'Google API access not authorized. Please grant permission first.', 
        needsConsent: true 
      }, { status: 403 })
    }

    const body = await request.json()
    const { formUrl } = body

    if (!formUrl) {
      return NextResponse.json({ error: 'Form URL is required' }, { status: 400 })
    }

    const match = formUrl.match(/\/forms\/d\/([a-zA-Z0-9-_]+)/)
    if (!match || !match[1]) {
      return NextResponse.json({ error: 'Invalid Google Form URL' }, { status: 400 })
    }
    const formId = match[1]

    const headers = {
      'Authorization': `Bearer ${session.provider_token}`,
    }

    // 1. Fetch form structure
    const formRes = await fetch(`https://forms.googleapis.com/v1/forms/${formId}`, { headers })
    if (!formRes.ok) {
      if (formRes.status === 401 || formRes.status === 403) {
        return NextResponse.json({ error: 'Unauthorized to read this form.', needsConsent: true }, { status: formRes.status })
      }
      return NextResponse.json({ error: 'Failed to fetch form structure.' }, { status: formRes.status })
    }
    const formData = await formRes.json()

    // 2. Fetch responses
    const responsesRes = await fetch(`https://forms.googleapis.com/v1/forms/${formId}/responses`, { headers })
    if (!responsesRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch form responses.' }, { status: responsesRes.status })
    }
    const responsesData = await responsesRes.json()

    const formTitle = formData.info?.title || ''
    const formDescription = formData.info?.documentTitle || ''
    
    const fields: FormField[] = []
    
    // Map items
    for (const item of formData.items || []) {
      if (!item.questionItem?.question) continue;
      
      const q = item.questionItem.question;
      const questionId = q.questionId;
      const label = item.title || '';
      let type = 'text';
      let options: string[] | undefined = undefined;

      if (q.choiceQuestion) {
        const ct = q.choiceQuestion.type;
        if (ct === 'RADIO') type = 'radio';
        else if (ct === 'CHECKBOX') type = 'checkbox';
        else if (ct === 'DROP_DOWN') type = 'dropdown';
        
        options = q.choiceQuestion.options?.map((o: any) => o.value) || [];
      } else if (q.textQuestion) {
        type = q.textQuestion.paragraph ? 'textarea' : 'text';
      } else if (q.scaleQuestion) {
        type = 'scale';
      } else if (q.dateQuestion) {
        type = 'date';
      }

      fields.push({
        id: questionId,
        label,
        type,
        options,
        required: q.required || false
      } as FormField);
    }

    const mappedResponses: Array<{ data: Record<string, any>, submittedAt: string }> = []
    
    // Map responses
    for (const resp of responsesData.responses || []) {
      const data: Record<string, any> = {};
      const answers = resp.answers || {};
      
      for (const [questionId, answerObj] of Object.entries(answers)) {
        const anyAnswer = answerObj as any;
        const textAnswers = anyAnswer.textAnswers?.answers || [];
        if (textAnswers.length > 0) {
          if (textAnswers.length === 1) {
            data[questionId] = textAnswers[0].value;
          } else {
            data[questionId] = textAnswers.map((a: any) => a.value).join(', ');
          }
        }
      }
      
      mappedResponses.push({
        data,
        submittedAt: resp.createTime
      })
    }

    return NextResponse.json({
      success: true,
      formTitle,
      formDescription,
      fields,
      responses: mappedResponses,
      totalResponses: mappedResponses.length
    })

  } catch (error) {
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 })
  }
}
