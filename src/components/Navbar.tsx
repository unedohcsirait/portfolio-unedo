"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getProfile } from "@/app/db-actions";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Navbar.module.css";
export default function Navbar() {
  const [profile, setProfile] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const p = await getProfile();
        if (p) setProfile(p);
      } catch (err) {}
    }
    load();
  }, []);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, targetId: string) => {
    e.preventDefault();
    setMenuOpen(false); // Close mobile menu when clicked
    const target = document.getElementById(targetId);
    if (!target) return;
    
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - 80; // Offset for navbar
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    const duration = 800;
    let start: number | null = null;

    const animation = (currentTime: number) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Easing function (ease-in-out-cubic)
      const ease = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
      window.scrollTo(0, startPosition + distance * ease);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };
    
    requestAnimationFrame(animation);
  };

  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setMenuOpen(false);
    
    const startPosition = window.scrollY;
    const distance = -startPosition; // Distance to top
    const duration = 800;
    let start: number | null = null;

    const animation = (currentTime: number) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const progress = Math.min(timeElapsed / duration, 1);
      
      const ease = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
      window.scrollTo(0, startPosition + distance * ease);
      
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      }
    };
    
    requestAnimationFrame(animation);
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={styles.header}
    >
      <div className={`container ${styles.navContainer}`}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          whileHover={{ scale: 1.05, filter: "drop-shadow(0px 0px 8px rgba(99, 102, 241, 0.8))" }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/" className={styles.logo} onClick={scrollToTop}>
            <span className={styles.rgbBreathe}>{profile?.name || 'Unedo Sirait'}</span>
          </Link>
        </motion.div>
        
        <nav className={styles.navLinks}>
          {['about', 'skills', 'projects', 'experience'].map((item, i) => (
            <motion.a 
              key={item}
              className={styles.rgbBreathe}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * (i + 1) }}
              whileHover={{ scale: 1.1, filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5))' }}
              whileTap={{ scale: 0.95 }}
              style={{cursor: 'pointer', textTransform: 'capitalize', animationDelay: `-${i * 1.5}s`}} 
              onClick={(e) => handleScroll(e, item)}
            >
              {item}
            </motion.a>
          ))}
        </nav>
        <div className={styles.socials}>
          <motion.a 
            className={styles.rgbRandom}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 400, delay: 0.2 }}
            whileHover={{ scale: 1.2, rotate: 10, filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.5))' }}
            whileTap={{ scale: 0.9 }}
            style={{ animationDelay: '-6s' }}
            href="https://github.com/unedohcsirait/" target="_blank" rel="noopener noreferrer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path></svg>
          </motion.a>
          <motion.a 
            className={styles.rgbRandom}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 400, delay: 0.25 }}
            whileHover={{ scale: 1.2, rotate: -10, filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.5))' }}
            whileTap={{ scale: 0.9 }}
            style={{ animationDelay: '-7.5s' }}
            href="https://www.linkedin.com/in/unedo-hc-sirait" target="_blank" rel="noopener noreferrer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
          </motion.a>
          <motion.a 
            className={styles.rgbRandom}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 400, delay: 0.3 }}
            whileHover={{ scale: 1.2, rotate: 10, filter: 'drop-shadow(0 0 5px rgba(255,255,255,0.5))' }}
            whileTap={{ scale: 0.9 }}
            style={{ animationDelay: '-9s' }}
            href="https://wa.me/6281373028553" target="_blank" rel="noopener noreferrer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          </motion.a>
        </div>
        
        {/* Hamburger Icon */}
        <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle Menu">
          {menuOpen ? (
            <motion.svg initial={{ rotate: -90 }} animate={{ rotate: 0 }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></motion.svg>
          ) : (
            <motion.svg initial={{ rotate: 90 }} animate={{ rotate: 0 }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></motion.svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`${styles.mobileMenu} ${styles.open}`}
          >
            <nav className={styles.navLinks} style={{ display: 'flex' }}>
              {['about', 'skills', 'projects', 'experience'].map((item, i) => (
                <motion.a 
                  key={item}
                  className={styles.rgbBreathe}
                  whileHover={{ scale: 1.1, filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5))' }}
                  whileTap={{ scale: 0.95 }}
                  style={{cursor: 'pointer', textTransform: 'capitalize', animationDelay: `-${i * 1.5}s`}} 
                  onClick={(e) => handleScroll(e, item)}
                >
                  {item}
                </motion.a>
              ))}
            </nav>
            <div className={styles.socials} style={{ display: 'flex' }}>
              <a className={styles.rgbRandom} style={{ animationDelay: '-6s' }} href="https://github.com/unedohcsirait" target="_blank" rel="noopener noreferrer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path></svg>
              </a>
              <a className={styles.rgbRandom} style={{ animationDelay: '-7.5s' }} href="https://www.linkedin.com/in/unedo-hc-sirait" target="_blank" rel="noopener noreferrer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a className={styles.rgbRandom} style={{ animationDelay: '-9s' }} href="https://wa.me/6281373028553" target="_blank" rel="noopener noreferrer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
