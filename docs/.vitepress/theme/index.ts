import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './style.css'
import RecentPosts from './components/RecentPosts.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('RecentPosts', RecentPosts)
  }
} satisfies Theme
