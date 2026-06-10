import { useState, useEffect, useCallback } from 'react'
import defaultContent from './content'
import { DEFAULT_SECTIONS } from './sectionDefaults'
import { apiUrl } from '../lib/api'

const FALLBACK = {
  ...defaultContent,
  sections: DEFAULT_SECTIONS.map(s => ({ ...s, visible: true })),
}

export function useWeddingConfig() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [fetchProgress, setFetchProgress] = useState(0)

  const refetch = useCallback(async () => {
    setLoading(true)
    setFetchProgress(0)
    try {
      const res = await fetch(apiUrl('/api/config'))
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const total = Number(res.headers.get('content-length')) || 0
      if (res.body && total) {
        const reader = res.body.getReader()
        const chunks = []
        let received = 0
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          chunks.push(value)
          received += value.length
          setFetchProgress(Math.min(99, Math.round((received / total) * 100)))
        }
        setData(JSON.parse(await new Blob(chunks).text()))
      } else {
        setData(await res.json())
      }
      setError(null)
    } catch (err) {
      setError(err)
      setData(prev => prev ?? FALLBACK)
    } finally {
      setFetchProgress(100)
      setLoading(false)
    }
  }, [])

  useEffect(() => { refetch() }, [refetch])

  return { data, loading, error, refetch, fetchProgress }
}
