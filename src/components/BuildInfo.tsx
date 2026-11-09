import { useEffect, useState } from 'react'
import { formatBuildInfo, type Health } from '../logic/build-info'

export default function BuildInfo() {
  const [text, setText] = useState('Loading build info…')

  useEffect(() => {
    let active = true
    fetch('/api/health')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((h: Health) => active && setText(formatBuildInfo(h)))
      .catch(() => active && setText('Build info unavailable'))
    return () => {
      active = false
    }
  }, [])

  return (
    <footer className="build-info" data-testid="build-info">
      {text}
    </footer>
  )
}
