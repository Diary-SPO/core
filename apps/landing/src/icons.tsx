export function ApkIcon() {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      aria-hidden='true'
    >
      <path
        d='M12 4v11m0 0 4-4m-4 4-4-4M4.5 19.5h15'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export function WebIcon() {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      aria-hidden='true'
    >
      <circle cx='12' cy='12' r='8.5' stroke='currentColor' strokeWidth='1.8' />
      <path
        d='M3.5 12h17M12 3.5c2.5 2.4 3.8 5.2 3.8 8.5s-1.3 6.1-3.8 8.5c-2.5-2.4-3.8-5.2-3.8-8.5S9.5 5.9 12 3.5Z'
        stroke='currentColor'
        strokeWidth='1.5'
      />
    </svg>
  )
}

export function ThemeIcon({ dark }: { dark: boolean }) {
  return dark ? (
    <svg
      width='18'
      height='18'
      viewBox='0 0 24 24'
      fill='none'
      aria-hidden='true'
    >
      <circle cx='12' cy='12' r='4.5' stroke='currentColor' strokeWidth='1.8' />
      <path
        d='M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5 5l1.8 1.8M17.2 17.2 19 19M19 5l-1.8 1.8M6.8 17.2 5 19'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
      />
    </svg>
  ) : (
    <svg
      width='18'
      height='18'
      viewBox='0 0 24 24'
      fill='none'
      aria-hidden='true'
    >
      <path
        d='M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`faq-chevron${open ? ' is-open' : ''}`}
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      aria-hidden='true'
    >
      <path
        d='m6 9 6 6 6-6'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export function CopyIcon() {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 24 24'
      fill='none'
      aria-hidden='true'
    >
      <rect
        x='9'
        y='9'
        width='11'
        height='11'
        rx='2'
        stroke='currentColor'
        strokeWidth='1.8'
      />
      <path
        d='M5 15V6a2 2 0 0 1 2-2h9'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
      />
    </svg>
  )
}

export function GlobeIcon() {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      aria-hidden='true'
    >
      <circle cx='12' cy='12' r='8.5' stroke='currentColor' strokeWidth='1.8' />
      <path
        d='M3.5 12h17M12 3.5c2.5 2.4 3.8 5.2 3.8 8.5s-1.3 6.1-3.8 8.5c-2.5-2.4-3.8-5.2-3.8-8.5S9.5 5.9 12 3.5Z'
        stroke='currentColor'
        strokeWidth='1.5'
      />
    </svg>
  )
}

export function CalendarIcon() {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      aria-hidden='true'
    >
      <rect
        x='4'
        y='5.5'
        width='16'
        height='15'
        rx='2.5'
        stroke='currentColor'
        strokeWidth='1.8'
      />
      <path
        d='M4 10h16M8.5 3.5v4M15.5 3.5v4'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
      />
    </svg>
  )
}

export function TrendIcon() {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      aria-hidden='true'
    >
      <path
        d='M4 19.5 9.5 14l3.5 3.5L20 10'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M15 10h5v5'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export function MegaphoneIcon() {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      aria-hidden='true'
    >
      <path
        d='M4 10v4h3l6 4V6l-6 4H4Z'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinejoin='round'
      />
      <path
        d='M16.5 9.5a4 4 0 0 1 0 5M19 7a8 8 0 0 1 0 10'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
      />
    </svg>
  )
}

export function CheckIcon() {
  return (
    <svg
      width='18'
      height='18'
      viewBox='0 0 24 24'
      fill='none'
      aria-hidden='true'
    >
      <path
        d='m5 12.5 4.5 4.5L19 7.5'
        stroke='currentColor'
        strokeWidth='2.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

export function CrossIcon() {
  return (
    <svg
      width='18'
      height='18'
      viewBox='0 0 24 24'
      fill='none'
      aria-hidden='true'
    >
      <path
        d='M7 7l10 10M17 7 7 17'
        stroke='currentColor'
        strokeWidth='2.5'
        strokeLinecap='round'
      />
    </svg>
  )
}

export function VkIcon() {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='currentColor'
      aria-hidden='true'
    >
      <path d='M12.93 17.5c-5.4 0-8.5-3.7-8.63-9.9h2.7c.09 4.54 2.1 6.46 3.69 6.86V7.6h2.55v3.9c1.56-.17 3.2-1.95 3.75-3.9h2.55c-.71 2.7-2.55 4.7-3.8 5.32 1.25.6 3.25 2.14 4.01 4.58h-2.8c-.6-1.9-2.1-3.37-4.34-3.58v3.58h-.65Z' />
    </svg>
  )
}

export function GithubIcon() {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='currentColor'
      aria-hidden='true'
    >
      <path d='M12 2.5A9.5 9.5 0 0 0 2.5 12c0 4.2 2.72 7.76 6.5 9.02.48.09.65-.2.65-.46v-1.63c-2.65.58-3.21-1.13-3.21-1.13-.43-1.1-1.06-1.4-1.06-1.4-.86-.6.07-.58.07-.58.95.07 1.46.98 1.46.98.85 1.46 2.24 1.04 2.78.8.09-.63.33-1.04.6-1.28-2.11-.24-4.33-1.06-4.33-4.7 0-1.04.37-1.9.98-2.56-.1-.25-.42-1.22.09-2.54 0 0 .8-.25 2.62.98a9.1 9.1 0 0 1 4.76 0c1.82-1.23 2.62-.98 2.62-.98.51 1.32.19 2.29.09 2.54.61.66.98 1.52.98 2.56 0 3.65-2.23 4.45-4.35 4.69.35.3.65.88.65 1.78v2.64c0 .26.17.56.66.46A9.5 9.5 0 0 0 21.5 12 9.5 9.5 0 0 0 12 2.5Z' />
    </svg>
  )
}
