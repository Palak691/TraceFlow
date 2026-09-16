import React, { useState } from 'react'
import styles from './style.module.css'
import { useSelector } from 'react-redux'

const AdminLayout = ({project}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(project.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
   
  <section className={styles.adminControls}>
      <h2>Manage Project</h2>

      <div className={styles.inviteBlock}>
        <span>Invite code:</span>
        <code>{project.inviteCode}</code>
        <button onClick={handleCopyInvite}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div className={styles.memberList}>
        <h3>Members</h3>
        <ul>
          {project.members?.map((m) => (
            <li key={m.user?._id || m.user}>
              {m.user?.name || 'Unknown'} — <em>{m.role}</em>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.delete}>
        <button className={styles.deleteButton}>Delete Project</button>
      </div>
    </section>

  )
}

export default AdminLayout