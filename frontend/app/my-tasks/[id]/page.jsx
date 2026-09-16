'use client'
import DashboardLayout from '@/layouts/dashboardLayout/DashboardLayout'
import React, { useEffect, useState } from 'react'
import styles from './style.module.css'
import { useParams, useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { getTasksByProject, updateTask } from '@/config/redux/action/taskAction'

const MyTasksPage = () => {
  const { id } = useParams();
  const { token, user } = useSelector((state) => state.auth);
  const { tasks, isLoading } = useSelector((state) => state.task);
  const dispatch = useDispatch();
  const router = useRouter();
  const [taskError, setTaskError] = useState('');

  useEffect(() => {
    if (!token) { router.push('/login'); return }
    dispatch(getTasksByProject({ token, projectId: id }))
  }, [id, token, router, dispatch]);

  if (!token) return null
  if (isLoading) return <DashboardLayout><p className={styles.emptyState}>Loading...</p></DashboardLayout>

  const myTasks = tasks.filter(t => t.assignee?._id?.toString() === user?._id?.toString())
  const unassignedOrOthers = tasks.filter(t => t.assignee?._id?.toString() !== user?._id?.toString())

  const markComplete = async (taskId) => {
    setTaskError('');
    try {
      await dispatch(updateTask({ token, taskId, updateTasks: { status: 'completed' } })).unwrap()
    } catch (err) {
      setTaskError(err?.message || 'Failed to update task')
    }
  }

  return (
    <DashboardLayout>
      <div className={styles.tasksPage}>
        {taskError && <p className={styles.error}>{taskError}</p>}

        <h2 className={styles.sectionTitle}>My Tasks</h2>
        <div className={styles.taskList}>
          {myTasks.length === 0 && <p className={styles.emptyState}>No tasks assigned to you yet.</p>}
          {myTasks.map((t) => (
            <div key={t._id} className={styles.taskCard}>
              <p className={styles.taskTitle}>{t.title}</p>
              {t.deadline && <span className={styles.deadline}>{new Date(t.deadline).toLocaleDateString()}</span>}
              <span className={`${styles.statusBadge} ${styles[t.status]}`}>{t.status}</span>
              {t.status !== 'completed' && (
                <button className={styles.markDoneBtn} onClick={() => markComplete(t._id)}>Mark done</button>
              )}
            </div>
          ))}
        </div>

        <h2 className={styles.sectionTitle}>Other Tasks</h2>
        <div className={styles.taskList}>
          {unassignedOrOthers.length === 0 && <p className={styles.emptyState}>No other tasks.</p>}
          {unassignedOrOthers.map((t) => (
            <div key={t._id} className={styles.taskCard}>
              <p className={styles.taskTitle}>{t.title}</p>
              <span className={styles.assignee}>{t.assignee?.name || t.assigneeRaw || 'Unassigned — needs review'}</span>
              <span className={`${styles.statusBadge} ${styles[t.status]}`}>{t.status}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default MyTasksPage