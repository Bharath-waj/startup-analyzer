import { useEffect, useRef, useState } from 'react'
import { Briefcase, Mic, Speaker, SpeakerOff, Handshake, Close, Refresh, Ico } from '../icons.jsx'
import { useVoiceInput, speakText } from '../speech.js'
import { useApp } from '../store/AppContext.jsx'

const DIFFS = [
  { key: 'friendly', label: 'Friendly' },
  { key: 'balanced', label: 'Balanced' },
  { key: 'brutal', label: 'Brutal' },
]
const EST_ROUNDS = 5

export default function PitchCoach() {
  const { pitch, pitchLoading, narration, difficulty, startPitch, restartPitch, changeDifficulty, sendPitch, toggleNarration } = useApp()
  const [input, setInput] = useState('')
  const chatRef = useRef(null)

  const voice = useVoiceInput((text) =>
    setInput((prev) => (prev ? `${prev} ${text}` : text))
  )

  useEffect(() => { startPitch() }, [startPitch])

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [pitch.messages, pitchLoading, pitch.deal])

  function handleSend() {
    const t = input.trim()
    if (!t || pitchLoading || pitch.deal) return
    setInput('')
    sendPitch(t)
  }

  const rounds = pitch.messages.filter((m) => m.type === 'shark').length
  const progress = pitch.deal ? 100 : Math.min((rounds / EST_ROUNDS) * 100, 100)

  return (
    <div className="flex h-[540px] flex-col">
      {/* Investor panel */}
      <div className="mb-3 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 text-white">
          <Ico size="h-[22px] w-[22px]"><Briefcase /></Ico>
        </div>
        <div className="flex-1">
          <h4 className="text-[0.92rem] font-bold text-slate-900">{pitch.sharkName}</h4>
          <p className="text-[0.8rem] text-slate-500">Pitch your startup and defend your business model to secure a deal.</p>
        </div>
        <button
          type="button"
          onClick={toggleNarration}
          title="Toggle voice narration"
          className={`chip ${narration ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-500 hover:text-slate-900'}`}
        >
          <Ico size="h-3.5 w-3.5">{narration ? <Speaker /> : <SpeakerOff />}</Ico>
          {narration ? 'Narration ON' : 'Muted'}
        </button>
      </div>

      {/* Controls: difficulty + restart + progress */}
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
          {DIFFS.map((d) => {
            const active = difficulty === d.key
            return (
              <button
                key={d.key}
                type="button"
                onClick={() => changeDifficulty(d.key)}
                title="Changing difficulty restarts the pitch"
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${active ? 'bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-soft' : 'text-slate-500 hover:text-slate-900'}`}
              >
                {d.label}
              </button>
            )
          })}
        </div>

        <button type="button" onClick={restartPitch} className="btn-ghost">
          <Ico size="h-3.5 w-3.5"><Refresh /></Ico> Restart
        </button>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">
            {pitch.deal ? 'Complete' : `Round ${Math.max(rounds, 1)} of ~${EST_ROUNDS}`}
          </span>
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand-500 to-violet-600 transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Chat */}
      <div ref={chatRef} className="mb-3 flex flex-1 flex-col gap-3 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4">
        {pitch.initState === 'loading' && (
          <div className="py-4 text-center text-sm text-slate-400">Loading your AI investor…</div>
        )}
        {pitch.initState === 'error' && (
          <div className="py-4 text-center text-sm text-rose-600">Failed to start Pitch Coach. Check server console.</div>
        )}

        {pitch.messages.map((m, i) =>
          m.type === 'user' ? (
            <div key={i} className="max-w-[82%] self-end rounded-2xl rounded-br-sm bg-gradient-to-br from-brand-500 to-violet-600 px-4 py-2.5 text-[0.9rem] leading-relaxed text-white">
              {m.text}
            </div>
          ) : (
            <div key={i} className="max-w-[82%] self-start rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-4 py-2.5 text-[0.9rem] leading-relaxed text-slate-900 shadow-soft">
              {m.evaluation && (
                <div className="mb-2 border-l-2 border-brand-200 pl-2.5 text-[0.8rem] text-brand-600">
                  <strong>Investor review:</strong> {m.evaluation}
                </div>
              )}
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex-1">{m.text}</div>
                <button onClick={() => speakText(m.text)} title="Read aloud" className="shrink-0 rounded p-0.5 text-slate-400 transition hover:bg-brand-50 hover:text-brand-600">
                  <Ico size="h-3.5 w-3.5"><Speaker /></Ico>
                </button>
              </div>
            </div>
          )
        )}

        {pitchLoading && <div className="pl-2.5 text-[0.85rem] italic text-slate-400">Investor is writing a response…</div>}

        {pitch.deal && (
          <div className={`mt-auto rounded-xl border p-5 text-center ${pitch.deal.accepted ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
            <h4 className={`mb-1.5 flex items-center justify-center gap-2 text-lg font-extrabold ${pitch.deal.accepted ? 'text-emerald-700' : 'text-rose-700'}`}>
              <Ico size="h-5 w-5">{pitch.deal.accepted ? <Handshake /> : <Close />}</Ico>
              {pitch.deal.accepted ? 'Deal Offered' : "I'm Out"}
            </h4>
            <p className="text-[0.9rem] text-slate-600">{pitch.deal.text}</p>
          </div>
        )}
      </div>

      {/* Input */}
      {!pitch.deal && (
        <div className="flex gap-2.5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type or speak your response to the investor…"
            className="input-field flex-1"
          />
          <button
            type="button"
            onClick={voice.start}
            title="Speak your response"
            className={`flex items-center justify-center rounded-xl border px-3 transition ${voice.listening ? 'animate-mic-pulse border-rose-200 bg-rose-50 text-rose-600' : 'border-slate-200 bg-white text-slate-500 hover:text-slate-900'}`}
          >
            <Ico size="h-[15px] w-[15px]"><Mic /></Ico>
          </button>
          <button onClick={handleSend} className="btn-primary px-6">Send Pitch</button>
        </div>
      )}
    </div>
  )
}
