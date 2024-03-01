import { Elysia, t } from 'elysia'
import getGitHubAuth from './handler'

const schema = {
  query: t.Object({
    code: t.String()
  })
}

const oauthGitHub = new Elysia().guard(schema, (app) =>
  app.get('/oauth/github', getGitHubAuth)
)

export default oauthGitHub
