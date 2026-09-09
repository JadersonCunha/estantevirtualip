import React from 'react';
import { Book } from '../types';

interface BookDetailModalProps {
  book: Book;
  onClose: () => void;
  onOpenBook: (book: Book, startPage?: number) => void;
  onDownloadBook: (book: Book) => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  onClose,
  onOpenBook,
  onDownloadBook,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto border border-slate-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <span className="material-symbols-outlined text-[22px]">close</span>
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
          {/* Cover */}
          <div className="sm:col-span-4 flex flex-col items-center">
            <div className="w-40 aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border border-slate-200">
              <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
            </div>
            <div className="mt-3 text-center">
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                {book.turmaLabel}
              </span>
            </div>
          </div>

          {/* Details */}
          <div className="sm:col-span-8">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              {book.genre}
            </div>
            <h2 className="text-2xl font-black text-slate-900 font-display mt-1">
              {book.title}
            </h2>
            <div className="text-sm font-semibold text-emerald-700 mt-0.5">
              {book.author}
            </div>

            <div className="flex flex-wrap gap-2 my-3 text-xs text-slate-500">
              <span className="bg-slate-100 px-2.5 py-1 rounded-lg font-medium">
                📄 {book.pagesCount} páginas
              </span>
              <span className="bg-slate-100 px-2.5 py-1 rounded-lg font-medium">
                🎯 {book.ageRange}
              </span>
              <span className="bg-slate-100 px-2.5 py-1 rounded-lg font-medium">
                💬 {book.comments.length} reflexões
              </span>
            </div>

            <div className="mt-4">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                Sinopse da Obra
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {book.synopsis}
              </p>
            </div>

            {/* Chapters Preview */}
            <div className="mt-5">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                Capítulos Disponíveis
              </div>
              <div className="max-h-32 overflow-y-auto space-y-1.5 pr-2">
                {book.chapters.map((ch) => (
                  <div
                    key={ch.id}
                    onClick={() => {
                      onClose();
                      onOpenBook(book, ch.pageNumber);
                    }}
                    className="p-2 rounded-lg bg-slate-50 hover:bg-emerald-50 hover:text-emerald-900 text-xs text-slate-700 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <span className="truncate">{ch.title}</span>
                    <span className="text-[10px] text-slate-400 font-bold shrink-0 ml-2">
                      Pág. {ch.pageNumber}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  onOpenBook(book, 1);
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">auto_stories</span>
                Ler Agora em Tela Cheia
              </button>

              <button
                onClick={() => onDownloadBook(book)}
                className="py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                Baixar PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
