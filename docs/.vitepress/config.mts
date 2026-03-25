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
      { text: '主页', link: '/' },
      { text: '八股相关', link: '/job/java/basic' },
      { text: '语言', link: '/language/rust' },
      { text: '框架', link: '/framework/react' },
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
            { text: 'MongoDB', link: '/job/database/mongodb' },
          ]
        },
        {
          text: '系统设计',
          items: [
            { text: '定时任务', link: '/job/sys_design/scheduled' },
            { text: '实时消息推送', link: '/job/sys_design/realtime' },
            
          ]
        }
      ],
      '/language/': [
        {
          items: [
            { text: 'Rust 基础', link: '/language/rust'},
          ]
        }
      ],
      '/framework/': [
        {
          items: [
            { text: 'React 基础', link: '/framework/react'},
            { text: 'Svelte5 基础', link: '/framework/svelte5'},
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/zhyzetton/link-blog' }
    ]
  }
})
