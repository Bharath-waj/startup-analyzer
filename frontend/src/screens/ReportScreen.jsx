import { Link } from 'react-router-dom'
import { useApp } from '../store/AppContext.jsx'
import ViabilityReport from '../components/ViabilityReport.jsx'
import { Cube, Ico } from '../icons.jsx'

function LoadingState({ message }) {
  return (
    <div className="m-auto flex flex-col items-center justify-center px-12 py-20 text-center">
      <div className="mb-7 h-12 w-12 animate-spin rounded-full border-[3px] border-brand-100 border-t-brand-600" />
      <h3 className="mb-1 text-xl font-bold text-slate-900">Analyzing Real-World Footprint</h3>
      <p className="mt-1 max-w-sm text-[0.88rem] text-slate-500">{message}</p>
    </div>
  )
}

function EmptyReport() {
  return (
    <div className="m-auto px-12 py-20 text-center">
      <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <Ico size="h-7 w-7"><Cube /></Ico>
      </div>
      <h3 className="text-xl font-bold text-slate-900">No Report Yet</h3>
      <p className="mt-2 text-[0.92rem] text-slate-500">
        You haven&apos;t analyzed an idea yet. Head to the Analyze screen to crawl Reddit, GitHub,
        and competitor archives for a viability rating and SWOT analysis.
      </p>
      <Link to="/" className="btn-primary mt-6">Go to Analyze</Link>
    </div>
  )
}

export default function ReportScreen() {
  const { status, result, loadingMsg } = useApp()

  return (
    <div className="animate-screen-in">
      <main className="card flex min-h-[560px] flex-col p-7">
        {status === 'loading' && <LoadingState message={loadingMsg} />}
        {status !== 'loading' && result && <ViabilityReport data={result} />}
        {status !== 'loading' && !result && <EmptyReport />}
      </main>
    </div>
  )
}
