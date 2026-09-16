"use client"
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from "next/navigation"
import styles from './style.module.css'
import UserLayout from '@/layouts/UserLayout/UserLayout'
import { createProject } from '@/config/redux/action/projectAction';

const CreateProject = () => {
  const { token} = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  
  const [project, setProject] = useState({
    projectName: '',
    projectType: '',
    projectTypeOther:'',
    description: ''

  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      return router.push('/login');
    }
  }, [token, router]);

  if (!token) return null;

  const handleChange = (e) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!project.projectName.trim()) return;
  setLoading(true);
  setError('');
  setMessage('');
  try {
    const result = await dispatch(
      createProject({ project: { ...project }, token })
    ).unwrap();

    setMessage( 'New Project Created');
    setProject({ projectName: '', projectType: '', description: '' ,projectTypeOther :''});
    setTimeout(() => {
      router.push(`/projectOverview/${result.project._id}`);
    }, 2000);
  } catch (err) {
    setError(err?.message || 'Failed to create project');
  } finally {
    setLoading(false);
  }
};

  return (
    <UserLayout>
      <div className={styles.createProjectContainer}>
        <div className={styles.createProject}>
          <form onSubmit={handleSubmit}>
            <h1>Create Project</h1>

            <div className={styles.project_name}>
              <label htmlFor="project_name">Project Name</label>
              <input  type="text"  id="project_name" name="projectName" value={project.projectName}
                placeholder="Pink Villa Project"  required  onChange={handleChange}/>
            </div>
            <div className={styles.project_type}>
              <label htmlFor="project_type">Project Type</label>
              <select id="project_type" name="projectType" value={project.projectType} required onChange={handleChange}>
                <option value="">Select project type</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="institutional">Institutional</option>
                <option value="interior">Interior</option>
                <option value="renovation">Renovation</option>
                <option value="other">Other</option>
              </select>
              {project.projectType === 'other' && (
              <div className={styles.projectTypeOther}>
            <label htmlFor="projectTypeOther">Please specify project type</label>
           <input type="text"  id="projectTypeOther"  name="projectTypeOther"
            value={project.projectTypeOther}  onChange={handleChange} required
          placeholder="e.g. Landscaping"/>
           </div>
          )}
            </div>
            <div className={styles.project_desc}>
              <label htmlFor="project_desc">Description</label>
              <textarea id="project_desc" name="description" placeholder="A residential architecture project"
                rows="4" value={project.description} onChange={handleChange} />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            {message && <p className={styles.success}>{message}</p>}         
            <button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create'}
            </button>
          </form>
        </div>
      </div>
    </UserLayout>
  );
}

export default CreateProject
