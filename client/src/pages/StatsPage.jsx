import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getLink } from '../services/linkService'

export default function StatsPage(){
  const { code } = useParams()
  const [link, setLink] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=>{
    let mounted = true
    setLoading(true)
    setError(null)
    getLink(code).then(r=> {
      if (!mounted) return
      setLink(r.data)
      setLoading(false)
    }).catch(err=>{
      if (!mounted) return
      setLink(null)
      setError(err?.response?.data?.error || 'Not found')
      setLoading(false)
    })
    return ()=> { mounted = false }
  },[code])

  if (loading) return <div className="container">Loading...</div>
  if (!link) return <div className="container">{error || 'Not found'}</div>

  return (
    <div className="container">
      <h2>Stats for {link.code}</h2>
      <p><strong>Target:</strong> <a href={link.url} target="_blank" rel="noreferrer">{link.url}</a></p>
      <p><strong>Clicks:</strong> {link.clicks || 0}</p>
      <p><strong>Last clicked:</strong> {link.lastClicked ? new Date(link.lastClicked).toLocaleString() : '-'}</p>
    </div>
  )
}
