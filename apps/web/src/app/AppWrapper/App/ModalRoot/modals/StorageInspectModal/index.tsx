import { useStorageInspect } from '@store'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import {
  Button,
  FormItem,
  Group,
  ModalPage,
  ModalPageHeader,
  Textarea
} from '@vkontakte/vkui'
import { useState } from 'react'

const StorageInspectModal = ({ id }: { id: string }) => {
  const routeNavigator = useRouteNavigator()
  const { key, value, clearStorageInspect } = useStorageInspect()
  const [copied, setCopied] = useState(false)

  const close = async () => {
    clearStorageInspect()
    setCopied(false)
    await routeNavigator.hideModal()
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  return (
    <ModalPage
      id={id}
      size={560}
      dynamicContentHeight
      onClose={() => void close()}
    >
      <ModalPageHeader>{key || 'Значение'}</ModalPageHeader>
      <Group>
        <FormItem top='Значение'>
          <Textarea value={value} readOnly rows={12} />
        </FormItem>
        <FormItem>
          <Button size='l' stretched onClick={() => void copy()}>
            {copied ? 'Скопировано' : 'Скопировать'}
          </Button>
        </FormItem>
        <FormItem>
          <Button
            size='m'
            mode='secondary'
            stretched
            onClick={() => void close()}
          >
            Закрыть
          </Button>
        </FormItem>
      </Group>
    </ModalPage>
  )
}

export default StorageInspectModal
