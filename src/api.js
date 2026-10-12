const KEY = 'lockin-auth'
export const getAuth = () => { try { return JSON.parse(localStorage.getItem(KEY)) } catch { return null } }
export const setAuth = a => { try { a ? localStorage.setItem(KEY, JSON.stringify(a)) : localStorage.removeItem(KEY) } catch {} }

export async function api(path, { method = 'GET', body, token } = {}) {
  const r = await fetch(path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
    body: body ? JSON.stringify(body) : undefined
  })
  const j = await r.json().catch(() => ({}))
  if (!r.ok) { const e = new Error(j.error || 'Request failed'); e.status = r.status; throw e }
  return j
}