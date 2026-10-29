import { Navigate, useLocation } from 'react-router-dom'

// Leadership now lives inside About MOBA. Keep old section and profile URLs working.
export default function Leadership() {
  const { hash } = useLocation()
  return <Navigate to={`/about${hash || '#leadership'}`} replace />
}
