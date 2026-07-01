import { useEffect, useMemo, useState } from 'react'
import { Calendar, Arrow, Search, Sort, Ico } from '../icons.jsx'
import { useApp } from '../store/AppContext.jsx'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'accelerator', label: 'Accelerator' },
  { key: 'competition', label: 'Competition' },
  { key: 'casting', label: 'Casting Call' },
]

const TAG_STYLES = {
  accelerator: 'bg-violet-50 text-violet-700',
  competition: 'bg-brand-50 text-brand-700',
  casting: 'bg-rose-50 text-rose-700',
}

function categoryOf(type) {
  const t = (type || '').toLowerCase()
  if (t.includes('competition') || t.includes('pitch') || t.includes('hackathon')) return 'competition'
  if (t.includes('casting') || t.includes('shark') || t.includes('show')) return 'casting'
  return 'accelerator'
}

export default function EventsPanel() {
  const { events, eventsError, loadEvents } = useApp()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('default')

  useEffect(() => { loadEvents() }, [loadEvents])

  const visible = useMemo(() => {
    let list = events ? [...events] : []
    if (filter !== 'all') list = list.filter((e) => categoryOf(e.type) === filter)
    const q = query.trim().toLowerCase()
    if (q) list = list.filter((e) => `${e.name} ${e.description}`.toLowerCase().includes(q))
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name))
    return list
  }, [events, filter, query, sort])

  return (
    <section aria-labelledby="events-title">
      <h2 id="events-title" className="section-title">
        <Ico className="text-violet-600"><Calendar /></Ico>
        Booster Events &amp; Pitch Calls
      </h2>
      <p className="-mt-2 mb-4 text-[0.92rem] text-slate-500">
        Live accelerator deadlines, pitch competitions, and casting calls — apply to get your startup in front of investors.
      </p>

      {/* Controls */}
      <div className="mb-5 flex flex-col gap-3">
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Ico size="h-4 w-4"><Search /></Ico>
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events…"
            className="input-field pl-10"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => {
            const active = filter === f.key
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`chip ${active ? 'border-transparent bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-soft' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'}`}
              >
                {f.label}
              </button>
            )
          })}
          <label className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Ico size="h-3.5 w-3.5"><Sort /></Ico>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700 focus:border-brand-500 focus:outline-none"
            >
              <option value="default">Default</option>
              <option value="name">Name A–Z</option>
            </select>
          </label>
        </div>
        {events && (
          <div className="text-xs font-medium text-slate-400">
            Showing {visible.length} of {events.length}
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {eventsError && (
          <div className="col-span-full py-8 text-center text-sm text-rose-600">Failed to fetch live booster events.</div>
        )}
        {!eventsError && events === null && (
          <div className="col-span-full py-8 text-center text-sm text-slate-400">Scanning casting calls &amp; accelerator deadlines…</div>
        )}
        {!eventsError && events && visible.length === 0 && (
          <div className="col-span-full py-8 text-center text-sm text-slate-400">No events match your filters.</div>
        )}
        {!eventsError && visible.map((event, idx) => {
          const cat = categoryOf(event.type)
          return (
            <div
              key={`${event.name}-${idx}`}
              style={{ animationDelay: `${Math.min(idx, 8) * 0.05}s` }}
              className="card animate-card-in flex flex-col justify-between p-4 transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-card"
            >
              <div>
                <div className="mb-2 flex items-start justify-between gap-2">
                  <span className="text-[0.92rem] font-bold text-slate-900">{event.name}</span>
                  <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-wide ${TAG_STYLES[cat]}`}>
                    {event.type}
                  </span>
                </div>
                <p className="mb-4 grow text-[0.83rem] text-slate-500">{event.description}</p>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 text-[0.78rem]">
                <span className="text-slate-400">Deadline: {event.deadline}</span>
                <a href={event.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 font-semibold text-brand-600 hover:text-brand-700">
                  Apply <Ico size="h-3 w-3"><Arrow /></Ico>
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
