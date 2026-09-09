import React, { useState, useEffect } from 'react';
import { Book, BookComment, UserSession } from '../types';

interface FullScreenReaderProps {
  book: Book;
  initialPage?: number;
  user: UserSession;
  onClose: () => void;
  onBookmark: (bookId: string, bookTitle: string, pageNumber: number) => void;
  onAddComment: (bookId: string, text: string, pageNumber: number) => void;
  onDownloadBook: (book: Book) => void;
}

export const FullScreenReader: React.FC<FullScreenReaderProps> = ({
  book,
  initialPage = 12,
  user,
  onClose,
  onBookmark,
  onAddComment,
  onDownloadBook,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [readingTheme, setReadingTheme] = useState<'light' | 'sepia' | 'dark'>('light');
  const [isDualSpread, setIsDualSpread] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [sidePanelOpen, setSidePanelOpen] = useState<boolean>(true);
  const [activeSideTab, setActiveSideTab] = useState<'comments' | 'index'>('comments');
  const [noteInput, setNoteInput] = useState<string>('');
  const [noteVisibility, setNoteVisibility] = useState<'public' | 'private'>('public');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [bookmarkFeedback, setBookmarkFeedback] = useState<string | null>(null);

  // Check if current page is bookmarked
  const isBookmarked = user.savedBookmarks.some(
    (b) => b.bookId === book.id && b.page === currentPage
  );

  // Page content lookup (fallback to generated content if page doesn't exist)
  const getPageContent = (pageNum: number) => {
    const existing = book.pages.find((p) => p.pageNumber === pageNum);
    if (existing) return existing;

    // Generated fallback page for realistic multi-page browsing
    return {
      pageNumber: pageNum,
      chapterTitle: `Capítulo de Leitura • Página ${pageNum}`,
      paragraphs: [
        `Ao avançar pela página ${pageNum} de "${book.title}", o leitor é convidado a mergulhar ainda mais fundo na jornada literária proposta por ${book.author}.`,
        'Cada linha deste livro foi escolhida para cultivar o diálogo entre as turmas do Instituto Providência, estimulando a imaginação, o senso crítico e o carinho mútuo.',
        'Ao terminar a leitura deste trecho, aproveite para registrar seus pensamentos no painel de anotações lateral e compartilhar com seus colegas e educadores.',
      ],
      highlightQuote:
        pageNum % 2 === 0
          ? '“A verdadeira sabedoria mora na curiosidade de quem não tem medo de fazer perguntas.”'
          : undefined,
    };
  };

  const leftPageContent = getPageContent(currentPage);
  const rightPageContent = isDualSpread && currentPage < book.pagesCount ? getPageContent(currentPage + 1) : null;

  const handleNext = () => {
    const step = isDualSpread ? 2 : 1;
    if (currentPage + step <= book.pagesCount) {
      setCurrentPage((prev) => prev + step);
    } else if (currentPage < book.pagesCount) {
      setCurrentPage(book.pagesCount);
    }
  };

  const handlePrev = () => {
    const step = isDualSpread ? 2 : 1;
    if (currentPage - step >= 1) {
      setCurrentPage((prev) => prev - step);
    } else {
      setCurrentPage(1);
    }
  };

  const handlePageJump = (pageStr: string) => {
    const val = parseInt(pageStr, 10);
    if (!isNaN(val) && val >= 1 && val <= book.pagesCount) {
      setCurrentPage(val);
    }
  };

  // Text-To-Speech function
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Seu navegador não suporta leitura em voz alta.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = [
      leftPageContent.chapterTitle,
      ...leftPageContent.paragraphs,
      ...(rightPageContent ? [rightPageContent.chapterTitle, ...rightPageContent.paragraphs] : []),
    ].join('. ');

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSaveBookmark = () => {
    onBookmark(book.id, book.title, currentPage);
    setBookmarkFeedback(`Página ${currentPage} marcada com sucesso!`);
    setTimeout(() => setBookmarkFeedback(null), 2500);
  };

  const handlePostNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    onAddComment(book.id, noteInput.trim(), currentPage);
    setNoteInput('');
  };

  // Theme-specific styles
  const themeStyles = {
    light: {
      bg: 'bg-slate-100',
      bookBg: 'bg-white',
      text: 'text-slate-800',
      headerText: 'text-slate-900',
      border: 'border-slate-200',
      sidebarBg: 'bg-white',
      paperShadow: 'shadow-2xl shadow-slate-400/30',
      spineGradient: 'bg-gradient-to-r from-slate-300/40 via-transparent to-slate-300/40',
    },
    sepia: {
      bg: 'bg-[#f4ecd8]',
      bookBg: 'bg-[#faf4e6]',
      text: 'text-[#433422]',
      headerText: 'text-[#2e2214]',
      border: 'border-[#dfd3bc]',
      sidebarBg: 'bg-[#faf4e6]',
      paperShadow: 'shadow-2xl shadow-amber-900/20',
      spineGradient: 'bg-gradient-to-r from-[#d9caa9] via-transparent to-[#d9caa9]',
    },
    dark: {
      bg: 'bg-[#12161f]',
      bookBg: 'bg-[#1a202c]',
      text: 'text-slate-300',
      headerText: 'text-white',
      border: 'border-slate-800',
      sidebarBg: 'bg-[#161c28]',
      paperShadow: 'shadow-2xl shadow-black/80',
      spineGradient: 'bg-gradient-to-r from-black/60 via-transparent to-black/60',
    },
  }[readingTheme];

  const pageComments = book.comments.filter((c) => !c.page || c.page === currentPage || c.page === currentPage + 1);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col ${themeStyles.bg} transition-colors duration-200 overflow-hidden`}>
      {/* Top Reading Ribbon Bar */}
      <div className="h-16 px-4 sm:px-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 z-20 text-slate-800 dark:text-white">
        
        {/* Left: Back button & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-bold shrink-0 cursor-pointer"
            title="Voltar para a Estante Virtual"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            <span className="hidden sm:inline">Voltar à Estante</span>
          </button>

          <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />

          <div className="min-w-0 truncate">
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate font-display">
              {book.title}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">{book.turmaLabel}</span>
              <span>•</span>
              <span className="truncate">{book.author}</span>
            </div>
          </div>
        </div>

        {/* Center: Page Controls (< 12 / 64 >) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={handlePrev}
            disabled={currentPage <= 1}
            className="p-1.5 sm:p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
            title="Página Anterior"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-xl text-xs font-bold">
            <input
              type="text"
              value={currentPage}
              onChange={(e) => handlePageJump(e.target.value)}
              className="w-8 text-center bg-transparent font-black focus:outline-none border-b border-transparent focus:border-emerald-500"
            />
            <span className="text-slate-400">/</span>
            <span className="text-slate-500 dark:text-slate-400">{book.pagesCount}</span>
          </div>

          <button
            onClick={handleNext}
            disabled={currentPage >= book.pagesCount}
            className="p-1.5 sm:p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-colors"
            title="Próxima Página"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>

        {/* Right Controls: Themes, Zoom, Audio, Bookmark, Drawer Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Color Themes: Claro, Sépia, Noturno */}
          <div className="hidden md:flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setReadingTheme('light')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                readingTheme === 'light' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'
              }`}
              title="Tema Claro"
            >
              Claro
            </button>
            <button
              onClick={() => setReadingTheme('sepia')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                readingTheme === 'sepia' ? 'bg-[#ebd8af] text-[#4a2e0a] shadow-xs' : 'text-slate-500'
              }`}
              title="Tema Sépia Acolhedor"
            >
              Sépia
            </button>
            <button
              onClick={() => setReadingTheme('dark')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                readingTheme === 'dark' ? 'bg-slate-950 text-white shadow-xs' : 'text-slate-500'
              }`}
              title="Tema Noturno"
            >
              Noturno
            </button>
          </div>

          {/* Spread Toggle: Dual vs Single */}
          <button
            onClick={() => setIsDualSpread(!isDualSpread)}
            className="hidden lg:flex p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title={isDualSpread ? 'Mudar para Página Única' : 'Mudar para Páginas Duplas'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isDualSpread ? 'auto_stories' : 'menu_book'}
            </span>
          </button>

          {/* Zoom Controls */}
          <div className="hidden sm:flex items-center gap-1 border border-slate-200 dark:border-slate-700 rounded-xl px-1 py-0.5">
            <button
              onClick={() => setZoomLevel((z) => Math.max(80, z - 10))}
              className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              title="Diminuir Zoom"
            >
              <span className="material-symbols-outlined text-[16px]">remove</span>
            </button>
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 w-9 text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(140, z + 10))}
              className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
              title="Aumentar Zoom"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
            </button>
          </div>

          {/* Audio Narrator TTS Button */}
          <button
            onClick={handleToggleSpeech}
            className={`p-2 rounded-xl border transition-all flex items-center gap-1 text-xs font-bold cursor-pointer ${
              isSpeaking
                ? 'bg-red-500 border-red-600 text-white animate-pulse'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
            }`}
            title={isSpeaking ? 'Pausar leitura em áudio' : 'Ouvir história narrada em voz alta'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isSpeaking ? 'volume_off' : 'record_voice_over'}
            </span>
            <span className="hidden xl:inline">{isSpeaking ? 'Parar Áudio' : 'Ouvir'}</span>
          </button>

          {/* Bookmark Button */}
          <button
            onClick={handleSaveBookmark}
            className={`p-2 rounded-xl border transition-all flex items-center gap-1 text-xs font-bold cursor-pointer ${
              isBookmarked
                ? 'bg-amber-100 border-amber-300 text-amber-900'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
            }`}
            title={isBookmarked ? 'Página marcada' : 'Marcar esta página'}
          >
            <span className="material-symbols-outlined text-[18px]">
              {isBookmarked ? 'bookmark' : 'bookmark_border'}
            </span>
          </button>

          {/* Download PDF button */}
          <button
            onClick={() => onDownloadBook(book)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
            title="Baixar cópia em PDF"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
          </button>

          {/* Toggle Side Panel */}
          <button
            onClick={() => setSidePanelOpen(!sidePanelOpen)}
            className={`p-2 rounded-xl border transition-all flex items-center gap-1 text-xs font-bold ${
              sidePanelOpen
                ? 'bg-emerald-600 border-emerald-700 text-white'
                : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
            }`}
            title="Abrir/fechar painel lateral de anotações e capítulos"
          >
            <span className="material-symbols-outlined text-[18px]">dock_to_left</span>
          </button>
        </div>
      </div>

      {/* Bookmark notification pill */}
      {bookmarkFeedback && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-emerald-700 text-white px-4 py-2 rounded-full shadow-lg text-xs font-bold flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-[16px]">bookmark_added</span>
          <span>{bookmarkFeedback}</span>
        </div>
      )}

      {/* Main Reading & Side Panel Split */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Book Spread Stage Container */}
        <div
          className="flex-1 overflow-y-auto p-4 sm:p-8 flex items-center justify-center relative"
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
        >
          {/* Dual or Single Paper Container */}
          <div
            className={`w-full max-w-5xl rounded-3xl ${themeStyles.bookBg} ${themeStyles.paperShadow} border ${themeStyles.border} relative overflow-hidden flex flex-col md:flex-row min-h-[580px] transition-all`}
          >
            {/* Left Page */}
            <div className={`flex-1 p-6 sm:p-10 flex flex-col justify-between relative ${themeStyles.text}`}>
              <div>
                {/* Header info & Page number */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-700/60 mb-6 text-xs text-slate-400 font-semibold tracking-wider uppercase">
                  <span>{book.title}</span>
                  <span>Pág. {leftPageContent.pageNumber}</span>
                </div>

                {/* Chapter Title */}
                <h3 className={`text-lg sm:text-xl font-black ${themeStyles.headerText} font-display mb-4`}>
                  {leftPageContent.chapterTitle}
                </h3>

                {/* Paragraphs */}
                <div className="space-y-4 text-xs sm:text-sm leading-relaxed font-body">
                  {leftPageContent.paragraphs.map((para, idx) => (
                    <p key={idx} className={idx === 0 ? 'first-letter:text-3xl first-letter:font-black first-letter:mr-1 first-letter:float-left' : ''}>
                      {para}
                    </p>
                  ))}
                </div>

                {/* Optional Illustration frame */}
                {leftPageContent.imageUrl && (
                  <div className="my-6 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                    <img
                      src={leftPageContent.imageUrl}
                      alt={leftPageContent.imageCaption || 'Ilustração da obra'}
                      className="w-full h-44 object-cover"
                    />
                    {leftPageContent.imageCaption && (
                      <div className="p-2.5 bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-500 dark:text-slate-400 italic text-center">
                        {leftPageContent.imageCaption}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom footer */}
              <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Instituto Providência • Leitura Ativa</span>
                <span className="font-bold">{leftPageContent.pageNumber}</span>
              </div>
            </div>

            {/* Central Book Spine Shadow in Dual Mode */}
            {isDualSpread && rightPageContent && (
              <div className={`hidden md:block w-8 ${themeStyles.spineGradient} shrink-0 relative pointer-events-none`}>
                <div className="absolute inset-y-0 left-1/2 w-px bg-slate-300 dark:bg-slate-700" />
              </div>
            )}

            {/* Right Page (Only if Dual spread enabled) */}
            {isDualSpread && rightPageContent && (
              <div className={`flex-1 p-6 sm:p-10 flex flex-col justify-between relative ${themeStyles.text} border-t md:border-t-0 md:border-l ${themeStyles.border}`}>
                <div>
                  {/* Header info & Page number */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-700/60 mb-6 text-xs text-slate-400 font-semibold tracking-wider uppercase">
                    <span>{rightPageContent.chapterTitle}</span>
                    <span>Pág. {rightPageContent.pageNumber}</span>
                  </div>

                  {/* Highlight Quote Box */}
                  {rightPageContent.highlightQuote && (
                    <div className="my-4 p-4 rounded-2xl bg-amber-500/10 border-l-4 border-amber-500 text-xs sm:text-sm font-semibold italic text-amber-900 dark:text-amber-200 leading-relaxed">
                      {rightPageContent.highlightQuote}
                    </div>
                  )}

                  {/* Paragraphs */}
                  <div className="space-y-4 text-xs sm:text-sm leading-relaxed font-body">
                    {rightPageContent.paragraphs.map((para, idx) => (
                      <p key={idx}>{para}</p>
                    ))}
                  </div>

                  {/* Reflective Discussion Box for Class */}
                  {rightPageContent.discussionPrompt && (
                    <div className="mt-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs">
                      <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 mb-1">
                        <span className="material-symbols-outlined text-[16px]">psychology_alt</span>
                        Pergunta para a Turma
                      </div>
                      <p className="text-slate-600 dark:text-slate-300">
                        {rightPageContent.discussionPrompt}
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom footer */}
                <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span className="font-bold">{rightPageContent.pageNumber}</span>
                  <span>{book.turmaLabel}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Collapsible Drawer ("Painel de Leitura") */}
        {sidePanelOpen && (
          <div
            className={`w-80 sm:w-96 ${themeStyles.sidebarBg} border-l ${themeStyles.border} flex flex-col shrink-0 z-30 shadow-xl`}
          >
            {/* Drawer Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/50">
              <button
                type="button"
                onClick={() => setActiveSideTab('comments')}
                className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-1.5 ${
                  activeSideTab === 'comments'
                    ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">edit_note</span>
                Comentários & Notas ({pageComments.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveSideTab('index')}
                className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-1.5 ${
                  activeSideTab === 'index'
                    ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-800'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">format_list_numbered</span>
                Índice (Capítulos)
              </button>
            </div>

            {/* Content Tab 1: Comentários & Notas */}
            {activeSideTab === 'comments' && (
              <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-4">
                {/* Note submission box */}
                <form onSubmit={handlePostNote} className="space-y-2.5 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-between">
                    <span>Anotação na Pág. {currentPage}</span>
                    <span className="text-[10px] text-slate-400 font-normal">por {user.name}</span>
                  </div>

                  <textarea
                    rows={3}
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="Escreva sua reflexão ou dúvida sobre este trecho..."
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:border-emerald-500"
                  />

                  <div className="flex items-center justify-between">
                    {/* Public / Private toggle */}
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <button
                        type="button"
                        onClick={() => setNoteVisibility('public')}
                        className={`px-2 py-0.5 rounded-md font-semibold ${
                          noteVisibility === 'public'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        Público
                      </button>
                      <button
                        type="button"
                        onClick={() => setNoteVisibility('private')}
                        className={`px-2 py-0.5 rounded-md font-semibold ${
                          noteVisibility === 'private'
                            ? 'bg-slate-200 text-slate-800'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        Privado
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={!noteInput.trim()}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Publicar Nota</span>
                      <span className="material-symbols-outlined text-[14px]">send</span>
                    </button>
                  </div>
                </form>

                {/* List of comments for current page */}
                <div className="space-y-3 pt-2">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Reflexões dos Alunos
                  </div>

                  {pageComments.length === 0 ? (
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-center text-xs text-slate-400">
                      Nenhum comentário ainda nesta página. Deixe a sua marca!
                    </div>
                  ) : (
                    pageComments.map((comment) => (
                      <div
                        key={comment.id}
                        className={`p-3 rounded-xl border text-xs space-y-1.5 ${
                          comment.isEducator
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {comment.authorName}
                            </span>
                            {comment.isEducator && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-600 text-white font-extrabold">
                                Educadora
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400">{comment.date}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                          {comment.text}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Content Tab 2: Índice (Capítulos) */}
            {activeSideTab === 'index' && (
              <div className="flex-1 p-4 overflow-y-auto space-y-1.5">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Navegar pelos Capítulos
                </div>
                {book.chapters.map((ch) => {
                  const isCurrentChapter = currentPage >= ch.pageNumber;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => setCurrentPage(ch.pageNumber)}
                      className={`w-full p-3 rounded-xl text-left text-xs transition-all flex items-center justify-between ${
                        isCurrentChapter
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold border border-emerald-200 dark:border-emerald-800'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className="material-symbols-outlined text-[16px] text-emerald-600 shrink-0">
                          bookmark
                        </span>
                        <span className="truncate">{ch.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold shrink-0 ml-2">
                        Pág. {ch.pageNumber}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
