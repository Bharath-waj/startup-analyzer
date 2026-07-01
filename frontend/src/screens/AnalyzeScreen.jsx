import { useNavigate } from 'react-router-dom'
import { useApp } from '../store/AppContext.jsx'
import AnalyzeForm from '../components/AnalyzeForm.jsx'

export default function AnalyzeScreen() {
  const { analyzeIdea, status } = useApp()
  const navigate = useNavigate()

  function handleAnalyze(idea, interests) {
    navigate('/report') // jump to the report screen, which shows the loading state
    analyzeIdea(idea, interests)
  }

  return (
    <div className="animate-screen-in mx-auto max-w-2xl">
      <AnalyzeForm onAnalyze={handleAnalyze} busy={status === 'loading'} />
    </div>
  )
}
