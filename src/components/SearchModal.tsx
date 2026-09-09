import React, { useState } from 'react';
import { Book } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  onOpenBook: (book: Book, startPage?: number) => void;
  onViewDetails: (book: Book) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  books,
  onOpenBook,
  onViewDetails,
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const results = books.filter((b) => {
    if (!query.trim()) return false;
    const q = query.toLowerCase();
    return (
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.genre.toLowerCase().includes(q) ||
      b.synopsis.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 z-10" style={{ overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', bottom: -20, right: -20,
          width: 180, height: 180, pointerEvents: 'none', zIndex: 0,
          backgroundImage: 'url(/logo\ fundo\ slide.png)',
          backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center',
          opacity: 0.07,
        }} />
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <span className="material-symbols-outlined text-emerald-600 text-2xl">search</span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquise por títulos, autores ou gêneros da biblioteca..."
            className="flex-1 text-sm sm:text-base font-semibold text-slate-900 placeholder:text-slate-400 outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600 p-1">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100"
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-2">
          {!query.trim() ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Digite palavras-chave como &ldquo;pequeno príncipe&rdquo;, &ldquo;árvores&rdquo;, &ldquo;máquinas&rdquo; ou &ldquo;turma&rdquo;.
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Nenhuma obra encontrada para &ldquo;{query}&rdquo;.
            </div>
          ) : (
            results.map((book) => (
              <div
                key={book.id}
                className="p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-12 h-16 object-cover rounded-lg shadow-xs shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-900 truncate">{book.title}</div>
                    <div className="text-xs text-slate-500 truncate">{book.author}</div>
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 mt-1">
                      {book.turmaLabel}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenBook(book, 1);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1"
                  >
                    <span>Ler</span>
                    <span className="material-symbols-outlined text-[14px]">auto_stories</span>
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      onViewDetails(book);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                  >
                    Detalhes
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
