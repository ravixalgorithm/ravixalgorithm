const apiUrl = "http://localhost:3000/api/openreadme?n=Ravi&g=ravixalgorithm&x=ravixalgorithm&l=ravixalgorithm&i=https%3A%2F%2Fmedia.licdn.com%2Fdms%2Fimage%2Fv2%2FD5603AQEYV5Z58t6l8A%2Fprofile-displayphoto-scale_400_400%2FB56ZnhgPOWHkAg-%2F0%2F1760424951727%3Fe%3D1762992000%26v%3Dbeta%26t%3DMKHu8SkrqGJ5rDg4ETT1hW5eFRDbi02iOv1YD0od9Es&p=github.com%2Fopen-dev-society&z=3ec09";
/*
  This file is a template. We will prepend a runtime-generated
  const apiUrl = "..." line before serving it to the user.
*/

import https from 'node:https'
import fs from 'node:fs'

const outPath = 'openreadme.png'

function download(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    https.get(url, (response) => {
      if (response.statusCode && response.statusCode >= 400) {
        return reject(new Error(`Failed: ${response.statusCode}`))
      }
      response.pipe(file)
      file.on('finish', () => file.close(() => resolve()))
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err))
    })
  })
}

async function main() {
  if (typeof apiUrl === 'undefined') {
    throw new Error('apiUrl not injected')
  }
  console.log('Fetching image from:', apiUrl)
  await download(apiUrl, outPath)
  console.log('Saved to', outPath)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
