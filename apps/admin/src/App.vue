<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import {Toaster} from "@/components/ui/toast";
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
