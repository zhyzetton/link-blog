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

<section class="home-section recent-posts">
  <div class="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16">
    <h2 class="font-black text-2xl md:text-4xl mb-8 md:mb-12 border-b-4 border-black pb-4">
      最新文章
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <a href="/job/java/concurrent" class="block bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 md:p-6 hover:shadow-[4px_4px_0px_0px_rgba(255,0,110,1)] hover:-translate-y-1 transition-all">
        <h3 class="font-black text-lg md:text-xl mb-2">Java 并发编程</h3>
        <p class="font-mono text-sm text-gray-700">线程、锁、并发容器、线程池等核心知识点</p>
        <span class="font-mono text-xs text-gray-500 mt-4 block">2024-03</span>
      </a>
      <a href="/job/database/mysql" class="block bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 md:p-6 hover:shadow-[4px_4px_0px_0px_rgba(255,0,110,1)] hover:-translate-y-1 transition-all">
        <h3 class="font-black text-lg md:text-xl mb-2">MySQL 实战</h3>
        <p class="font-mono text-sm text-gray-700">索引、事务、锁、日志、性能优化等</p>
        <span class="font-mono text-xs text-gray-500 mt-4 block">2024-03</span>
      </a>
      <a href="/job/sys_design/scheduled" class="block bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 md:p-6 hover:shadow-[4px_4px_0px_0px_rgba(255,0,110,1)] hover:-translate-y-1 transition-all">
        <h3 class="font-black text-lg md:text-xl mb-2">定时任务系统设计</h3>
        <p class="font-mono text-sm text-gray-700">单机定时、多级队列、分布式调度方案</p>
        <span class="font-mono text-xs text-gray-500 mt-4 block">2024-02</span>
      </a>
    </div>
  </div>
</section>

<style>
.home-section {
  margin-top: 40px;
  padding: 18px;
}
.recent-posts {
  background: #f5f5f5;
}
</style>
