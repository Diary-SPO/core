import { useState } from 'react'
import { FAQ } from '../data'
import { ChevronIcon } from '../icons'

export function Faq() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <section id='faq' className='container section'>
      <div className='section-head reveal'>
        <h2>Частые вопросы</h2>
      </div>
      <div className='faq reveal'>
        {FAQ.map((f, i) => {
          const open = openFaq === i
          return (
            <div className={`faq-item${open ? ' is-open' : ''}`} key={f.q}>
              <button
                type='button'
                className='faq-q'
                aria-expanded={open}
                onClick={() => setOpenFaq(open ? null : i)}
              >
                <span>{f.q}</span>
                <ChevronIcon open={open} />
              </button>
              <div className='faq-a' aria-hidden={!open}>
                <p>{f.a}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
