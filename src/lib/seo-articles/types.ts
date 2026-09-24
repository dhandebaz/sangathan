/**
 * SEO Guides article schema.
 *
 * Articles live at /guides/[slug] (English, crawlable, sitemap-listed).
 * They are intentionally NOT linked from site navigation — links live only
 * in the system-admin SEO Posts registry (/admin/seo-posts) plus
 * related-article links on article pages themselves.
 */

export type ArticleCategory =
  | 'ngo-registration'
  | 'ngo-compliance'
  | 'fundraising'
  | 'governance'
  | 'rti-civic'
  | 'collective'

export const ARTICLE_CATEGORIES: Record<ArticleCategory, { labelEn: string; labelHi: string }> = {
  'ngo-registration': { labelEn: 'NGO Setup & Registration', labelHi: 'एनजीओ स्थापना व पंजीकरण' },
  'ngo-compliance': { labelEn: 'Compliance & Filings', labelHi: 'अनुपालन व फाइलिंग' },
  fundraising: { labelEn: 'Donations & Fundraising', labelHi: 'दान व धन संग्रह' },
  governance: { labelEn: 'Governance & Operations', labelHi: 'शासन व संचालन' },
  'rti-civic': { labelEn: 'RTI & Civic Action', labelHi: 'आरटीआई व नागरिक कार्रवाई' },
  collective: { labelEn: 'Collectives & Movements', labelHi: 'समूह व आंदोलन' },
}

export type ArticleFigure =
  | { type: 'steps'; title?: string; steps: string[] }
  | { type: 'checklist'; title?: string; items: string[] }
  | { type: 'stats'; title?: string; stats: { value: string; label: string }[] }
  | { type: 'dos-donts'; title?: string; dos: string[]; donts: string[] }
  | { type: 'timeline'; title?: string; entries: { label: string; text: string }[] }

export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'h3'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'numbered'; items: string[] }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'table'; title?: string; headers: string[]; rows: string[][] }
  | { type: 'figure'; figure: ArticleFigure; caption?: string }
  | { type: 'note'; title?: string; text: string }

export interface ArticleFaq {
  q: string
  a: string
}

export interface SeoArticle {
  /** kebab-case, unique, 20-70 chars. Example: 'how-to-register-ngo-india-2026' */
  slug: string
  /** 30-70 chars, keyword-first, human. Example: 'How to Register an NGO in India (2026): ...' */
  title: string
  /** 120-170 chars, one compelling summary with the primary keyword. */
  description: string
  /** 4-8 search keywords, lowercase mostly. */
  keywords: string[]
  category: ArticleCategory
  /** YYYY-MM-DD */
  datePublished: string
  /** 3-5 crisp answers a searcher wants. Rendered in the Key Takeaways box. */
  keyTakeaways: string[]
  /**
   * >= 7 blocks. First block MUST be { type: 'p' } (the lede).
   * Include >= 2 h2 sections, >= 1 figure, and a table in most articles.
   */
  blocks: ArticleBlock[]
  /** 4-6 FAQs phrased the way people ask Google. Answers 40-90 words. */
  faqs: ArticleFaq[]
  /**
   * Optional 1-2 honest sentences tying the topic to a REAL Sangathan
   * capability (donation records, registers, secret ballot, complaint diary +
   * 30-day RTI reminder, parcha studio, transparency page, ID cards, member
   * import). Omit when no natural fit. NEVER invent features.
   */
  productTieIn?: string
}
