import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import AddLinkForm from '../components/AddLinkForm'
import LinkTable from '../components/LinkTable'
import { listLinks } from '../services/linkService'

export default function Dashboard(){
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async ()=>{
    setLoading(true)
    setError(null)
    try {
      const res = await listLinks()
      setLinks(res.data)
    } catch (err) {
      console.error('Failed to load links', err)
      setError(err?.response?.data?.error || 'Failed to load links')
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{ load() },[])

  const handleUpdated = (updated) => {
    setLinks(prev => prev.map(p => p.code === updated.code ? updated : p))
  }

  return (
    <div className="container" style={{background:"linear-gradient(to right, #f779e7, #84f5a8)", paddingBottom:20, minHeight:"100vh"}}>
      <Header />
      <AddLinkForm onCreated={(l)=> setLinks(prev=> [l, ...prev])} />
      {loading && <div>Loading...</div>}
      {error && !loading && (
        <div style={{color:'red', marginTop:8}}>
          {error} <button className="btn" onClick={load} style={{marginLeft:8}}>Retry</button>
        </div>
      )}
      {!loading && !error && (
        <LinkTable links={links} onDeleted={(code)=> setLinks(prev=> prev.filter(p=>p.code!==code))} onUpdated={handleUpdated} />
      )}
    </div>
  )
}
