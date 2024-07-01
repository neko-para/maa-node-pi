import { ProjectInterfaceData } from '..'

const testDir =
  process.platform === 'darwin'
    ? '/Users/nekosu/Documents/Projects/MAA/MaaHatsuboshiTA/install'
    : 'E:/Projects/MAA/MaaHatsuboshiTA/install'

async function main() {
  const pi = new ProjectInterfaceData()
  await pi.load(testDir)
  console.log(pi.data)
  console.log(pi.validate())
}

main()
