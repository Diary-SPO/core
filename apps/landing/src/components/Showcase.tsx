import { useEffect, useState } from 'react'
import { FEATURES } from '../data'

interface ShowcaseProps {
  suspended: boolean
}

export function Showcase({ suspended }: ShowcaseProps) {
  const [activeFeature, setActiveFeature] = useState(0)
  const [paused, setPaused] = useState(false)
  const feature = FEATURES[activeFeature]

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset timer on manual switch
  useEffect(() => {
    if (paused || suspended) return
    const t = setInterval(
      () => setActiveFeature((i) => (i + 1) % FEATURES.length),
      5000
    )
    return () => clearInterval(t)
  }, [paused, suspended, activeFeature])

  return (
    <section id='features' className='container section'>
      <div className='section-head reveal'>
        <h2>Что внутри приложения</h2>
        <p>Листайте экраны — как в сторе, только интерактивно.</p>
      </div>
      <div className='showcase reveal'>
        <div
          className='showcase-list'
          role='tablist'
          aria-label='Экраны приложения'
        >
          {FEATURES.map((f, i) => (
            <button
              key={f.title}
              type='button'
              role='tab'
              aria-selected={i === activeFeature}
              className={`showcase-tab${i === activeFeature ? ' is-active' : ''}`}
              style={{ ['--tab-color' as string]: f.color }}
              onClick={() => setActiveFeature(i)}
              onMouseEnter={() => setPaused(true)}
              onFocus={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onBlur={() => setPaused(false)}
            >
              <span className='tab-title'>{f.title}</span>
              <span className='tab-text'>{f.text}</span>
              {i === activeFeature && (
                <span className='tab-progress' aria-hidden='true' />
              )}
            </button>
          ))}
        </div>
        <div
          className='showcase-shot'
          style={{ backgroundImage: `url(${feature.bg})` }}
          key={feature.img}
        >
          <img
            src={feature.img}
            alt={feature.alt}
            loading='lazy'
            className='shot-fade'
          />
        </div>
      </div>
    </section>
  )
}
