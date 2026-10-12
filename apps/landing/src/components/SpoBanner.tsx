import { CheckIcon, CrossIcon } from '../icons'

export function SpoBanner() {
  return (
    <section className='container spo-section'>
      <div className='spo-banner reveal'>
        <div className='spo-col spo-yes'>
          <span className='spo-mark' aria-hidden='true'>
            <CheckIcon />
          </span>
          <div>
            <b>Подойдёт вам, если вы студент</b>
            <p>
              колледжа, техникума или училища — приложение работает с модулем
              ПОО системы «Сетевой город. Образование»
            </p>
          </div>
        </div>
        <div className='spo-col spo-no'>
          <span className='spo-mark' aria-hidden='true'>
            <CrossIcon />
          </span>
          <div>
            <b>Не подойдёт школьникам</b>
            <p>школьный модуль Сетевого города не поддерживается</p>
          </div>
        </div>
      </div>
    </section>
  )
}
