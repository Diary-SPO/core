import { shareContent } from '@runtime-api'
import { Icon24ShareOutline } from '@vkontakte/icons'
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router'
import {
  Button,
  ButtonGroup,
  Div,
  ModalPage,
  ModalPageHeader,
  Text,
  Title
} from '@vkontakte/vkui'
import { useState } from 'react'

import recommendAppImage from '../../../../../../assets/images/recommend-app.webp'
import recommendAppPlayfulImage from '../../../../../../assets/images/recommend-app-playful.webp'
import recommendAppSurprisedImage from '../../../../../../assets/images/recommend-app-surprised.webp'
import {
  dismissRecommendationPrompt,
  postponeRecommendationPrompt
} from '../../../../../../shared/utils/recommendationPrompt'

import './index.css'

const RECOMMEND_APP_URL =
  'https://www.rustore.ru/catalog/app/io.github.diaryspo'
const SHARE_TEXT =
  'Попробуй «Дневник СПО» — удобное расписание, оценки и объявления в одном приложении.'

const RECOMMEND_APP_VARIANTS = [
  {
    image: recommendAppImage,
    alt: 'Любопытный котик предлагает рассказать друзьям о приложении',
    phrase: 'Мяу? Расскажем друзьям?',
    title: 'А одногруппники уже знают?',
    description:
      'Котик подозревает, что кому-то ещё приходится искать расписание по скриншотам. Отправьте им Дневник СПО — пусть тоже живут спокойнее.',
    hint: 'Один тап — и вы герой группы 💙',
    buttonLabel: 'Рассказать одногруппникам'
  },
  {
    image: recommendAppPlayfulImage,
    alt: 'Котик тянет лапу к рекомендации приложения',
    phrase: 'Ловлю вашу рекомендацию!',
    title: 'Подкинем Дневник СПО друзьям?',
    description:
      'Кот уже тянет лапу к кнопке. Осталось выбрать чат группы и отправить ссылку тем, кто снова спрашивает: «А какая завтра первая пара?»',
    hint: 'Быстрее, чем отвечать каждому 😸',
    buttonLabel: 'Поделиться с группой'
  },
  {
    image: recommendAppSurprisedImage,
    alt: 'Удивлённый котик предлагает поделиться приложением',
    phrase: 'Ого, нас станет больше?',
    title: 'Что, если об этом ещё не знают?',
    description:
      'Глаза кота говорят сами за себя: расписание, оценки и объявления — в одном месте. Поделитесь приложением, пока он не удивился ещё сильнее.',
    hint: 'Обещаем: никаких цепочек счастья 🙀',
    buttonLabel: 'Удивить друзей приложением'
  }
] as const

const RecommendAppModal = ({ id }: { id: string }) => {
  const routeNavigator = useRouteNavigator()
  const [variant] = useState(
    () =>
      RECOMMEND_APP_VARIANTS[
        Math.floor(Math.random() * RECOMMEND_APP_VARIANTS.length)
      ]
  )

  const closeForNow = async () => {
    postponeRecommendationPrompt()
    await routeNavigator.hideModal()
  }

  const hideLongTerm = async () => {
    dismissRecommendationPrompt()
    await routeNavigator.hideModal()
  }

  const shareApp = async () => {
    try {
      const shared = await shareContent({
        title: 'Дневник СПО',
        text: SHARE_TEXT,
        url: RECOMMEND_APP_URL,
        dialogTitle: 'Поделиться приложением'
      })

      if (!shared && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(
          `${SHARE_TEXT}\n${RECOMMEND_APP_URL}`
        )
      } else if (!shared) {
        window.open(RECOMMEND_APP_URL, '_blank', 'noopener,noreferrer')
      }

      await hideLongTerm()
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return

      console.error('Не удалось поделиться приложением', error)

      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(
            `${SHARE_TEXT}\n${RECOMMEND_APP_URL}`
          )
        } else {
          window.open(RECOMMEND_APP_URL, '_blank', 'noopener,noreferrer')
        }
      } catch {
        window.open(RECOMMEND_APP_URL, '_blank', 'noopener,noreferrer')
      }

      await hideLongTerm()
    }
  }

  return (
    <ModalPage id={id} size={520} dynamicContentHeight>
      <ModalPageHeader>Поддержать проект</ModalPageHeader>
      <div className='recommendAppModal__hero'>
        <img
          className='recommendAppModal__image'
          src={variant.image}
          alt={variant.alt}
        />
        <Text className='recommendAppModal__phrase'>{variant.phrase}</Text>
      </div>
      <Div className='recommendAppModal__content'>
        <Title
          className='recommendAppModal__title'
          level='2'
          weight='2'
          Component='h2'
        >
          {variant.title}
        </Title>
        <Text className='recommendAppModal__description'>
          {variant.description}
        </Text>
        <Text className='recommendAppModal__hint'>{variant.hint}</Text>
        <ButtonGroup mode='vertical' gap='s' stretched>
          <Button
            size='l'
            stretched
            before={<Icon24ShareOutline />}
            onClick={shareApp}
          >
            {variant.buttonLabel}
          </Button>
          <Button size='l' mode='secondary' stretched onClick={closeForNow}>
            Не сейчас
          </Button>
          <Button
            size='m'
            mode='tertiary'
            appearance='neutral'
            stretched
            onClick={hideLongTerm}
          >
            Больше не показывать
          </Button>
        </ButtonGroup>
      </Div>
    </ModalPage>
  )
}

export default RecommendAppModal
