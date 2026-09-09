export type TurmaId = 'todos' | 'gratidao' | 'fe' | 'acolhida' | 'trabalho';

export interface TurmaInfo {
  id: TurmaId;
  name: string;
  subName: string;
  code: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  icon: string;
  description: string;
  ageRange: string;
}

export interface BookComment {
  id: string;
  authorName: string;
  authorRole: string;
  turma: string;
  avatarInitials?: string;
  avatarUrl?: string;
  date: string;
  text: string;
  likes: number;
  userLiked?: boolean;
  page?: number;
  isEducator?: boolean;
}

export interface BookChapter {
  id: string;
  title: string;
  pageNumber: number;
}

export interface BookPageContent {
  pageNumber: number;
  chapterTitle: string;
  paragraphs: string[];
  imageUrl?: string;
  imageCaption?: string;
  highlightQuote?: string;
  discussionPrompt?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  turma: 'gratidao' | 'fe' | 'acolhida' | 'trabalho';
  turmaLabel: string;
  pagesCount: number;
  category: 'Infantil' | 'Contos' | 'Ciências' | 'Poesia' | 'Quadrinhos' | 'Formação' | 'Comunidade';
  genre: string;
  ageRange: string;
  coverUrl: string;
  synopsis: string;
  featured?: boolean;
  isNew?: boolean;
  reactions: {
    hearts: number;
    bulbs: number;
    trophies: number;
  };
  userReactions: {
    heart: boolean;
    bulb: boolean;
    trophy: boolean;
  };
  comments: BookComment[];
  chapters: BookChapter[];
  pages: BookPageContent[];
  pdfDownloadName: string;
}

export interface UserSession {
  name: string;
  matricula: string;
  turma: TurmaId;
  role: 'aluno' | 'professor';
  avatarUrl?: string;
  booksRead: number;
  savedBookmarks: {
    bookId: string;
    bookTitle: string;
    page: number;
    timestamp: string;
  }[];
  favoriteBookIds: string[];
}
