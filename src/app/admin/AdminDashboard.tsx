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
          flex-direction: row;
        }
        .admin-sidebar {
          width: 250px;
          background-color: var(--bg-secondary);
          border-right: 1px solid var(--glass-border);
          padding: 2rem;
          display: flex;
          flex-direction: column;
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
          }
          .admin-sidebar button {
            white-space: nowrap;
          }
          .admin-logout-container {
            flex-direction: row !important;
            justify-content: space-between;
            align-items: center;
            padding-top: 1.5rem !important;
          }
        }
      `}</style>
      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
        <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 800 }}><span className="text-gradient">Admin Panel</span></h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {['dashboard', 'profile', 'projects', 'experience', 'account'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ textAlign: 'left', padding: '0.75rem 1rem', borderRadius: '8px', background: activeTab === tab ? 'var(--glass-bg)' : 'transparent', color: activeTab === tab ? 'var(--accent-1)' : 'var(--text-secondary)', border: 'none', cursor: 'pointer', fontWeight: 600, textTransform: 'capitalize' }}
            >
              {tab}
            </button>
          ))}
        </nav>
        
        <div style={{ marginTop: 'auto', paddingTop: '4rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button onClick={handleLogout} style={{ textAlign: 'left', padding: '0.75rem 1rem', color: 'var(--accent-2)', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
            🚪 Logout
          </button>
          <Link href="/" style={{ display: 'block', padding: '0.75rem 1rem', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
            &larr; View Portfolio
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '3rem', overflowY: 'auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, textTransform: 'capitalize' }}>{activeTab} Management</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Welcome, <strong>Unedo</strong></span>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-1), var(--accent-2))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👨‍💻</div>
          </div>
        </header>

        {/* Content Area */}
        <div className="glass-panel" style={{ padding: '2.5rem', minHeight: '600px' }}>
          {activeTab === 'dashboard' && (
            <div>
              <h3 style={{ marginBottom: '2rem', color: 'var(--accent-1)' }}>System Overview</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <div style={{ padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Total Profile Views</p>
                  <h4 style={{ fontSize: '2.5rem' }}>1,245</h4>
                </div>
                <div style={{ padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Projects Active</p>
                  <h4 style={{ fontSize: '2.5rem' }}>{projects.length}</h4>
                </div>
                <div style={{ padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Experiences Active</p>
                  <h4 style={{ fontSize: '2.5rem' }}>{experiences.length}</h4>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'profile' && profile && (
            <div>
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-1)' }}>Edit Profile & About Me</h3>
              <form onSubmit={saveProfile} style={{ display: 'grid', gap: '1.5rem', maxWidth: '800px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Full Name</label>
                  <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'white', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Hero Subtitle (e.g. Informatics Student | Web Developer)</label>
                  <input type="text" value={profile.hero_subtitle} onChange={e => setProfile({...profile, hero_subtitle: e.target.value})} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'white', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Hero Description</label>
                  <textarea value={profile.hero_desc} onChange={e => setProfile({...profile, hero_desc: e.target.value})} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'white', outline: 'none', minHeight: '100px' }}></textarea>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '1rem 0' }} />
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>About Section Title</label>
                  <input type="text" value={profile.about_title} onChange={e => setProfile({...profile, about_title: e.target.value})} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'white', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>About Section Description</label>
                  <textarea value={profile.about_desc} onChange={e => setProfile({...profile, about_desc: e.target.value})} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'white', outline: 'none', minHeight: '120px' }}></textarea>
                </div>
                <button type="submit" className="btn-primary" style={{ width: 'max-content', marginTop: '1rem' }}>Save Profile</button>
              </form>
            </div>
          )}

          {activeTab === 'projects' && (
            <div>
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-1)' }}>Add New Project</h3>
              <form onSubmit={addProject} style={{ display: 'grid', gap: '1rem', marginBottom: '3rem', maxWidth: '600px' }}>
                <input type="text" placeholder="Project Title" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'white', outline: 'none' }} />
                <input type="text" placeholder="Tech Stack (e.g. React, Node.js)" value={newProject.tech} onChange={e => setNewProject({...newProject, tech: e.target.value})} required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'white', outline: 'none' }} />
                <textarea placeholder="Project Description" value={newProject.desc} onChange={e => setNewProject({...newProject, desc: e.target.value})} required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'white', outline: 'none', minHeight: '100px' }}></textarea>
                <button type="submit" className="btn-primary" style={{ width: 'max-content' }}>Save Project</button>
              </form>

              <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-1)' }}>Current Projects</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {projects.map(p => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{p.title}</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{p.tech}</p>
                    </div>
                    <button onClick={() => deleteProject(p.id)} style={{ padding: '0.5rem 1rem', background: 'rgba(236, 72, 153, 0.2)', color: 'var(--accent-2)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                  </div>
                ))}
                {projects.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No projects found.</p>}
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div>
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-1)' }}>Add Experience / Education</h3>
              <form onSubmit={addExp} style={{ display: 'grid', gap: '1rem', marginBottom: '3rem', maxWidth: '600px' }}>
                <input type="text" placeholder="Role / Degree" value={newExp.role} onChange={e => setNewExp({...newExp, role: e.target.value})} required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'white', outline: 'none' }} />
                <input type="text" placeholder="Company / Institution" value={newExp.company} onChange={e => setNewExp({...newExp, company: e.target.value})} required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'white', outline: 'none' }} />
                <input type="text" placeholder="Year (e.g. 2023 - Present)" value={newExp.year} onChange={e => setNewExp({...newExp, year: e.target.value})} required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'white', outline: 'none' }} />
                <button type="submit" className="btn-primary" style={{ width: 'max-content' }}>Save Experience</button>
              </form>

              <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-1)' }}>Current Timeline</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {experiences.map(e => (
                  <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{e.role}</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{e.company} • {e.year}</p>
                    </div>
                    <button onClick={() => deleteExp(e.id)} style={{ padding: '0.5rem 1rem', background: 'rgba(236, 72, 153, 0.2)', color: 'var(--accent-2)', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                  </div>
                ))}
                {experiences.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No experience found.</p>}
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div>
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-1)' }}>Update Credentials</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Change your login username and password here.</p>
              
              <form onSubmit={handleUpdateCreds} style={{ display: 'grid', gap: '1.5rem', maxWidth: '500px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>New Username</label>
                  <input type="text" value={newCreds.username} onChange={e => setNewCreds({...newCreds, username: e.target.value})} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'white', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>New Password</label>
                  <input type="password" value={newCreds.password} onChange={e => setNewCreds({...newCreds, password: e.target.value})} required style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'white', outline: 'none' }} />
                </div>
                <button type="submit" className="btn-primary" style={{ width: 'max-content', marginTop: '1rem' }}>Update Credentials</button>
              </form>
            </div>
          )}

        </div>
      </main>
    </div>
    </>
  );
}
