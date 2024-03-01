<script setup lang="ts">
import { useUserStore } from '@/stores/userStore'

const { isAuthenticated, login, logout } = useUserStore()
</script>

<template>
  <div>
    <p v-if="isAuthenticated">User is authenticated</p>
    <p v-else>User is not authenticated</p>
  </div>

  <slot />
</template>
