import { Icon28Hearts2Outline } from '@vkontakte/icons'
import { Footer as VKUIFooter, Footnote } from '@vkontakte/vkui'

import './index.css'

const Footer = () => {
  return (
    <VKUIFooter className='footer'>
      {/*//@ts-ignore типы React не совсем совместимы с Preact*/}
      <Footnote className='footerSubheader'>made with</Footnote>
      <Icon28Hearts2Outline />
    </VKUIFooter>
  )
}

export default Footer
