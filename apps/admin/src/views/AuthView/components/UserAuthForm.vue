<script setup lang="ts">
import { ref } from 'vue'
import {
  FormControl,
  FormLabel,
  FormItem,
  FormField,
  FormMessage,
  Input,
  Button,
  useToast,
} from '@/components'
import { GithubLogoIcon } from '@radix-icons/vue'
const { toast } = useToast()

const formValues = ref({
  login: '',
  password: '',
})

async function onSubmit() {
  console.log(formValues.value.password)

  toast({
    title: 'Scheduled: Catch up',
    description: 'Friday, February 10, 2023 at 5:57 PM',
    duration: 2000,
  })
}
</script>

<template>
  <Form class="space-y-2" @submit.prevent="onSubmit">
    <FormField name="login">
      <FormItem>
        <FormLabel>Логин</FormLabel>
        <FormControl>
          <Input
            type="text"
            placeholder="Введите логин"
            v-model="formValues.login"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField name="password">
      <FormItem>
        <FormLabel>Пароль</FormLabel>
        <FormControl>
          <Input
            type="text"
            placeholder="Введите пароль"
            v-model="formValues.password"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button class="w-full" type="submit">Вход</Button>
  </Form>

  <div class="relative">
    <div class="absolute inset-0 flex items-center">
      <span class="w-full border-t" />
    </div>
    <div class="relative flex justify-center text-xs uppercase">
      <span class="bg-background px-2 text-muted-foreground"> Или </span>
    </div>
  </div>

  <Button variant="outline" type="button">
    <GithubLogoIcon class="mr-2" />
    GitHub
  </Button>
</template>
