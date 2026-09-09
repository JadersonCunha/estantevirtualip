import React from 'react';
import { Book, TurmaId, UserSession } from '../types';
import { TURMAS_LIST } from '../data/booksData';

interface UserProfileDrawerProps {
  user: UserSession;
  books: Book[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (user: UserSession) => void;
  onOpenBook: (book: Book, startPage?: number) => void;
}

export const UserProfileDrawer: React.FC<UserProfileDrawerProps> = ({
  user,
  books,
  isOpen,
  onClose,
  onUpdateUser,
  onOpenBook,
}) => {
  if (!isOpen) return null;

  const currentTurma = TURMAS_LIST.find((t) => t.id === user.turma);

  const favoriteBooks = books.filter((b) => user.favoriteBookIds?.includes(b.id));

  const handleSwitchUser = (name: string, turma: TurmaId, role: 'aluno' | 'professor', avatarUrl?: string) => {
    onUpdateUser({
      ...user,
      name,
      turma,
      role,
      avatarUrl,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
          
          <div>
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-600">account_circle</span>
                Passaporte do Leitor IP
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Profile Hero Card */}
            <div className="mt-5 p-5 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-slate-50 border border-emerald-200/80 flex items-center gap-4">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-md shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md shrink-0">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="text-base font-extrabold text-slate-900 truncate font-display">
                  {user.name}
                </div>
                <div className="text-xs text-emerald-700 font-bold capitalize">
                  {user.role === 'professor' ? 'Educadora / Mediadora' : currentTurma ? `Turma ${currentTurma.name}` : 'Aluno Leitor'}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Matrícula: {user.matricula}
                </div>
              </div>
            </div>

            {/* Reading Stats Grid */}
            <div className="grid grid-cols-3 gap-2.5 mt-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                <div className="text-xl font-black text-emerald-700 font-display">
                  {user.booksRead}
                </div>
                <div className="text-[10px] text-slate-500 font-semibold uppercase">Livros Lidos</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                <div className="text-xl font-black text-amber-600 font-display">
                  {user.savedBookmarks.length}
                </div>
                <div className="text-[10px] text-slate-500 font-semibold uppercase">Marcadores</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                <div className="text-xl font-black text-blue-600 font-display">
                  {favoriteBooks.length}
                </div>
                <div className="text-[10px] text-slate-500 font-semibold uppercase">Favoritos</div>
              </div>
            </div>

            {/* Saved Bookmarks Section */}
            <div className="mt-6">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Páginas Marcadas</span>
                <span className="text-emerald-700 text-[11px]">Salvas recentemente</span>
              </div>

              {user.savedBookmarks.length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                  Você ainda não marcou nenhuma página. Ao abrir um livro, toque no ícone de marcador!
                </div>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {user.savedBookmarks.map((bm, i) => {
                    const targetBook = books.find((b) => b.id === bm.bookId);
                    return (
                      <div
                        key={i}
                        onClick={() => {
                          if (targetBook) {
                            onClose();
                            onOpenBook(targetBook, bm.page);
                          }
                        }}
                        className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 transition-colors cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="font-bold text-slate-800 truncate">{bm.bookTitle}</div>
                          <div className="text-[10px] text-slate-400">{bm.timestamp}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[11px] shrink-0">
                          Pág. {bm.page}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Favorite Books Section */}
            <div className="mt-6">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Livros Favoritados ({favoriteBooks.length})
              </div>
              {favoriteBooks.length === 0 ? (
                <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                  Toque no coração dos livros para adicioná-los aos seus favoritos.
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {favoriteBooks.map((fav) => (
                    <div
                      key={fav.id}
                      onClick={() => {
                        onClose();
                        onOpenBook(fav, 1);
                      }}
                      className="cursor-pointer group"
                    >
                      <div className="aspect-[3/4] rounded-lg overflow-hidden border border-slate-200 shadow-xs">
                        <img
                          src={fav.coverUrl}
                          alt={fav.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="text-[10px] font-bold text-slate-800 truncate mt-1">
                        {fav.title}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Switch Persona for Classroom Testing */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Alternar Usuário para Demonstração
              </div>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() =>
                    handleSwitchUser(
                      'Mariana Souza',
                      'gratidao',
                      'aluno',
                      'https://lh3.googleusercontent.com/aida-public/AB6AXuBSZsngVMIohDZvAMpvCyhm0npvu6DCQeRDPs6YtI5etFe8Tm1z5Km51rm3cTH4Kw76QKe3J4exT6m5QB46fR-9r3JhkMhos_byi-bxqpdYQ-X7AW0DCIod0l3_QyaYIPLW0_QADldsVyMTFauNaOIKZF5XwVFUvJKlkO23Pr96UVjRXqhd8sIDHGYu5YnqdD4SBjsEQ0M-DAMpLxpH2qnN-pCoc714tQqjCNHighWi0mHjBNNUnfrA'
                    )
                  }
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-emerald-50 text-slate-700 flex items-center justify-between"
                >
                  <span>Mariana Souza (Aluna • Gratidão)</span>
                  <span className="material-symbols-outlined text-sm">switch_account</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleSwitchUser(
                      'Lucas Gabriel',
                      'gratidao',
                      'aluno',
                      'https://lh3.googleusercontent.com/aida-public/AB6AXuDP0QL3JA2-bQnkGxjP1sjCNhUXukuFMDN4fBu5muef9XLbXsohE5hqenSIDqYCgZLGJ8PeFXLeuANMwg3Ft_5Z6qYVnRc2_Htb6cdF2_dYvDsfUp7yF3JCKgkVF4dPH7Wu8_XbdL1WqJY8b1ukm0vlhOx4wuibpHsezRFQxMocR3dNtExkGjIp_CoQEg82LXsXj9vI7SeajtRYd28xi_bt_Qfzk10o4pQ8HpGZnECJg5ccTl5wczg6'
                    )
                  }
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-emerald-50 text-slate-700 flex items-center justify-between"
                >
                  <span>Lucas Gabriel (Aluno • Gratidão)</span>
                  <span className="material-symbols-outlined text-sm">switch_account</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleSwitchUser(
                      'Profª. Rosana',
                      'fe',
                      'professor',
                      'https://lh3.googleusercontent.com/aida/AEtjO1WqhJYaHZj9f9Y324EKtr84Gxhkk6NgEHPZx4Jy5PHF1aFSFNmIdQCMFSsR3-bHuYvCiNGpbZgTb4n6pjLsLLKxrN_V_LxwLQ9EucpP15cqTFjzXBZWWxBmvy-rRonW36gqAJcociLUVwtqVE30o9nu2jGIp1deTUZc9SHuCQy7ys2BpsEgce-gHFftj8WhyIl1OIMR03Bjnzdn22rF-39Y5gUYV0h5Ulffb0o0361et7s1-jY3WGjr4g'
                    )
                  }
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-900 flex items-center justify-between"
                >
                  <span>Profª. Rosana (Mediadora de Leitura)</span>
                  <span className="material-symbols-outlined text-sm">psychology</span>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Fechar Painel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
