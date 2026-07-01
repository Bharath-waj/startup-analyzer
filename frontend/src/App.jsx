import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './store/AppContext.jsx'
import Header from './components/Header.jsx'
import AnalyzeScreen from './screens/AnalyzeScreen.jsx'
import EventsScreen from './screens/EventsScreen.jsx'
import ReportScreen from './screens/ReportScreen.jsx'
import PitchScreen from './screens/PitchScreen.jsx'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
          <Header />
          <Routes>
            <Route path="/" element={<AnalyzeScreen />} />
            <Route path="/events" element={<EventsScreen />} />
            <Route path="/report" element={<ReportScreen />} />
            <Route path="/pitch" element={<PitchScreen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}
