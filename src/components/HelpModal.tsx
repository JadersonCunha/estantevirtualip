import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="fixed inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 z-10 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-lg font-black text-slate-900 font-display flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600">help</span>
            Ajuda & Como Acessar
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
            <div className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">how_to_reg</span>
              Como entrar como Aluno ou Professor?
            </div>
            <p className="text-xs text-emerald-800">
              Selecione a sua turma educativa (Gratidão, Fé, Acolhida ou Trabalho Educativo) e digite seu nome ou número de matrícula. Você também pode tocar nas sugestões rápidas para testar o acesso imediato.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">screen_search_desktop</span>
              O que é a Estante de Madeira 3D?
            </div>
            <p className="text-xs text-slate-600">
              Na aba <strong>Estante Geral</strong>, você pode alternar entre o modo de &ldquo;Cards & Interação&rdquo; e a &ldquo;Estante de Madeira 3D&rdquo;, que simula prateleiras de biblioteca com gavetas de acervo.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">record_voice_over</span>
              Como ouvir o livro em voz alta?
            </div>
            <p className="text-xs text-slate-600">
              Dentro do <strong>Leitor em Tela Cheia</strong>, toque no botão &ldquo;Ouvir&rdquo; no topo. O narrador da biblioteca lerá os parágrafos em voz alta em português!
            </p>
          </div>
        </div>

        <div className="pt-3">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
          >
            Entendi, voltar à Biblioteca
          </button>
        </div>
      </div>
    </div>
  );
};
