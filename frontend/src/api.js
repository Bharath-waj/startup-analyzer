const JSON_HEADERS = { 'Content-Type': 'application/json' }

export async function fetchEvents() {
  const res = await fetch('/api/events')
  if (!res.ok) throw new Error('Failed to fetch events')
  return res.json()
}

export async function analyze(idea, userInterests) {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ idea, user_interests: userInterests || null }),
  })
  if (!res.ok) {
    let detail = 'Analysis request failed.'
    try {
      const data = await res.json()
      detail = data.detail || detail
    } catch (_) {}
    throw new Error(detail)
  }
  return res.json()
}

export async function pitchCoach(idea, history, userResponse) {
  const res = await fetch('/api/pitch-coach', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ idea, history, user_response: userResponse }),
  })
  if (!res.ok) throw new Error('Pitch reply failed')
  return res.json()
}
