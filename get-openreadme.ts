const apiUrl = "http://openreadme.vercel.app/api/openreadme?n=Ravi&g=ravixalgorithm&x=ravixalgorithm&l=ravixalgorithm&i=&p=&z=0016e";
/*
  This file is a template. We will prepend a runtime-generated
  const apiUrl = "..." line before serving it to the user.
*/

import https from 'node:https'
import fs from 'node:fs'
import path from 'node:path'

// Write the image inside public so Next.js can serve it
const outPath = process.env.OPENREADME_OUTPUT || 'public/openreadme.png'
// Ensure output directory exists
fs.mkdirSync(path.dirname(outPath), { recursive: true })

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

// UI injects: const apiUrl = "https://your-domain/api/openreadme?...";
// Do not change the injected apiUrl line.

async function main() {
  try {
    if (typeof apiUrl !== "string" || !apiUrl.startsWith("http")) {
      throw new Error("Invalid apiUrl injected into get-openreadme.ts")
    }

    const res = await fetch(apiUrl, { method: "GET", cache: "no-store" })
    if (!res.ok) {
      throw new Error(`API request failed: ${res.status} ${res.statusText}`)
    }

    // Expect JSON like { ok: true, url: "https://..." }
    const data: any = await res.json().catch(() => ({}))
    if (data?.error) {
      throw new Error(`API error: ${data.error}`)
    }
    console.log("OpenReadme refresh triggered:", data?.url ?? "(no url)")

    // If an image URL is provided, download and overwrite the public file
    const imageUrl: string | undefined = data?.url
    if (typeof imageUrl === 'string' && imageUrl.startsWith('http')) {
      console.log(`Downloading image to ${outPath} ...`)
      await download(imageUrl, outPath)
      console.log('Image updated.')
    } else {
      console.log('No image URL returned; nothing to download.')
    }
  } catch (err) {
    console.error("[OpenReadme] Refresh failed:", err)
    process.exit(1)
  }
}

main()
