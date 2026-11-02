import { Icon28LockOutline } from '@vkontakte/icons'
import {
  Button,
  ButtonGroup,
  FormItem,
  Group,
  Header,
  Input,
  SimpleCell,
  Switch
} from '@vkontakte/vkui'
import { useState } from 'react'

import { useSnackbar } from '../../../shared/hooks'
import {
  APP_PIN_LENGTH,
  clearPin,
  isPinEnabled,
  isValidPinFormat,
  setPin,
  verifyPin
} from '../shared/pin'

type Mode = 'idle' | 'create' | 'change' | 'disable'

const PinSettings = () => {
  const [enabled, setEnabled] = useState(isPinEnabled)
  const [mode, setMode] = useState<Mode>('idle')
  const [currentPin, setCurrentPin] = useState('')
  const [nextPin, setNextPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [snackbar, showSnackbar] = useSnackbar()

  const resetForm = () => {
    setMode('idle')
    setCurrentPin('')
    setNextPin('')
    setConfirmPin('')
  }

  const startCreate = () => {
    setMode('create')
    setCurrentPin('')
    setNextPin('')
    setConfirmPin('')
  }

  const onToggle = (checked: boolean) => {
    if (checked) {
      startCreate()
      return
    }
    if (!enabled) return
    setMode('disable')
    setCurrentPin('')
  }

  const submit = async () => {
    if (mode === 'create' || mode === 'change') {
      if (!isValidPinFormat(nextPin)) {
        showSnackbar({
          title: 'Неверный формат',
          subtitle: `Введите ${APP_PIN_LENGTH} цифры`
        })
        return
      }
      if (nextPin !== confirmPin) {
        showSnackbar({
          title: 'Пинкоды не совпадают',
          subtitle: 'Проверьте подтверждение'
        })
        return
      }
      if (mode === 'change' && !(await verifyPin(currentPin))) {
        showSnackbar({
          title: 'Неверный текущий пинкод'
        })
        return
      }
      await setPin(nextPin)
      setEnabled(true)
      resetForm()
      showSnackbar({ title: 'Пинкод сохранён' })
      return
    }

    if (mode === 'disable') {
      if (!(await verifyPin(currentPin))) {
        showSnackbar({ title: 'Неверный пинкод' })
        return
      }
      clearPin()
      setEnabled(false)
      resetForm()
      showSnackbar({ title: 'Пинкод отключён' })
    }
  }

  return (
    <Group header={<Header size='s'>Безопасность</Header>}>
      <SimpleCell
        before={<Icon28LockOutline />}
        after={
          <Switch
            checked={enabled || mode === 'create'}
            onChange={(event) => onToggle(event.currentTarget.checked)}
          />
        }
        subtitle={`Код из ${APP_PIN_LENGTH} цифр при открытии приложения`}
        multiline
      >
        Пинкод входа
      </SimpleCell>

      {enabled && mode === 'idle' && (
        <FormItem>
          <Button
            size='m'
            mode='secondary'
            stretched
            onClick={() => setMode('change')}
          >
            Сменить пинкод
          </Button>
        </FormItem>
      )}

      {mode !== 'idle' && (
        <>
          {(mode === 'change' || mode === 'disable') && (
            <FormItem top='Текущий пинкод'>
              <Input
                type='password'
                inputMode='numeric'
                autoComplete='off'
                maxLength={APP_PIN_LENGTH}
                value={currentPin}
                onChange={(event) =>
                  setCurrentPin(event.currentTarget.value.replace(/\D/g, ''))
                }
              />
            </FormItem>
          )}
          {(mode === 'create' || mode === 'change') && (
            <>
              <FormItem top='Новый пинкод'>
                <Input
                  type='password'
                  inputMode='numeric'
                  autoComplete='off'
                  maxLength={APP_PIN_LENGTH}
                  value={nextPin}
                  onChange={(event) =>
                    setNextPin(event.currentTarget.value.replace(/\D/g, ''))
                  }
                />
              </FormItem>
              <FormItem top='Подтверждение'>
                <Input
                  type='password'
                  inputMode='numeric'
                  autoComplete='off'
                  maxLength={APP_PIN_LENGTH}
                  value={confirmPin}
                  onChange={(event) =>
                    setConfirmPin(event.currentTarget.value.replace(/\D/g, ''))
                  }
                />
              </FormItem>
            </>
          )}
          <FormItem>
            <ButtonGroup mode='horizontal' gap='s' stretched>
              <Button size='m' stretched onClick={() => void submit()}>
                {mode === 'disable' ? 'Отключить' : 'Сохранить'}
              </Button>
              <Button size='m' mode='secondary' stretched onClick={resetForm}>
                Отмена
              </Button>
            </ButtonGroup>
          </FormItem>
        </>
      )}
      {snackbar}
    </Group>
  )
}

export default PinSettings
