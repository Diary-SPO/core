import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { renderToString } from 'react-dom/server'
import { App } from '../src/App'

const indexPath = fileURLToPath(new URL('../dist/index.html', import.meta.url))
const placeholder = '<div id="root"></div>'

const html = await readFile(indexPath, 'utf8')
if (!html.includes(placeholder)) {
  throw new Error(`Не найден контейнер ${placeholder} в ${indexPath}`)
}

const appHtml = renderToString(<App />)
await writeFile(
  indexPath,
  html.replace(placeholder, `<div id="root">${appHtml}</div>`)
)

console.log(
  `Prerendered landing: ${(appHtml.length / 1024).toFixed(1)} kB of HTML`
)
