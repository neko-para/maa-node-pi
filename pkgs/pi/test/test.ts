import { ProjectInterfaceData } from '..'

async function main() {
  const pi = new ProjectInterfaceData()
  await pi.load('E:/Projects/MAA/MaaHatsuboshiTA/install')
  console.log(pi.data)
  console.log(pi.validate())
}

main()
