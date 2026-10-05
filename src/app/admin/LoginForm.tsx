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
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)' }}>
      <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-1), var(--accent-2))', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
          🔒
        </div>
        <h2 style={{ marginBottom: '2rem', fontSize: '2rem' }}>Admin <span className="text-gradient">Access</span></h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <input 
            type="text" 
            placeholder="Username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'white', outline: 'none' }}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'white', outline: 'none' }}
            required
          />
          {loginError && <p style={{ color: 'var(--accent-2)', fontSize: '0.9rem' }}>{loginError}</p>}
          
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'left' }}>Hint: username <strong>unedo</strong>, password <strong>unedo123</strong></p>

          <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', opacity: isLoading ? 0.7 : 1 }} disabled={isLoading}>
            {isLoading ? "Authenticating..." : "Login securely"}
          </button>
        </form>
        <Link href="/" style={{ display: 'block', marginTop: '2rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>&larr; Back to Portfolio</Link>
      </div>
    </div>
  );
}
