import React, { useState } from 'react'
import isValidUrl from '../utils/validateUrl'
import { createLink } from '../services/linkService'

export default function AddLinkForm({ onCreated }){
  const [url, setUrl] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    if (!isValidUrl(url)) return setError('Enter a valid URL')
    setLoading(true)
    try {
      const res = await createLink({ url, code: code || undefined })
      setUrl('')
      setCode('')
      onCreated && onCreated(res.data)
    } catch (err) {
      setError(err?.response?.data?.error || 'Create failed')
    } finally { setLoading(false) }
  }

  return (
    <form onSubmit={submit} className="container">
      <div className="form-row" style={{marginBottom:8,padding:"5px"}}>
        <div className="form-group">
          <label htmlFor="link-box" className="form-label" >Paste your long link here</label>
          <input id="link-box" className="input" style={{marginRight:"4px"}} placeholder="https://example.com/long/path" value={url} onChange={e=>setUrl(e.target.value)} />
        </div>

        <div className="form-group">
          <label htmlFor="code-box" className="form-label" >Custom Name/code</label>
          <input id="code-box" className="input" style={{marginRight:"4px"}} placeholder="Custom code" value={code} onChange={e=>setCode(e.target.value)} />
        </div>

        <div className="actions">
          <button className="btn btn-primary" disabled={loading} type="submit">{loading? 'Saving...':'Add'}</button>
        </div>
      </div>
      {error && <div style={{color:'red'}}>{error}</div>}
    </form>
  )
}
