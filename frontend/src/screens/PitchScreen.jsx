import { Link } from 'react-router-dom'
import { useApp } from '../store/AppContext.jsx'
import PitchCoach from '../components/PitchCoach.jsx'
import { Message, Ico } from '../icons.jsx'

function EmptyPitch() {
  return (
    <div className="m-auto px-12 py-20 text-center">
      <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
        <Ico size="h-7 w-7"><Message /></Ico>
      </div>
      <h3 className="text-xl font-bold text-slate-900">No Idea to Pitch</h3>
      <p className="mt-2 text-[0.92rem] text-slate-500">
        Analyze a startup idea first, then come back to pitch it to an AI investor and defend your
        business model to secure a deal.
      </p>
      <Link to="/" className="btn-primary mt-6">Go to Analyze</Link>
    </div>
  )
}

export default function PitchScreen() {
  const { idea } = useApp()

  return (
    <div className="animate-screen-in">
      <main className="card flex min-h-[560px] flex-col p-7">
        {idea ? <PitchCoach /> : <EmptyPitch />}
      </main>
    </div>
  )
}
