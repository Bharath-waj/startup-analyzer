import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { analyze as apiAnalyze, fetchEvents as apiFetchEvents, pitchCoach as apiPitchCoach } from '../api.js'
import { speakText, cancelSpeech } from '../speech.js'

const LOADING_MESSAGES = [
  'Scouring Reddit for user pain points...',
  'Searching GitHub for open-source repositories...',
  'Identifying commercial competitors...',
  'Evaluating strengths, weaknesses, opportunities, & threats...',
  'Running SWOT evaluations with Groq LLM...',
  'Synthesizing recommendations...',
]

const RECENT_KEY = 'sa_recent_ideas'

function loadRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]') } catch { return [] }
}

const AppContext = createContext(null)

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within <AppProvider>')
  return ctx
}

const EMPTY_PITCH = { sharkName: 'AI Investor Panel', messages: [], deal: null, initState: 'idle' }

const DIFFICULTY_HINTS = {
  friendly: 'Adopt a warm, encouraging investor persona. Ask gentle questions and be supportive.',
  balanced: '',
  brutal: 'Adopt a ruthless, deeply skeptical investor persona. Press hard on weaknesses and unit economics.',
}

export function AppProvider({ children }) {
  // --- Analysis ---
  const [status, setStatus] = useState('empty') // empty | loading | done
  const [result, setResult] = useState(null)
  const [idea, setIdea] = useState('')
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0])
  const msgTimer = useRef(null)

  // --- Recent ideas (localStorage) ---
  const [recentIdeas, setRecentIdeas] = useState(loadRecent)

  const addRecentIdea = useCallback((text) => {
    setRecentIdeas((prev) => {
      const next = [text, ...prev.filter((i) => i !== text)].slice(0, 5)
      try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const clearRecentIdeas = useCallback(() => {
    setRecentIdeas([])
    try { localStorage.removeItem(RECENT_KEY) } catch {}
  }, [])

  // --- Events ---
  const [events, setEvents] = useState(null)
  const [eventsError, setEventsError] = useState(false)
  const eventsStarted = useRef(false)

  // --- Pitch session ---
  const [pitch, setPitch] = useState(EMPTY_PITCH)
  const [pitchLoading, setPitchLoading] = useState(false)
  const [narration, setNarration] = useState(false)
  const [difficulty, setDifficulty] = useState('balanced')
  const pitchHistory = useRef([])
  const pitchKey = useRef(null)
  const narrationRef = useRef(false)

  const composePitchIdea = useCallback((diff) => {
    const hint = DIFFICULTY_HINTS[diff]
    return hint ? `${idea}\n\n[Coaching directive: ${hint}]` : idea
  }, [idea])

  const loadEvents = useCallback(() => {
    if (eventsStarted.current) return
    eventsStarted.current = true
    apiFetchEvents()
      .then((data) => setEvents(data.events || []))
      .catch((err) => { console.error(err); setEventsError(true) })
  }, [])

  const startPitch = useCallback(async (force = false) => {
    if (!idea) return
    const key = `${idea}::${difficulty}`
    if (!force && pitchKey.current === key) return
    pitchKey.current = key
    pitchHistory.current = []
    cancelSpeech()
    setPitch({ ...EMPTY_PITCH, initState: 'loading' })
    try {
      const res = await apiPitchCoach(composePitchIdea(difficulty), [], null)
      pitchHistory.current = [{ role: 'shark', content: res.next_question }]
      setPitch({
        sharkName: `${res.shark_name} (AI Investor)`,
        messages: [{ type: 'shark', text: res.next_question }],
        deal: null,
        initState: 'ready',
      })
    } catch (err) {
      console.error(err)
      pitchKey.current = null
      setPitch((p) => ({ ...p, initState: 'error' }))
    }
  }, [idea, difficulty, composePitchIdea])

  const restartPitch = useCallback(() => {
    pitchKey.current = null
    startPitch(true)
  }, [startPitch])

  const changeDifficulty = useCallback((d) => setDifficulty(d), [])

  const resetPitch = useCallback(() => {
    pitchHistory.current = []
    pitchKey.current = null
    cancelSpeech()
    setPitch(EMPTY_PITCH)
  }, [])

  const analyzeIdea = useCallback(async (ideaText, interests) => {
    setIdea(ideaText)
    addRecentIdea(ideaText)
    setResult(null)
    setStatus('loading')
    resetPitch()

    let i = 0
    setLoadingMsg(LOADING_MESSAGES[0])
    clearInterval(msgTimer.current)
    msgTimer.current = setInterval(() => {
      i = (i + 1) % LOADING_MESSAGES.length
      setLoadingMsg(LOADING_MESSAGES[i])
    }, 2500)

    try {
      const data = await apiAnalyze(ideaText, interests)
      setResult(data)
      setStatus('done')
    } catch (err) {
      console.error(err)
      alert(`Error during analysis: ${err.message}`)
      setStatus('empty')
    } finally {
      clearInterval(msgTimer.current)
    }
  }, [addRecentIdea, resetPitch])

  const sendPitch = useCallback(async (text) => {
    const t = text.trim()
    if (!t) return
    setPitch((p) => ({ ...p, messages: [...p.messages, { type: 'user', text: t }] }))

    const requestHistory = [...pitchHistory.current]
    pitchHistory.current.push({ role: 'user', content: t })

    setPitchLoading(true)
    try {
      const res = await apiPitchCoach(composePitchIdea(difficulty), requestHistory, t)
      if (res.is_pitch_finished) {
        const accepted = !res.deal_verdict.toLowerCase().includes('out')
        setPitch((p) => ({
          ...p,
          messages: [...p.messages, { type: 'shark', text: "I've heard enough.", evaluation: res.evaluation }],
          deal: { accepted, text: res.deal_verdict },
        }))
        if (narrationRef.current) speakText(`${res.evaluation ? res.evaluation + '. ' : ''}I've heard enough.`)
      } else {
        setPitch((p) => ({
          ...p,
          messages: [...p.messages, { type: 'shark', text: res.next_question, evaluation: res.evaluation }],
        }))
        pitchHistory.current.push({ role: 'shark', content: res.next_question })
        if (narrationRef.current) speakText(`${res.evaluation ? res.evaluation + '. ' : ''}${res.next_question}`)
      }
    } catch (err) {
      console.error(err)
      alert(`Error replying to investor: ${err.message}`)
    } finally {
      setPitchLoading(false)
    }
  }, [difficulty, composePitchIdea])

  const toggleNarration = useCallback(() => {
    setNarration((prev) => {
      const next = !prev
      narrationRef.current = next
      if (next) speakText('Narration enabled.')
      else cancelSpeech()
      return next
    })
  }, [])

  const value = {
    // analysis
    status, result, idea, loadingMsg, analyzeIdea, hasResult: status === 'done' && !!result,
    // recent ideas
    recentIdeas, clearRecentIdeas,
    // events
    events, eventsError, loadEvents,
    // pitch
    pitch, pitchLoading, narration, difficulty,
    startPitch, restartPitch, changeDifficulty, sendPitch, toggleNarration,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
