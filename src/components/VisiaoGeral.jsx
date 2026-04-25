import { useState, useEffect, useCallback } from "react";
import { Users, Building2, Briefcase, ClipboardList, FileCheck, ListChecks } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const fetchJson = async (endpoint) => {
  try {
    const res = await fetch(`${API_URL}/${endpoint}`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
};

const VisiaoGeral = () => {
  const anoAtual = String(new Date().getFullYear());
  const [filtroAnoEncaminhados, setFiltroAnoEncaminhados] = useState(anoAtual);
  const [filtroAnoControle, setFiltroAnoControle] = useState(anoAtual);
  const [filtroAnoFicha, setFiltroAnoFicha] = useState(anoAtual);

  const [dados, setDados] = useState({
    pessoas: [],
    empresas: [],
    funcoes: [],
    encaminhados: [],
    controleInterno: [],
    avaliacoes: [],
    fichas: [],
  });
  const [carregando, setCarregando] = useState(true);

  const carregarDados = useCallback(async () => {
    setCarregando(true);
    const [pessoas, empresas, funcoes, encaminhados, controleInterno, avaliacoes, fichas] =
      await Promise.all([
        fetchJson("pessoas"),
        fetchJson("empresas"),
        fetchJson("funcoes-cargos"),
        fetchJson("listas-encaminhados"),
        fetchJson("controle-interno-avaliacao-usuarios"),
        fetchJson("avaliacoes-experiencia"),
        fetchJson("ficha-acompanhamento"),
      ]);
    setDados({ pessoas, empresas, funcoes, encaminhados, controleInterno, avaliacoes, fichas });
    setCarregando(false);
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  // --- Cálculos ---

  const pessoasAtivas = dados.pessoas.filter((p) => p.status === "ativo");
  const alunosAtivos = pessoasAtivas.filter((p) => p.perfil === "aluno");
  const empresasAtivas = dados.empresas.filter((e) => e.status === "ativo");

  // Encaminhados filtrados por ano
  const encaminhadosNoAno = dados.encaminhados.filter((lista) =>
    (lista.usuarios || []).some((u) => {
      if (!u.dataEncaminhamento) return false;
      return String(new Date(u.dataEncaminhamento).getFullYear()) === String(filtroAnoEncaminhados);
    })
  );
  const todosUsuariosEncaminhados = encaminhadosNoAno.flatMap((l) =>
    (l.usuarios || []).filter((u) => {
      if (!u.dataEncaminhamento) return false;
      return String(new Date(u.dataEncaminhamento).getFullYear()) === String(filtroAnoEncaminhados);
    })
  );
  const encaminhadosAtivos = todosUsuariosEncaminhados.filter(
    (u) => (u.statusEncaminhamento || "ativo") === "ativo"
  );
  const encaminhadosInativos = todosUsuariosEncaminhados.filter(
    (u) => u.statusEncaminhamento === "inativo"
  );

  // Empresas mais frequentes nos encaminhados
  const contEmpresas = {};
  todosUsuariosEncaminhados.forEach((u) => {
    if (u.empresa) contEmpresas[u.empresa] = (contEmpresas[u.empresa] || 0) + 1;
  });
  const topEmpresas = Object.entries(contEmpresas)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Controle Interno filtrado por ano
  const controleNoAno = dados.controleInterno.filter((r) => {
    const campo = r.data_entrada || r.dt_1_avaliacao;
    if (!campo) return !filtroAnoControle;
    return String(new Date(campo).getFullYear()) === String(filtroAnoControle);
  });
  const controleComResultado = controleNoAno.filter((r) => r.resultado);

  // Avaliações de Experiência
  const avaliacoes1 = dados.avaliacoes.filter((a) => a.tipo?.includes("1") || a.tipo?.includes("exp1") || a.tipo === "avaliacao-exp1");
  const avaliacoes2 = dados.avaliacoes.filter((a) => a.tipo?.includes("2") || a.tipo?.includes("exp2") || a.tipo === "avaliacao-exp2");

  // Fichas de Acompanhamento filtradas por ano
  const fichasNoAno = dados.fichas.filter((f) => {
    const campo = f.data_visita || f.data_admissao;
    if (!campo) return !filtroAnoFicha;
    return String(new Date(campo).getFullYear()) === String(filtroAnoFicha);
  });

  if (carregando) {
    return (
      <div className="visao-geral-container">
        <div className="loading-message">Carregando visão geral...</div>
      </div>
    );
  }

  return (
    <div className="visao-geral-container">
      <div className="cadastro-header">
        <h1>Visão Geral</h1>
      </div>

      {/* ── Cadastros ── */}
      <section className="vg-section">
        <h2 className="vg-section-title">Cadastros</h2>
        <div className="vg-cards-row">
          <div className="vg-card vg-card-blue">
            <div className="vg-card-icon"><Users size={28} /></div>
            <div className="vg-card-info">
              <span className="vg-card-number">{alunosAtivos.length}</span>
              <span className="vg-card-label">Alunos ativos</span>
            </div>
            <div className="vg-card-sub">{dados.pessoas.length} pessoas cadastradas</div>
          </div>
          <div className="vg-card vg-card-green">
            <div className="vg-card-icon"><Building2 size={28} /></div>
            <div className="vg-card-info">
              <span className="vg-card-number">{empresasAtivas.length}</span>
              <span className="vg-card-label">Empresas ativas</span>
            </div>
            <div className="vg-card-sub">{dados.empresas.length} empresas cadastradas</div>
          </div>
          <div className="vg-card vg-card-orange">
            <div className="vg-card-icon"><Briefcase size={28} /></div>
            <div className="vg-card-info">
              <span className="vg-card-number">{dados.funcoes.length}</span>
              <span className="vg-card-label">Funções/Cargos</span>
            </div>
            <div className="vg-card-sub">cadastros ativos no sistema</div>
          </div>
        </div>
      </section>

      {/* ── Lista de Encaminhados ── */}
      <section className="vg-section">
        <div className="vg-section-header">
          <h2 className="vg-section-title">Lista de Usuários Encaminhados</h2>
          <div className="vg-filter">
            <label>Ano:</label>
            <input
              type="number"
              value={filtroAnoEncaminhados}
              onChange={(e) => setFiltroAnoEncaminhados(e.target.value)}
              className="vg-ano-input"
              min="2020"
              max="2030"
            />
          </div>
        </div>
        <div className="vg-cards-row">
          <div className="vg-card vg-card-blue">
            <div className="vg-card-icon"><Users size={28} /></div>
            <div className="vg-card-info">
              <span className="vg-card-number">{todosUsuariosEncaminhados.length}</span>
              <span className="vg-card-label">Encaminhados em {filtroAnoEncaminhados}</span>
            </div>
            <div className="vg-card-sub">{encaminhadosNoAno.length} lista(s) no período</div>
          </div>
          <div className="vg-card vg-card-green">
            <div className="vg-card-icon"><FileCheck size={28} /></div>
            <div className="vg-card-info">
              <span className="vg-card-number">{encaminhadosAtivos.length}</span>
              <span className="vg-card-label">Status ativo</span>
            </div>
            <div className="vg-card-sub">atualmente na empresa</div>
          </div>
          <div className="vg-card vg-card-red">
            <div className="vg-card-icon"><FileCheck size={28} /></div>
            <div className="vg-card-info">
              <span className="vg-card-number">{encaminhadosInativos.length}</span>
              <span className="vg-card-label">Status inativo</span>
            </div>
            <div className="vg-card-sub">desligados no período</div>
          </div>
        </div>
        {topEmpresas.length > 0 && (
          <div className="vg-ranking">
            <h3 className="vg-ranking-title">Empresas com mais encaminhamentos</h3>
            <div className="vg-ranking-list">
              {topEmpresas.map(([empresa, total], idx) => (
                <div key={empresa} className="vg-ranking-item">
                  <span className="vg-ranking-pos">{idx + 1}º</span>
                  <span className="vg-ranking-name">{empresa}</span>
                  <span className="vg-ranking-count">{total} aluno{total > 1 ? "s" : ""}</span>
                  <div className="vg-ranking-bar">
                    <div
                      className="vg-ranking-bar-fill"
                      style={{ width: `${(total / (topEmpresas[0][1] || 1)) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── Controle Interno ── */}
      <section className="vg-section">
        <div className="vg-section-header">
          <h2 className="vg-section-title">Controle Interno</h2>
          <div className="vg-filter">
            <label>Ano:</label>
            <input
              type="number"
              value={filtroAnoControle}
              onChange={(e) => setFiltroAnoControle(e.target.value)}
              className="vg-ano-input"
              min="2020"
              max="2030"
            />
          </div>
        </div>
        <div className="vg-cards-row">
          <div className="vg-card vg-card-blue">
            <div className="vg-card-icon"><ClipboardList size={28} /></div>
            <div className="vg-card-info">
              <span className="vg-card-number">{controleNoAno.length}</span>
              <span className="vg-card-label">Registros em {filtroAnoControle}</span>
            </div>
            <div className="vg-card-sub">{dados.controleInterno.length} total no sistema</div>
          </div>
          <div className="vg-card vg-card-green">
            <div className="vg-card-icon"><FileCheck size={28} /></div>
            <div className="vg-card-info">
              <span className="vg-card-number">{controleComResultado.length}</span>
              <span className="vg-card-label">Com resultado</span>
            </div>
            <div className="vg-card-sub">avaliações concluídas no período</div>
          </div>
          <div className="vg-card vg-card-orange">
            <div className="vg-card-icon"><ClipboardList size={28} /></div>
            <div className="vg-card-info">
              <span className="vg-card-number">{controleNoAno.length - controleComResultado.length}</span>
              <span className="vg-card-label">Pendentes</span>
            </div>
            <div className="vg-card-sub">sem resultado registrado</div>
          </div>
        </div>
      </section>

      {/* ── Avaliações de Experiência ── */}
      <section className="vg-section">
        <h2 className="vg-section-title">Avaliações de Experiência</h2>
        <div className="vg-cards-row">
          <div className="vg-card vg-card-blue">
            <div className="vg-card-icon"><ListChecks size={28} /></div>
            <div className="vg-card-info">
              <span className="vg-card-number">{dados.avaliacoes.length}</span>
              <span className="vg-card-label">Total de avaliações</span>
            </div>
            <div className="vg-card-sub">registradas no sistema</div>
          </div>
          <div className="vg-card vg-card-green">
            <div className="vg-card-icon"><ListChecks size={28} /></div>
            <div className="vg-card-info">
              <span className="vg-card-number">{avaliacoes1.length}</span>
              <span className="vg-card-label">1ª Avaliação</span>
            </div>
            <div className="vg-card-sub">fichas de 1ª avaliação</div>
          </div>
          <div className="vg-card vg-card-orange">
            <div className="vg-card-icon"><ListChecks size={28} /></div>
            <div className="vg-card-info">
              <span className="vg-card-number">{avaliacoes2.length}</span>
              <span className="vg-card-label">2ª Avaliação</span>
            </div>
            <div className="vg-card-sub">fichas de 2ª avaliação</div>
          </div>
        </div>
      </section>

      {/* ── Ficha de Acompanhamento ── */}
      <section className="vg-section">
        <div className="vg-section-header">
          <h2 className="vg-section-title">Ficha de Acompanhamento</h2>
          <div className="vg-filter">
            <label>Ano:</label>
            <input
              type="number"
              value={filtroAnoFicha}
              onChange={(e) => setFiltroAnoFicha(e.target.value)}
              className="vg-ano-input"
              min="2020"
              max="2030"
            />
          </div>
        </div>
        <div className="vg-cards-row">
          <div className="vg-card vg-card-blue">
            <div className="vg-card-icon"><FileCheck size={28} /></div>
            <div className="vg-card-info">
              <span className="vg-card-number">{fichasNoAno.length}</span>
              <span className="vg-card-label">Fichas em {filtroAnoFicha}</span>
            </div>
            <div className="vg-card-sub">{dados.fichas.length} total no sistema</div>
          </div>
          <div className="vg-card vg-card-green">
            <div className="vg-card-icon"><FileCheck size={28} /></div>
            <div className="vg-card-info">
              <span className="vg-card-number">
                {fichasNoAno.filter((f) => f.parecer_geral).length}
              </span>
              <span className="vg-card-label">Com parecer</span>
            </div>
            <div className="vg-card-sub">fichas com parecer preenchido</div>
          </div>
          <div className="vg-card vg-card-orange">
            <div className="vg-card-icon"><FileCheck size={28} /></div>
            <div className="vg-card-info">
              <span className="vg-card-number">
                {fichasNoAno.filter((f) => !f.parecer_geral).length}
              </span>
              <span className="vg-card-label">Sem parecer</span>
            </div>
            <div className="vg-card-sub">fichas sem parecer registrado</div>
          </div>
        </div>
      </section>

      <div className="vg-atualizado">
        <button className="btn-save" onClick={carregarDados} style={{ padding: "8px 20px", fontSize: "0.875rem" }}>
          Atualizar dados
        </button>
      </div>
    </div>
  );
};

export default VisiaoGeral;
