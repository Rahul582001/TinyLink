import React from 'react';
import { deleteLink, getLink, BACKEND_BASE } from '../services/linkService';

export default function LinkTable({ links = [], onDeleted, onUpdated }) {
  //When delete is clicked, we ask for confirmation then we delete the link using deleteLink service
  const handleDelete = async (code) => {
    if (!confirm('Delete this link?')) return;
    try {
      await deleteLink(code);
      onDeleted && onDeleted(code);
    } catch (err) {
      console.error('Delete failed', err);
      alert('Delete failed');
    }
  };
  
  //When the link is clicked, we do not let the browser navigate directly.

  const handleOpen = (link) => async (e) => {
    e.preventDefault();

    const optimistic = {
      ...link,
      clicks: (link.clicks || 0) + 1,
      lastClicked: new Date().toISOString(),
    };
    onUpdated && onUpdated(optimistic);

    // open backend redirect URL (use BACKEND_BASE so dev/prod work)
    const redirectUrl = `${BACKEND_BASE.replace(/\/$/, '')}/${link.code}`
    window.open(redirectUrl, '_blank', 'noopener')

    setTimeout(async () => {
      try {
        const res = await getLink(link.code);
        onUpdated && onUpdated(res.data);
      } catch (err) {
        console.error('Failed to refresh link after redirect', err);
      }
    }, 1000);
  };

  if (!Array.isArray(links) || links.length === 0) {
    return <div className="container">No links yet</div>;
  }

  return (
    <div className="container">
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Target</th>
            <th>Clicks</th>
            <th>Last clicked</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.map((l) => (
            <tr key={l.code}>
              <td>
                <a href={`${BACKEND_BASE.replace(/\/$/, '')}/${l.code}`} onClick={handleOpen(l)} target="_blank" rel="noopener noreferrer">
                  {l.code}
                </a>
              </td>
              <td title={l.url} style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {l.url}
              </td>
              <td>{l.clicks || 0}</td>
              <td>{l.lastClicked ? new Date(l.lastClicked).toLocaleString() : '-'}</td>
              <td>
                <button className="btn btn-danger" onClick={() => handleDelete(l.code)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
