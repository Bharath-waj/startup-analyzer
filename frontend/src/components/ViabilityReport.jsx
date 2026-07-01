import { useState } from 'react'
import ViabilityMeter from './ViabilityMeter.jsx'
import {
  Grid, Trend, Users, Plus, CheckSquare, Shuffle,
  Rocket, Check, Arrow, Link, Reddit, Github,
  Download, Copy, Printer, Ico,
} from '../icons.jsx'

const SWOT = {
  s: { title: 'Strengths', wrap: 'border-emerald-200 bg-emerald-50', head: 'text-emerald-700' },
  w: { title: 'Weaknesses', wrap: 'border-rose-200 bg-rose-50', head: 'text-rose-700' },
  o: { title: 'Opportunities', wrap: 'border-brand-200 bg-brand-50', head: 'text-brand-700' },
  t: { title: 'Threats', wrap: 'border-amber-200 bg-amber-50', head: 'text-amber-700' },
}

function tierFor(score) {
  if (score >= 70) return { label: 'Strong Viability', cls: 'border-emerald-200 bg-emerald-50 text-emerald-700' }
  if (score >= 40) return { label: 'Moderate Viability', cls: 'border-amber-200 bg-amber-50 text-amber-700' }
  return { label: 'Weak Viability', cls: 'border-rose-200 bg-rose-50 text-rose-700' }
}

function SwotQuad({ variant, items }) {
  const cfg = SWOT[variant]
  const list = items && items.length ? items : ['N/A']
  return (
    <div className={`rounded-xl border p-4 ${cfg.wrap}`}>
      <h4 className={`mb-2.5 text-[0.72rem] font-bold uppercase tracking-wide ${cfg.head}`}>{cfg.title}</h4>
      <ul>
        {list.map((item, i) => (
          <li
            key={i}
            className="relative mb-1.5 pl-4 text-[0.85rem] text-slate-600 before:absolute before:left-0 before:top-[0.55rem] before:h-1 before:w-1 before:rounded-full before:bg-slate-400 before:content-['']"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function ViabilityReport({ data }) {
  const [copied, setCopied] = useState(false)
  const swot = data.swot_analysis || {}
  const recs = data.recommendations || {}
  const competitors = data.similar_ideas_and_competitors || []
  const isPromising = data.is_promising
  const score = data.viability_score || 0
  const tier = tierFor(score)

  const sources = data.raw_sources || {}
  const pills = []
  ;['reddit', 'github', 'competitors'].forEach((cat) => {
    (sources[cat] || []).forEach((src) => pills.push({ ...src, cat }))
  })

  function pillIcon(cat) {
    if (cat === 'reddit') return <Reddit />
    if (cat === 'github') return <Github />
    return <Link />
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'viability-report.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  async function copySummary() {
    const text = `Viability score: ${score}/100 (${tier.label})\n\n${data.idea_summary || ''}\n\nVerdict: ${recs.verdict || ''}`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="animate-fade-in">
      {/* Action toolbar */}
      <div className="mb-4 flex flex-wrap items-center justify-end gap-2 print:hidden">
        <button className="btn-ghost" onClick={exportJson}>
          <Ico size="h-3.5 w-3.5"><Download /></Ico> Export JSON
        </button>
        <button className="btn-ghost" onClick={copySummary}>
          <Ico size="h-3.5 w-3.5"><Copy /></Ico> {copied ? 'Copied!' : 'Copy summary'}
        </button>
        <button className="btn-ghost" onClick={() => window.print()}>
          <Ico size="h-3.5 w-3.5"><Printer /></Ico> Print
        </button>
      </div>

      {/* Header */}
      <div className="mb-7 flex flex-col items-start gap-6 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <span className={`mb-3 inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${tier.cls}`}>
            {tier.label} · {score}/100
          </span>
          <h2 className="mb-1 text-[1.4rem] font-extrabold tracking-tight text-slate-900">Analysis Completed</h2>
          <p className="text-[0.92rem] text-slate-500">{data.idea_summary || ''}</p>
        </div>
        <ViabilityMeter score={score} />
      </div>

      {/* SWOT */}
      <section className="mb-7">
        <h3 className="section-title">
          <Ico size="h-[17px] w-[17px]" className="text-brand-600"><Grid /></Ico>
          SWOT Analysis
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <SwotQuad variant="s" items={swot.strengths} />
          <SwotQuad variant="w" items={swot.weaknesses} />
          <SwotQuad variant="o" items={swot.opportunities} />
          <SwotQuad variant="t" items={swot.threats} />
        </div>
      </section>

      {/* Market demand */}
      <section className="mb-7">
        <h3 className="section-title">
          <Ico size="h-[17px] w-[17px]" className="text-cyan-600"><Trend /></Ico>
          Market Demand &amp; Reddit Discussions
        </h3>
        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-[0.92rem] text-slate-700">
          {data.market_demand_analysis || ''}
        </div>
      </section>

      {/* Competitors */}
      <section className="mb-7">
        <h3 className="section-title">
          <Ico size="h-[17px] w-[17px]" className="text-violet-600"><Users /></Ico>
          Similar Ideas &amp; Competitors
        </h3>
        <p className="mb-2 text-[0.83rem] text-slate-500">Identified commercial competitors and active alternatives:</p>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-[0.88rem]">
            <thead>
              <tr className="bg-slate-50 text-[0.7rem] uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3 font-bold">Competitor / Reach</th>
                <th className="px-4 py-3 font-bold">Successes</th>
                <th className="px-4 py-3 font-bold">Faults / Drawbacks</th>
              </tr>
            </thead>
            <tbody>
              {competitors.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-4 text-center text-slate-400">
                    No competitors found in web index. You may be first to market!
                  </td>
                </tr>
              ) : (
                competitors.map((comp, i) => (
                  <tr key={i} className="border-t border-slate-100 align-top">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{comp.name}</div>
                      <div className="mt-1.5 inline-block rounded-md bg-brand-50 px-2 py-0.5 text-[0.72rem] font-semibold text-brand-700">{comp.reach}</div>
                    </td>
                    <td className="px-4 py-3 text-emerald-600">{comp.successes}</td>
                    <td className="px-4 py-3 text-rose-600">{comp.faults}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Verdict */}
      <div className={`mb-6 flex items-center gap-3 rounded-xl border p-4 text-[0.92rem] font-semibold text-slate-900 ${isPromising ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
        <Ico size="h-5 w-5" className={isPromising ? 'text-emerald-600' : 'text-amber-600'}>
          {isPromising ? <Rocket /> : <Shuffle />}
        </Ico>
        <span>{recs.verdict || ''}</span>
      </div>

      {/* Recommendations */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {isPromising ? (
          <>
            <section>
              <h3 className="section-title">
                <Ico size="h-[17px] w-[17px]" className="text-brand-600"><Plus /></Ico>
                Recommended Features to Add
              </h3>
              <ul className="grid gap-2.5">
                {(recs.features_to_add || []).map((feat, i) => (
                  <li key={i} className="flex gap-2 text-[0.9rem] text-slate-600">
                    <Ico size="h-[15px] w-[15px]" className="mt-0.5 text-brand-600"><Plus /></Ico>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className="section-title">
                <Ico size="h-[17px] w-[17px]" className="text-emerald-600"><CheckSquare /></Ico>
                Validation Plan
              </h3>
              <ul className="grid gap-2.5">
                {(recs.validation_steps || []).map((step, i) => (
                  <li key={i} className="flex gap-2 text-[0.9rem] text-slate-600">
                    <Ico size="h-[15px] w-[15px]" className="mt-0.5 text-emerald-600"><Check /></Ico>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </section>
          </>
        ) : (
          <section className="sm:col-span-2">
            <h3 className="section-title">
              <Ico size="h-[17px] w-[17px]" className="text-violet-600"><Shuffle /></Ico>
              Recommended Pivots &amp; Alternative Directions
            </h3>
            <p className="mb-3 text-[0.83rem] text-slate-500">
              Based on market density or feasibility limits, consider these interest-aligned alternatives:
            </p>
            <ul className="grid gap-2.5">
              {(recs.alternative_ideas || []).map((alt, i) => (
                <li key={i} className="flex gap-2 text-[0.9rem] text-slate-600">
                  <Ico size="h-[15px] w-[15px]" className="mt-0.5 text-violet-600"><Arrow /></Ico>
                  <span>{alt}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Sources */}
      <div className="mt-8 border-t border-slate-100 pt-6">
        <h3 className="mb-3 text-[0.85rem] font-bold text-slate-500">Crawled Sources &amp; Verifiable Data</h3>
        <div className="flex flex-wrap gap-2">
          {pills.length === 0 ? (
            <span className="text-[0.85rem] text-slate-400">No external sources indexed.</span>
          ) : (
            pills.map((pill, i) => (
              <a
                key={i}
                href={pill.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex max-w-[250px] items-center gap-1.5 truncate rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-[0.78rem] text-slate-500 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
              >
                <Ico size="h-3.5 w-3.5">{pillIcon(pill.cat)}</Ico>
                <span className="truncate">{pill.title}</span>
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
