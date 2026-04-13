---
layout: home

hero:
  name: "Link"
  text: "求职八股 & 个人笔记"
  tagline: 准备面试，整理知识点
  image:
    src: /link-notion-style-avatar.png
    alt: Link Avatar
  actions:
    - theme: primary
      text: 浏览文章
      link: /job/java/basic
    - theme: alt
      text: 关于我
      link: /job/java/basic

features:
  - title: Java 八股
    details: Java 基础、并发、JVM、框架、分布式等面试知识点
    link: /job/java/basic
    linkText: 开始阅读

  - title: 数据库
    details: MySQL、Redis、MongoDB、Elasticsearch 等数据库相关知识
    link: /job/database/mysql
    linkText: 开始阅读

  - title: 系统设计
    details: 定时任务、实时系统、场景设计等架构设计
    link: /job/sys_design/scheduled
    linkText: 开始阅读

  - title: 前端框架
    details: React、Vue、Svelte5 等前端技术笔记
    link: /framework/react
    linkText: 开始阅读

  - title: 编程语言
    details: Rust、Go、TypeScript 等语言学习笔记
    link: /language/rust
    linkText: 开始阅读

  - title: 工具技巧
    details: 开发工具、效率技巧、Linux 命令行等
    link: /job/java/basic
    linkText: 敬请期待
---

<section class="home-section">
  <div class="recent-posts-header">
    <h2>最新文章</h2>
    <p>最近更新的笔记和八股文</p>
  </div>
  <RecentPosts />
</section>

<style>
.home-section {
  max-width: 1152px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}
.recent-posts-header {
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 1rem;
}
.recent-posts-header h2 {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: var(--vp-c-text-1);
}
.recent-posts-header p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 1rem;
}
</style>
