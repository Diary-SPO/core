import { Elysia, t } from 'elysia'
import getGitHubAuth from './handler'

const schema = {
  body: t.Object({
    code: t.String()
  })
}

const oauthGitHub = new Elysia().guard(schema, (app) =>
  app.post('/oauth/github', getGitHubAuth)
)

export default oauthGitHub
