'use client'
import React, { useEffect, useRef, useState } from 'react'
import styles from './style.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import UserLayout from '@/layouts/UserLayout/UserLayout'
import { getUserProfileData, updateUserProfileData,uploadProfilePicture} from '@/config/redux/action/authAction'
import DashboardLayout from '@/layouts/dashboardLayout/DashboardLayout'

const MyProfilePage = () => {

  const { token, userProfile, userProjects, isLoading } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const router = useRouter()
  const fileInputRef = useRef(null)
  const [isEditingName, setIsEditingName] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [savingName, setSavingName] = useState(false)
  const [nameError, setNameError] = useState('')
  const [uploadingPicture, setUploadingPicture] = useState(false)
  const [pictureError, setPictureError] = useState('')



  useEffect(() => {
    if (!token) {
      router.push('/login')
      return
    }
    dispatch(getUserProfileData(token));
  }, [token, dispatch, router]);


  
  useEffect(() => {
    if (userProfile?.name) {
      setNameInput(userProfile.name)
    }
  }, [userProfile]);


  if (!token) return null;


  if (isLoading || !userProfile) {
    return (
      <DashboardLayout>
        <div className={styles.loadingState}>
          Loading profile...
        </div>
      </DashboardLayout>
    )
  }


  const initials = userProfile.name
    ? userProfile.name.split(' ').map((name) => name[0]).slice(0, 2).join('').toUpperCase(): '?'


  const memberSince = userProfile.memberSince
    ? new Date(userProfile.memberSince).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      }): null


  // Save name
  const handleNameSave = async () => {
    const name = nameInput.trim()
    if (!name) {
      setNameError('Name cannot be empty')
      return
    }
    if (name === userProfile.name) {
      setIsEditingName(false)
      return
    }
    setSavingName(true)
    setNameError('')
    try {
      await dispatch(
        updateUserProfileData({
          token,
          data: { name }
        })
      ).unwrap()
      setIsEditingName(false)
    } catch (err) {
      setNameError(
        err?.message || 'Failed to update name'
     )
    } finally {

      setSavingName(false)

    }
  }


  // Upload profile picture
  const handlePictureChange = async (e) => {

    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setPictureError('Please select an image file')
      return
    }

    setUploadingPicture(true)
    setPictureError('')
    try {
      await dispatch(
        uploadProfilePicture({ token, profilePicture: file})).unwrap()
    } catch (err) {
      setPictureError(
        err?.message || 'Failed to upload picture')
    } finally {
      setUploadingPicture(false)
      e.target.value = ''
    }
  }


  return (
    <DashboardLayout>
      <div className={styles.profilePage}>
        <div className={styles.profileCard}>
          <div  className={styles.avatarWrap} onClick={() =>  !uploadingPicture &&
              fileInputRef.current?.click()}  title="Click to change profile picture">
         {userProfile.profilePicture ? (
  <img
    src={userProfile.profilePicture}
    alt={userProfile.name}
    className={styles.avatarImg}
    onError={(e) => { e.target.style.display = 'none' }}
  />
) : (
  <div className={styles.avatarInitials}>{initials}</div>
)}

            <div className={styles.avatarOverlay}>
              {uploadingPicture  ? 'Uploading...': 'Change'}
            </div>
          </div>
          <input  type="file"  accept="image/*"  ref={fileInputRef}  name = 'profilePicture'
            onChange={handlePictureChange} style={{ display: 'none' }} disabled={uploadingPicture}/>
          {pictureError && ( <p className={styles.nameError}>{pictureError}</p>)}
         
          {nameError && ( <p className={styles.nameError}> {nameError}</p>)}
          <p className={styles.email}>
            {userProfile.email}
          </p>
          {memberSince && (
            <p className={styles.memberSince}>
              Member since {memberSince}
            </p>
          )}
        </div>
        <div className={styles.projectsSection}>
          {!userProjects || userProjects.length === 0 ? (
            <p className={styles.emptyState}>
              You haven't joined any projects yet.
            </p>
          ) : (
            <div className={styles.myProjects}>
              <div className={styles.myProjectsHeader}>
                <h2>Your Projects</h2>
                <span className={styles.projectCount}>
                  {userProjects.length}
                </span>
              </div>

              <ul>
                {userProjects.map((p) => (
                  <li key={p.projectId}>
                    <Link href={`/projectOverview/${p.projectId}`} className={styles.projectLink}>
                      <span className={styles.projectDot} />
                      <span className={styles.projectLinkText}>
                        {p.projectName}
                      </span>
                      <span className={styles.roleBadge}>
                        {p.role
                          .replaceAll('_', ' ')
                          .replace(/\b\w/g, (char) => char.toUpperCase())}
                      </span>
                      <span className={styles.projectArrow}>→</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default MyProfilePage