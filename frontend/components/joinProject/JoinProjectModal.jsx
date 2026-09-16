"use client";
import React, { useEffect, useState } from 'react';
import styles from './style.module.css';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { joinProject } from '@/config/redux/action/projectAction';
//invalid token msg
const JoinProjectModal = ({ isOpen, onClose }) => {
  const { token } = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  const [inviteCode, setInviteCode] = useState('');
  const [role, setRole] = useState('');
  const [roleOther, setRoleOther] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;
async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
    const result = await dispatch(joinProject({ inviteCode, role, token , roleOther })).unwrap();
    setInviteCode('');
    setRole('');
    setRoleOther('');
    setTimeout(() => {
      onClose();
      router.push(`/projectOverview/${result.project._id}`);
    }, 2000);
    } catch (err) {
     setError(err?.message || 'Failed to join project');
     setIsSubmitting(false);
  }
}

  return (
     <div className={styles.overlay} onClick={onClose}>
    <div className={styles.join_project} onClick={(e)=>e.stopPropagation()}>
      <h2>Join a project</h2>
      <button onClick={onClose}>X</button>

      <form onSubmit={handleSubmit}>
        <label htmlFor="inviteCode">Invite code or link</label>
        <input
          type="text"
          id="inviteCode"
          placeholder="TF-8X4K2"
          name="inviteCode"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          required
        />

        <label htmlFor="role">Your role on this project</label>
        <select id="role" name="role" value={role} required onChange={(e) => setRole(e.target.value)}>
          <option value="">Select your role</option>
          <option value="client">Client</option>
          <option value="architect">Architect</option>
          <option value="contractor">Contractor</option>
          <option value="vendor">Vendor</option>
          <option value="other">Other</option>
        </select>
        {role === 'other' && (
          <>
         <label htmlFor="roleOther">Please specify your role</label>
         <input  type="text"  id="roleOther" name="roleOther"  value={roleOther}  onChange={(e) => setRoleOther(e.target.value)}
         required  placeholder="e.g. Structural Engineer"/>
  </>
)}

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit">Join Project</button>
      </form>
    </div>
    </div>
  );
};

export default JoinProjectModal;
