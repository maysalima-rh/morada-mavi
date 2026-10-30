// Menu lateral vertical, compartilhado por todas as páginas.
// Para adicionar um item, inclua uma linha em ITENS.
(function () {
  const ITENS = [
    { grupo: 'Financeiro', nome: 'Morada Mavi',     href: 'index.html',          icone: '⌂' },
    { grupo: 'Financeiro', nome: 'Meu financeiro',  href: 'meu-financeiro.html', icone: '▤' },
    { grupo: 'Financeiro', nome: 'Dashboard',       href: 'dashboard.html',      icone: '▦' }
  ];

  const css = `
  :root { --sb-w: 232px; }
  .sb { position:fixed; top:0; left:0; bottom:0; width:var(--sb-w); padding:24px 14px;
    background:var(--surface,#fff); border-right:1px solid var(--border,#e6e6e4); color:var(--text,#15161a);
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,Roboto,sans-serif;
    display:flex; flex-direction:column; gap:2px; z-index:40; overflow-y:auto; }
  .sb .marca { font-weight:700; font-size:1rem; padding:4px 10px 18px; letter-spacing:-.01em; }
  .sb .grupo { color:var(--muted,#72747a); font-size:.68rem; letter-spacing:.08em; text-transform:uppercase; padding:16px 10px 6px; }
  .sb a { display:flex; align-items:center; gap:10px; padding:10px; border-radius:10px; color:var(--text,#15161a);
    text-decoration:none; font-size:.92rem; font-weight:500; }
  .sb a:hover { background:var(--surface-2,#f0f0ef); }
  .sb a.ativo { background:var(--ink,#15161a); color:var(--ink-text,#fff); }
  .sb a .i { width:20px; text-align:center; }
  .sb .rodape { margin-top:auto; padding-top:16px; }
  .sb .rodape button { width:100%; background:none; border:1px solid var(--border,#e6e6e4); color:var(--muted,#72747a);
    border-radius:10px; padding:9px; font:inherit; font-size:.85rem; cursor:pointer; }
  body.com-menu { padding-left: calc(var(--sb-w) + 24px) !important; }
  .sb-toggle { display:none; }
  .sb-fundo { display:none; }
  @media (max-width: 820px) {
    body.com-menu { padding-left:16px !important; padding-top:68px !important; }
    .sb { transform:translateX(-100%); transition:transform .25s ease; box-shadow:0 0 40px rgba(0,0,0,.25); }
    .sb.aberto { transform:translateX(0); }
    .sb-toggle { display:grid; place-items:center; position:fixed; top:14px; left:14px; z-index:50;
      width:42px; height:42px; border-radius:50%; border:1px solid var(--border,#e6e6e4);
      background:var(--surface,#fff); color:var(--text,#15161a); font-size:1.1rem; cursor:pointer; }
    .sb-fundo.aberto { display:block; position:fixed; inset:0; background:rgba(0,0,0,.35); z-index:30; }
  }`;

  function init() {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    document.body.classList.add('com-menu');

    const atual = location.pathname.split('/').pop() || 'index.html';
    let html = '<div class="marca">Meu painel</div>';
    let grupoAtual = undefined;
    ITENS.forEach(it => {
      if (it.grupo !== grupoAtual) {
        grupoAtual = it.grupo;
        if (it.grupo) html += `<div class="grupo">${it.grupo}</div>`;
      }
      const ativo = it.href === atual ? ' class="ativo"' : '';
      html += `<a href="${it.href}"${ativo}><span class="i">${it.icone}</span>${it.nome}</a>`;
    });
    html += '<div class="rodape" id="sbRodape"></div>';

    const nav = document.createElement('nav');
    nav.className = 'sb';
    nav.id = 'sb';
    nav.innerHTML = html;
    document.body.appendChild(nav);

    const fundo = document.createElement('div');
    fundo.className = 'sb-fundo';
    document.body.appendChild(fundo);

    const botao = document.createElement('button');
    botao.className = 'sb-toggle';
    botao.setAttribute('aria-label', 'Abrir menu');
    botao.textContent = '☰';
    document.body.appendChild(botao);

    const alternar = (abrir) => {
      nav.classList.toggle('aberto', abrir);
      fundo.classList.toggle('aberto', abrir);
    };
    botao.onclick = () => alternar(!nav.classList.contains('aberto'));
    fundo.onclick = () => alternar(false);

    // botão Sair aparece só quando há sessão ativa
    if (window.sb) {
      window.sb.auth.getSession().then(({ data: { session } }) => {
        if (!session) return;
        const rod = document.getElementById('sbRodape');
        rod.innerHTML = '<button type="button">Sair</button>';
        rod.querySelector('button').onclick = async () => {
          await window.sb.auth.signOut();
          location.href = 'index.html';
        };
      });
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
