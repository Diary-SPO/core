<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  Form,
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
import { useFetch } from '@vueuse/core'
import { SERVER_URL } from '@/config'
import { getGitHubUrl } from '@/utils/oauth/github'
const { toast } = useToast()
// import * as VKID from '@vkid/sdk';

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

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')

  if (!code) {
    return
  }

  const { data } = await useFetch(`${SERVER_URL}/oauth/github`, {
    method: 'POST',
    body: JSON.stringify({
      code,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  localStorage.setItem('data', JSON.stringify(data))
  window.location.search = ''
})

</script>

<template>
  <div
    id="test"
    style="z-index: 300; position: relative; width: 300px; height: 100px"
  ></div>
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

  <Button :href="getGitHubUrl('/')" variant="outline" as="a">
    <GithubLogoIcon class="mr-2" />
    GitHub
  </Button>
</template>
