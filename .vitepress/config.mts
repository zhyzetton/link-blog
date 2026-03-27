import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Link Blog',
  description: '求职八股 & 个人笔记',
  logo: '/link-notion-style-avatar.png',
  logoLink: '/',
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }]
  ],
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: 'Java', link: '/job/java/basic' },
      { text: '数据库', link: '/job/database/mysql' },
      { text: '系统设计', link: '/job/sys_design/scheduled' },
      { text: '前端', link: '/framework/react' },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/link' }
    ]
  }
})
