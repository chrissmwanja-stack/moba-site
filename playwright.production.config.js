import base from './playwright.config.js'

// Runs the same smoke suite against an already deployed site; no local preview server is started.
export default {
  ...base,
  use: {
    ...base.use,
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'https://www.mwirian.org',
  },
  webServer: undefined,
}
