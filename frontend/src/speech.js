import { useRef, useState } from 'react'

// --- Text to speech ---
export function speakText(text) {
  if (!window.speechSynthesis) return
  const cleaned = text
    .replace(/<[^>]*>/g, '')
    .replace(/\*\*|__/g, '')
    .replace(/\*|_/g, '')

  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(cleaned)

  const voices = window.speechSynthesis.getVoices()
  const englishVoice =
    voices.find((v) => v.lang.startsWith('en-US') && v.name.includes('Google')) ||
    voices.find((v) => v.lang.startsWith('en') && v.name.includes('Natural')) ||
    voices.find((v) => v.lang.startsWith('en'))
  if (englishVoice) utterance.voice = englishVoice

  utterance.pitch = 0.95
  utterance.rate = 1.0
  window.speechSynthesis.speak(utterance)
}

export function cancelSpeech() {
  if (window.speechSynthesis) window.speechSynthesis.cancel()
}

// Prime the voice list (Chrome loads voices asynchronously).
if (typeof window !== 'undefined' && window.speechSynthesis && window.speechSynthesis.onvoiceschanged !== undefined) {
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices()
}

// --- Voice input (speech recognition) ---
// onResult receives the recognized transcript string.
export function useVoiceInput(onResult) {
  const [listening, setListening] = useState(false)
  const recRef = useRef(null)

  const start = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your browser. Please try Google Chrome or Microsoft Edge.')
      return
    }
    if (recRef.current) {
      recRef.current.stop()
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setListening(true)
      recRef.current = recognition
    }
    recognition.onresult = (event) => {
      onResult(event.results[0][0].transcript)
    }
    recognition.onerror = (event) => {
      console.error('Speech Recognition Error:', event.error)
    }
    recognition.onend = () => {
      setListening(false)
      recRef.current = null
    }

    recognition.start()
  }

  return { listening, start }
}
