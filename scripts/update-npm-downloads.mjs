import { readFile, writeFile } from 'node:fs/promises'

const PACKAGE_NAME = '@peermetrics/webrtc-stats'
const TEMPLATE_PATH = new URL('../index.template.html', import.meta.url)
const OUTPUT_PATH = new URL('../index.html', import.meta.url)
const FALLBACK_DOWNLOADS = '115,836'
const FALLBACK_RANGE = 'May 14-20, 2026'

function formatRange(start, end) {
  const startDate = new Date(`${start}T00:00:00Z`)
  const endDate = new Date(`${end}T00:00:00Z`)
  const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' })
  const dayFormatter = new Intl.DateTimeFormat('en-US', { day: 'numeric', timeZone: 'UTC' })
  const yearFormatter = new Intl.DateTimeFormat('en-US', { year: 'numeric', timeZone: 'UTC' })

  const startMonth = monthFormatter.format(startDate)
  const endMonth = monthFormatter.format(endDate)
  const startDay = dayFormatter.format(startDate)
  const endDay = dayFormatter.format(endDate)
  const endYear = yearFormatter.format(endDate)

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}-${endDay}, ${endYear}`
  }

  return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${endYear}`
}

async function getWeeklyDownloads() {
  const url = `https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(PACKAGE_NAME)}`
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'peermetrics-page-build'
    }
  })

  if (!response.ok) {
    throw new Error(`npm downloads API returned ${response.status}`)
  }

  const payload = await response.json()
  if (typeof payload.downloads !== 'number' || !payload.start || !payload.end) {
    throw new Error('npm downloads API payload was incomplete')
  }

  return {
    downloads: payload.downloads.toLocaleString('en-US'),
    range: formatRange(payload.start, payload.end)
  }
}

async function main() {
  const template = await readFile(TEMPLATE_PATH, 'utf8')

  let downloads = FALLBACK_DOWNLOADS
  let range = FALLBACK_RANGE

  try {
    const liveStats = await getWeeklyDownloads()
    downloads = liveStats.downloads
    range = liveStats.range
  } catch (error) {
    console.warn(`[build:content] Using fallback npm downloads metric: ${error.message}`)
  }

  const html = template
    .replaceAll('__NPM_WEEKLY_DOWNLOADS__', downloads)
    .replaceAll('__NPM_WEEKLY_RANGE__', range)

  await writeFile(OUTPUT_PATH, html, 'utf8')
  console.log(`[build:content] ${PACKAGE_NAME}: ${downloads} downloads for ${range}`)
}

await main()
