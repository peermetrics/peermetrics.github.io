import { cp, mkdir, rm } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = resolve(rootDir, 'public')

const assetsToCopy = [
  ['static/js/peermetrics.js', 'public/static/js/peermetrics.js'],
  ['static/js/app-dashboard/index.min.js', 'public/static/js/app-dashboard/index.min.js'],
  ['static/js/conference/index.min.js', 'public/static/js/conference/index.min.js'],
  ['static/js/demo/app-dashboard.js', 'public/static/js/demo/app-dashboard.js'],
  ['static/js/demo/demo-conference.js', 'public/static/js/demo/demo-conference.js'],
  ['static/js/demo/conference', 'public/static/js/demo/conference'],
  ['static/img/favicon/browserconfig.xml', 'public/static/img/favicon/browserconfig.xml'],
]

await rm(resolve(publicDir, 'static/js/demo'), { recursive: true, force: true })

for (const [source, destination] of assetsToCopy) {
  const sourcePath = resolve(rootDir, source)
  const destinationPath = resolve(rootDir, destination)

  await mkdir(dirname(destinationPath), { recursive: true })
  await cp(sourcePath, destinationPath, { recursive: true })
}
