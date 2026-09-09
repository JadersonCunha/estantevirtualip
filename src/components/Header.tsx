import React, { useState } from 'react';
import { TurmaId, UserSession } from '../types';
import { TURMAS_LIST } from '../data/booksData';

interface HeaderProps {
  activeTab: 'portal' | 'estante' | 'desafio';
  setActiveTab: (tab: 'portal' | 'estante' | 'desafio') => void;
  selectedTurma: TurmaId;
  onSelectTurma: (turma: TurmaId) => void;
  user: UserSession;
  onOpenUserProfile: () => void;
  visitCount: number;
  onIncrementVisits: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab, setActiveTab, selectedTurma, onSelectTurma,
  user, onOpenUserProfile, visitCount, onIncrementVisits, onOpenSearch,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [turmaOpen, setTurmaOpen] = useState(false);
  const currentTurma = TURMAS_LIST.find(t => t.id === selectedTurma);

  const navItems = [
    { id: 'portal',  label: 'Início',   icon: 'home' },
    { id: 'estante', label: 'Estante',  icon: 'shelves' },
    { id: 'desafio', label: 'Desafios', icon: 'military_tech' },
  ] as const;

  return (
    <header className="site-header">
      <div className="container">
        <div className="header-inner">

          {/* Logo */}
          <button onClick={() => { setActiveTab('portal'); onSelectTurma('todos'); }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer' }}>
            <img
              src="https://lh3.googleusercontent.com/aida/AEtjO1VPc2KvPlkD--149MEuR3a08bKhpOhgUN0duJslM1Ke8d9OQnZPCVCT0UwVrJ-5Hg7Mp6ed8N4BPpOGOpX5408dmCcOQ0t6ODkiSPbPeUArsWn7JX7CokFdLI-6W3SRvU0Zy5eczTDSohqqVdmy8YBPavNgPrVckTp7T299SFmp4XZZvby0EwRo-BnGnpbUs5x9A0xqCDxYheBEmU1usrV6tyDuGNPgPSt7H8jfG_zv2cT60KzAI75U6PI"
              alt="IP" style={{ height: 38, width: 'auto', objectFit: 'contain' }} />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
              <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 16, color: 'var(--ink)' }}>
                Biblioteca Virtual
              </span>
              <span style={{ fontWeight: 700, fontSize: 11, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Instituto Providência
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="desktop-nav">
            {navItems.map(({ id, label, icon }) => (
              <button key={id} className={`nav-item${activeTab === id ? ' active' : ''}`}
                onClick={() => setActiveTab(id)}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{icon}</span>
                {label}
              </button>
            ))}

            {/* Turmas dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                className={`nav-item${selectedTurma !== 'todos' ? ' active' : ''}`}
                style={selectedTurma !== 'todos' ? { background: 'var(--primary-light)', color: 'var(--primary)' } : {}}
                onClick={() => setTurmaOpen(!turmaOpen)}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>groups</span>
                {selectedTurma === 'todos' ? 'Turmas' : currentTurma?.name}
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                  {turmaOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {turmaOpen && (
                <>
                  <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setTurmaOpen(false)} />
                  <div className="dropdown">
                    <button className={`dropdown-item${selectedTurma === 'todos' ? ' active' : ''}`}
                      onClick={() => { onSelectTurma('todos'); setActiveTab('estante'); setTurmaOpen(false); }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--primary)' }}>apps</span>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 13, fontFamily: 'Nunito, sans-serif' }}>Todas as Turmas</div>
                        <div style={{ fontSize: 11, color: 'var(--ink-muted)' }}>Ver acervo completo</div>
                      </div>
                    </button>
                    <hr className="divider" style={{ margin: '6px 0' }} />
                    {TURMAS_LIST.map(t => (
                      <button key={t.id} className={`dropdown-item${selectedTurma === t.id ? ' active' : ''}`}
                        onClick={() => { onSelectTurma(t.id); setActiveTab('estante'); setTurmaOpen(false); }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18, color: t.color }}>{t.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 13 }}>{t.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--ink-muted)' }}>{t.ageRange}</div>
                        </div>
                        <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 999, background: 'var(--bg)', color: 'var(--ink-muted)', fontWeight: 700 }}>
                          {t.code}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="nav-item" onClick={onOpenSearch} style={{ padding: '7px 10px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20 }}>search</span>
            </button>

            <button onClick={onIncrementVisits} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 12px', borderRadius: 999,
              background: 'var(--primary-light)', color: 'var(--primary)',
              border: '1.5px solid #a5d6a7', fontSize: 12, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit'
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4caf50', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              {visitCount.toLocaleString('pt-BR')}
            </button>

            <button onClick={onOpenUserProfile} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '5px 10px 5px 5px', borderRadius: 12,
              border: '1.5px solid var(--border)', background: 'var(--surface)',
              cursor: 'pointer', transition: 'border-color 0.15s', fontFamily: 'inherit'
            }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'}>
              {user.avatarUrl
                ? <img src={user.avatarUrl} alt={user.name} style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }} />
                : <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>}
              <div className="desktop-only">
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name}
                </div>
                <div style={{ fontSize: 10, color: 'var(--primary)', fontWeight: 600 }}>
                  {user.role === 'professor' ? 'Educador(a)' : `Turma ${user.turma}`}
                </div>
              </div>
            </button>

            <button className="mobile-only nav-item" style={{ padding: '7px 10px' }}
              onClick={() => setMobileOpen(!mobileOpen)}>
              <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
                {mobileOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="animate-in" style={{ padding: '12px 0 16px', borderTop: '1.5px solid var(--border-soft)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {navItems.map(({ id, label, icon }) => (
                <button key={id} className={`nav-item${activeTab === id ? ' active' : ''}`}
                  style={{ justifyContent: 'flex-start' }}
                  onClick={() => { setActiveTab(id); setMobileOpen(false); }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{icon}</span>
                  {label}
                </button>
              ))}
              <div style={{ paddingTop: 10, marginTop: 6, borderTop: '1px solid var(--border-soft)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {TURMAS_LIST.map(t => (
                  <button key={t.id}
                    className={`turma-pill${selectedTurma === t.id ? ' active' : ''}`}
                    style={selectedTurma === t.id ? { background: t.color, borderColor: t.color } : {}}
                    onClick={() => { onSelectTurma(t.id); setActiveTab('estante'); setMobileOpen(false); }}>
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (min-width: 768px) { .mobile-only { display: none !important; } }
        @media (max-width: 767px) { .desktop-nav, .desktop-only { display: none !important; } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </header>
  );
};
