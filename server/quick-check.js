const axios = require('axios')

async function run() {
  const base = process.env.BASE_URL || 'http://localhost:4000'
  const code = 'qc' + Math.floor(Math.random() * 900000 + 100000)
  console.log('Using code:', code)

  try {
    console.log('Creating link...')
    const create = await axios.post(`${base}/api/links`, { url: 'https://example.com', code })
    console.log('Created:', create.data)
  } catch (err) {
    console.error('Create failed:', err.response ? err.response.status : err.message)
    process.exit(1)
  }

  try {
    const before = await axios.get(`${base}/api/links/${code}`)
    console.log('Before:', { clicks: before.data.clicks, lastClicked: before.data.lastClicked })
  } catch (err) {
    console.error('Fetch before failed:', err.response ? err.response.status : err.message)
    process.exit(1)
  }

  try {
    console.log('Requesting redirect (HEAD)')
    // use node's http to make a HEAD request without following redirects
    const res = await axios({ method: 'head', url: `${base}/${code}`, maxRedirects: 0, validateStatus: null })
    console.log('Redirect response status:', res.status, 'location:', res.headers.location)
  } catch (err) {
    if (err.response) {
      console.log('Redirect response status:', err.response.status, 'location:', err.response.headers.location)
    } else {
      console.error('Redirect request failed:', err.message)
    }
  }

  // wait briefly for server to persist click
  await new Promise(r => setTimeout(r, 800))

  try {
    const after = await axios.get(`${base}/api/links/${code}`)
    console.log('After:', { clicks: after.data.clicks, lastClicked: after.data.lastClicked })
  } catch (err) {
    console.error('Fetch after failed:', err.response ? err.response.status : err.message)
    process.exit(1)
  }
}

run().catch(err => { console.error(err); process.exit(1) })
