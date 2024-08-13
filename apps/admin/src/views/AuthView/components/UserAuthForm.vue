<script setup lang="ts">
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  useToast
} from '@/components'
// import { SERVER_URL } from '@/config'
import { getGitHubUrl } from '@/utils/oauth/github'
import { GithubLogoIcon } from '@radix-icons/vue'
import { useLocalStorage } from '@vueuse/core'
import { onMounted, ref } from 'vue'
const { toast } = useToast()
const formValues = ref({
  login: '',
  password: ''
})
const onSubmit = () => {
  console.log(formValues.value.password)
}
const getAuthParam = async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')
  // const data = urlParams.get('code')
  if (!code) {
    return
  }
  try {
    toast({
      title: 'Вход через GitHub',
      description: 'Пожалуйста, подождите',
      duration: 1000
    })
    // const data = await fetch(`${SERVER_URL}/oauth/github`, {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     code,
    //   }),
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // // })
    // console.log('data 1', data)
    // return data
  } catch (e) {
    console.log('AAAAAAAAAAAAAAAA')
    console.log(e)
    toast({
      variant: 'destructive',
      title: 'Ошибка входа',
      description: 'Сообщите нам о проблеме'
    })
  }
}
onMounted(async () => {
  const data = await getAuthParam()
  useLocalStorage('data', JSON.stringify(data))
  console.log('data', data)
})
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

  <Button :href="getGitHubUrl('/')" variant="outline" as="a">
    <GithubLogoIcon class="mr-2" />
    GitHub
  </Button>
</template>