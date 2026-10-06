"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { logoutAction, updateCredentialsAction } from "./actions";
import { useRouter } from "next/navigation";
import { getProjects, addProjectAction, deleteProjectAction, getExperiences, addExperienceAction, deleteExperienceAction, getProfile, updateProfileAction } from "../db-actions";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");

  const [projects, setProjects] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);

  const [newProject, setNewProject] = useState({ title: '', tech: '', desc: '' });
  const [newExp, setNewExp] = useState({ role: '', company: '', year: '' });
  const [newCreds, setNewCreds] = useState({ username: '', password: '' });

  useEffect(() => {
    async function fetchDB() {
      const p = await getProjects();
      setProjects(p);
      const e = await getExperiences();
      setExperiences(e);
      const prof = await getProfile();
      setProfile(prof);
    }
    fetchDB();
  }, []);

  const handleLogout = async () => {
    await logoutAction();
    router.refresh();
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    const updated = await updateProfileAction(profile.name, profile.hero_subtitle, profile.hero_desc, profile.about_title, profile.about_desc, profile.cv_link || '#', profile.contact_link || '#');
    setProfile(updated);
    alert('Profile updated successfully!');
  };

  const handleUpdateCreds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCreds.username || !newCreds.password) {
      alert("Please fill both username and password!");
      return;
    }
    const res = await updateCredentialsAction(newCreds.username, newCreds.password);
    if (res.success) {
      alert("Credentials updated successfully!");
      setNewCreds({ username: '', password: '' });
    }
  };

  const addProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const inserted = await addProjectAction(newProject.title, newProject.tech, newProject.desc);
    setProjects([inserted, ...projects]);
    setNewProject({ title: '', tech: '', desc: '' });
  };

  const addExp = async (e: React.FormEvent) => {
    e.preventDefault();
    const inserted = await addExperienceAction(newExp.role, newExp.company, newExp.year, "");
    setExperiences([inserted, ...experiences]);
    setNewExp({ role: '', company: '', year: '' });
  };

  const deleteProject = async (id: number) => {
    await deleteProjectAction(id);
    setProjects(projects.filter(p => p.id !== id));
  };

  const deleteExp = async (id: number) => {
    await deleteExperienceAction(id);
    setExperiences(experiences.filter(e => e.id !== id));
  };

  return (
    <>
      <style>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background-color: var(--bg-primary);
          position: relative;
          overflow: hidden;
        }
        .bg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          z-index: 0;
          pointer-events: none;
          animation: float-slow 15s infinite alternate;
        }
        .blob-1 { width: 500px; height: 500px; background: rgba(99, 102, 241, 0.15); top: -200px; left: -100px; }
        .blob-2 { width: 400px; height: 400px; background: rgba(236, 72, 153, 0.15); bottom: -100px; right: -100px; animation-delay: -7s; }
        @keyframes float-slow {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(50px, 30px) scale(1.1); }
        }
        
        .admin-sidebar {
          width: 280px;
          background: rgba(18, 18, 18, 0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-right: 1px solid var(--glass-border);
          padding: 2.5rem 2rem;
          display: flex;
          flex-direction: column;
          z-index: 10;
          box-shadow: 4px 0 24px rgba(0,0,0,0.2);
        }
        
        .nav-btn {
          text-align: left;
          padding: 0.85rem 1.25rem;
          border-radius: 12px;
          background: transparent;
          color: var(--text-secondary);
          border: 1px solid transparent;
          cursor: pointer;
          font-weight: 600;
          text-transform: capitalize;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1rem;
          position: relative;
        }
        .nav-btn:hover {
          background: rgba(255,255,255,0.03);
          color: white;
          transform: translateX(4px);
        }
        .nav-btn.active {
          background: linear-gradient(to right, rgba(99, 102, 241, 0.15), rgba(236, 72, 153, 0.15));
          color: var(--text-primary);
          border: 1px solid var(--glass-border);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .nav-btn.active::before {
          content: '';
          position: absolute;
          left: -1rem;
          width: 4px;
          height: 24px;
          background: linear-gradient(to bottom, var(--accent-1), var(--accent-2));
          border-radius: 0 4px 4px 0;
        }
        
        .main-content {
          flex: 1;
          padding: 3rem 4rem;
          overflow-y: auto;
          z-index: 1;
          position: relative;
        }
        .main-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
          animation: fadeInDown 0.6s ease forwards;
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .main-header-title {
          font-size: 2.5rem;
          font-weight: 800;
          text-transform: capitalize;
          letter-spacing: -0.5px;
        }
        
        .content-panel {
          padding: 3rem;
          min-height: 600px;
          border-radius: 24px;
          background: rgba(20, 20, 20, 0.4);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05);
          border: 1px solid var(--glass-border);
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
        }
        .stat-card {
          padding: 2.5rem;
          background: rgba(255,255,255,0.02);
          border-radius: 20px;
          border: 1px solid var(--glass-border);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--accent-1), var(--accent-2));
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          background: rgba(255,255,255,0.04);
        }
        .stat-card:hover::before {
          opacity: 1;
        }
        
        .form-grid {
          display: grid;
          gap: 1.5rem;
          max-width: 800px;
        }
        .form-grid-small {
          display: grid;
          gap: 1.25rem;
          margin-bottom: 3.5rem;
          max-width: 600px;
        }
        .item-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .item-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.25rem 1.75rem;
          background: rgba(255,255,255,0.02);
          border-radius: 16px;
          border: 1px solid var(--glass-border);
          transition: all 0.3s ease;
        }
        .item-card:hover {
          background: rgba(255,255,255,0.04);
          transform: translateX(5px);
          border-color: rgba(255,255,255,0.15);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        .input-field {
          width: 100%;
          padding: 1rem 1.25rem;
          border-radius: 12px;
          border: 1px solid var(--glass-border);
          background: rgba(0,0,0,0.2);
          color: white;
          outline: none;
          transition: all 0.3s ease;
          font-family: inherit;
        }
        .input-field:focus {
          border-color: var(--accent-1);
          background: rgba(0,0,0,0.4);
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }
        
        .delete-btn {
          padding: 0.6rem 1.25rem;
          background: rgba(236, 72, 153, 0.1);
          color: var(--accent-2);
          border: 1px solid rgba(236, 72, 153, 0.2);
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease;
        }
        .delete-btn:hover {
          background: rgba(236, 72, 153, 0.2);
          transform: scale(1.05);
        }
        
        @media (max-width: 1024px) {
          .main-content {
            padding: 2.5rem;
          }
        }
        
        @media (max-width: 768px) {
          .admin-layout {
            flex-direction: column;
          }
          .admin-sidebar {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid var(--glass-border);
            padding: 1.5rem;
          }
          .admin-sidebar nav {
            flex-direction: row !important;
            overflow-x: auto;
            padding-bottom: 0.5rem;
            gap: 0.5rem;
          }
          .nav-btn {
            white-space: nowrap;
            padding: 0.6rem 1rem;
          }
          .nav-btn.active::before {
            display: none;
          }
          .admin-logout-container {
            flex-direction: row !important;
            justify-content: space-between;
            align-items: center;
            padding-top: 1.5rem !important;
          }
          .main-content {
            padding: 1.5rem;
          }
          .main-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
            margin-bottom: 2rem;
          }
          .main-header-title {
            font-size: 1.8rem;
          }
          .content-panel {
            padding: 1.5rem;
            min-height: auto;
          }
          .item-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          .item-card button {
            width: 100%;
          }
        }
      `}</style>
      <div className="admin-layout">
        <div className="bg-blob blob-1"></div>
        <div className="bg-blob blob-2"></div>
        
        {/* Sidebar */}
        <aside className="admin-sidebar">
        <h2 style={{ marginBottom: '2.5rem', fontSize: '1.6rem', fontWeight: 800 }}><span className="text-gradient">Admin Panel</span></h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            { id: 'dashboard', icon: '📊' },
            { id: 'profile', icon: '👤' },
            { id: 'projects', icon: '🚀' },
            { id: 'experience', icon: '💼' },
            { id: 'account', icon: '⚙️' }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-btn ${activeTab === tab.id ? 'active' : ''}`}
            >
              <span style={{ fontSize: '1.2rem' }}>{tab.icon}</span>
              {tab.id}
            </button>
          ))}
        </nav>
        
        <div className="admin-logout-container" style={{ marginTop: 'auto', paddingTop: '4rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button onClick={handleLogout} className="nav-btn" style={{ color: 'var(--accent-2)' }}>
            <span style={{ fontSize: '1.2rem' }}>🚪</span> Logout
          </button>
          <Link href="/" className="nav-btn" style={{ color: 'var(--text-secondary)' }}>
            <span style={{ fontSize: '1.2rem' }}>&larr;</span> View Portfolio
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="main-header">
          <h1 className="main-header-title">{activeTab} Management</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 1rem', borderRadius: '999px', border: '1px solid var(--glass-border)' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Welcome, <strong style={{ color: 'white' }}>Unedo</strong></span>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-1), var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: '0 4px 10px rgba(99, 102, 241, 0.4)' }}>👨‍💻</div>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-panel">
          {activeTab === 'dashboard' && (
            <div>
              <h3 style={{ marginBottom: '2.5rem', color: 'var(--text-secondary)', fontSize: '1.2rem', fontWeight: 400 }}>System Overview</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>Total Profile Views</p>
                  <h4 style={{ fontSize: '3rem', fontWeight: 800, color: 'white' }}>{profile?.views || 0}</h4>
                </div>
                <div className="stat-card">
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>Projects Active</p>
                  <h4 style={{ fontSize: '3rem', fontWeight: 800, color: 'white' }}>{projects.length}</h4>
                </div>
                <div className="stat-card">
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px' }}>Experiences</p>
                  <h4 style={{ fontSize: '3rem', fontWeight: 800, color: 'white' }}>{experiences.length}</h4>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'profile' && profile && (
            <div>
              <h3 style={{ marginBottom: '2rem', color: 'var(--accent-1)' }}>Edit Profile & About Me</h3>
              <form onSubmit={saveProfile} className="form-grid">
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Full Name</label>
                  <input type="text" className="input-field" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Hero Subtitle (e.g. Informatics Student | Web Developer)</label>
                  <input type="text" className="input-field" value={profile.hero_subtitle} onChange={e => setProfile({...profile, hero_subtitle: e.target.value})} required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Hero Description</label>
                  <textarea className="input-field" value={profile.hero_desc} onChange={e => setProfile({...profile, hero_desc: e.target.value})} required style={{ minHeight: '120px' }}></textarea>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '1rem 0' }} />
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>About Section Title</label>
                  <input type="text" className="input-field" value={profile.about_title} onChange={e => setProfile({...profile, about_title: e.target.value})} required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>About Section Description</label>
                  <textarea className="input-field" value={profile.about_desc} onChange={e => setProfile({...profile, about_desc: e.target.value})} required style={{ minHeight: '140px' }}></textarea>
                </div>
                <button type="submit" className="btn-primary" style={{ width: 'max-content', marginTop: '1rem', padding: '1rem 2rem' }}>Save Profile Changes</button>
              </form>
            </div>
          )}

          {activeTab === 'projects' && (
            <div>
              <h3 style={{ marginBottom: '2rem', color: 'var(--accent-1)' }}>Add New Project</h3>
              <form onSubmit={addProject} className="form-grid-small">
                <input type="text" className="input-field" placeholder="Project Title" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} required />
                <input type="text" className="input-field" placeholder="Tech Stack (e.g. React, Node.js)" value={newProject.tech} onChange={e => setNewProject({...newProject, tech: e.target.value})} required />
                <textarea className="input-field" placeholder="Project Description" value={newProject.desc} onChange={e => setNewProject({...newProject, desc: e.target.value})} required style={{ minHeight: '120px' }}></textarea>
                <button type="submit" className="btn-primary" style={{ width: 'max-content', padding: '0.8rem 1.5rem' }}>+ Add Project</button>
              </form>

              <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '3rem 0' }} />

              <h3 style={{ marginBottom: '2rem', color: 'var(--text-primary)' }}>Current Projects</h3>
              <div className="item-list">
                {projects.map(p => (
                  <div key={p.id} className="item-card">
                    <div>
                      <h4 style={{ fontSize: '1.2rem', marginBottom: '0.35rem', fontWeight: 600 }}>{p.title}</h4>
                      <p style={{ color: 'var(--accent-1)', fontSize: '0.9rem', fontWeight: 500 }}>{p.tech}</p>
                    </div>
                    <button onClick={() => deleteProject(p.id)} className="delete-btn">Delete</button>
                  </div>
                ))}
                {projects.length === 0 && <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No projects found. Add one above.</p>}
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div>
              <h3 style={{ marginBottom: '2rem', color: 'var(--accent-1)' }}>Add Experience / Education</h3>
              <form onSubmit={addExp} className="form-grid-small">
                <input type="text" className="input-field" placeholder="Role / Degree" value={newExp.role} onChange={e => setNewExp({...newExp, role: e.target.value})} required />
                <input type="text" className="input-field" placeholder="Company / Institution" value={newExp.company} onChange={e => setNewExp({...newExp, company: e.target.value})} required />
                <input type="text" className="input-field" placeholder="Year (e.g. 2023 - Present)" value={newExp.year} onChange={e => setNewExp({...newExp, year: e.target.value})} required />
                <button type="submit" className="btn-primary" style={{ width: 'max-content', padding: '0.8rem 1.5rem' }}>+ Add Experience</button>
              </form>

              <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '3rem 0' }} />

              <h3 style={{ marginBottom: '2rem', color: 'var(--text-primary)' }}>Current Timeline</h3>
              <div className="item-list">
                {experiences.map(e => (
                  <div key={e.id} className="item-card">
                    <div>
                      <h4 style={{ fontSize: '1.2rem', marginBottom: '0.35rem', fontWeight: 600 }}>{e.role}</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}><span style={{ color: 'var(--accent-1)' }}>{e.company}</span> • {e.year}</p>
                    </div>
                    <button onClick={() => deleteExp(e.id)} className="delete-btn">Delete</button>
                  </div>
                ))}
                {experiences.length === 0 && <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No experience found. Add one above.</p>}
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div>
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-1)' }}>Update Credentials</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: 1.6 }}>Change your login username and password here to keep your admin access secure.</p>
              
              <form onSubmit={handleUpdateCreds} className="form-grid" style={{ maxWidth: '400px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>New Username</label>
                  <input type="text" className="input-field" value={newCreds.username} onChange={e => setNewCreds({...newCreds, username: e.target.value})} required />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>New Password</label>
                  <input type="password" className="input-field" value={newCreds.password} onChange={e => setNewCreds({...newCreds, password: e.target.value})} required />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1.5rem', padding: '1rem' }}>Update Credentials</button>
              </form>
            </div>
          )}

        </div>
      </main>
    </div>
    </>

  );
}
