import { Icon28Hearts2Outline } from '@vkontakte/icons'
import { Footnote, Footer as VKUIFooter } from '@vkontakte/vkui'

import './index.css'

const Footer = () => {
  return (
    <VKUIFooter className='footer'>
      <Footnote className='footerSubheader'>made with</Footnote>
      <Icon28Hearts2Outline />
    </VKUIFooter>
  )
}

export default Footer
