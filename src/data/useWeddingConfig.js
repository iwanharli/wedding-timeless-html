import { useState, useEffect, useCallback } from 'react'
import defaultContent from './content'
import { DEFAULT_SECTIONS } from './sectionDefaults'

const FALLBACK = {
  ...defaultContent,
  sections: DEFAULT_SECTIONS.map(s => ({ ...s, visible: true })),
}

export function useWeddingConfig() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/config')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setData(await res.json())
      setError(null)
    } catch (err) {
      setError(err)
      setData(prev => prev ?? FALLBACK)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { refetch() }, [refetch])

  return { data, loading, error, refetch }
}
