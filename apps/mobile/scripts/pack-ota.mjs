#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
/**
 * Собирает OTA zip + manifest.json из apps/mobile/dist.
 *
 * Env:
 *   OTA_VERSION   semver бандла (обязательно)
 *   OTA_CHANNEL   stable | beta (default stable)
 *   OTA_NOTES     текст для пользователя
 *   MIN_NATIVE    versionCode, ниже которого нужен APK (default из build.gradle)
 *   OTA_BASE_URL  https://diary-spo.github.io/mobile
 *   OUT_DIR       куда положить артефакты (default apps/mobile/ota-dist)
 */
import { createHash } from 'node:crypto'
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync
} from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const mobileRoot = resolve(__dirname, '..')
const distDir = join(mobileRoot, 'dist')
const gradleFile = join(mobileRoot, 'android/app/build.gradle')

const version = process.env.OTA_VERSION?.trim()
const channel = (process.env.OTA_CHANNEL || 'stable').trim()
const notes =
  process.env.OTA_NOTES?.trim() || 'Улучшения интерфейса и исправления'
const baseUrl = (
  process.env.OTA_BASE_URL || 'https://diary-spo.github.io/mobile'
).replace(/\/$/, '')
const outDir = resolve(process.env.OUT_DIR || join(mobileRoot, 'ota-dist'))

if (!version) {
  console.error('OTA_VERSION is required (semver)')
  process.exit(1)
}
if (channel !== 'stable' && channel !== 'beta') {
  console.error('OTA_CHANNEL must be stable or beta')
  process.exit(1)
}
if (!existsSync(join(distDir, 'index.html'))) {
  console.error(`No build in ${distDir}. Run bun run build first.`)
  process.exit(1)
}

const readMinNative = () => {
  if (process.env.MIN_NATIVE) return Number.parseInt(process.env.MIN_NATIVE, 10)
  const gradle = readFileSync(gradleFile, 'utf8')
  const match = gradle.match(/versionCode\s+(\d+)/)
  return match ? Number.parseInt(match[1], 10) : 1
}

const minNative = readMinNative()
if (!Number.isFinite(minNative) || minNative < 1) {
  console.error('Invalid MIN_NATIVE / versionCode')
  process.exit(1)
}

rmSync(outDir, { recursive: true, force: true })
mkdirSync(outDir, { recursive: true })

const zipPath = join(outDir, 'bundle.zip')
const zip = spawnSync('zip', ['-r', '-q', zipPath, '.', '-x', '*.map'], {
  cwd: distDir,
  stdio: 'inherit'
})
if (zip.status !== 0) {
  console.error('zip failed')
  process.exit(zip.status || 1)
}

const checksum = createHash('sha256')
  .update(readFileSync(zipPath))
  .digest('hex')
const bundleUrl = `${baseUrl}/${channel}/bundle.zip`

const manifest = {
  version,
  minNative,
  url: bundleUrl,
  checksum,
  notes,
  channel,
  builtAt: new Date().toISOString()
}

writeFileSync(
  join(outDir, 'manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`
)
copyFileSync(zipPath, join(outDir, 'bundle.zip'))

console.log(JSON.stringify(manifest, null, 2))
console.log(`OTA artifacts written to ${outDir}`)
