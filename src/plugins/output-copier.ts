// Copy integrations output
// It's a known problem on Astro v5, causing output-dependened integrations
// files missing on the final build.
// This plugin helps to copy the output files to the final build.
// See:
// - https://github.com/withastro/astro/issues/12663
// - https://github.com/withastro/adapters/issues/445

import { cp, readdir } from 'node:fs/promises'
import * as path from 'node:path'
import type { AstroIntegration, AstroIntegrationLogger } from 'astro'

const copierTasks = {
  sitemap: sitemapCopier,
  pagefind: pagefindCopier
}

export type OutputCopierOptions = {
  integ: Array<'sitemap' | 'pagefind'>
}

export const outputCopier = (
  opts: OutputCopierOptions = { integ: ['sitemap'] }
): AstroIntegration => ({
  name: 'output-copier',
  hooks: {
    'astro:build:done': async ({ logger }) => {
      const buildLogger = logger.fork('output-copier')
      buildLogger.info('Copying output files from dist to vercel out')

      await Promise.all(
        opts.integ.map(async (integ) => {
          const copier = copierTasks[integ]
          if (copier) {
            await copier(buildLogger)
          } else {
            buildLogger.warn(`No copier found for integration: ${integ}`)
          }
        })
      )
    }
  }
})

async function sitemapCopier(logger: AstroIntegrationLogger) {
  logger.info('[sitemap] Copying XML files to .vercel/output/static')
  try {
    // Try to read from dist/client first (server mode), then dist (static mode)
    let distDir = './dist/client'
    try {
      await readdir(distDir)
    } catch {
      distDir = './dist'
    }

    const files = await readdir(distDir)
    const xmlFiles = files.filter(
      (file) =>
        path.extname(file).toLowerCase() === '.xml' &&
        path.basename(file).toLowerCase().startsWith('sitemap')
    )
    logger.info(xmlFiles.join(', '))
    await Promise.all(
      xmlFiles.map(async (file) => {
        const sourcePath = path.join(distDir, file)
        const destPath = path.join('./.vercel/output/static', file)
        await cp(sourcePath, destPath)
      })
    )
  } catch (error) {
    logger.error(`[sitemap] Error copying files: ${error}`)
  }
}

async function pagefindCopier(logger: AstroIntegrationLogger) {
  logger.info('[pagefind] Copying pagefind folder to .vercel/output/static')
  // Try to find pagefind in dist/client first (server mode), then dist (static mode)
  let sourcePath = './dist/client/pagefind'
  let destPath = './.vercel/output/static/pagefind'
  
  try {
    await readdir(sourcePath)
  } catch {
    sourcePath = './dist/pagefind'
  }

  try {
    await cp(sourcePath, destPath, { recursive: true })
  } catch (error) {
    logger.error(`[pagefind] Error copying folder: ${error}`)
  }
}
