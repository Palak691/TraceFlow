'use client'
import { createConversation, createConversationFromImage, getConversationsByProject } from '@/config/redux/action/conversationAction';
import DashboardLayout from '@/layouts/dashboardLayout/DashboardLayout';
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styles from './style.module.css'

const CommunicationPage = () => {
    const {id} = useParams();
    const { token } = useSelector((state) => state.auth);
    const [rawText, setRawText] = useState('');
    const [source, setSource] = useState('chat');
    const { conversations, isLoading } = useSelector((state) => state.conversation);
    const dispatch = useDispatch();
    const router = useRouter();
    const [error, setError] = useState('');
    //ocr
    const [imageFile, setImageFile] = useState(null);


   useEffect(() => {
      if (!token) {
      router.push('/login');
       return;
     }
     dispatch(getConversationsByProject({ token, projectId: id }));
     }, [token, id, router, dispatch]);

    if (!token) return null;


   const handleTextSubmit  = async (e) => {
      e.preventDefault()
      if (!rawText.trim()) return
      setError('')
      try {
        await dispatch(createConversation({ token, projectId: id, source, rawText })).unwrap()
        setRawText('')
       } catch (err) {
       setError(err?.message || 'Failed to process conversation')
    }
  }
  const handleImageSubmit = async(e)=>{
     e.preventDefault();
     if (!imageFile) return;
      setError('');
      try {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('projectId', id);
    await dispatch(createConversationFromImage({ token, formData })).unwrap();
    setImageFile(null);
  } catch (err) {
    setError(err?.message || 'Failed to process image');
  }

  }
  return (
  <DashboardLayout>
      <div className={styles.communicationPage}>
        <form onSubmit={handleTextSubmit} className={styles.inputForm}>
          <select value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="chat">WhatsApp / Chat</option>
            <option value="email">Email</option>
            <option value="meeting">Meeting notes</option>
            <option value="call">Call transcript</option>
            <option value="voice_note">Voice note transcript</option>
          </select>
          <textarea
            rows={6}
            placeholder="Paste the conversation or notes here..."
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" disabled={isLoading || !rawText.trim()}>
            {isLoading ? 'Processing...' : 'Extract tasks & decisions'}
          </button>
        </form>

        <form onSubmit={handleImageSubmit} className={styles.imageForm}>
       <label htmlFor="imageUpload" className={styles.imageLabel}>
           {imageFile ? imageFile.name : 'Choose an image (screenshot, photo of notes, etc.)'}
         </label>
         <input id="imageUpload"  type="file"  accept="image/*"   onChange={(e) => setImageFile(e.target.files[0])}
          className={styles.imageInput}/>
        <button type="submit" disabled={isLoading || !imageFile}>
         {isLoading ? 'Processing...' : 'Extract from image'}
      </button>
       </form>

        <div className={styles.conversationList}>
          {isLoading && <p className={styles.emptyState}>Loading...</p>}
          {!isLoading && conversations.length === 0 && (
            <p className={styles.emptyState}>No conversations yet — paste one above.</p>
          )}
          {conversations.map((c) => (
            <div key={c._id} className={styles.conversationCard}>
              <p className={styles.source}>{c.sourceType}</p>
              <p className={styles.summary}>{c.summary || 'Not yet processed'}</p>
              <p className={styles.rawPreview}>
                {c.rawText?.length > 120 ? `${c.rawText.slice(0, 120)}...` : c.rawText}
              </p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}


export default CommunicationPage