<script setup lang="ts">
import UserAuthForm from './components/UserAuthForm.vue'
</script>

<template>
  <div
    class="container relative h-[800px] flex flex-col items-center justify-center md:grid lg:grid-cols-1"
  >
    <div class="lg:p-8">
      <div
        class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
      >
        <div class="flex flex-col space-y-2 text-center">
          <h1 class="text-2xl font-semibold tracking-tight">Вход</h1>
          <p class="text-sm text-muted-foreground">
            Введите данные логин и пароль или войдите через GitHub
          </p>
        </div>
        <UserAuthForm />
      </div>
    </div>
  </div>
</template>
