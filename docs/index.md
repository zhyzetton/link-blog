---
layout: false
---

<script setup>
import { onMounted } from 'vue'
import { withBase } from 'vitepress'

const target = withBase('/job/java/basic')

onMounted(() => {
  window.location.replace(target)
})
</script>

<meta http-equiv="refresh" :content="`0;url=${target}`">
<p><a :href="target">Redirecting to /job/java/basic...</a></p>
