import { useContent } from './siteContent.js'
import { getBackground } from './backgrounds.js'

export function useBackground(key) {
  const { site } = useContent()
  return getBackground(key, site.backgrounds)
}
