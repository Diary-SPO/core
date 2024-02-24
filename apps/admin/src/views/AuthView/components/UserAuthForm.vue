<script setup lang="ts">
import { h } from 'vue'
import {
  FormControl,
  FormLabel,
  FormItem,
  FormField,
  FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/components/ui/toast'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { GithubLogoIcon } from '@radix-icons/vue'
const { toast } = useToast()
async function onSubmit(values: any) {
  console.log(values)
  toast({
    title: 'Scheduled: Catch up',
    description: 'Friday, February 10, 2023 at 5:57 PM',
    duration: 2000,
  })
}
</script>

<template>
  <Form class="space-y-2" @submit.prevent="onSubmit">
    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel>Name</FormLabel>
        <FormControl>
          <Input type="text" placeholder="Your name" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel>Name</FormLabel>
        <FormControl>
          <Input type="text" placeholder="Your name" v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button class="w-full" type="submit" @click.prevent="onSubmit">Вход</Button>
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
    <!--    <LucideSpinner v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />-->
    <GithubLogoIcon class="mr-2" />
    GitHub
  </Button>
</template>
