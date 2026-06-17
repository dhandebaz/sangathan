import sanitizeHtml from 'sanitize-html'

const DEFAULT_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'code',
    'span', 'div', 'sub', 'sup', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
    span: ['style'],
    th: ['scope', 'style'],
    td: ['style'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  transformTags: {
    a: (tagName, attribs) => ({
      tagName,
      attribs: {
        ...attribs,
        rel: 'noopener noreferrer nofollow',
        target: '_blank',
      },
    }),
  },
  disallowedTagsMode: 'discard',
}

const STRICT_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [],
  allowedAttributes: {},
  disallowedTagsMode: 'discard',
}

export function sanitizeRichText(input: string): string {
  return sanitizeHtml(input, DEFAULT_OPTIONS)
}

export function sanitizePlainText(input: string): string {
  return sanitizeHtml(input, STRICT_OPTIONS)
}

export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  richTextFields: (keyof T)[] = []
): T {
  const result = { ...obj }
  for (const key of Object.keys(result) as (keyof T)[]) {
    if (typeof result[key] === 'string') {
      const value = result[key] as string
      result[key] = (richTextFields.includes(key) ? sanitizeRichText(value) : sanitizePlainText(value)) as T[keyof T]
    }
  }
  return result
}
