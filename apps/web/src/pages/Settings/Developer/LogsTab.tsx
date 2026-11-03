import { shareContent } from '@runtime-api'
import { Icon28DownloadOutline, Icon28SearchOutline } from '@vkontakte/icons'
import {
  CellButton,
  FormItem,
  Group,
  Header,
  NativeSelect,
  Search,
  SimpleCell,
  Text
} from '@vkontakte/vkui'
import { type ChangeEvent, type FC, useEffect, useMemo, useState } from 'react'

import {
  type AppLogCategory,
  type AppLogEntry,
  clearAppLogs,
  getAppLogs,
  subscribeAppLogs
} from '../../../shared/utils/appLog'

type LogFilter = 'all' | AppLogCategory

const PAGE_SIZE = 100

const FILTERS: Array<{ label: string; value: LogFilter }> = [
  { label: 'Все', value: 'all' },
  { label: 'Уведомления', value: 'notifications' },
  { label: 'Авторизация', value: 'auth' },
  { label: 'Дневник', value: 'diary' },
  { label: 'Система', value: 'system' }
]

const formatTime = (at: number) => {
  const date = new Date(at)
  return `${date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit'
  })} ${date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })}`
}

const formatEntry = (entry: AppLogEntry) => {
  const line = `[${formatTime(entry.at)}] [${entry.category}] ${entry.message}`
  return entry.detail ? `${line}\n${entry.detail}` : line
}

const matchesQuery = (entry: AppLogEntry, query: string) => {
  if (!query) return true
  return formatEntry(entry).toLowerCase().includes(query)
}

const downloadTextFile = (filename: string, text: string) => {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.rel = 'noopener'
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

const LogRow: FC<{ entry: AppLogEntry }> = ({ entry }) => (
  <SimpleCell multiline>
    <Text
      style={{
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        fontSize: 12,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
      }}
    >
      {formatEntry(entry)}
    </Text>
  </SimpleCell>
)

const LogsTab: FC = () => {
  const [filter, setFilter] = useState<LogFilter>('all')
  const [query, setQuery] = useState('')
  const [limit, setLimit] = useState(PAGE_SIZE)
  const [logs, setLogs] = useState<AppLogEntry[]>(() => getAppLogs())
  const [exporting, setExporting] = useState(false)

  useEffect(() => subscribeAppLogs(() => setLogs(getAppLogs())), [])

  const normalizedQuery = query.trim().toLowerCase()

  const filtered = useMemo(() => {
    const byCategory =
      filter === 'all'
        ? logs
        : logs.filter((entry) => entry.category === filter)
    if (!normalizedQuery) return byCategory
    return byCategory.filter((entry) => matchesQuery(entry, normalizedQuery))
  }, [filter, logs, normalizedQuery])

  const visible = filtered.slice(0, limit)
  const hasMore = filtered.length > limit

  const resetPaging = () => setLimit(PAGE_SIZE)

  const exportLogs = async () => {
    if (!filtered.length || exporting) return
    setExporting(true)
    try {
      const text = filtered.map(formatEntry).join('\n\n')
      const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')
      const filename = `diaryspo-logs-${stamp}.txt`
      const shared = await shareContent({
        title: filename,
        text,
        dialogTitle: 'Сохранить логи'
      })
      if (!shared) downloadTextFile(filename, text)
    } finally {
      setExporting(false)
    }
  }

  return (
    <>
      <Group header={<Header size='s'>Фильтр</Header>}>
        <Search
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            resetPaging()
          }}
          placeholder='Поиск по логам'
          icon={<Icon28SearchOutline />}
        />
        <FormItem top='Тип событий'>
          <NativeSelect
            value={filter}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => {
              setFilter(event.currentTarget.value as LogFilter)
              resetPaging()
            }}
          >
            {FILTERS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </NativeSelect>
        </FormItem>
        <CellButton
          before={<Icon28DownloadOutline />}
          disabled={!filtered.length || exporting}
          onClick={() => void exportLogs()}
        >
          Скачать логи
        </CellButton>
        <CellButton
          appearance='negative'
          disabled={logs.length === 0}
          onClick={() => clearAppLogs()}
        >
          Очистить лог
        </CellButton>
      </Group>

      <Group
        header={
          <Header size='s' indicator={`${visible.length}/${filtered.length}`}>
            Записи
          </Header>
        }
      >
        {visible.length === 0 ? (
          <SimpleCell multiline>
            <Text style={{ color: 'var(--vkui--color_text_secondary)' }}>
              {logs.length === 0 ? 'Пока пусто' : 'Ничего не найдено'}
            </Text>
          </SimpleCell>
        ) : (
          <>
            {visible.map((entry) => (
              <LogRow key={entry.id} entry={entry} />
            ))}
            {hasMore && (
              <CellButton
                onClick={() => setLimit((value) => value + PAGE_SIZE)}
              >
                Ещё {Math.min(PAGE_SIZE, filtered.length - limit)}
              </CellButton>
            )}
          </>
        )}
      </Group>
    </>
  )
}

export default LogsTab
