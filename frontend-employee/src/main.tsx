import React, { FormEvent, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { apiFetch, getSession, Session } from './api'
import './styles.css'

interface Announcement {
  id: string
  title: string
  body: string
  status: string
  departmentId?: string
  publishedAt?: string
}

interface Feedback {
  id: string
  subject: string
  message: string
  status: string
  reviewNote?: string
  closeNote?: string
}

const demoEmployees = ['employee@company.test', 'noah.it@company.test']

const App = () => {
  const [session, setSession] = useState<Session | undefined>(getSession())
  const [email, setEmail] = useState(demoEmployees[0])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const load = async () => {
    if (!getSession()) return
    setAnnouncements(await apiFetch('/announcements'))
    setFeedback(await apiFetch('/feedback'))
  }

  useEffect(() => {
    load().catch((err) => setError(err.message))
  }, [session])

  const login = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    try {
      const result = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email }) })
      if (result.user.role !== 'EMPLOYEE') throw new Error('Use an employee account for this portal')
      localStorage.setItem('employeeSession', JSON.stringify(result))
      setSession(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  const submitFeedback = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    try {
      await apiFetch('/feedback', { method: 'POST', body: JSON.stringify({ subject, message }) })
      setSubject('')
      setMessage('')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit feedback')
    }
  }

  if (!session) {
    return (
      <main className="login-shell">
        <section className="login-panel">
          <h1>Employee Portal</h1>
          <form onSubmit={login}>
            <label>
              Mock Azure AD account
              <select value={email} onChange={(event) => setEmail(event.target.value)}>
                {demoEmployees.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <button>Sign in</button>
          </form>
          {error && <p className="error">{error}</p>}
        </section>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <header>
        <div>
          <h1>Welcome, {session.user.displayName}</h1>
          <p>{session.user.role} self-service workspace</p>
        </div>
        <button onClick={() => { localStorage.removeItem('employeeSession'); setSession(undefined) }}>Sign out</button>
      </header>

      {error && <p className="error">{error}</p>}

      <section className="grid">
        <div>
          <h2>Announcements</h2>
          <div className="stack">
            {announcements.map((item) => (
              <article className="item" key={item.id}>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
                <span>{item.departmentId ? 'Department' : 'Company-wide'} · {item.status}</span>
              </article>
            ))}
          </div>
        </div>

        <div>
          <h2>Submit Feedback</h2>
          <form className="feedback-form" onSubmit={submitFeedback}>
            <input placeholder="Subject" value={subject} onChange={(event) => setSubject(event.target.value)} />
            <textarea placeholder="What should HR or your department admin know?" value={message} onChange={(event) => setMessage(event.target.value)} />
            <button>Submit</button>
          </form>

          <h2>My Feedback</h2>
          <div className="stack">
            {feedback.map((item) => (
              <article className="item" key={item.id}>
                <strong>{item.subject}</strong>
                <p>{item.message}</p>
                <span>{item.status}</span>
                {item.reviewNote && <small>{item.reviewNote}</small>}
                {item.closeNote && <small>{item.closeNote}</small>}
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
