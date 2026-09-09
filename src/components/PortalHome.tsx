import React, { useState } from 'react';
import { Book, TurmaId, UserSession } from '../types';
import { TURMAS_LIST } from '../data/booksData';

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

  const highlights = books.filter(b => b.featured).slice(0, 6);
  const recommended = books.find(b => b.id === 'segredo-arvores') || books[0];

  const turmaColors: Record<string, string> = {
    gratidao: 'var(--turma-gratidao)',
    fe:       'var(--turma-fe)',
    acolhida: 'var(--turma-acolhida)',
    trabalho: 'var(--turma-trabalho)',
  };

  return (
    <div style={{ paddingBottom: 64 }}>

      {/* ── Hero ──────────────────────────────────────── */}
      <section style={{
        background: 'linear-gradient(160deg, #e8f5e9 0%, #f7faf7 50%, #fff8f0 100%)',
        borderBottom: '2px solid var(--border-soft)',
        padding: '48px 0 56px',
      }}>
        <div className="container">
          <div className="hero-grid">

            {/* Left: headline + login */}
            <div>
              <span className="badge badge-green" style={{ marginBottom: 14 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>local_library</span>
                Instituto Providência
              </span>

              <h1 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 42, lineHeight: 1.1, color: 'var(--ink)', marginBottom: 10 }}>
                Biblioteca<br />
                <span style={{ color: 'var(--primary)' }}>Virtual IP</span>
              </h1>
              <p style={{ fontSize: 15, color: 'var(--ink-soft)', lineHeight: 1.7, maxWidth: 440, marginBottom: 24 }}>
                Acervo digital para todas as turmas. Leia, explore e compartilhe suas ideias com educadores e colegas.
              </p>

              {/* Stats */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
                {[
                  { icon: 'menu_book', label: '+1.400 livros' },
                  { icon: 'school',    label: '4 turmas' },
                  { icon: 'devices',   label: 'Qualquer dispositivo' },
                  { icon: 'verified',  label: 'Gratuito' },
                ].map(s => (
                  <div key={s.label} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '6px 14px', borderRadius: 999,
                    background: 'var(--surface)', border: '1.5px solid var(--border-soft)',
                    fontSize: 12, fontWeight: 600, color: 'var(--ink-soft)',
                    boxShadow: 'var(--shadow-xs)'
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, color: 'var(--primary)' }}>{s.icon}</span>
                    {s.label}
                  </div>
                ))}
              </div>

              {/* Login card */}
              <div className="card" style={{ padding: 28, boxShadow: 'var(--shadow-md)' }}>

                {/* Role tabs */}
                <div style={{ display: 'flex', background: 'var(--bg)', borderRadius: 12, padding: 4, marginBottom: 22 }}>
                  {(['aluno', 'professor'] as const).map(r => (
                    <button key={r} type="button"
                      onClick={() => { setRoleTab(r); if (r === 'professor') setUserNameInput('Profª. Rosana'); }}
                      style={{
                        flex: 1, padding: '9px 0', borderRadius: 9,
                        fontSize: 13, fontWeight: 800, border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        fontFamily: 'Nunito, sans-serif', transition: 'all 0.15s',
                        background: roleTab === r ? 'var(--surface)' : 'transparent',
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
                  {/* Turma */}
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10, fontFamily: 'Nunito, sans-serif' }}>
                      Selecione sua turma
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {TURMAS_LIST.map(t => {
                        const sel = selectedTurmaInput === t.id;
                        return (
                          <button key={t.id} type="button" onClick={() => setSelectedTurmaInput(t.id)}
                            style={{
                              padding: '11px 12px', borderRadius: 12, textAlign: 'left',
                              display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                              border: `2px solid ${sel ? t.color : 'var(--border-soft)'}`,
                              background: sel ? `${t.color}12` : 'var(--surface)',
                              transition: 'all 0.15s', fontFamily: 'inherit'
                            }}>
                            <div style={{
                              width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                              background: sel ? t.color : 'var(--bg)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              transition: 'all 0.15s'
                            }}>
                              <span className="material-symbols-outlined" style={{ fontSize: 18, color: sel ? '#fff' : t.color }}>{t.icon}</span>
                            </div>
                            <div>
                              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)', fontFamily: 'Nunito, sans-serif' }}>{t.name}</div>
                              <div style={{ fontSize: 10, color: 'var(--ink-muted)' }}>{t.ageRange}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Name */}
                  <div style={{ marginBottom: 18 }}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8, fontFamily: 'Nunito, sans-serif' }}>
                      Seu nome
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span className="material-symbols-outlined" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: 'var(--ink-muted)', pointerEvents: 'none' }}>
                        person
                      </span>
                      <input type="text" value={userNameInput}
                        onChange={e => setUserNameInput(e.target.value)}
                        placeholder={roleTab === 'aluno' ? 'Ex: Mariana Souza...' : 'Ex: Profª. Rosana...'}
                        className="input" style={{ paddingLeft: 38 }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 18 }}>
                    <button type="button" onClick={onOpenHelpModal}
                      style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                      Precisa de ajuda?
                    </button>
                  </div>

                  <button type="submit" className="btn btn-primary btn-full btn-lg">
                    <span className="material-symbols-outlined" style={{ fontSize: 20 }}>login</span>
                    Entrar na Biblioteca
                  </button>

                  {loginSuccess && (
                    <div className="animate-in" style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, textAlign: 'center', background: 'var(--primary-light)', color: 'var(--primary)', fontSize: 13, fontWeight: 700 }}>
                      ✓ Acesso confirmado! Redirecionando...
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* Desafio da semana */}
              <div style={{
                borderRadius: 20, padding: 28, color: '#fff', position: 'relative', overflow: 'hidden',
                background: 'linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%)',
                boxShadow: '0 8px 32px rgba(46,125,50,0.25)'
              }}>
                <div style={{ position: 'absolute', top: -10, right: -10, opacity: 0.07, pointerEvents: 'none' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 120 }}>auto_stories</span>
                </div>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.18)', color: '#c8e6c9', marginBottom: 14, fontSize: 10 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 13 }}>flag</span>
                  Desafio da Semana
                </span>
                <h3 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 18, fontWeight: 900, marginBottom: 6 }}>
                  "Ler é viajar sem sair do lugar"
                </h3>
                <p style={{ fontSize: 13, opacity: 0.85, lineHeight: 1.6, marginBottom: 18 }}>
                  Meta coletiva: 100 páginas entre todas as turmas esta semana.
                </p>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: '#a5d6a7', marginBottom: 8 }}>
                    <span>Progresso geral</span><span>80 / 100 págs</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: '80%' }} />
                  </div>
                </div>
                <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img src="https://lh3.googleusercontent.com/aida/AEtjO1WqhJYaHZj9f9Y324EKtr84Gxhkk6NgEHPZx4Jy5PHF1aFSFNmIdQCMFSsR3-bHuYvCiNGpbZgTb4n6pjLsLLKxrN_V_LxwLQ9EucpP15cqTFjzXBZWWxBmvy-rRonW36gqAJcociLUVwtqVE30o9nu2jGIp1deTUZc9SHuCQy7ys2BpsEgce-gHFftj8WhyIl1OIMR03Bjnzdn22rF-39Y5gUYV0h5Ulffb0o0361et7s1-jY3WGjr4g"
                    alt="Profª. Rosana" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.3)', flexShrink: 0 }} />
                  <p style={{ fontSize: 12, fontStyle: 'italic', opacity: 0.9, lineHeight: 1.5 }}>
                    "Ler não é apenas decifrar palavras, é construir pontes de empatia."
                  </p>
                </div>
              </div>

              {/* Turmas rápidas */}
              <div className="card" style={{ padding: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--ink-muted)', marginBottom: 12, fontFamily: 'Nunito, sans-serif' }}>
                  Acesso rápido por turma
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {TURMAS_LIST.map(t => (
                    <button key={t.id} onClick={() => { onSelectTurma(t.id); onNavigateToEstante(); }}
                      style={{
                        padding: '10px 12px', borderRadius: 12, border: `1.5px solid ${t.color}22`,
                        background: `${t.color}0d`, cursor: 'pointer', textAlign: 'left',
                        display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.15s',
                        fontFamily: 'inherit'
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${t.color}20`; (e.currentTarget as HTMLElement).style.borderColor = t.color; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${t.color}0d`; (e.currentTarget as HTMLElement).style.borderColor = `${t.color}22`; }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20, color: t.color }}>{t.icon}</span>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)', fontFamily: 'Nunito, sans-serif' }}>{t.name}</div>
                        <div style={{ fontSize: 10, color: 'var(--ink-muted)' }}>{t.ageRange}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recomendado */}
              <div className="card card-hover" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
                <img src={recommended.coverUrl} alt={recommended.title}
                  style={{ width: 60, aspectRatio: '3/4', objectFit: 'cover', borderRadius: 10, flexShrink: 0, border: '1px solid var(--border-soft)', boxShadow: 'var(--shadow-sm)' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span className="badge badge-orange" style={{ marginBottom: 6 }}>⭐ Recomendado</span>
                  <h4 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 14, fontWeight: 900, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {recommended.title}
                  </h4>
                  <p style={{ fontSize: 12, color: 'var(--ink-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {recommended.author}
                  </p>
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <button className="btn btn-primary btn-sm" onClick={() => onOpenBook(recommended, 1)}>
                      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>auto_stories</span>
                      Ler agora
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => onViewDetails(recommended)}>
                      Detalhes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Destaques ─────────────────────────────────── */}
      <section style={{ padding: '56px 0 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <div className="section-label">Acervo Curado</div>
              <h2 className="section-title">Destaques da Semana</h2>
            </div>
            <button onClick={onNavigateToEstante}
              style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 700, color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}>
              Ver todos
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>
            </button>
          </div>

          <div className="books-grid">
            {highlights.map(book => {
              const isFav = user.favoriteBookIds?.includes(book.id);
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
                    <button type="button"
                      onClick={e => { e.stopPropagation(); onToggleFavorite(book.id); }}
                      style={{
                        position: 'absolute', top: 8, right: 8,
                        width: 30, height: 30, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: isFav ? '#e53935' : 'rgba(255,255,255,0.92)',
                        color: isFav ? '#fff' : '#9e9e9e',
                        border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                        boxShadow: 'var(--shadow-sm)'
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

      {/* ── Como funciona ─────────────────────────────── */}
      <section style={{ padding: '56px 0 0' }}>
        <div className="container">
          <div style={{
            borderRadius: 24, padding: '44px 40px', color: '#fff',
            background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #1565c0 100%)',
            boxShadow: '0 12px 40px rgba(46,125,50,0.20)'
          }}>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#a5d6a7', fontFamily: 'Nunito, sans-serif' }}>
              Como funciona
            </div>
            <h2 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 28, marginTop: 4 }}>
              3 passos para começar a ler
            </h2>
            <div className="how-grid">
              {[
                { n: '1', color: '#81c784', bg: 'rgba(129,199,132,0.15)', title: 'Escolha sua turma', desc: 'Selecione a turma e entre com seu nome para acessar o acervo personalizado.' },
                { n: '2', color: '#ffb74d', bg: 'rgba(255,183,77,0.15)',  title: 'Leia ou baixe',     desc: 'Abra o leitor interativo com modo noturno e zoom, ou baixe para ler offline.' },
                { n: '3', color: '#64b5f6', bg: 'rgba(100,181,246,0.15)', title: 'Compartilhe ideias',desc: 'Deixe comentários, reaja aos livros e participe do desafio literário coletivo.' },
              ].map(s => (
                <div key={s.n} style={{ borderRadius: 16, padding: '22px 24px', background: s.bg, border: '1px solid rgba(255,255,255,0.12)' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, fontFamily: 'Nunito, sans-serif', background: `${s.color}30`, color: s.color }}>
                    {s.n}
                  </div>
                  <h4 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 16, fontWeight: 900, color: '#fff', marginBottom: 8 }}>{s.title}</h4>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
