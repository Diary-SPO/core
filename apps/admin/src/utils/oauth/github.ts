import { GITHUB_OAUTH_URL, CLIENT_ID, REDIRECT_URL } from '@/config'

export const getGitHubUrl = (from: string) => {
  const options = {
    client_id: CLIENT_ID,
    redirect_url: REDIRECT_URL,
    scope: 'user:email',
    state: from
  }

  const qs = new URLSearchParams(options)

  return `${GITHUB_OAUTH_URL}?${qs.toString()}`
}
