import React, { useState } from 'react';
import { Book, TurmaId, UserSession } from '../types';
import { TURMAS_LIST } from '../data/booksData';

interface BookshelfViewProps {
  books: Book[];
  selectedTurma: TurmaId;
  onSelectTurma: (turma: TurmaId) => void;
  user: UserSession;
  onOpenBook: (book: Book, startPage?: number) => void;
  onViewDetails: (book: Book) => void;
  onAddReaction: (bookId: string, type: 'heart' | 'bulb' | 'trophy') => void;
  onAddComment: (bookId: string, text: string) => void;
  onDownloadBook: (book: Book) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const BookshelfView: React.FC<BookshelfViewProps> = ({
  books, selectedTurma, onSelectTurma, user,
  onOpenBook, onViewDetails, onAddReaction, onAddComment, onDownloadBook,
  searchQuery, setSearchQuery,
}) => {
  const [viewStyle, setViewStyle] = useState<'grid' | 'wooden'>('grid');
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);

  const filtered = books.filter(b => {
    const matchTurma = selectedTurma === 'todos' || b.turma === selectedTurma;
    const q = searchQuery.toLowerCase().trim();
    const matchQ = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
    return matchTurma && matchQ;
  });

  const handleCommentSubmit = (bookId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInputs[bookId]?.trim();
    if (!text) return;
    onAddComment(bookId, text);
    setCommentInputs(p => ({ ...p, [bookId]: '' }));
  };

  return (
    <div style={{ padding: '28px 0 64px' }}>
      <div className="container">

        {/* ── Toolbar ─────────────────────────────────── */}
        <div className="card" style={{ padding: '18px 22px', marginBottom: 16, boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                <span className="badge badge-green">
                  {selectedTurma === 'todos' ? 'Acervo Completo' : `Turma ${selectedTurma}`}
                </span>
                <span style={{ fontSize: 12, color: 'var(--ink-muted)' }}>{filtered.length} obras</span>
              </div>
              <h1 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 22, fontWeight: 900, color: 'var(--ink)' }}>
                Estante Digital
              </h1>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ position: 'relative' }}>
                <span className="material-symbols-outlined" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 18, color: 'var(--ink-muted)', pointerEvents: 'none' }}>search</span>
                <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Buscar título, autor..."
                  className="input" style={{ paddingLeft: 34, paddingTop: 8, paddingBottom: 8, fontSize: 12, width: 210 }} />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')}
                    style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)', display: 'flex' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', background: 'var(--bg)', borderRadius: 10, padding: 3 }}>
                {[
                  { id: 'grid',   icon: 'grid_view', label: 'Grid' },
                  { id: 'wooden', icon: 'shelves',   label: 'Estante' },
                ].map(v => (
                  <button key={v.id} type="button" onClick={() => setViewStyle(v.id as 'grid' | 'wooden')}
                    style={{
                      padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                      border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                      display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.15s',
                      background: viewStyle === v.id ? (v.id === 'wooden' ? '#a0522d' : 'var(--surface)') : 'transparent',
                      color: viewStyle === v.id ? (v.id === 'wooden' ? '#fff' : 'var(--ink)') : 'var(--ink-muted)',
                      boxShadow: viewStyle === v.id ? 'var(--shadow-xs)' : 'none',
                    }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 15 }}>{v.icon}</span>
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Turma filters */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 16, paddingTop: 16, borderTop: '1.5px solid var(--border-soft)' }}>
            <button className={`turma-pill${selectedTurma === 'todos' ? ' active' : ''}`}
              style={selectedTurma === 'todos' ? { background: 'var(--ink)', borderColor: 'var(--ink)', color: '#fff' } : {}}
              onClick={() => onSelectTurma('todos')}>
              <span className="material-symbols-outlined" style={{ fontSize: 13 }}>apps</span>
              Todas
            </button>
            {TURMAS_LIST.map(t => (
              <button key={t.id}
                className={`turma-pill${selectedTurma === t.id ? ' active' : ''}`}
                style={selectedTurma === t.id ? { background: t.color, borderColor: t.color, color: '#fff' } : {}}
                onClick={() => onSelectTurma(t.id)}>
                <span className="material-symbols-outlined" style={{ fontSize: 13 }}>{t.icon}</span>
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* ── Ranking ─────────────────────────────────── */}
        <div style={{
          borderRadius: 16, padding: '14px 20px', marginBottom: 24,
          background: 'linear-gradient(135deg, #2e7d32, #1565c0)',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          boxShadow: 'var(--shadow-md)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🏆</div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#a5d6a7', fontFamily: 'Nunito, sans-serif' }}>
                Circuito de Leitura 2026
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
                Cada livro lido gera pontos para sua turma!
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { label: 'Gratidão', pts: 340, color: '#a5d6a7' },
              { label: 'Trab. Educ.', pts: 315, color: '#ce93d8' },
              { label: 'Fé', pts: 295, color: '#90caf9' },
              { label: 'Acolhida', pts: 260, color: '#ffcc80' },
            ].map(r => (
              <div key={r.label} style={{ padding: '6px 12px', borderRadius: 10, textAlign: 'center', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: r.color, fontFamily: 'Nunito, sans-serif' }}>{r.label}</div>
                <div style={{ fontSize: 14, fontWeight: 900, color: '#fff', fontFamily: 'Nunito, sans-serif' }}>{r.pts}pts</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── GRID VIEW ───────────────────────────────── */}
        {viewStyle === 'grid' && (
          <>
            {filtered.length === 0 ? (
              <div className="card" style={{ padding: 56, textAlign: 'center' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 52, color: 'var(--border)' }}>search_off</span>
                <h3 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 18, fontWeight: 800, color: 'var(--ink-soft)', marginTop: 10 }}>
                  Nenhum livro encontrado
                </h3>
                <button className="btn btn-primary" style={{ marginTop: 18 }}
                  onClick={() => { setSearchQuery(''); onSelectTurma('todos'); }}>
                  Limpar filtros
                </button>
              </div>
            ) : (
              <div className="books-grid">
                {filtered.map(book => {
                  const showComments = activeCommentId === book.id;
                  return (
                    <div key={book.id} className="card card-hover book-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ position: 'relative', aspectRatio: '3/4', cursor: 'pointer' }}
                        onClick={() => onOpenBook(book, 1)}>
                        <img src={book.coverUrl} alt={book.title} className="book-cover" />
                        <div className="book-cover-overlay">
                          <span style={{ background: 'var(--primary)', color: '#fff', padding: '5px 14px', borderRadius: 8, fontSize: 12, fontWeight: 800, fontFamily: 'Nunito, sans-serif' }}>
                            Ler
                          </span>
                        </div>
                        <span className="badge badge-white" style={{ position: 'absolute', top: 7, left: 7, fontSize: 9 }}>
                          {book.turmaLabel}
                        </span>
                        {book.isNew && (
                          <span className="badge badge-orange" style={{ position: 'absolute', bottom: 7, left: 7, fontSize: 9 }}>Novo</span>
                        )}
                      </div>

                      <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <h4 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 13, fontWeight: 800, color: 'var(--ink)', cursor: 'pointer', lineHeight: 1.3, marginBottom: 3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                          onClick={() => onOpenBook(book, 1)}>
                          {book.title}
                        </h4>
                        <p style={{ fontSize: 11, color: 'var(--ink-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 10 }}>
                          {book.author}
                        </p>

                        {/* Reactions */}
                        <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
                          {([
                            { type: 'heart'  as const, emoji: '❤️', count: book.reactions.hearts,   active: book.userReactions.heart  },
                            { type: 'bulb'   as const, emoji: '💡', count: book.reactions.bulbs,    active: book.userReactions.bulb   },
                            { type: 'trophy' as const, emoji: '🏆', count: book.reactions.trophies, active: book.userReactions.trophy },
                          ]).map(r => (
                            <button key={r.type} className={`reaction-btn${r.active ? ' active' : ''}`}
                              onClick={() => onAddReaction(book.id, r.type)}>
                              {r.emoji} {r.count}
                            </button>
                          ))}
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: 6, paddingTop: 10, borderTop: '1px solid var(--border-soft)', marginTop: 'auto' }}>
                          <button className="btn btn-primary btn-sm" style={{ flex: 1 }}
                            onClick={() => onOpenBook(book, 1)}>
                            Ler
                          </button>
                          <button className="btn btn-ghost btn-sm" onClick={() => onViewDetails(book)} title="Detalhes">
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>info</span>
                          </button>
                          <button className="btn btn-ghost btn-sm" onClick={() => onDownloadBook(book)} title="Baixar">
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>download</span>
                          </button>
                          <button className="btn btn-ghost btn-sm"
                            onClick={() => setActiveCommentId(showComments ? null : book.id)} title="Comentários">
                            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>forum</span>
                          </button>
                        </div>

                        {showComments && (
                          <div className="animate-in" style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border-soft)' }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ink-soft)', marginBottom: 6 }}>
                              Reflexões ({book.comments.length})
                            </div>
                            {book.comments.slice(0, 3).map(c => (
                              <div key={c.id} style={{ padding: '8px 10px', borderRadius: 8, marginBottom: 4, fontSize: 11, background: c.isEducator ? 'var(--primary-light)' : 'var(--bg)', color: 'var(--ink)' }}>
                                <span style={{ fontWeight: 700 }}>{c.authorName}: </span>
                                <span style={{ color: 'var(--ink-soft)' }}>{c.text}</span>
                              </div>
                            ))}
                            <form onSubmit={e => handleCommentSubmit(book.id, e)} style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                              <input type="text" value={commentInputs[book.id] || ''}
                                onChange={e => setCommentInputs(p => ({ ...p, [book.id]: e.target.value }))}
                                placeholder="Sua reflexão..."
                                className="input" style={{ fontSize: 11, padding: '6px 10px', flex: 1 }} />
                              <button type="submit" className="btn btn-primary btn-sm">
                                <span className="material-symbols-outlined" style={{ fontSize: 13 }}>send</span>
                              </button>
                            </form>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── WOODEN VIEW ─────────────────────────────── */}
        {viewStyle === 'wooden' && (
          <div className="wood-outer-frame wood-grain-bg" style={{ padding: '32px 24px' }}>
            <div style={{ maxWidth: 280, margin: '0 auto 32px', background: 'linear-gradient(180deg, #e5b376, #8d5220)', borderRadius: 12, padding: 3, border: '1px solid #f7d6a3' }}>
              <div style={{ background: '#4a240c', borderRadius: 8, padding: '8px 20px', textAlign: 'center', border: '1px solid #783e18' }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f7d6a3', fontFamily: 'Nunito, sans-serif' }}>Instituto Providência</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: '#fef3c7', fontFamily: 'Nunito, sans-serif' }}>Estante Virtual</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
              {[0, 1, 2].map(si => {
                const shelf = filtered.slice(si * 5, si * 5 + 5);
                if (!shelf.length && si > 0) return null;
                return (
                  <div key={si} style={{ position: 'relative' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'center', gap: 16, padding: '0 16px 4px', minHeight: 180 }}>
                      {shelf.map(book => (
                        <div key={book.id} className="book-card-3d"
                          style={{ width: 90, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                          onClick={() => onOpenBook(book, 1)}>
                          <div style={{ position: 'relative', width: '100%', aspectRatio: '3/4', borderRadius: 8, overflow: 'hidden', border: '2px solid #83491f', background: '#1a1f2e' }}>
                            <img src={book.coverUrl} alt={book.title} className="book-cover" />
                            <div style={{ position: 'absolute', inset: '0 auto 0 0', width: 8, background: 'linear-gradient(90deg, rgba(0,0,0,0.6), rgba(255,255,255,0.15), transparent)', pointerEvents: 'none' }} />
                          </div>
                          <div style={{ marginTop: 6, padding: '4px 8px', borderRadius: 6, textAlign: 'center', maxWidth: 100, background: '#2d1506', border: '1px solid #a4652a' }}>
                            <div style={{ fontSize: 9, fontWeight: 700, color: '#fde68a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'Nunito, sans-serif' }}>{book.title}</div>
                            <div style={{ fontSize: 8, color: '#d97706', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.turmaLabel}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="wood-shelf-beam" />
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 32, paddingTop: 20, borderTop: '3px solid #783e18' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: 12, background: '#4a240c', border: '1px solid #a4652a' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#fcd34d' }}>inbox</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fef3c7', fontFamily: 'Nunito, sans-serif' }}>Acervo Extra & Documentos</div>
                    <div style={{ fontSize: 11, color: '#d97706' }}>Cadernos, cartilhas e audio-livros</div>
                  </div>
                </div>
                <button onClick={() => setDrawerOpen(!drawerOpen)}
                  style={{ padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, background: '#8c4b1d', color: '#fef3c7', border: '1px solid rgba(253,211,77,0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'inherit' }}>
                  {drawerOpen ? 'Fechar' : 'Abrir'}
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{drawerOpen ? 'expand_less' : 'expand_more'}</span>
                </button>
              </div>
              {drawerOpen && (
                <div className="animate-in" style={{ marginTop: 8, padding: 16, borderRadius: 12, background: '#321707', border: '1px solid #783e18', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
                  {[
                    { icon: 'description', label: 'Diário de Bordo 2026', sub: 'Registro pedagógico' },
                    { icon: 'audio_file',  label: 'Podcasts Literários',  sub: 'Gravações dos alunos' },
                    { icon: 'palette',     label: 'Mural de Ilustrações', sub: 'Desenhos da Turma Gratidão' },
                  ].map(d => (
                    <div key={d.label} style={{ padding: '10px 12px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10, background: '#44200a', border: '1px solid #6b3512' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#fcd34d' }}>{d.icon}</span>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#fef3c7', fontFamily: 'Nunito, sans-serif' }}>{d.label}</div>
                        <div style={{ fontSize: 10, color: '#d97706' }}>{d.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
