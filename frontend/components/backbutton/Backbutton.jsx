"use client";
import React from "react";
import styles from "./style.module.css";
import { useRouter } from "next/navigation";

const Backbutton = () => {
const router = useRouter();

return (
<button
className={styles.backButton}
onClick={() => router.back()}
>
← Back </button>
);
};

export default Backbutton;
