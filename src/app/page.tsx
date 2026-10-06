"use client";

import Navbar from "@/components/Navbar";
import Background3D from "@/components/Background3D";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getProjects, getExperiences, getProfile, incrementProfileViews } from "./db-actions";
import styles from "./page.module.css";

export default function Home() {
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const dbProfile = await getProfile();
        if (dbProfile) setProfile(dbProfile);
        
        const dbProjects = await getProjects();
        if (dbProjects.length > 0) setProjects(dbProjects);
        
        const dbExperiences = await getExperiences();
        if (dbExperiences.length > 0) setExperiences(dbExperiences);

        // Increment views in background
        incrementProfileViews();
      } catch (err) {
        console.error("Failed to fetch from DB:", err);
      }
    }
    loadData();
  }, []);



  const customScroll = (e: React.MouseEvent<HTMLButtonElement>, targetId: string) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (!target) return;
    
    const targetPosition = target.getBoundingClientRect().top + window.scrollY - 80;
    const startPosition = window.scrollY;
    const distance = targetPosition - startPosition;
    const duration = 800;
    let start: number | null = null;

    const animation = (currentTime: number) => {
      if (start === null) start = currentTime;
      const timeElapsed = currentTime - start;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      window.scrollTo(0, startPosition + distance * ease);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    };
    requestAnimationFrame(animation);
  };

  return (
    <>
      <Background3D />
      <Navbar />
      <main className={styles.main}>
        <section className={styles.heroSection}>
          <div className="container" style={{ display: 'flex', flexWrap: 'wrap-reverse', alignItems: 'center', justifyContent: 'space-between', gap: '4rem' }}>
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={styles.heroContent}
              style={{ flex: '1 1 500px' }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '0.5rem 1rem', borderRadius: '50px', marginBottom: '1.5rem' }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-1)', letterSpacing: '0.5px' }}>Available for Work</span>
              </motion.div>
              
              <h1 className={styles.title} style={{ fontSize: 'clamp(2.8rem, 5vw, 5rem)', lineHeight: 1.1, marginBottom: '1rem' }}>
                Hi, I'm <span className="text-gradient" style={{ display: 'inline-block' }}>{profile?.name?.split(' ')[0] || 'Unedo'}</span> <br />
                <span style={{ fontSize: '0.5em', opacity: 0.9, fontWeight: 500, letterSpacing: '1px' }}>{profile?.hero_subtitle || 'Informatics Student | Web Developer'}</span>
              </h1>
              
              <p className={styles.subtitle} style={{ fontSize: '1.2rem', lineHeight: 1.8, maxWidth: '600px', marginBottom: '3rem', color: 'var(--text-secondary)' }}>
                {profile?.hero_desc || 'I’m an Informatics student who enjoys building web applications, information systems, and AI/ML projects.'}
              </p>
              
              <div className={styles.actions} style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary" 
                  onClick={(e: any) => customScroll(e, 'projects')} 
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', border: 'none', cursor: 'pointer', padding: '1rem 2rem', fontSize: '1.1rem' }}
                >
                  View Work 
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.05)' }}
                  whileTap={{ scale: 0.95 }}
                  className={styles.btnSecondary} 
                  onClick={(e: any) => customScroll(e, 'about')} 
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', padding: '1rem 2rem', fontSize: '1.1rem' }}
                >
                  Download CV 
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                </motion.button>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center', position: 'relative', width: '100%' }}
            >
              <div style={{ position: 'relative', width: '100%', maxWidth: '320px', aspectRatio: '1/1', zIndex: 2 }}>
                {/* Decorative Glow */}
                <div style={{ position: 'absolute', inset: '-20px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)', filter: 'blur(30px)', zIndex: -1 }}></div>
                
                {/* Floating Elements */}
                <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} style={{ position: 'absolute', top: '10%', left: '-5%', background: 'var(--glass-bg)', backdropFilter: 'blur(10px)', padding: '1rem', borderRadius: '16px', border: '1px solid var(--glass-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 10 }}>
                  <span style={{ fontSize: '1.5rem' }}>💻</span>
                </motion.div>
                
                <motion.div animate={{ y: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }} style={{ position: 'absolute', bottom: '10%', right: '-5%', background: 'var(--glass-bg)', backdropFilter: 'blur(10px)', padding: '1rem', borderRadius: '16px', border: '1px solid var(--glass-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 10 }}>
                  <span style={{ fontSize: '1.5rem' }}>🚀</span>
                </motion.div>

                {/* Profile Image Wrapper */}
                <div style={{ width: '100%', height: '100%', borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%', overflow: 'hidden', border: '4px solid var(--glass-border)', background: 'linear-gradient(135deg, var(--accent-1), var(--accent-2))', padding: '4px' }}>
                  <img src="/profile.jpg" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
                </div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* About Section */}
        <section id="about" className={styles.section} style={{ position: 'relative', zIndex: 10, backgroundColor: 'var(--glass-bg)' }}>
          <div className="container">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h2 className={styles.sectionTitle} style={{ textAlign: 'center' }}>About <span className="text-gradient">Me</span></h2>
            </motion.div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem', alignItems: 'stretch' }}>
              {/* Profile Card */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
                className="glass-panel" 
                style={{ padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'var(--accent-1)', filter: 'blur(80px)', opacity: 0.2 }}></div>
                
                <motion.div whileHover={{ scale: 1.05 }} style={{ width: '160px', height: '160px', borderRadius: '50%', overflow: 'hidden', border: '4px solid var(--accent-1)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 25px rgba(99, 102, 241, 0.4)' }}>
                  <img src="/profile.jpg" alt="Unedo H.C. Sirait" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </motion.div>
                
                <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', fontWeight: 800 }}>{profile?.name || 'Unedo H.C. Sirait'}</h3>
                <p style={{ color: 'var(--accent-1)', fontWeight: 600, marginBottom: '2rem', fontSize: '1.1rem' }}>{profile?.about_title || 'Informatics Student & Web Developer'}</p>
                
                <motion.a 
                  whileHover={{ scale: 1.05, background: 'var(--accent-1)', color: '#fff' }} 
                  whileTap={{ scale: 0.95 }}
                  href="#contact" 
                  onClick={(e: any) => customScroll(e, 'contact')}
                  style={{ display: 'inline-block', padding: '0.8rem 2rem', borderRadius: '50px', border: '2px solid var(--accent-1)', color: 'var(--text-primary)', fontWeight: 600, transition: 'all 0.3s ease', cursor: 'pointer' }}
                >
                  Let's Connect &rarr;
                </motion.a>
              </motion.div>

              {/* Details Card */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
                className="glass-panel" 
                style={{ padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}
              >
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--accent-1)' }}>✨</span> My Journey
                </h3>
                <p style={{ fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                  {profile?.about_desc || 'I’m an Informatics student who enjoys building web applications, information systems, and AI/ML projects.'}
                </p>
                
                <div style={{ display: 'grid', gap: '1.2rem' }}>
                  {[
                    { icon: '🎓', text: 'Informatics Student' },
                    { icon: '💻', text: 'Passionate about Web Dev & Software Eng' },
                    { icon: '🤖', text: 'Exploring AI & Machine Learning' },
                    { icon: '⚡', text: 'Fun fact: I turn coffee into code!' }
                  ].map((item, i) => (
                    <motion.div key={i} whileHover={{ x: 5 }} style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ fontSize: '1.2rem', background: 'rgba(99, 102, 241, 0.1)', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>{item.icon}</span> 
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{item.text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className={styles.section}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Featured <span className="text-gradient">Projects</span></h2>
            <div className={styles.projectGrid}>
              {projects.map((proj: any, i: number) => (
                <div key={proj.id || i} className="glass-panel" style={{ padding: '2rem', height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', transition: 'transform 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  <h3 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>{proj.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>{proj.desc}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                    {Array.isArray(proj.tech) ? proj.tech.map((t: string, idx: number) => (
                      <span key={idx} style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', background: 'var(--glass-border)', borderRadius: '99px', color: 'var(--accent-1)' }}>{t}</span>
                    )) : proj.tech.split(',').map((t: string, idx: number) => (
                      <span key={idx} style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', background: 'var(--glass-border)', borderRadius: '99px', color: 'var(--accent-1)' }}>{t.trim()}</span>
                    ))}
                  </div>
                  <a href={proj.link || '#'} style={{ color: 'var(--text-primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>View Case Study <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className={styles.section} style={{ backgroundColor: 'var(--glass-bg)' }}>
          <div className="container">
            <h2 className={styles.sectionTitle}>Tech <span className="text-gradient">Stack</span></h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
              <div>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>💻 Languages</h3>
                <img src="https://skillicons.dev/icons?i=js,ts,python,php,html,css" alt="Languages" style={{ maxWidth: '100%' }} />
              </div>

              <div>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>⚛️ Frontend</h3>
                <img src="https://skillicons.dev/icons?i=react,nextjs,tailwind" alt="Frontend" style={{ maxWidth: '100%' }} />
              </div>

              <div>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>🖥️ Backend & Database</h3>
                <img src="https://skillicons.dev/icons?i=nodejs,express,postgres,mysql" alt="Backend" style={{ maxWidth: '100%' }} />
              </div>

              <div>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>🤖 AI / Data Science</h3>
                <img src="https://skillicons.dev/icons?i=python,tensorflow,pytorch" alt="AI Data Science" style={{ maxWidth: '100%' }} />
              </div>

              <div>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>🔧 Tools</h3>
                <img src="https://skillicons.dev/icons?i=git,github,vscode,postman,docker" alt="Tools" style={{ maxWidth: '100%' }} />
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className={styles.section} style={{ position: 'relative' }}>
          <div className="container">
            <h2 className={styles.sectionTitle} style={{ textAlign: 'center' }}>Experience & <span className="text-gradient">Education</span></h2>
            <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', marginTop: '3rem' }}>
              {/* Timeline Line */}
              <div style={{ position: 'absolute', left: '24px', top: '10px', bottom: '0', width: '2px', background: 'linear-gradient(to bottom, var(--accent-1), rgba(99, 102, 241, 0.05))' }}></div>
              
              {experiences.map((exp: any, index: number) => (
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  viewport={{ once: true, margin: "-50px" }}
                  key={exp.id || index} 
                  style={{ position: 'relative', paddingLeft: '5.5rem', paddingBottom: '3rem' }}
                >
                  {/* Timeline Dot */}
                  <div style={{ position: 'absolute', left: '11px', top: '1.5rem', width: '28px', height: '28px', borderRadius: '50%', background: 'var(--bg-primary)', border: '2px solid var(--accent-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)', zIndex: 2 }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-1)' }}></div>
                  </div>
                  
                  {/* Card Content */}
                  <div className="glass-panel" style={{ padding: '2rem', transition: 'transform 0.3s ease, box-shadow 0.3s ease', cursor: 'default' }} 
                       onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(99, 102, 241, 0.15)' }} 
                       onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', gap: '1rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{exp.role}</h3>
                        <h4 style={{ color: 'var(--accent-1)', fontWeight: 600, fontSize: '1.05rem', letterSpacing: '0.5px' }}>{exp.company}</h4>
                      </div>
                      <span style={{ background: 'rgba(236, 72, 153, 0.1)', color: 'var(--accent-2)', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700, border: '1px solid rgba(236, 72, 153, 0.2)' }}>
                        {exp.year}
                      </span>
                    </div>
                    {exp.desc && <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '1rem' }}>{exp.desc}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className={styles.section}>
          <div className="container" style={{ textAlign: 'center', maxWidth: '600px' }}>
            <h2 className={styles.sectionTitle}>Let's <span className="text-gradient">Connect</span></h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', lineHeight: 1.6 }}>
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your visions. Let's build something amazing together!
            </p>
            <a href="https://wa.me/6281373028553" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', fontSize: '1.1rem' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
              Chat on WhatsApp
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
