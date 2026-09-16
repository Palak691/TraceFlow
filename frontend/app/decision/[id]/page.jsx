'use client'
import { getDecisionsByProject } from '@/config/redux/action/decisionAction'
import DashboardLayout from '@/layouts/dashboardLayout/DashboardLayout'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './style.module.css'

const DecisionsPage = () => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);
  const { decisions, isLoading } = useSelector((state) => state.decision);
  const dispatch = useDispatch();
  const router = useRouter();

    useEffect(() => {
    if (!token) { router.push('/login'); return }
    dispatch(getDecisionsByProject({ token, projectId: id }))
  }, [id, token, router, dispatch]);

    if (!token) return null
   if (isLoading) return <DashboardLayout><p>Loading...</p></DashboardLayout>
 
  const decisionsList = decisions.filter(d => d.type === 'decision');
  const approvals = decisions.filter(d => d.type === 'approval');
  const pendingApprovals = decisions.filter(d => d.type === 'pending_approval');

  return (
    <DashboardLayout>
         <h2>Pending approvals</h2>
      <div className={styles.list}>
        {pendingApprovals.length === 0 && <p>No pending approvals.</p>}
        {pendingApprovals.map((d) => (
          <div key={d._id} className={styles.card}>
            <p>{d.decisionText}</p>
            <span className={styles.pending}>Pending</span>
          </div>
        ))}
      </div>

      <h2>Approvals</h2>
      <div className={styles.list}>
        {approvals.map((d) => (
          <div key={d._id} className={styles.card}>
            <p>{d.decisionText}</p>
            <span className={styles.approved}>Approved</span>
          </div>
        ))}
      </div>

      <h2>Decisions</h2>
      <div className={styles.list}>
        {decisionsList.map((d) => (
          <div key={d._id} className={styles.card}>
            <p>{d.decisionText}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}

export default DecisionsPage