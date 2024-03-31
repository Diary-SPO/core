<script setup lang="ts">
import { Toaster } from '@/components/ui/toast'
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/login">login</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
  <Toaster />
</template>
