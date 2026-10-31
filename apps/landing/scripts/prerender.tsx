import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { renderToString } from 'react-dom/server'
import { App } from '../src/App'
import { REGIONS } from '../src/lib/regions'
import { DnevnikNeOtkryvaetsyaPage } from '../src/pages/dnevnik-spo-ne-otkryvaetsya'
import { DnevnikNeRabotaetPage } from '../src/pages/dnevnik-spo-ne-rabotaet'
import { DnevnikOshibkaZaprosaPage } from '../src/pages/dnevnik-spo-oshibka-zaprosa'
import { RegionalPage } from '../src/pages/RegionalPage'
import { RegionsPage } from '../src/pages/regions'
import { SkachatPage } from '../src/pages/skachat'
import { VhodPage } from '../src/pages/vhod'
import { VhodGosuslugiPage } from '../src/pages/vhod-cherez-gosuslugi'

const distPath = fileURLToPath(new URL('../dist', import.meta.url))
const indexPath = fileURLToPath(new URL('../dist/index.html', import.meta.url))
const placeholder = '<div id="root"></div>'

const html = await readFile(indexPath, 'utf8')
if (!html.includes(placeholder)) {
  throw new Error(`Не найден контейнер ${placeholder} в ${indexPath}`)
}

const pages = [
  {
    path: 'index.html',
    component: <App />,
    title: 'Дневник СПО — Сетевой город в удобном приложении для Android'
  },
  {
    path: 'skachat/index.html',
    component: <SkachatPage />,
    title:
      'Скачать Дневник СПО — приложение для колледжа на Android (APK и RuStore)'
  },
  {
    path: 'vhod/index.html',
    component: <VhodPage />,
    title: 'Как войти в Дневник СПО — инструкция для студентов'
  },
  {
    path: 'vhod-cherez-gosuslugi/index.html',
    component: <VhodGosuslugiPage />,
    title: 'Вход в Дневник СПО через Госуслуги (ЕСИА)'
  },
  {
    path: 'dnevnik-spo-ne-otkryvaetsya/index.html',
    component: <DnevnikNeOtkryvaetsyaPage />,
    title: 'Дневник СПО не открывается: причины и решение'
  },
  {
    path: 'dnevnik-spo-oshibka-zaprosa/index.html',
    component: <DnevnikOshibkaZaprosaPage />,
    title: 'Ошибка запроса в Дневнике СПО при входе — решение'
  },
  {
    path: 'dnevnik-spo-ne-rabotaet/index.html',
    component: <DnevnikNeRabotaetPage />,
    title: 'Не работает Сетевой город в Дневнике СПО — причины'
  },
  {
    path: 'regions/index.html',
    component: <RegionsPage />,
    title: 'Все регионы Дневник СПО — список поддерживаемых областей'
  },
  ...REGIONS.map((region: any) => ({
    path: `dnevnik-spo-${region.code}/index.html`,
    component: <RegionalPage region={region} />,
    title: `Дневник СПО ${region.code} — электронный дневник колледжа ${region.name}`
  }))
]

for (const page of pages) {
  const appHtml = renderToString(page.component)
  const pageHtml = html
    .replace(placeholder, `<div id="root">${appHtml}</div>`)
    .replace(/<title>.*?<\/title>/, `<title>${page.title}</title>`)

  const pagePath = fileURLToPath(
    new URL(`../dist/${page.path}`, import.meta.url)
  )

  // Создать родительскую директорию если путь содержит вложенность
  if (page.path.includes('/')) {
    const dirPath = pagePath.substring(0, pagePath.lastIndexOf('/'))
    await mkdir(dirPath, { recursive: true })
  }

  await writeFile(pagePath, pageHtml)

  console.log(
    `Prerendered ${page.path}: ${(appHtml.length / 1024).toFixed(1)} kB of HTML`
  )
}

console.log('All pages prerendered successfully')
