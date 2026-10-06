"use client";

import Link from "next/link";
import { useState } from "react";
import { loginAction } from "./actions";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");

    const res = await loginAction(username, password);
    
    if (res.success) {
      router.refresh(); // Memuat ulang halaman agar server membaca cookie baru
    } else {
      setLoginError(res.error || "Gagal login.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .login-container {
          position: relative;
          display: flex;
          min-height: 100vh;
          align-items: center;
          justify-content: center;
          background-color: var(--bg-primary);
          padding: 1rem;
          overflow: hidden;
        }
        .bg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          z-index: 0;
          animation: float 10s infinite alternate;
        }
        .blob-1 {
          width: 400px;
          height: 400px;
          background: rgba(99, 102, 241, 0.2);
          top: -100px;
          left: -100px;
        }
        .blob-2 {
          width: 300px;
          height: 300px;
          background: rgba(236, 72, 153, 0.2);
          bottom: -50px;
          right: -50px;
          animation-delay: -5s;
        }
        @keyframes float {
          0% { transform: translate(0, 0) rotate(0deg); }
          100% { transform: translate(50px, 50px) rotate(10deg); }
        }
        .login-panel {
          position: relative;
          z-index: 1;
          padding: 3.5rem 3rem;
          width: 100%;
          max-width: 420px;
          text-align: center;
          background: rgba(20, 20, 20, 0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          transform: translateY(20px);
          opacity: 0;
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideUp {
          to { transform: translateY(0); opacity: 1; }
        }
        .input-field {
          width: 100%;
          padding: 1rem 1.25rem;
          border-radius: 12px;
          border: 1px solid var(--glass-border);
          background: rgba(255,255,255,0.03);
          color: white;
          outline: none;
          transition: all 0.3s ease;
          font-family: inherit;
        }
        .input-field:focus {
          border-color: var(--accent-1);
          background: rgba(255,255,255,0.08);
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }
        .lock-icon {
          width: 80px; 
          height: 80px; 
          border-radius: 50%; 
          background: linear-gradient(135deg, var(--accent-1), var(--accent-2)); 
          margin: 0 auto 2rem; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-size: 2.5rem;
          box-shadow: 0 10px 25px rgba(236, 72, 153, 0.3);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.4); }
          70% { box-shadow: 0 0 0 20px rgba(236, 72, 153, 0); }
          100% { box-shadow: 0 0 0 0 rgba(236, 72, 153, 0); }
        }
        @media (max-width: 480px) {
          .login-panel {
            padding: 2.5rem 1.5rem;
          }
        }
      `}</style>
      <div className="login-container">
        <div className="bg-blob blob-1"></div>
        <div className="bg-blob blob-2"></div>
        
        <div className="login-panel">
          <div className="lock-icon">🔒</div>
          <h2 style={{ marginBottom: '2.5rem', fontSize: '2.2rem', fontWeight: 800 }}>Admin <span className="text-gradient">Access</span></h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <input 
              type="text" 
              placeholder="Username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              required
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
            {loginError && <p style={{ color: 'var(--accent-2)', fontSize: '0.9rem', margin: '-0.5rem 0' }}>{loginError}</p>}

            <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', padding: '1rem', fontSize: '1.1rem', opacity: isLoading ? 0.7 : 1 }} disabled={isLoading}>
              {isLoading ? "Authenticating..." : "Login Securely"}
            </button>
          </form>
          <Link href="/" style={{ display: 'inline-block', marginTop: '2.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'white'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}>
            &larr; Back to Portfolio
          </Link>
        </div>
      </div>
    </>
  );
}
