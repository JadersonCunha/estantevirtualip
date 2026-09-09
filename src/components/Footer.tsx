import React from 'react';
import { TurmaId } from '../types';
import { TURMAS_LIST } from '../data/booksData';

interface FooterProps {
  onSelectTurma: (turma: TurmaId) => void;
  setActiveTab: (tab: 'portal' | 'estante' | 'desafio') => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTurma, setActiveTab }) => {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const link: React.CSSProperties = {
    fontSize: 13, color: '#6cdbdf', background: 'none', border: 'none',
    cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
    padding: 0, lineHeight: 2, transition: 'color 0.15s',
  };

  return (
    <footer style={{ background: '#062f32', borderTop: '2px solid #0e9095', marginTop: 64 }}>
      <div className="container" style={{ padding: '52px 24px 32px' }}>
        <div className="footer-grid">

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <img
                src="https://lh3.googleusercontent.com/aida/AEtjO1VPc2KvPlkD--149MEuR3a08bKhpOhgUN0duJslM1Ke8d9OQnZPCVCT0UwVrJ-5Hg7Mp6ed8N4BPpOGOpX5408dmCcOQ0t6ODkiSPbPeUArsWn7JX7CokFdLI-6W3SRvU0Zy5eczTDSohqqVdmy8YBPavNgPrVckTp7T299SFmp4XZZvby0EwRo-BnGnpbUs5x9A0xqCDxYheBEmU1usrV6tyDuGNPgPSt7H8jfG_zv2cT60KzAI75U6PI"
                alt="IP"
                style={{ height: 34, width: 'auto', objectFit: 'contain', filter: 'brightness(2)' }} />
              <div>
                <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: 15, fontWeight: 900, color: '#fff' }}>
                  Biblioteca Virtual IP
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#4dc2c7' }}>
                  Instituto Providência
                </div>
              </div>
            </div>

            <p style={{ fontSize: 13, color: '#6cdbdf', lineHeight: 1.7, maxWidth: 300 }}>
              Promovendo leitura, desenvolvimento socioemocional e imaginação para todas as turmas do Instituto Providência.
            </p>

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              {[
                { icon: 'menu_book', label: '+1.400 livros' },
                { icon: 'school',    label: '4 turmas' },
              ].map(s => (
                <div key={s.label} style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '4px 10px', borderRadius: 999,
                  background: 'rgba(255,255,255,0.07)',
                  fontSize: 11, fontWeight: 600, color: '#8bf4f8'
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>{s.icon}</span>
                  {s.label}
                </div>
              ))}
            </div>
          </div>

          {/* Turmas */}
          <div>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#fff', marginBottom: 14 }}>
              Turmas
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {TURMAS_LIST.map(t => (
                <button key={t.id} style={link}
                  onClick={() => { onSelectTurma(t.id); setActiveTab('estante'); scrollTop(); }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#6cdbdf'}>
                  {t.name}
                  <span style={{ color: '#2da9ae', marginLeft: 4 }}>({t.code})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Navegação */}
          <div>
            <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#fff', marginBottom: 14 }}>
              Navegação
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {([
                { label: 'Início',            tab: 'portal'  },
                { label: 'Estante de Livros', tab: 'estante' },
                { label: 'Desafio Literário', tab: 'desafio' },
              ] as const).map(n => (
                <button key={n.tab} style={link}
                  onClick={() => { setActiveTab(n.tab); scrollTop(); }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#6cdbdf'}>
                  {n.label}
                </button>
              ))}

              <button onClick={scrollTop}
                style={{ ...link, color: '#4dc2c7', fontWeight: 700, marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#8bf4f8'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#4dc2c7'}>
                Voltar ao topo
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_upward</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          marginTop: 36, paddingTop: 20,
          borderTop: '1px solid #0e9095',
          display: 'flex', flexWrap: 'wrap',
          alignItems: 'center', justifyContent: 'space-between', gap: 8
        }}>
          <span style={{ fontSize: 12, color: '#2da9ae' }}>
            © 2026 Instituto Providência • Todos os direitos reservados.
          </span>
          <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#2da9ae' }}>
            <span>Leitura Acessível</span>
            <span>•</span>
            <span>Espaço Educativo Seguro</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
