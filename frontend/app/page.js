'use client'
import Link from "next/link";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import JoinProjectModal from "@/components/joinProject/JoinProjectModal";
import UserLayout from "@/layouts/UserLayout/UserLayout";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getMyProject } from "@/config/redux/action/projectAction";

export default function Home() {
  const {token} = useSelector((state)=>state.auth);
  const { projects } = useSelector((state) => state.project);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
  if (token) {
    dispatch(getMyProject(token));
  }
}, [token, dispatch]);

  return (
    <UserLayout>
    <main className={styles.hero}>
         <section>
        <h1>Stop digging through chats for what matters.</h1>

        <p>
         TraceFlow reads your project conversations and pulls out the tasks, deadlines, and decisions — automatically, and never disconnected from where they came from.
        </p>

   {token && projects?.length > 0 && (
  <div className={styles.myProjects}>
    <div className={styles.myProjectsHeader}>
      <h2>Your Projects</h2>
      <span className={styles.projectCount}>{projects.length}</span>
    </div>
    <ul>
      {projects.map((p) => (
        <li key={p._id}>
          <Link href={`/projectOverview/${p._id}`} className={styles.projectLink}>
            <span className={styles.projectDot} />
            <span className={styles.projectLinkText}>{p.projectName}</span>
            <span className={styles.projectArrow}>→</span>
          </Link>
        </li>
        ))}
      </ul>
      </div>
     )}
       
      <div className={styles.buttons}>
        <Link href={'/create-project'} className={styles.createBtn}>Create Project</Link>
        <button  className={styles.joinBtn} onClick={()=>{
          if(!token){
          return router.push('/login');
          }
           setShowJoinModal(true)} 
           }>
            Join Project
            </button>
        </div>
        <JoinProjectModal isOpen={showJoinModal} onClose={()=>setShowJoinModal(false)}/>
      </section>
    </main>
    </UserLayout>
  );
}
