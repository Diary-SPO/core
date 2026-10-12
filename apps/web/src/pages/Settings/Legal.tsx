import { Group, Header, Link, SimpleCell } from '@vkontakte/vkui'

import {
  PERSONAL_DATA_CONSENT_URL,
  PRIVACY_POLICY_URL,
  USER_AGREEMENT_URL
} from '../../shared/config'

const documents = [
  ['Политика конфиденциальности', PRIVACY_POLICY_URL],
  ['Пользовательское соглашение', USER_AGREEMENT_URL],
  ['Согласие на обработку персональных данных', PERSONAL_DATA_CONSENT_URL]
] as const

const Legal = () => {
  const configuredDocuments = documents.filter(([, url]) => Boolean(url))

  if (!configuredDocuments.length) return null

  return (
    <Group header={<Header size='s'>Правовая информация</Header>}>
      {configuredDocuments.map(([title, url]) => (
        <SimpleCell key={title} multiline>
          <Link href={url} target='_blank' rel='noreferrer'>
            {title}
          </Link>
        </SimpleCell>
      ))}
    </Group>
  )
}

export default Legal
