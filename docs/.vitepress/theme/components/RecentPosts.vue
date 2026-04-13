<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'

const modules = import.meta.glob('../../../**/*.md', { eager: true })

const posts = computed(() => {
  const result = []
  
  for (const path in modules) {
    if (path.includes('.vitepress') || path.includes('index.md') || path.includes('README.md') || path.includes('node_modules')) {
      continue
    }
    
    const post = modules[path]
    // VitePress exports frontmatter as a variable or it can be found in __pageData
    const pageData = post.__pageData || {}
    const frontmatter = pageData.frontmatter || {}
    
    // Clean path for URL (e.g., ../../../job/java/basic.md -> /job/java/basic)
    const url = path.replace('../../../', '/').replace('.md', '')
    
    // Extract title (prefer frontmatter, then first H1 from markdown content, then filename)
    let title = frontmatter.title || pageData.title || ''
    if (!title) {
      const filename = url.split('/').pop()
      title = filename.charAt(0).toUpperCase() + filename.slice(1)
    }

    // Attempt to extract date from frontmatter, or fallback to file modified time (mocked or ignored)
    const date = frontmatter.date || pageData.lastUpdated || ''
    const description = frontmatter.description || ''
    
    result.push({
      title,
      url,
      date,
      description,
      // For sorting, if date exists use it, else default to 0
      time: date ? new Date(date).getTime() : 0
    })
  }
  
  // Sort by time descending (newest first)
  result.sort((a, b) => b.time - a.time)
  
  // If all times are 0 (no dates), fallback to path sorting or just take top 6
  return result.slice(0, 6)
})

// Formatting helper
const formatDate = (ts) => {
  if (!ts) return ''
  const d = new Date(ts)
  return isNaN(d.getTime()) ? '' : `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
</script>

<template>
  <div class="recent-posts-container">
    <div class="recent-posts-grid">
      <a v-for="post in posts" :key="post.url" :href="withBase(post.url)" class="post-card">
        <div class="post-content">
          <h3 class="post-title">{{ post.title }}</h3>
          <p v-if="post.description" class="post-desc">{{ post.description }}</p>
        </div>
        <div v-if="post.date || post.time" class="post-meta">
          <span class="post-date">{{ formatDate(post.time) }}</span>
        </div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.recent-posts-container {
  margin-top: 1.5rem;
}
.recent-posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}
.post-card {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--vp-radius-m);
  background-color: var(--vp-c-bg);
  transition: all 0.2s ease;
  text-decoration: none !important;
  height: 100%;
}
.post-card:hover {
  border-color: var(--vp-c-border);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transform: translateY(-2px);
}
:global(.dark) .post-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}
.post-content {
  flex-grow: 1;
}
.post-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}
.post-desc {
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.post-meta {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
  display: flex;
  align-items: center;
}
.post-date {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
}
</style>
