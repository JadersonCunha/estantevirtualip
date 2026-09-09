import React, { useState } from 'react';
import { Book, TurmaId, UserSession } from '../types';
import { TURMAS_LIST } from '../data/booksData';

interface DesafioViewProps {
  user: UserSession;
  books: Book[];
  onOpenBook: (book: Book, startPage?: number) => void;
  onNavigateToEstante: (turma?: TurmaId) => void;
}

export const DesafioView: React.FC<DesafioViewProps> = ({
  user,
  books,
  onOpenBook,
  onNavigateToEstante,
}) => {
  const [readingLogInput, setReadingLogInput] = useState('');
  const [loggedPagesCount, setLoggedPagesCount] = useState(80);
  const [showLogSuccess, setShowLogSuccess] = useState(false);

  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(readingLogInput, 10);
    if (!isNaN(count) && count > 0) {
      setLoggedPagesCount((prev) => Math.min(100, prev + count));
      setReadingLogInput('');
      setShowLogSuccess(true);
      setTimeout(() => setShowLogSuccess(false), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-extrabold uppercase tracking-wider border border-emerald-400/30 mb-3">
            <span className="material-symbols-outlined text-sm">military_tech</span>
            Desafio Literário 2026
          </span>
          <h1 className="text-2xl sm:text-4xl font-black font-display text-white">
            &ldquo;Ler é viajar sem sair do lugar&rdquo;
          </h1>
          <p className="text-emerald-100/90 text-sm sm:text-base mt-2 leading-relaxed">
            Nossa missão coletiva desta semana: unir todas as turmas do Instituto Providência para
            alcançar a meta de 100 páginas compartilhadas!
          </p>

          {/* Big Progress Bar */}
          <div className="mt-6 bg-black/40 p-5 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold text-emerald-300 mb-2">
              <span>Meta Coletiva do Instituto</span>
              <span>{loggedPagesCount}% concluída ({loggedPagesCount} / 100 páginas)</span>
            </div>
            <div className="w-full h-4 rounded-full bg-black/50 overflow-hidden p-0.5 border border-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 shadow-md transition-all duration-700"
                style={{ width: `${loggedPagesCount}%` }}
              />
            </div>
          </div>
        </div>

        {/* Message from Mediadora */}
        <div className="relative z-10 mt-8 pt-6 border-t border-white/15 flex flex-col sm:flex-row sm:items-center gap-4">
          <img
            src="https://lh3.googleusercontent.com/aida/AEtjO1WqhJYaHZj9f9Y324EKtr84Gxhkk6NgEHPZx4Jy5PHF1aFSFNmIdQCMFSsR3-bHuYvCiNGpbZgTb4n6pjLsLLKxrN_V_LxwLQ9EucpP15cqTFjzXBZWWxBmvy-rRonW36gqAJcociLUVwtqVE30o9nu2jGIp1deTUZc9SHuCQy7ys2BpsEgce-gHFftj8WhyIl1OIMR03Bjnzdn22rF-39Y5gUYV0h5Ulffb0o0361et7s1-jY3WGjr4g"
            alt="Profª. Rosana"
            className="w-14 h-14 rounded-full object-cover border-2 border-emerald-400 shrink-0"
          />
          <div>
            <div className="text-xs text-emerald-300 font-bold uppercase tracking-wider">
              Mensagem da Mediadora de Leitura • Profª. Rosana
            </div>
            <p className="text-sm text-emerald-50 italic mt-0.5 max-w-2xl">
              &ldquo;Parabéns a todas as crianças e jovens! Ao lerem juntos, vocês não apenas acumulam pontos, mas ampliam horizontes de solidariedade, amizade e pensamento criativo.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Register reading + Turma Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Register Reading Form (Span 5) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-md">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-emerald-600 text-2xl">menu_book</span>
            <h2 className="text-lg font-black text-slate-900 font-display">
              Registrar Páginas Lidas
            </h2>
          </div>
          <p className="text-xs text-slate-500 mb-5">
            Contribua com a pontuação da sua turma registrando quantas páginas você leu hoje.
          </p>

          <form onSubmit={handleLogSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Leitor Ativo
              </label>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>{user.name}</span>
                <span className="text-emerald-700 capitalize font-medium">{user.turma}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Quantidade de Páginas Lidas Hoje
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={readingLogInput}
                onChange={(e) => setReadingLogInput(e.target.value)}
                placeholder="Ex: 5 páginas"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={!readingLogInput.trim()}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">add_task</span>
              Registrar no Desafio Coletivo
            </button>

            {showLogSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold text-center animate-in fade-in">
                Parabéns! Suas páginas foram somadas ao placar geral do Instituto!
              </div>
            )}
          </form>

          {/* Suggestion to open book */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-700 mb-2">Quer começar uma nova leitura agora?</div>
            <button
              onClick={() => onOpenBook(books[0], 1)}
              className="w-full p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors flex items-center justify-between"
            >
              <span>Abrir &ldquo;{books[0].title}&rdquo;</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Ranking of Turmas (Span 7) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500 text-2xl">trophy</span>
                Placar Geral entre Turmas
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pontuação atualizada com base em livros lidos, páginas e notas reflexivas
              </p>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">
              Semana 11/2026
            </span>
          </div>

          <div className="space-y-3 mt-4">
            {[
              {
                id: 'gratidao',
                name: 'Turma Gratidão',
                code: 'Turma A • Infantil',
                points: 340,
                color: '#059669',
                bg: 'bg-emerald-50 border-emerald-200',
                rank: '1º Lugar 🥇',
              },
              {
                id: 'trabalho',
                name: 'Trabalho Educativo',
                code: 'Oficinas • Jovens',
                points: 315,
                color: '#4338ca',
                bg: 'bg-indigo-50 border-indigo-200',
                rank: '2º Lugar 🥈',
              },
              {
                id: 'fe',
                name: 'Turma Fé',
                code: 'Turma B • Juvenil',
                points: 295,
                color: '#1e40af',
                bg: 'bg-blue-50 border-blue-200',
                rank: '3º Lugar 🥉',
              },
              {
                id: 'acolhida',
                name: 'Turma Acolhida',
                code: 'Turma C • Apoio',
                points: 260,
                color: '#d97706',
                bg: 'bg-amber-50 border-amber-200',
                rank: '4º Lugar 🌟',
              },
            ].map((t) => (
              <div
                key={t.id}
                className={`p-4 rounded-2xl border ${t.bg} flex items-center justify-between transition-transform hover:scale-[1.01]`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-sm font-black">{t.rank}</div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.code}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-base font-black text-slate-900">{t.points} pts</div>
                    <div className="text-[10px] text-slate-400 font-semibold">leituras ativas</div>
                  </div>
                  <button
                    onClick={() => onNavigateToEstante(t.id as TurmaId)}
                    className="p-1.5 rounded-lg bg-white shadow-xs text-slate-600 hover:text-emerald-700"
                    title="Ver livros desta turma"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
