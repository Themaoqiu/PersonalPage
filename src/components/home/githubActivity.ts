export interface GitHubActivityDay {
  date: string
  count: number
  level: number
}

export interface GitHubActivityApiResponse {
  contributions: Array<GitHubActivityDay>
  total: {
    lastYear: number
    [year: string]: number
  }
}

export async function fetchGitHubActivity(
  username: string,
  fetcher: typeof fetch = fetch
): Promise<GitHubActivityApiResponse | null> {
  const apiUrl = 'https://github-contributions-api.jogruber.de/v4/'

  try {
    const response = await fetcher(`${apiUrl}${username}?y=last`)
    const data = (await response.json()) as GitHubActivityApiResponse | { error?: string }

    if (!response.ok) {
      const message = 'error' in data && data.error ? data.error : 'Unknown error'
      console.warn(`Fetching GitHub contribution data for "${username}" failed: ${message}`)
      return null
    }

    return data as GitHubActivityApiResponse
  } catch (error) {
    console.warn(`Fetching GitHub contribution data for "${username}" failed`, error)
    return null
  }
}
