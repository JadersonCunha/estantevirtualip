import { useState, useEffect } from 'react';
import { Book, TurmaId, UserSession } from './types';
import { INITIAL_BOOKS } from './data/booksData';
import { Header } from './components/Header';
import { PortalHome } from './components/PortalHome';
import { BookshelfView } from './components/BookshelfView';
import { FullScreenReader } from './components/FullScreenReader';
import { BookDetailModal } from './components/BookDetailModal';
import { UserProfileDrawer } from './components/UserProfileDrawer';
import { SearchModal } from './components/SearchModal';
import { HelpModal } from './components/HelpModal';
import { DesafioView } from './components/DesafioView';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<'portal' | 'estante' | 'desafio'>('portal');
  const [selectedTurma, setSelectedTurma] = useState<TurmaId>('todos');
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Current logged in user session
  const [user, setUser] = useState<UserSession>(() => {
    const saved = localStorage.getItem('biblioteca_ip_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      name: 'Mariana Souza',
      matricula: '2026-0482',
      turma: 'gratidao',
      role: 'aluno',
      avatarUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBSZsngVMIohDZvAMpvCyhm0npvu6DCQeRDPs6YtI5etFe8Tm1z5Km51rm3cTH4Kw76QKe3J4exT6m5QB46fR-9r3JhkMhos_byi-bxqpdYQ-X7AW0DCIod0l3_QyaYIPLW0_QADldsVyMTFauNaOIKZF5XwVFUvJKlkO23Pr96UVjRXqhd8sIDHGYu5YnqdD4SBjsEQ0M-DAMpLxpH2qnN-pCoc714tQqjCNHighWi0mHjBNNUnfrA',
      booksRead: 4,
      savedBookmarks: [
        {
          bookId: 'pequeno-principe',
          bookTitle: 'O Pequeno Príncipe',
          page: 13,
          timestamp: 'Hoje, 09:30',
        },
      ],
      favoriteBookIds: ['pequeno-principe', 'jardim-lembrancas', 'segredo-arvores'],
    };
  });

  // Modals & Reader States
  const [currentReadingBook, setCurrentReadingBook] = useState<Book | null>(null);
  const [readingStartPage, setReadingStartPage] = useState<number>(12);
  const [detailModalBook, setDetailModalBook] = useState<Book | null>(null);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);
  const [visitCount, setVisitCount] = useState<number>(14820);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync user state to localStorage
  useEffect(() => {
    localStorage.setItem('biblioteca_ip_user', JSON.stringify(user));
  }, [user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Open Fullscreen Reader
  const handleOpenBook = (book: Book, startPage = 1) => {
    setCurrentReadingBook(book);
    setReadingStartPage(startPage);
  };

  // Close Reader
  const handleCloseReader = () => {
    setCurrentReadingBook(null);
  };

  // Toggle favorite book
  const handleToggleFavorite = (bookId: string) => {
    const isFav = user.favoriteBookIds?.includes(bookId);
    const updatedFavs = isFav
      ? user.favoriteBookIds.filter((id) => id !== bookId)
      : [...(user.favoriteBookIds || []), bookId];

    setUser({
      ...user,
      favoriteBookIds: updatedFavs,
    });

    const book = books.find((b) => b.id === bookId);
    showToast(
      isFav
        ? `"${book?.title}" removido dos seus favoritos.`
        : `"${book?.title}" adicionado aos seus favoritos!`
    );
  };

  // Add reaction to book (Heart, Bulb, Trophy)
  const handleAddReaction = (bookId: string, type: 'heart' | 'bulb' | 'trophy') => {
    setBooks((prevBooks) =>
      prevBooks.map((b) => {
        if (b.id !== bookId) return b;
        const currentSelected = b.userReactions[type];
        const newReactions = { ...b.reactions };
        const newUserReactions = { ...b.userReactions };

        if (type === 'heart') {
          newReactions.hearts = currentSelected ? newReactions.hearts - 1 : newReactions.hearts + 1;
          newUserReactions.heart = !currentSelected;
        } else if (type === 'bulb') {
          newReactions.bulbs = currentSelected ? newReactions.bulbs - 1 : newReactions.bulbs + 1;
          newUserReactions.bulb = !currentSelected;
        } else if (type === 'trophy') {
          newReactions.trophies = currentSelected
            ? newReactions.trophies - 1
            : newReactions.trophies + 1;
          newUserReactions.trophy = !currentSelected;
        }

        return {
          ...b,
          reactions: newReactions,
          userReactions: newUserReactions,
        };
      })
    );

    const labels = { heart: '❤️ Amei', bulb: '💡 Inspirador', trophy: '🏆 Campeão' };
    showToast(`Reação registrada: ${labels[type]}!`);
  };

  // Add Comment/Note to book
  const handleAddComment = (bookId: string, text: string, pageNumber?: number) => {
    const newComment = {
      id: `c-${Date.now()}`,
      authorName: user.name,
      authorRole: user.role === 'professor' ? 'Educadora de Leitura' : 'Aluno Leitor',
      turma: user.turma !== 'todos' ? `Turma ${user.turma}` : 'Instituto Providência',
      avatarUrl: user.avatarUrl,
      date: 'Agora mesmo',
      text,
      likes: 0,
      page: pageNumber,
      isEducator: user.role === 'professor',
    };

    setBooks((prevBooks) =>
      prevBooks.map((b) => {
        if (b.id !== bookId) return b;
        return {
          ...b,
          comments: [newComment, ...b.comments],
        };
      })
    );

    showToast('Sua reflexão foi compartilhada com a turma!');
  };

  // Bookmark a page
  const handleBookmark = (bookId: string, bookTitle: string, pageNumber: number) => {
    const existingIndex = user.savedBookmarks.findIndex(
      (bm) => bm.bookId === bookId && bm.page === pageNumber
    );

    let updatedBookmarks = [...user.savedBookmarks];
    if (existingIndex >= 0) {
      updatedBookmarks.splice(existingIndex, 1);
      showToast(`Marcador da pág. ${pageNumber} removido.`);
    } else {
      updatedBookmarks.push({
        bookId,
        bookTitle,
        page: pageNumber,
        timestamp: 'Hoje',
      });
      showToast(`Página ${pageNumber} de "${bookTitle}" marcada com sucesso!`);
    }

    setUser({
      ...user,
      savedBookmarks: updatedBookmarks,
    });
  };

  // Download Book as text/pdf file
  const handleDownloadBook = (book: Book) => {
    const content = `=====================================================
BIBLIOTECA VIRTUAL - INSTITUTO PROVIDÊNCIA
Acervo Digital de Leitura e Desenvolvimento Humano
=====================================================

TÍTULO: ${book.title}
AUTOR(A): ${book.author}
TURMA: ${book.turmaLabel}
CATEGORIA: ${book.category} (${book.genre})
TOTAL DE PÁGINAS ESTIMADAS: ${book.pagesCount}

SINOPSE:
${book.synopsis}

ÍNDICE DE CAPÍTULOS:
${book.chapters.map((ch) => `- Pág. ${ch.pageNumber}: ${ch.title}`).join('\n')}

TRECHO SELECIONADO:
${book.pages.map((p) => `\n[ PÁGINA ${p.pageNumber} - ${p.chapterTitle} ]\n${p.paragraphs.join('\n\n')}`).join('\n\n')}

=====================================================
Instituto Providência • 2026
"Ler é viajar sem sair do lugar"
=====================================================
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = book.pdfDownloadName || `${book.title.replace(/\s+/g, '_')}_IP.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast(`Download de "${book.title}" iniciado com sucesso!`);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', color: 'var(--ink)' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast">
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#34d399' }}>check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main App Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedTurma={selectedTurma}
        onSelectTurma={(t) => {
          setSelectedTurma(t);
        }}
        user={user}
        onOpenUserProfile={() => setIsUserProfileOpen(true)}
        visitCount={visitCount}
        onIncrementVisits={() => {
          setVisitCount((v) => v + 1);
          showToast('Sua visita foi registrada no Instituto Providência!');
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Primary Views Content */}
      <main className="flex-1">
        {activeTab === 'portal' && (
          <PortalHome
            books={books}
            user={user}
            onUpdateUser={setUser}
            onSelectTurma={setSelectedTurma}
            onOpenBook={handleOpenBook}
            onViewDetails={setDetailModalBook}
            onNavigateToEstante={() => setActiveTab('estante')}
            onToggleFavorite={handleToggleFavorite}
            onOpenHelpModal={() => setIsHelpModalOpen(true)}
          />
        )}

        {activeTab === 'estante' && (
          <BookshelfView
            books={books}
            selectedTurma={selectedTurma}
            onSelectTurma={setSelectedTurma}
            user={user}
            onOpenBook={handleOpenBook}
            onViewDetails={setDetailModalBook}
            onAddReaction={handleAddReaction}
            onAddComment={(bookId, text) => handleAddComment(bookId, text)}
            onDownloadBook={handleDownloadBook}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {activeTab === 'desafio' && (
          <DesafioView
            user={user}
            books={books}
            onOpenBook={handleOpenBook}
            onNavigateToEstante={(turmaId) => {
              if (turmaId) setSelectedTurma(turmaId);
              setActiveTab('estante');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onSelectTurma={(t) => setSelectedTurma(t)}
        setActiveTab={setActiveTab}
      />

      {/* Immersive Fullscreen Interactive Reader */}
      {currentReadingBook && (
        <FullScreenReader
          book={currentReadingBook}
          initialPage={readingStartPage}
          user={user}
          onClose={handleCloseReader}
          onBookmark={handleBookmark}
          onAddComment={handleAddComment}
          onDownloadBook={handleDownloadBook}
        />
      )}

      {/* Book Synopsis & Details Modal */}
      {detailModalBook && (
        <BookDetailModal
          book={detailModalBook}
          onClose={() => setDetailModalBook(null)}
          onOpenBook={handleOpenBook}
          onDownloadBook={handleDownloadBook}
        />
      )}

      {/* User Passport & Profile Drawer */}
      <UserProfileDrawer
        user={user}
        books={books}
        isOpen={isUserProfileOpen}
        onClose={() => setIsUserProfileOpen(false)}
        onUpdateUser={setUser}
        onOpenBook={handleOpenBook}
      />

      {/* Global Quick Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        books={books}
        onOpenBook={handleOpenBook}
        onViewDetails={setDetailModalBook}
      />

      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </div>
  );
}
