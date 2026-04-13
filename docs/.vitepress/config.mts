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
      label: '大纲',
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '八股', link: '/job/java/basic' },
      { text: '语言', link: '/language/rust' },
      { text: '框架', link: '/framework/react' },
      { text: '算法', link: '/algorithm/basic' },
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
            { text: 'Elasticsearch', link: '/job/database/elasticsearch' },
            { text: 'MongoDB', link: '/job/database/mongodb' },
          ]
        },
        {
          text: '系统设计',
          items: [
            { text: '定时任务', link: '/job/sys_design/scheduled' },
            { text: '实时消息推送', link: '/job/sys_design/realtime' },
            { text: '场景题[未完成]', link: '/job/sys_design/scene' },
          ]
        },
        {
          text: '计算机基础',
          items: [
            { text: '网络', link: '/job/computer_basic/network' },
            { text: '操作系统', link: '/job/computer_basic/os' },
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
      ],
      '/algorithm/': [
        {
          items: [
            { text: '算法基础', link: '/algorithm/basic' },
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/zhyzetton/link-blog' }
    ]
  }
})
