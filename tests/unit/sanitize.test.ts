import { describe, it, expect } from 'vitest'
import { sanitizeRichText, sanitizePlainText, sanitizeObject } from '@/lib/sanitize'

describe('sanitizeRichText', () => {
  it('allows basic HTML tags', () => {
    const input = '<p><strong>Bold</strong> and <em>italic</em> text with a <br /> break.</p>'
    const output = sanitizeRichText(input)
    // sanitize-html might return <br /> instead of <br>
    expect(output).toBe(input)
  })

  it('allows heading tags', () => {
    const input = '<h1>H1</h1><h2>H2</h2><h3>H3</h3>'
    const output = sanitizeRichText(input)
    expect(output).toBe(input)
  })

  it('allows list tags', () => {
    const input = '<ul><li>Item 1</li><li>Item 2</li></ul><ol><li>One</li></ol>'
    const output = sanitizeRichText(input)
    expect(output).toBe(input)
  })

  it('strips disallowed tags like script and iframe', () => {
    const input = '<div>Safe</div><script>alert("xss")</script><iframe src="malicious.com"></iframe>'
    const output = sanitizeRichText(input)
    expect(output).toBe('<div>Safe</div>')
  })

  it('strips disallowed attributes', () => {
    const input = '<p onclick="alert(1)" class="some-class">Text</p>'
    const output = sanitizeRichText(input)
    expect(output).toBe('<p>Text</p>')
  })

  it('allows specific attributes on allowed tags', () => {
    const input = '<span style="color:red">Colored text</span>'
    const output = sanitizeRichText(input)
    // sanitize-html might normalize the style attribute
    expect(output).toBe('<span style="color:red">Colored text</span>')
  })

  it('transforms anchor tags correctly', () => {
    const input = '<a href="https://example.com" title="Example">Link</a>'
    const output = sanitizeRichText(input)
    expect(output).toContain('href="https://example.com"')
    expect(output).toContain('rel="noopener noreferrer nofollow"')
    expect(output).toContain('target="_blank"')
    expect(output).not.toContain('title="Example"')
  })

  it('handles nested structures', () => {
    const input = '<blockquote><p>Quote <code>code</code></p></blockquote>'
    const output = sanitizeRichText(input)
    expect(output).toBe(input)
  })
})

describe('sanitizePlainText', () => {
  it('strips all HTML tags including scripts content if it contains tags', () => {
    const input = '<div><p>Paragraph</p> <strong>Bold</strong></div>'
    const output = sanitizePlainText(input)
    expect(output.trim().replace(/\s+/g, ' ')).toBe('Paragraph Bold')
  })

  it('strips script tags and their content by default if configured', () => {
    // By default sanitize-html strips script tags and their content.
    const input = 'Hello <script>alert(1)</script> World'
    const output = sanitizePlainText(input)
    expect(output.trim()).toBe('Hello  World')
  })

  it('returns same string if no HTML', () => {
    const input = 'Just some plain text'
    const output = sanitizePlainText(input)
    expect(output).toBe(input)
  })
})

describe('sanitizeObject', () => {
  it('sanitizes strings in an object based on field names', () => {
    const input = {
      title: '<h1>Title</h1>',
      content: '<p>Rich <strong>content</strong></p>',
      other: '<span>Plain</span>'
    }

    const result = sanitizeObject(input, ['content'])

    expect(result.title).toBe('Title')
    expect(result.content).toBe('<p>Rich <strong>content</strong></p>')
    expect(result.other).toBe('Plain')
  })

  it('handles non-string fields', () => {
    const input = {
      id: 123,
      active: true,
      data: { key: 'value' },
      text: '<b>Bold</b>'
    }

    const result = sanitizeObject(input)

    expect(result.id).toBe(123)
    expect(result.active).toBe(true)
    expect(result.data).toEqual({ key: 'value' })
    expect(result.text).toBe('Bold')
  })
})
