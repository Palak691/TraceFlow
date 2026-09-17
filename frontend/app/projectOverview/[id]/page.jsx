'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {useParams,useRouter} from 'next/navigation'
import { getMyProject, getProjectById } from '@/config/redux/action/projectAction';
import styles from './style.module.css'
import AdminLayout from '@/layouts/adminLayout/AdminLayout';
import { getTasksByProject } from '@/config/redux/action/taskAction';
import { getDecisionsByProject } from '@/config/redux/action/decisionAction';
import { getConversationsByProject } from '@/config/redux/action/conversationAction';
import DashboardLayout from '@/layouts/dashboardLayout/DashboardLayout';


const ProjectOverviewPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const { token, user } = useSelector((state) => state.auth);
    const { currentProject, isLoading : projectLoading } = useSelector((state) => state.project);
    const { tasks, isLoading: tasksLoading } = useSelector((state) => state.task);
    const { decisions, isLoading: decisionsLoading } = useSelector((state) => state.decision);
    const { conversations, isLoading: conversationsLoading } = useSelector((state) => state.conversation);
    const [showInviteCode, setShowInviteCode] = useState(false);
    const [copied, setCopied] = useState(false);
   
  
   useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }
    dispatch(getProjectById({ token,projectId : id }));
    dispatch(getTasksByProject({ token, projectId: id }));
    dispatch(getDecisionsByProject({ token, projectId: id }));
    dispatch(getConversationsByProject({ token, projectId: id }));
  }, [id, token, router, dispatch]);

    if (!token) return null;
  if (projectLoading || tasksLoading || decisionsLoading || conversationsLoading || !currentProject) {
    return (
      <DashboardLayout>
        <p>Loading...</p>
      </DashboardLayout>
    );
  }
  const currentMember = currentProject.members?.find((m) => {
  const memberId = m.user?._id || m.user;
    return memberId?.toString() === user?._id?.toString();
  });

  const currentUserRole = currentMember?.role;
  const isAdmin = currentUserRole === 'project_manager';

  
 const handleCopyInvite = () => {
        navigator.clipboard.writeText(currentProject.inviteCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      };

  const handleSearch = (e) => {
    e.preventDefault();
     if (!token) {
       router.push('/login');
       return;
    }
    const query = e.target.elements.search.value.trim();
  if (!query) return;
  router.push(`/search/${id}?q=${encodeURIComponent(query)}`);
};
  return (

    <DashboardLayout>
      <div className={styles.projectOverview}>
        <header className={styles.projectHeader}>
          <div>
            <h1>{currentProject?.projectName}</h1>
            <p>{currentProject?.description || 'No description yet.'}</p>
          </div>
          <div className={styles.roleBadge}>
          
            You: {currentUserRole == 'other'  ?  currentMember?.roleOther : currentUserRole}
          </div>
        </header>

          {currentProject.members?.length <= 1 && (
          <div className={styles.memberEmptyState}>
            <p>You're the only member so far.</p>
          <button onClick={() => setShowInviteCode(true)}>Invite teammates</button>
          {showInviteCode && (
            <div className={styles.inviteCodeBox}>
            <p>Share this code: <strong>{currentProject.inviteCode}</strong></p>
            <button onClick={handleCopyInvite}>{copied ? "Copied!" : "Copy"}</button>
            <button onClick={() => setShowInviteCode(false)}>Close</button>
           </div>
            )}
        </div>
        )}
        <form onSubmit={handleSearch} className={styles.searchBar}>
           <input name="search" type="text" placeholder="Search conversations, tasks, decisions..."/>
             <button type="submit" className={styles.addButton}>
               Search
              </button>
             </form>

        {isAdmin && <AdminLayout project={currentProject} />}
        <section className={styles.section}>
            {currentUserRole !== 'client' &&
          <div className={styles.sectionHeader}>
            <h2>Conversations</h2>
            <button onClick={() => router.push(`/communication/${id}`)}>
              + Add Conversation
            </button>
          </div>
       }
          {conversations.length === 0 ? (
            <p>No threads yet.</p>
          ) : (
            <ul className={styles.list}>
              {conversations.map((c) => (
                <li key={c._id} className={styles.conversationItem}>
                  <span className={styles.sourceTag}>{c.sourceType}</span>
                  <p>{c.summary || 'Processing summary...'}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={styles.section}>
          <h2>Tasks</h2>
          {tasks.length === 0 ? (
            <p>No tasks yet.</p>
          ) : (
            <table className={styles.taskTable}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Assignee</th>
                  <th>Deadline</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t) => (
                  <tr key={t._id}>
                    <td>{t.title}</td>
                    <td className={styles.assignee}>{t.assignee?.name || t.assigneeRaw || 'Unassigned — needs review'}</td>
                    <td>{t.deadline ? new Date(t.deadline).toLocaleDateString() : '—'}</td>
                    <td>{t.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className={styles.section}>
          <h2>Decisions</h2>
          {decisions.length === 0 ? (
            <p>No decisions logged yet.</p>
          ) : (
            <ul className={styles.list}>
              {decisions.map((d) => (
                <li key={d._id} className={styles.decisionItem}>
                  <span className={styles.typeTag}>{d.type}</span>
                  <p>{d.decisionText}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
      </DashboardLayout>
    
  );

}

export default ProjectOverviewPage


