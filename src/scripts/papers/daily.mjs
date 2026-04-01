import fs from 'node:fs'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'

import { ImapFlow } from 'imapflow'
import { simpleParser } from 'mailparser'

const SCRIPT_DIR = path.resolve('src/scripts/papers')
const CONFIG_PATH = path.join(SCRIPT_DIR, 'config.json')
const DEFAULT_CONFIG_PATH = path.join(SCRIPT_DIR, 'config.example.json')
const OUTPUT_ROOT = path.resolve('src/content/blogs')
const DEBUG_ROOT = path.resolve('data/papers')
const MAX_PAPERS_PER_DAY = 15
const DEFAULT_TIMEZONE = 'Asia/Shanghai'
const PREDEFINED_SECTIONS = [
  // Visual Reasoning
  { id: 'visual-reasoning:grounding-driven-visual-reasoning', title: 'Grounding-driven Visual Reasoning', outer: 'visual-reasoning' },
  { id: 'visual-reasoning:thinking-with-images', title: 'Thinking with Images', outer: 'visual-reasoning' },
  { id: 'visual-reasoning:thinking-with-code-structure', title: 'Thinking with Code/Structure', outer: 'visual-reasoning' },
  { id: 'visual-reasoning:multimodal-agent', title: 'Multimodal Agent', outer: 'visual-reasoning' },
  { id: 'visual-reasoning:3d-space-reasoning', title: '3D/Space Reasoning', outer: 'visual-reasoning' },
  // Agent / 3D Agent / Embodied
  { id: 'general-agent:3d-llm', title: '3D LLM', outer: 'general-agent' },
  { id: 'general-agent:3d-agent', title: '3D Agent', outer: 'general-agent' },
  { id: 'general-agent:embodied-agent', title: 'Embodied Agent', outer: 'general-agent' },
  { id: 'general-agent:spatial-intelligence', title: 'Spatial Intelligence (Image/Video)', outer: 'general-agent' },
  { id: 'general-agent:4d-understanding-generation', title: '4D Understanding and Generation', outer: 'general-agent' },
  { id: 'general-agent:agent-training-evaluation', title: 'Agent Training and Evaluation', outer: 'general-agent' },
  // Multimodal World Model / Video
  { id: 'video-world-model:world-models', title: 'Multimodal World Model', outer: 'video-world-model' },
]

function loadConfig() {
  const source = fs.existsSync(CONFIG_PATH) ? CONFIG_PATH : DEFAULT_CONFIG_PATH
  return JSON.parse(fs.readFileSync(source, 'utf8'))
}

function getDateKeyInTimeZone(date, timeZone = DEFAULT_TIMEZONE) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date)
  const pick = (type) => parts.find((p) => p.type === type)?.value || '00'
  return `${pick('year')}-${pick('month')}-${pick('day')}`
}

function getMinutesInTimeZone(date, timeZone = DEFAULT_TIMEZONE) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).formatToParts(date)
  const pick = (type) => Number(parts.find((p) => p.type === type)?.value || 0)
  return pick('hour') * 60 + pick('minute')
}

function parseHHMM(value, fallbackMinutes) {
  if (typeof value !== 'string') return fallbackMinutes
  const m = value.match(/^(\d{1,2}):(\d{2})$/)
  if (!m) return fallbackMinutes
  const hour = Number(m[1])
  const minute = Number(m[2])
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return fallbackMinutes
  return hour * 60 + minute
}

function nowDate(timeZone = DEFAULT_TIMEZONE) {
  return getDateKeyInTimeZone(new Date(), timeZone)
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function normalizeText(input) {
  return (input || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function cleanPaperTitle(title) {
  return normalizeText(
    (title || '')
      .replace(/\(\s*\d+\s*(▲|upvotes?)?\s*\)/gi, '')
      .replace(/\s*-\s*Hugging Face\s*$/i, '')
  )
}

function normalizePaperUrl(inputUrl) {
  const cleaned = (inputUrl || '').replace(/[)\],.;]+$/, '')
  try {
    const u = new URL(cleaned)
    if (u.hostname.includes('huggingface.co')) {
      const m = u.pathname.match(/^\/papers\/([0-9]{4}\.[0-9]{4,5})/)
      if (m) return `https://huggingface.co/papers/${m[1]}`
    }
    if (u.hostname.includes('arxiv.org')) {
      const abs = u.pathname.match(/^\/abs\/([0-9]{4}\.[0-9]{4,5})/)
      if (abs) return `https://arxiv.org/abs/${abs[1]}`
      const pdf = u.pathname.match(/^\/pdf\/([0-9]{4}\.[0-9]{4,5})(v\d+)?(\.pdf)?$/)
      if (pdf) return `https://arxiv.org/abs/${pdf[1]}`
    }
    return cleaned
  } catch {
    return cleaned
  }
}

function isPaperUrl(url) {
  return (
    /^https:\/\/huggingface\.co\/papers\/[0-9]{4}\.[0-9]{4,5}$/i.test(url) ||
    /^https:\/\/arxiv\.org\/abs\/[0-9]{4}\.[0-9]{4,5}$/i.test(url)
  )
}

function extractArxivId(url) {
  if (!url) return null
  const hfMatch = url.match(/huggingface\.co\/papers\/([0-9]{4}\.[0-9]{4,5})/i)
  if (hfMatch) return hfMatch[1]
  const absMatch = url.match(/arxiv\.org\/abs\/([0-9]{4}\.[0-9]{4,5})(v\d+)?/i)
  if (absMatch) return absMatch[1]
  const pdfMatch = url.match(/arxiv\.org\/pdf\/([0-9]{4}\.[0-9]{4,5})(v\d+)?(\.pdf)?/i)
  if (pdfMatch) return pdfMatch[1]
  return null
}

function extractPapersFromText(input) {
  const papers = []
  const seen = new Set()

  const anchorRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gim
  for (const match of input.matchAll(anchorRegex)) {
    const rawUrl = match[1] || ''
    const linkText = match[2] || ''
    const url = normalizePaperUrl(rawUrl)
    if (!isPaperUrl(url) || seen.has(url)) continue
    const title = cleanPaperTitle(linkText) || 'Untitled Paper'
    papers.push({ title, url })
    seen.add(url)
  }

  const urlRegex = /(https?:\/\/[^\s)>"']+)/g
  for (const line of input.split('\n')) {
    const urls = line.match(urlRegex) || []
    for (const rawUrl of urls) {
      const url = normalizePaperUrl(rawUrl)
      if (!isPaperUrl(url) || seen.has(url)) continue
      const titleHint = cleanPaperTitle(line.replace(urlRegex, '').replace(/^[\-*\d\.)\s]+/, '').trim())
      papers.push({ title: titleHint || 'Untitled Paper', url })
      seen.add(url)
    }
  }

  return papers
}

function loadFineSectionsFromDocs() {
  return PREDEFINED_SECTIONS
}

async function fetchDailyMails(config, todayKey, timeZone = DEFAULT_TIMEZONE) {
  const email = config.email
  const user = process.env[email.userEnv]
  const pass = process.env[email.passEnv]
  if (!user || !pass) {
    throw new Error(`Missing env: ${email.userEnv} or ${email.passEnv}`)
  }

  const client = new ImapFlow({
    host: email.imapHost,
    port: email.imapPort,
    secure: email.secure,
    auth: { user, pass },
    logger: false
  })

  // Use broad IMAP query, then strictly keep only today's mails in local timezone.
  const since = new Date()
  since.setUTCDate(since.getUTCDate() - 2)

  const messages = []
  await client.connect()
  const lock = await client.getMailboxLock('INBOX')
  try {
    const query = { since, from: email.fromContains }
    for await (const msg of client.fetch(query, { source: true, envelope: true })) {
      const subject = (msg.envelope?.subject || '').toLowerCase()
      const matchSubject = email.subjectKeywords.every((k) => subject.includes(k.toLowerCase()))
      if (!matchSubject) continue
      const parsed = await simpleParser(msg.source)
      const mailDate = parsed.date instanceof Date ? parsed.date : null
      const mailDateKey = mailDate ? getDateKeyInTimeZone(mailDate, timeZone) : ''
      if (mailDateKey !== todayKey) continue
      const rawBody = `${parsed.text || ''}\n${parsed.html || ''}`
      messages.push({
        subject: parsed.subject || '',
        from: parsed.from?.text || '',
        date: parsed.date?.toISOString() || '',
        body: rawBody
      })
    }
  } finally {
    lock.release()
    await client.logout()
  }

  return messages
}

async function fetchTodayMailsWithOptionalWait(config, todayKey, timeZone) {
  const email = config.email || {}
  const waitEnabled =
    process.env.PAPERS_WAIT_FOR_TODAY_MAIL === 'true' || email.waitForTodayMail === true
  const intervalMinutes = Number(email.pollIntervalMinutes || 15)
  const endMinutes = parseHHMM(email.waitUntilLocal || '12:00', 12 * 60)

  while (true) {
    const mails = await fetchDailyMails(config, todayKey, timeZone)
    if (mails.length > 0) return mails
    if (!waitEnabled) return mails

    const nowMinutes = getMinutesInTimeZone(new Date(), timeZone)
    if (nowMinutes >= endMinutes) return mails

    console.log(
      `[papers] no today's mail yet, sleep ${intervalMinutes}m then retry (until ${email.waitUntilLocal || '12:00'} ${timeZone})`
    )
    await sleep(Math.max(1, intervalMinutes) * 60 * 1000)
  }
}

async function fetchArxivAbstract(url) {
  const arxivId = extractArxivId(url)
  if (!arxivId) return null
  try {
    // Fast path: arXiv API
    const apiUrl = `https://export.arxiv.org/api/query?id_list=${arxivId}`
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 12000)
    const res = await fetch(apiUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 papers-bot' },
      signal: controller.signal
    })
    clearTimeout(timer)
    if (!res.ok) return null
    const xml = await res.text()
    const summaryMatch = xml.match(/<summary>([\s\S]*?)<\/summary>/i)
    if (summaryMatch) return normalizeText(summaryMatch[1])

    // Fallback: arXiv abs HTML
    const absUrl = `https://arxiv.org/abs/${arxivId}`
    const htmlRes = await fetch(absUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 papers-bot' }
    })
    if (!htmlRes.ok) return null
    const html = await htmlRes.text()
    const blockquote = html.match(/<blockquote[^>]*class=["'][^"']*abstract[^"']*["'][^>]*>([\s\S]*?)<\/blockquote>/i)
    if (blockquote) return normalizeText(blockquote[1].replace(/^Abstract:\s*/i, ''))
    return null
  } catch {
    return null
  }
}

function classifyCategoryId(text) {
  const content = (text || '').toLowerCase()

  const agentKeywords = [
    'agent',
    'multi-agent',
    'sub-agent',
    'tool use',
    'planner',
    'reasoning trace',
    'embodied'
  ]
  const visualKeywords = [
    'visual reasoning',
    'vision-language',
    'grounding',
    'segmentation',
    'tracking',
    'image reasoning',
    'chart'
  ]
  const worldKeywords = [
    'world model',
    'video generation',
    'long video',
    'diffusion',
    'video understanding',
    'dynamics'
  ]

  const score = (keys) => keys.reduce((acc, key) => acc + (content.includes(key) ? 1 : 0), 0)

  const sAgent = score(agentKeywords)
  const sVisual = score(visualKeywords)
  const sWorld = score(worldKeywords)

  if (sAgent >= sVisual && sAgent >= sWorld && sAgent > 0) return 'general-agent'
  if (sVisual >= sAgent && sVisual >= sWorld && sVisual > 0) return 'visual-reasoning'
  return 'video-world-model'
}

function annotatePapersWithCodexChunk(papers, sections, chunkIndex = 0) {
  const tmpFile = path.join(path.resolve('/tmp'), `papers-fine-${Date.now()}-${chunkIndex}.json`)
  const payload = {
    sections: sections.map((s) => ({ id: s.id, title: s.title, outer: s.outer })),
    papers: papers.map((p) => ({
      url: p.url,
      title: p.title,
      summary_en: p.summary_en || ''
    }))
  }
  const prompt = [
    'You are a strict paper triage classifier for a personal daily research digest.',
    'For kept papers, write a Chinese summary for readers.',
    'If it does not clearly belong, drop it. Do NOT force-fit papers into any section.',
    '',
    'Rules:',
    '1) Use ONLY the provided sections and ids.',
    '2) For each paper return EXACTLY one decision item with the same url.',
    '3) If relevant: action="keep", section_id must be one of provided ids.',
    '4) If irrelevant/uncertain: action="drop", section_id must be null.',
    '5) If action="keep", summary_zh must be 3-8 Chinese sentences.',
    '6) summary_zh must cover: what the paper achieves, methods, and experimental results.',
    '7) If action="drop", summary_zh must be an empty string.',
    '',
    'Return strict JSON only, no markdown, no extra text.',
    'Schema:',
    '{"items":[{"url":"string","action":"keep|drop","section_id":"string|null","summary_zh":"string"}]}',
    '',
    JSON.stringify(payload)
  ].join('\n')

  try {
    console.log(`[papers] annotate papers with codex (chunk ${chunkIndex + 1}, ${papers.length} items)...`)
    execFileSync(
      'codex',
      [
        'exec',
        '--skip-git-repo-check',
        '--sandbox',
        'read-only',
        '-m',
        'gpt-5.1-codex-mini',
        '-c',
        'reasoning_effort="low"',
        '-o',
        tmpFile,
        prompt
      ],
      { stdio: 'pipe', timeout: 180000 }
    )
    const raw = fs.readFileSync(tmpFile, 'utf8')
    const parsed = JSON.parse(raw)
    const items = Array.isArray(parsed.items) ? parsed.items : []
    console.log(`[papers] codex annotations(chunk ${chunkIndex + 1}): ${items.length}`)
    return items
  } catch (err) {
    console.warn(`[papers] codex chunk ${chunkIndex + 1} failed: ${err?.message || err}`)
    return []
  }
}

function annotatePapersWithCodex(papers, sections) {
  const CHUNK_SIZE = 5
  const chunks = []
  for (let i = 0; i < papers.length; i += CHUNK_SIZE) {
    chunks.push(papers.slice(i, i + CHUNK_SIZE))
  }
  const all = []
  chunks.forEach((chunk, idx) => {
    const items = annotatePapersWithCodexChunk(chunk, sections, idx)
    all.push(...items)
  })
  console.log(`[papers] codex annotations(total): ${all.length}/${papers.length}`)
  return all
}

async function enrichPapers(papers) {
  const out = []
  for (const [idx, paper] of papers.entries()) {
    console.log(`[papers] fetch summary ${idx + 1}/${papers.length}: ${paper.url}`)
    const summaryEn = (await fetchArxivAbstract(paper.url)) || ''
    const title = cleanPaperTitle(paper.title)
    const categoryId = classifyCategoryId(`${title}\n${summaryEn}`)
    const summaryZh = summaryEn || 'No summary available.'
    out.push({
      title,
      url: paper.url,
      category_id: categoryId,
      summary_zh: summaryZh,
      summary_en: summaryEn
    })
  }
  return out
}

function pickFallbackSection(paper, sections) {
  const outer = classifyCategoryId(`${paper.title}\n${paper.summary_en || ''}`)
  const exact = sections.find((s) => s.outer === outer)
  return exact || sections[0]
}

function groupByFineSections(items, sections) {
  const map = new Map(sections.map((s) => [s.id, { ...s, papers: [] }]))
  for (const item of items) {
    const sec = map.get(item.section_id)
    if (sec) sec.papers.push(item)
  }
  return sections.map((s) => map.get(s.id)).filter(Boolean)
}

function mdxProp(value) {
  return `{${JSON.stringify(value)}}`
}

function renderMdx(date, groups, config) {
  const title = `Papers - ${date}`
  const hasAgent = groups.some((g) => g.outer === 'general-agent' && g.papers.length > 0)
  const hasVisual = groups.some((g) => g.outer === 'visual-reasoning' && g.papers.length > 0)
  const hasWorld = groups.some((g) => g.outer === 'video-world-model' && g.papers.length > 0)

  const tags = ['paper reading']
  if (hasAgent) tags.push('agent')
  if (hasVisual) tags.push('visual reasoning')
  if (hasWorld) tags.push('multimodal world model')

  const sectionLines = groups.map((group) => {
    if (!group.papers.length) return ''
    const cards = group.papers
      .map((paper) => {
        const arxivId = extractArxivId(paper.url)
        const arxivUrl = arxivId ? `https://arxiv.org/abs/${arxivId}` : paper.url
        const hjfyUrl = arxivId ? `https://hjfy.top/arxiv/${arxivId}` : paper.url
        return `<PaperCard\n  title=${mdxProp(paper.title)}\n  arxivUrl=${mdxProp(arxivUrl)}\n  hjfyUrl=${mdxProp(hjfyUrl)}\n  summary=${mdxProp(paper.summary_display || paper.summary_zh || paper.summary_en || 'No summary available.')}\n/>`
      })
      .join('\n\n')

    return `## ${group.title}\n\n<div class="space-y-4">\n${cards}\n</div>`
  })

  const heroImageLine = config?.papers?.heroImageUrl
    ? `heroImage: { src: "${config.papers.heroImageUrl}" }`
    : ''

  return `---
title: ${title}
description: "吾能观之数千而面色如故"
publishDate: ${date}
updatedDate: ${date}
tags: [${tags.map((x) => `'${x}'`).join(', ')}]
category: research
comment: true
${heroImageLine}
---

import PaperCard from '@/components/papers/PaperCard.astro'

${sectionLines.filter(Boolean).join('\n\n')}
`
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true })
}

function writeOutputs(date, mdx, debugData) {
  const postDir = path.join(OUTPUT_ROOT, `papers-${date}`)
  const postFile = path.join(postDir, 'index.mdx')
  const debugFile = path.join(DEBUG_ROOT, `${date}.raw.json`)

  ensureDir(postDir)
  ensureDir(DEBUG_ROOT)
  fs.writeFileSync(postFile, mdx, 'utf8')
  fs.writeFileSync(debugFile, JSON.stringify(debugData, null, 2), 'utf8')
  return { postFile, debugFile }
}

function updatePapersCollection() {
  const collectionFile = path.resolve('src/content/collection/papers.md')
  const entries = fs
    .readdirSync(OUTPUT_ROOT, { withFileTypes: true })
    .filter((x) => x.isDirectory() && x.name.startsWith('papers-'))
    .map((x) => x.name)
    .sort((a, b) => b.localeCompare(a))

  const blogListLines = entries.map((x) => `  - "${x}"`).join('\n')
  const content = `---
title: "Papers"
title_en: "Papers"
description: "每日论文整理与分类"
description_en: "Daily paper collection with AI classification"
bloglist:
${blogListLines}
---
`
  fs.writeFileSync(collectionFile, content, 'utf8')
  return collectionFile
}

function hasStagedChanges() {
  try {
    execFileSync('git', ['diff', '--cached', '--quiet'], { stdio: 'pipe' })
    return false
  } catch (err) {
    if (typeof err?.status === 'number' && err.status === 1) return true
    throw err
  }
}

function runDeployScript(scriptPath) {
  const resolved = path.isAbsolute(scriptPath) ? scriptPath : path.resolve(scriptPath)
  if (!fs.existsSync(resolved)) {
    throw new Error(`deploy script not found: ${resolved}`)
  }
  console.log(`[papers] deploy pages via ${resolved}`)
  execFileSync('bash', [resolved], { stdio: 'inherit' })
}

async function maybePublish(date, files, config) {
  const gitAutoPush =
    process.env.PAPERS_GIT_AUTOPUSH === 'true' || config?.publishing?.gitAutoPush === true
  const deployAfterPush =
    process.env.PAPERS_DEPLOY_GITHUB_PAGES === 'true' ||
    config?.publishing?.deployAfterPush === true
  const deployScript =
    process.env.PAPERS_DEPLOY_SCRIPT ||
    config?.publishing?.deployScript ||
    './deploy-to-github-pages.sh'

  if (!gitAutoPush && !deployAfterPush) return

  execFileSync('git', ['add', ...files], { stdio: 'inherit' })
  if (!hasStagedChanges()) {
    console.log('[papers] no staged changes, skip publish/deploy')
    return
  }

  if (gitAutoPush) {
    execFileSync('git', ['commit', '-m', `papers: ${date}`], { stdio: 'inherit' })
    execFileSync('git', ['push'], { stdio: 'inherit' })
  } else {
    console.log('[papers] git auto push disabled, skip commit/push')
  }

  if (deployAfterPush) {
    runDeployScript(deployScript)
  }
}

async function main() {
  const config = loadConfig()
  const timeZone = config?.email?.timezone || DEFAULT_TIMEZONE
  const date = nowDate(timeZone)
  const sections = loadFineSectionsFromDocs()

  console.log(`[papers] running for ${date} (${timeZone})`)
  const mails = await fetchTodayMailsWithOptionalWait(config, date, timeZone)
  console.log(`[papers] matched mails: ${mails.length}`)
  const extracted = mails.flatMap((m) => extractPapersFromText(m.body))
  const dedupMap = new Map()
  for (const paper of extracted) dedupMap.set(paper.url, paper)
  const papers = Array.from(dedupMap.values()).slice(0, MAX_PAPERS_PER_DAY)
  console.log(`[papers] unique papers after cleanup: ${papers.length}`)

  if (!papers.length) {
    console.log('[papers] no candidate papers found in daily emails')
  }

  const enriched = await enrichPapers(papers)
  const llmAssignments = annotatePapersWithCodex(enriched, sections)
  const sectionById = new Map(sections.map((s) => [s.id, s]))
  const assignmentMap = new Map(llmAssignments.map((x) => [x.url, x]))
  const kept = []
  const dropped = []

  for (const paper of enriched) {
    const llmAnn = assignmentMap.get(paper.url)
    if (!llmAnn) {
      const fallback = pickFallbackSection(paper, sections)
      paper.section_id = fallback.id
      paper.category_id = fallback.outer
      paper.summary_display = paper.summary_en || 'No summary available.'
      paper.fallback_reason = 'No codex decision returned'
      kept.push(paper)
      continue
    }

    const action = `${llmAnn.action || ''}`.toLowerCase()
    const sectionId = llmAnn.section_id || null
    const summaryZh = typeof llmAnn.summary_zh === 'string' ? llmAnn.summary_zh.trim() : ''

    if (action === 'drop' || !sectionId) {
      dropped.push({ ...paper, drop_reason: 'Dropped by codex' })
      continue
    }

    const section = sectionById.get(sectionId)
    if (!section) {
      const fallback = pickFallbackSection(paper, sections)
      paper.section_id = fallback.id
      paper.category_id = fallback.outer
      paper.summary_display = paper.summary_en || 'No summary available.'
      paper.fallback_reason = `Invalid section_id from codex: ${sectionId}`
      kept.push(paper)
      continue
    }

    paper.section_id = section.id
    paper.category_id = section.outer
    paper.summary_display = summaryZh || paper.summary_en || 'No summary available.'
    kept.push(paper)
  }

  const groups = groupByFineSections(kept, sections)
  const mdx = renderMdx(date, groups, config)
  console.log(`[papers] kept: ${kept.length}, dropped: ${dropped.length}`)

  const { postFile, debugFile } = writeOutputs(date, mdx, {
    date,
    mailCount: mails.length,
    paperCount: papers.length,
    keptCount: kept.length,
    droppedCount: dropped.length,
    maxPapersPerDay: MAX_PAPERS_PER_DAY,
    papers,
    enriched: kept,
    dropped,
    sections,
    llmAssignments
  })

  const collectionFile = updatePapersCollection()
  await maybePublish(date, [postFile, debugFile, collectionFile], config)
  console.log(`[papers] generated ${postFile}`)
}

main().catch((err) => {
  console.error('[papers] failed:', err)
  process.exit(1)
})
