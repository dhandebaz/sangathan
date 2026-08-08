import defaultPostsData from '@/lib/data/default-union-posts.json'
import type { UnionPost } from '@/types/posts'

export function getDefaultUnionPosts(): UnionPost[] {
  return defaultPostsData as UnionPost[]
}
