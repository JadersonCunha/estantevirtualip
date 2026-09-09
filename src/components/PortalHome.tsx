import React, { useState } from 'react';
import { Book, TurmaId, UserSession } from '../types';
import { TURMAS_LIST, INITIAL_BOOKS } from '../data/booksData';

interface PortalHomeProps {
  books: Book[];
  user: UserSession;
  onUpdateUser: (user: UserSession) => void;
  onSelectTurma: (turma: TurmaId) => void;
  onOpenBook: (book: Book, startPage?: number) => void;
  onViewDetails: (book: Book) => void;
  onNavigateToEstante: () => void;
  onToggleFavorite: (bookId: string) => void;
  onOpenHelpModal: () => void;
}

export const PortalHome: React.FC<PortalHomeProps> = ({
  books, user, onUpdateUser, onSelectTurma, onOpenBook,
  onViewDetails, onNavigateToEstante, onToggleFavorite, onOpenHelpModal,
}) => {
  const [roleTab, setRoleTab] = useState<'aluno' | 'professor'>('aluno');
  const [selectedTurmaInput, setSelectedTurmaInput] = useState<TurmaId>(
    user.turma === 'todos' ? 'gratidao' : user.turma
  );
  const [userNameInput, setUserNameInput] = useState(user.name || '');
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = userNameInput.trim() || (roleTab === 'aluno' ? 'Leitor IP' : 'Profª. Rosana');
    onUpdateUser({
      ...user, name, turma: selectedTurmaInput, role: roleTab,
      avatarUrl: roleTab === 'professor'
        ? 'https://lh3.googleusercontent.com/aida/AEtjO1WqhJYaHZj9f9Y324EKtr84Gxhkk6NgEHPZx4Jy5PHF1aFSFNmIdQCMFSsR3-bHuYvCiNGpbZgTb4n6pjLsLLKxrN_V_LxwLQ9EucpP15cqTFjzXBZWWxBmvy-rRonW36gqAJcociLUVwtqVE30o9nu2jGIp1deTUZc9SHuCQy7ys2BpsEgce-gHFftj8WhyIl1OIMR03Bjnzdn22rF-39Y5gUYV0h5Ulffb0o0361et7s1-jY3WGjr4g'
        : user.avatarUrl,
    });
    onSelectTurma(selectedTurmaInput);
    setLoginSuccess(true);
    setTimeout(() => { setLoginSuccess(false); onNavigateToEstante(); }, 700);
  };

  const featured = books.filter(b => b.featured).slice(0, 8);
  const newBooks = books.filter(b => b.isNew).slice(0, 4);

  return (
    <div style={{ background: 'var(--bg)', paddingBottom: 64 }}>

      {/* ── HERO ─────────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 40%, #388e3c 70%, #f57c00 130%)',
        padding: '0',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* decorative circles */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

        <div className="container" style={{ padding: '56px 24px 64px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 40, alignItems: 'center' }}>

            {/* Left: headline */}
            <div style={{ color: '#fff', maxWidth: 560 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.15)', borderRadius: 999,
                padding: '6px 16px', marginBottom: 24, backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#a5d6a7' }}>auto_stories</span>
                <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', color: '#c8e6c9' }}>INSTITUTO PROVIDÊNCIA</span>
              </div>

              <h1 style={{
                fontFamily: 'Nunito, sans-serif', fontWeight: 900,
                fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 1.1,
                color: '#fff', marginBottom: 16,
              }}>
                Biblioteca<br />
                <span style={{ color: '#ffcc02' }}>Virtual IP</span>
              </h1>

              <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginBottom: 32, maxWidth: 460 }}>
                Acervo digital para todas as turmas. Leia, explore e compartilhe suas ideias com educadores e colegas.
              </p>

              {/* Stats row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 40 }}>
                {[
                  { icon: 'menu_book', label: '+1.400 livros' },
                  { icon: 'school', label: '4 turmas' },
                  { icon: 'devices', label: 'Qualquer dispositivo' },
                  { icon: 'verified', label: 'Gratuito' },
                ].map(s => (
                  <div key={s.label} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '8px 16px', borderRadius: 999,
                    background: 'rgba(255,255,255,0.12)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    fontSize: 13, fontWeight: 600, color: '#fff',
                    backdropFilter: 'blur(4px)',
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#a5d6a7' }}>{s.icon}</span>
                    {s.label}
                  </div>
                ))}
              </div>

              {/* Turma quick access */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, maxWidth: 480 }}>
                {TURMAS_LIST.map(t => (
                  <button key={t.id}
                    onClick={() => { onSelectTurma(t.id); onNavigateToEstante(); }}
                    style={{
                      padding: '14px 16px', borderRadius: 16,
                      background: 'rgba(255,255,255,0.12)',
                      border: '1.5px solid rgba(255,255,255,0.2)',
                      color: '#fff', cursor: 'pointer', textAlign: 'left',
                      display: 'flex', alignItems: 'center', gap: 12,
                      transition: 'all 0.15s', backdropFilter: 'blur(4px)',
                      fontFamily: 'inherit',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.22)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)'; }}
                  >
                    <div style={{
                      width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                      background: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#fff' }}>{t.icon}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, fontFamily: 'Nunito, sans-serif' }}>{t.name}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>{t.ageRange}</div>
                    </div>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, marginLeft: 'auto', opacity: 0.6 }}>chevron_right</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LOGIN CARD (flutuando abaixo do hero) ─────────── */}
      <section style={{ background: 'var(--bg)', padding: '0 0 0' }}>
        <div className="container">
          <div style={{
            marginTop: -32,
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 20,
            maxWidth: 900,
            margin: '-32px auto 0',
          }}>
            <div style={{
              background: '#fff',
              borderRadius: 24,
              boxShadow: '0 8px 40px rgba(0,0,0,0.14)',
              padding: '32px 32px 28px',
              border: '1.5px solid var(--border-soft)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 24, color: 'var(--primary)' }}>login</span>
                </div>
                <div>
                  <h2 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 20, fontWeight: 900, color: 'var(--ink)', margin: 0 }}>Entrar na Biblioteca</h2>
                  <p style={{ fontSize: 13, color: 'var(--ink-muted)', margin: 0 }}>Selecione sua turma e acesse o acervo</p>
                </div>
              </div>

              {/* Role tabs */}
              <div style={{ display: 'flex', background: 'var(--bg)', borderRadius: 12, padding: 4, marginBottom: 24, gap: 4 }}>
                {(['aluno', 'professor'] as const).map(r => (
                  <button key={r} type="button"
                    onClick={() => { setRoleTab(r); if (r === 'professor') setUserNameInput('Profª. Rosana'); }}
                    style={{
                      flex: 1, padding: '10px 0', borderRadius: 9,
                      fontSize: 13, fontWeight: 800, border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                      fontFamily: 'Nunito, sans-serif', transition: 'all 0.15s',
                      background: roleTab === r ? '#fff' : 'transparent',
                      color: roleTab === r ? 'var(--primary)' : 'var(--ink-muted)',
                      boxShadow: roleTab === r ? 'var(--shadow-sm)' : 'none',
                    }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 17 }}>
                      {r === 'aluno' ? 'school' : 'psychology'}
                    </span>
                    {r === 'aluno' ? 'Sou Aluno' : 'Sou Professor'}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 20 }}>
                  {TURMAS_LIST.map(t => {
                    const sel = selectedTurmaInput === t.id;
                    return (
                      <button key={t.id} type="button" onClick={() => setSelectedTurmaInput(t.id)}
                        style={{
                          padding: '12px 14px', borderRadius: 14, textAlign: 'left',
                          display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                          border: `2px solid ${sel ? t.color : 'var(--border-soft)'}`,
                          background: sel ? `${t.color}12` : 'var(--surface)',
                          transition: 'all 0.15s', fontFamily: 'inherit',
                        }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                          background: sel ? t.color : `${t.color}20`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 18, color: sel ? '#fff' : t.color }}>{t.icon}</span>
                        </div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--ink)', fontFamily: 'Nunito, sans-serif' }}>{t.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--ink-muted)' }}>{t.ageRange}</div>
                        </div>
                        {sel && <span className="material-symbols-outlined" style={{ fontSize: 18, color: t.color, marginLeft: 'auto' }}>check_circle</span>}
                      </button>
                    );
                  })}
                </div>

                <div style={{ marginBottom: 20 }}>
                  <div style={{ position: 'relative' }}>
                    <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: 'var(--ink-muted)', pointerEvents: 'none' }}>
                      person
                    </span>
                    <input type="text" value={userNameInput}
                      onChange={e => setUserNameInput(e.target.value)}
                      placeholder={roleTab === 'aluno' ? 'Seu nome...' : 'Ex: Profª. Rosana...'}
                      className="input" style={{ paddingLeft: 38 }} />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <button type="button" onClick={onOpenHelpModal}
                    style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    Precisa de ajuda?
                  </button>
                </div>

                <button type="submit" className="btn btn-primary btn-full btn-lg">
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>auto_stories</span>
                  Acessar a Biblioteca
                </button>

                {loginSuccess && (
                  <div className="animate-in" style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, textAlign: 'center', background: 'var(--primary-light)', color: 'var(--primary)', fontSize: 13, fontWeight: 700 }}>
                    ✓ Acesso confirmado! Redirecionando...
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ── DESTAQUES ─────────────────────────────────────── */}
      <section style={{ padding: '56px 0 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <div className="section-label">Acervo Curado</div>
              <h2 className="section-title">Livros em Destaque</h2>
            </div>
            <button onClick={onNavigateToEstante}
              style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 700, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}>
              Ver todos
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>
            </button>
          </div>

          <div className="books-grid">
            {featured.map(book => {
              const isFav = user.favoriteBookIds?.includes(book.id);
              const turma = TURMAS_LIST.find(t => t.id === book.turma);
              return (
                <div key={book.id} className="card card-hover book-card" style={{ overflow: 'hidden' }}>
                  <div style={{ position: 'relative', aspectRatio: '3/4', cursor: 'pointer' }}
                    onClick={() => onOpenBook(book, 1)}>
                    <img src={book.coverUrl} alt={book.title} className="book-cover" />
                    <div className="book-cover-overlay">
                      <span style={{ background: 'var(--primary)', color: '#fff', padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 800, fontFamily: 'Nunito, sans-serif' }}>
                        Ler agora
                      </span>
                    </div>
                    {book.isNew && (
                      <span className="badge badge-orange" style={{ position: 'absolute', top: 8, left: 8, fontSize: 9 }}>Novo</span>
                    )}
                    {turma && (
                      <div style={{
                        position: 'absolute', bottom: 8, left: 8,
                        background: turma.color, borderRadius: 6,
                        padding: '2px 8px', fontSize: 9, fontWeight: 800,
                        color: '#fff', fontFamily: 'Nunito, sans-serif',
                      }}>
                        {turma.name}
                      </div>
                    )}
                    <button type="button"
                      onClick={e => { e.stopPropagation(); onToggleFavorite(book.id); }}
                      style={{
                        position: 'absolute', top: 8, right: 8,
                        width: 30, height: 30, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: isFav ? '#e53935' : 'rgba(255,255,255,0.92)',
                        color: isFav ? '#fff' : '#9e9e9e',
                        border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                        boxShadow: 'var(--shadow-sm)',
                      }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
                        {isFav ? 'favorite' : 'favorite_border'}
                      </span>
                    </button>
                  </div>
                  <div style={{ padding: '12px 14px' }}>
                    <h4 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 13, fontWeight: 800, color: 'var(--ink)', cursor: 'pointer', lineHeight: 1.3, marginBottom: 3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                      onClick={() => onOpenBook(book, 1)}>
                      {book.title}
                    </h4>
                    <p style={{ fontSize: 11, color: 'var(--ink-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 10 }}>
                      {book.author}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--border-soft)' }}>
                      <span style={{ fontSize: 10, color: 'var(--ink-muted)', fontWeight: 600 }}>{book.pagesCount} págs</span>
                      <button onClick={() => onOpenBook(book, 1)}
                        style={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 12, fontWeight: 800, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
                        Ler
                        <span className="material-symbols-outlined" style={{ fontSize: 15 }}>chevron_right</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── DESAFIO DA SEMANA ─────────────────────────────── */}
      <section style={{ padding: '56px 0 0' }}>
        <div className="container">
          <div style={{
            borderRadius: 24, overflow: 'hidden',
            display: 'grid', gridTemplateColumns: '1fr',
            background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 60%, #1565c0 100%)',
          }}>
            <div style={{ padding: '40px 36px', color: '#fff', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.06, pointerEvents: 'none' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 200 }}>emoji_events</span>
              </div>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.15)', color: '#c8e6c9', marginBottom: 16, fontSize: 11 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>flag</span>
                Desafio da Semana
              </span>
              <h2 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 28, fontWeight: 900, marginBottom: 10 }}>
                "Ler é viajar sem sair do lugar"
              </h2>
              <p style={{ fontSize: 15, opacity: 0.85, lineHeight: 1.7, marginBottom: 24, maxWidth: 520 }}>
                Meta coletiva: 100 páginas entre todas as turmas esta semana. Cada leitura conta!
              </p>
              <div style={{ maxWidth: 400, marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, color: '#a5d6a7', marginBottom: 10 }}>
                  <span>Progresso geral</span><span>80 / 100 págs</span>
                </div>
                <div style={{ height: 12, borderRadius: 999, background: 'rgba(255,255,255,0.15)', overflow: 'hidden' }}>
                  <div style={{ width: '80%', height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, #81c784, #ffcc02)' }} />
                </div>
              </div>
              <button className="btn" onClick={onNavigateToEstante}
                style={{ background: '#fff', color: 'var(--primary)', fontWeight: 800, fontSize: 14, padding: '12px 28px', borderRadius: 12 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>auto_stories</span>
                Participar do Desafio
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ─────────────────────────────────── */}
      <section style={{ padding: '56px 0 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div className="section-label" style={{ justifyContent: 'center', display: 'flex' }}>Como funciona</div>
            <h2 className="section-title">3 passos para começar a ler</h2>
          </div>
          <div className="how-grid">
            {[
              { n: '1', icon: 'school', color: '#2e7d32', bg: '#e8f5e9', title: 'Escolha sua turma', desc: 'Selecione a turma e entre com seu nome para acessar o acervo personalizado.' },
              { n: '2', icon: 'auto_stories', color: '#1565c0', bg: '#e3f2fd', title: 'Leia ou baixe', desc: 'Abra o leitor interativo com modo noturno e zoom, ou baixe para ler offline.' },
              { n: '3', icon: 'forum', color: '#f57c00', bg: '#fff3e0', title: 'Compartilhe ideias', desc: 'Deixe comentários, reaja aos livros e participe do desafio literário coletivo.' },
            ].map(s => (
              <div key={s.n} className="card" style={{ padding: '28px 24px', textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: 18, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: s.bg }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 32, color: s.color }}>{s.icon}</span>
                </div>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: s.color, color: '#fff', fontSize: 13, fontWeight: 900, fontFamily: 'Nunito, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>{s.n}</div>
                <h4 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 17, fontWeight: 900, color: 'var(--ink)', marginBottom: 10 }}>{s.title}</h4>
                <p style={{ fontSize: 13, color: 'var(--ink-muted)', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
