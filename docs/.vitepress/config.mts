import { defineConfig } from 'vitepress'
// @ts-ignore
import markdownItMark from 'markdown-it-mark'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/link-blog/',
  title: "Link Blog",
  description: "A VitePress Site",
  markdown: {
    config: (md) => {
      md.use(markdownItMark)
    }
  },
  themeConfig: {
    outline: {
      level: 'deep',
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: '八股相关', link: '/job/java/basic' }
    ],

    sidebar: {
      '/job/': [
        {
          text: 'Java',
          items: [
            { text: 'Java 基础', link: '/job/java/basic' },
            { text: '并发编程', link: '/job/java/concurrent' },
            { text: 'JVM', link: '/job/java/jvm' },
            { text: '高性能', link: '/job/java/high-performance' },
            { text: '分布式', link: '/job/java/distributed' },
            { text: '常用框架', link: '/job/java/framework' },
          ]
        },
        {
          text: '数据库',
          items: [
            { text: 'MySQL', link: '/job/database/mysql' },
            { text: 'Redis', link: '/job/database/redis' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/zhyzetton/link-blog' }
    ]
  }
})
