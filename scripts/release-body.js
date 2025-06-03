import {execSync} from 'child_process'
import path from 'path'
import {fileURLToPath} from 'url'
import {readFileSync} from 'fs'

const dirname = path.join(path.dirname(fileURLToPath(import.meta.url)))
const conventionalChangelog = path.join(dirname, '..', 'node_modules', '.bin', 'conventional-changelog')
const packageJsonPath = path.join(dirname, '..', 'package.json')
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
const version = packageJson.version

// sometimes release-count 1 is empty
let releaseChangelog = 
  execSync(`${conventionalChangelog} --preset angular --release-count 1`).toString() || 
  execSync(`${conventionalChangelog} --preset angular --release-count 2`).toString()

// format
releaseChangelog = releaseChangelog.trim().replace(/\n\n+/g, '\n\n')

const releaseBody = `This version fixes a bug where the android app would launch in fullscreen mode.

- Web app: https://plebchan.app
- Decentralized web app: https://plebchan.eth (only works on [Brave Browser](https://brave.com/) or via [IPFS Companion](https://docs.ipfs.tech/install/ipfs-companion/#prerequisites))

## Downloads

- Android app: [Download APK](https://github.com/plebbit/plebchan/releases/download/v${version}/plebchan-${version}.apk)
- Linux app: [Download AppImage](https://github.com/plebbit/plebchan/releases/download/v${version}/plebchan-${version}.AppImage)
- macOS app: [Download DMG](https://github.com/plebbit/plebchan/releases/download/v${version}/plebchan-${version}.dmg)
- Windows app: [Download EXE](https://github.com/plebbit/plebchan/releases/download/v${version}/plebchan.Setup.${version}.exe)

${releaseChangelog}`

console.log(releaseBody)