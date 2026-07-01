import { useState } from 'react'
import { Bulb, Mic, Sparkles, Clock, X, Ico } from '../icons.jsx'
import { useVoiceInput } from '../speech.js'
import { useApp } from '../store/AppContext.jsx'

const EXAMPLES = [
  'An AI recipe planner that scans your fridge with a camera to generate meal-prep lists',
  'A peer-to-peer marketplace for renting camera gear from people nearby',
  'A habit tracker that auto-donates to charity whenever you miss a daily goal',
]
const MAX = 600

export default function AnalyzeForm({ onAnalyze, busy }) {
  const { recentIdeas, clearRecentIdeas } = useApp()
  const [idea, setIdea] = useState('')
  const [interests, setInterests] = useState('')

  const voice = useVoiceInput((text) =>
    setIdea((prev) => (prev ? `${prev} ${text}`.slice(0, MAX) : text.slice(0, MAX)))
  )

  function handleSubmit(e) {
    e.preventDefault()
    if (!idea.trim()) return
    onAnalyze(idea.trim(), interests)
  }

  const count = idea.length
  const nearLimit = count > MAX * 0.85

  return (
    <section className="card animate-fade-in p-7">
      <h2 className="section-title">
        <Ico className="text-brand-600"><Bulb /></Ico>
        Analyze Your Idea
      </h2>

      {/* Example idea chips */}
      <div className="mb-5">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
          <Ico size="h-3.5 w-3.5" className="text-violet-500"><Sparkles /></Ico>
          Try an example
        </div>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdea(ex)}
              className="chip border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100"
            >
              {ex.split(' ').slice(0, 4).join(' ')}…
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="startup-idea" className="m-0 text-sm font-semibold text-slate-900">Startup Idea</label>
            <button
              type="button"
              onClick={voice.start}
              title="Speak your idea"
              className={`chip ${voice.listening ? 'animate-mic-pulse border-rose-200 bg-rose-50 text-rose-600' : 'border-slate-200 bg-white text-slate-500 hover:text-slate-900'}`}
            >
              <Ico size="h-3.5 w-3.5"><Mic /></Ico>
              {voice.listening ? 'Listening…' : 'Voice Input'}
            </button>
          </div>
          <textarea
            id="startup-idea"
            required
            maxLength={MAX}
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Describe your startup idea clearly. E.g., An AI-powered recipe planner that scans your fridge using a camera to generate meal prep lists..."
            className="input-field min-h-[120px] resize-y"
          />
          <div className={`mt-1.5 text-right text-xs font-medium ${nearLimit ? 'text-amber-600' : 'text-slate-400'}`}>
            {count}/{MAX}
          </div>
        </div>

        <div className="mb-5">
          <label htmlFor="user-interests" className="field-label">Your Hobbies / Interests (Optional)</label>
          <input
            type="text"
            id="user-interests"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="E.g., cooking, fitness, SaaS, finance..."
            className="input-field"
          />
          <span className="mt-1.5 block text-xs text-slate-400">
            Used to explore pivots and suggest alternative startup directions.
          </span>
        </div>

        <button type="submit" className="btn-primary w-full py-3.5 text-base" disabled={busy}>
          {busy ? 'Analyzing…' : 'Run Viability Check'}
        </button>
      </form>

      {/* Recent ideas */}
      {recentIdeas.length > 0 && (
        <div className="mt-6 border-t border-slate-100 pt-5">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <Ico size="h-3.5 w-3.5" className="text-cyan-500"><Clock /></Ico>
              Recent ideas
            </div>
            <button type="button" onClick={clearRecentIdeas} className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-rose-600">
              <Ico size="h-3 w-3"><X /></Ico> Clear
            </button>
          </div>
          <div className="flex flex-col gap-1.5">
            {recentIdeas.map((r, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdea(r)}
                className="truncate rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-left text-sm text-slate-600 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                title={r}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
