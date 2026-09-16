'use client'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useRouter } from 'next/navigation'

import styles from './style.module.css'
import { searchProject } from '@/config/redux/action/searchAction'
import DashboardLayout from '@/layouts/dashboardLayout/DashboardLayout'

const SearchPage = () => {
  const { id } = useParams()
  const [query, setQuery] = useState('')
  const { token } = useSelector((state) => state.auth)
  const { results, isLoading } = useSelector((state) => state.search)
  const dispatch = useDispatch()
  const router = useRouter()

  const handleSearch = (e) => {
    e.preventDefault()
    if (!token) { router.push('/login'); return }
    if (!query.trim()) return
    dispatch(searchProject({ token, projectId: id, q: query }))
  }

  return (
    <DashboardLayout>
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <input
          type="text"
          placeholder="Search tasks, decisions, conversations..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {isLoading && <p>Searching...</p>}

      {!isLoading && (
        <>
          <section>
            <h2>Tasks</h2>
            {results.tasks.length === 0 ? <p>No matching tasks.</p> : (
              results.tasks.map(t => (
                <div key={t._id} className={styles.resultCard}>
                  <p>{t.title}</p>
                  <span>{t.assignee?.name || t.assigneeRaw || 'Unassigned'}</span>
                </div>
              ))
            )}
          </section>

          <section>
            <h2>Decisions</h2>
            {results.decisions.length === 0 ? <p>No matching decisions.</p> : (
              results.decisions.map(d => (
                <div key={d._id} className={styles.resultCard}>
                  <span className={styles.typeTag}>{d.type}</span>
                  <p>{d.decisionText}</p>
                </div>
              ))
            )}
          </section>

          <section>
            <h2>Conversations</h2>
            {results.conversations.length === 0 ? <p>No matching conversations.</p> : (
              results.conversations.map(c => (
                <div key={c._id} className={styles.resultCard}>
                  <p>{c.summary || c.rawText.slice(0, 100)}</p>
                </div>
              ))
            )}
          </section>
        </>
      )}
    </DashboardLayout>
  )
}

export default SearchPage