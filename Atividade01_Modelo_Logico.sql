-- =============================================================================
-- MODELO LÓGICO – SISTEMA DE AVALIAÇÃO E ACOMPANHAMENTO
-- Controle de pessoas, empresas, avaliações e encaminhamentos
-- =============================================================================

-- Ordem de criação: tabelas independentes primeiro, depois as que possuem FK.

-- -----------------------------------------------------------------------------
-- TABELA 1: PESSOAS
-- Cadastro de pessoas (alunos, professores) com dados de responsável e saúde.
-- Perfil: aluno | professor | Status: ativo | inativo
-- -----------------------------------------------------------------------------
CREATE TABLE PESSOAS (
    id                      VARCHAR(20)     PRIMARY KEY,
    nome                    VARCHAR(255)    NOT NULL,
    email                   VARCHAR(255)    NOT NULL,
    telefone                VARCHAR(20),
    cpf                     VARCHAR(14),
    perfil                  VARCHAR(20),                -- aluno, professor (NULL = Selecione)
    data_ingresso           DATE,
    data_nascimento         DATE,
    nome_responsavel        VARCHAR(255),
    telefone_responsavel    VARCHAR(20),
    usa_medicamento         VARCHAR(10),                -- sim, não (ou NULL = Selecione)
    info_medicamentos       TEXT,
    status                  VARCHAR(20)     NOT NULL,   -- ativo, inativo
    CONSTRAINT chk_pessoas_perfil       CHECK (perfil IS NULL OR perfil IN ('aluno', 'professor')),
    CONSTRAINT chk_pessoas_status       CHECK (status IN ('ativo', 'inativo')),
    CONSTRAINT chk_pessoas_medicamento  CHECK (usa_medicamento IS NULL OR usa_medicamento IN ('sim', 'não'))
);

-- -----------------------------------------------------------------------------
-- TABELA 2: EMPRESAS
-- Empresas parceiras (razão social, CNPJ, contato RH).
-- Status: ativo | inativo
-- -----------------------------------------------------------------------------
CREATE TABLE EMPRESAS (
    id                      VARCHAR(20)     PRIMARY KEY,
    nome_fantasia           VARCHAR(255),
    razao_social            VARCHAR(255)    NOT NULL,
    cnpj                    VARCHAR(18)     NOT NULL,
    endereco                VARCHAR(500),
    telefone                VARCHAR(20),
    nome_responsavel_rh     VARCHAR(255),
    email_responsavel_rh    VARCHAR(255),
    status                  VARCHAR(20)     NOT NULL,   -- ativo, inativo
    CONSTRAINT chk_empresas_status CHECK (status IN ('ativo', 'inativo'))
);

-- -----------------------------------------------------------------------------
-- TABELA 3: USUARIOS
-- Usuários do sistema (login, senha, recuperação, nível de acesso).
-- -----------------------------------------------------------------------------
CREATE TABLE USUARIOS (
    id                  VARCHAR(20)     PRIMARY KEY,
    nome                VARCHAR(255)    NOT NULL,
    email               VARCHAR(255)    NOT NULL,
    senha_hash          VARCHAR(255)    NOT NULL,
    token_recuperacao   VARCHAR(255),
    validade_token      TIMESTAMP,
    nivel_acesso        VARCHAR(50)
);

-- -----------------------------------------------------------------------------
-- TABELA 4: FUNCOES_CARGOS
-- Funções/cargos (título, departamento, nível, descrição).
-- Status: ativo | inativo
-- -----------------------------------------------------------------------------
CREATE TABLE FUNCOES_CARGOS (
    id              VARCHAR(20)     PRIMARY KEY,
    titulo_funcao   VARCHAR(150)    NOT NULL,
    departamento    VARCHAR(100),
    nivel           VARCHAR(50),
    descricao       TEXT,
    status          VARCHAR(20)     NOT NULL,   -- ativo, inativo
    CONSTRAINT chk_funcoes_status CHECK (status IN ('ativo', 'inativo'))
);

-- -----------------------------------------------------------------------------
-- TABELA 5: ITENS_AVALIACAO
-- Itens a serem avaliados (questionários / critérios).
-- Status: ativo | inativo
-- -----------------------------------------------------------------------------
CREATE TABLE ITENS_AVALIACAO (
    id      VARCHAR(20)     PRIMARY KEY,
    itens   VARCHAR(255)    NOT NULL,
    status  VARCHAR(20)     NOT NULL,   -- ativo, inativo
    CONSTRAINT chk_itens_status CHECK (status IN ('ativo', 'inativo'))
);

-- -----------------------------------------------------------------------------
-- TABELA 6: FICHA_AVALIACAO_ALUNO_PROFESSOR
-- Ficha de avaliação aluno x professor (tipo, datas, vínculos com PESSOAS).
-- -----------------------------------------------------------------------------
CREATE TABLE FICHA_AVALIACAO_ALUNO_PROFESSOR (
    id                      VARCHAR(20)     PRIMARY KEY,
    tipo_avaliacao          VARCHAR(100)    NOT NULL,
    id_pessoa_aluno         VARCHAR(20)     NOT NULL,
    data_entrada            DATE,
    data_avaliacao          DATE            NOT NULL,
    id_pessoa_professor     VARCHAR(20)     NOT NULL,
    CONSTRAINT fk_ficha_aval_aluno   FOREIGN KEY (id_pessoa_aluno)   REFERENCES PESSOAS(id),
    CONSTRAINT fk_ficha_aval_prof    FOREIGN KEY (id_pessoa_professor) REFERENCES PESSOAS(id)
);

-- -----------------------------------------------------------------------------
-- TABELA 7: FICHA_AVALIACAO_QUESTIONARIO
-- Respostas do questionário vinculado à ficha aluno/professor e aos itens.
-- -----------------------------------------------------------------------------
CREATE TABLE FICHA_AVALIACAO_QUESTIONARIO (
    id                              VARCHAR(20)     PRIMARY KEY,
    id_item                         VARCHAR(20)     NOT NULL,
    id_ficha_avaliacao_aluno_prof   VARCHAR(20)     NOT NULL,
    resultado                       VARCHAR(100),
    campo_pergunta1                 TEXT,
    campo_pergunta2                 TEXT,
    CONSTRAINT fk_questionario_item     FOREIGN KEY (id_item) REFERENCES ITENS_AVALIACAO(id),
    CONSTRAINT fk_questionario_ficha    FOREIGN KEY (id_ficha_avaliacao_aluno_prof) REFERENCES FICHA_AVALIACAO_ALUNO_PROFESSOR(id)
);

-- -----------------------------------------------------------------------------
-- TABELA 8: FICHA_ACOMPANHAMENTO
-- Acompanhamento do aluno (visita, empresa, contato RH, parecer).
-- Dados de contato RH podem ser obtidos via id_empresa (EMPRESAS).
-- -----------------------------------------------------------------------------
CREATE TABLE FICHA_ACOMPANHAMENTO (
    id                  VARCHAR(20)     PRIMARY KEY,
    id_pessoa_aluno     VARCHAR(20)     NOT NULL,
    data_admissao       DATE,
    data_visita         DATE            NOT NULL,
    id_empresa          VARCHAR(20)     NOT NULL,
    parecer_geral       TEXT,
    CONSTRAINT fk_acomp_pessoa   FOREIGN KEY (id_pessoa_aluno) REFERENCES PESSOAS(id),
    CONSTRAINT fk_acomp_empresa  FOREIGN KEY (id_empresa)       REFERENCES EMPRESAS(id)
);

-- -----------------------------------------------------------------------------
-- TABELA 9: CONTROLE_INTERNO_AVALIACAO_USUARIOS
-- Controle interno – avaliação de usuários (datas de avaliação e entrevistas).
-- -----------------------------------------------------------------------------
CREATE TABLE CONTROLE_INTERNO_AVALIACAO_USUARIOS (
    id                          VARCHAR(20)     PRIMARY KEY,
    id_pessoa_aluno             VARCHAR(20)     NOT NULL,
    data_entrada                DATE,
    dt_1_avaliacao              DATE,
    dt_2_avaliacao              DATE,
    dt_1_entrevista_pais        DATE,
    dt_2_entrevista_pais        DATE,
    resultado                   VARCHAR(255),
    CONSTRAINT fk_controle_pessoa FOREIGN KEY (id_pessoa_aluno) REFERENCES PESSOAS(id)
);

-- -----------------------------------------------------------------------------
-- TABELA 10: LISTA_ENCAMINHADOS
-- Lista de alunos encaminhados (empresa, função, contato RH, previsão desligamento).
-- E-mail do contato RH pode ser obtido via id_empresa (EMPRESAS).
-- -----------------------------------------------------------------------------
CREATE TABLE LISTA_ENCAMINHADOS (
    id                              VARCHAR(20)     PRIMARY KEY,
    id_pessoa_aluno                 VARCHAR(20)     NOT NULL,
    data_entrada                    DATE,
    id_empresa                      VARCHAR(20)     NOT NULL,
    id_funcao                       VARCHAR(20),
    provavel_data_desligamento_ieedf DATE,
    CONSTRAINT fk_encaminhados_pessoa   FOREIGN KEY (id_pessoa_aluno) REFERENCES PESSOAS(id),
    CONSTRAINT fk_encaminhados_empresa  FOREIGN KEY (id_empresa)     REFERENCES EMPRESAS(id),
    CONSTRAINT fk_encaminhados_funcao   FOREIGN KEY (id_funcao)      REFERENCES FUNCOES_CARGOS(id)
);

-- =============================================================================
-- RESUMO DO MODELO LÓGICO
-- 1. PESSOAS                         – alunos/professores, responsável, medicamento, status
-- 2. EMPRESAS                        – nome fantasia, razão social, CNPJ, RH, status
-- 3. USUARIOS                        – login, senha_hash, token recuperação, nível
-- 4. FUNCOES_CARGOS                  – título, departamento, nível, status
-- 5. ITENS_AVALIACAO                 – itens a avaliar, status
-- 6. FICHA_AVALIACAO_ALUNO_PROFESSOR – tipo, aluno, professor, datas (FK: PESSOAS)
-- 7. FICHA_AVALIACAO_QUESTIONARIO    – itens, ficha, resultado, perguntas (FK: ITENS, FICHA)
-- 8. FICHA_ACOMPANHAMENTO            – aluno, visita, empresa, parecer (FK: PESSOAS, EMPRESAS)
-- 9. CONTROLE_INTERNO_AVALIACAO_USUARIOS – aluno, datas avaliação/entrevista, resultado (FK: PESSOAS)
-- 10. LISTA_ENCAMINHADOS             – aluno, empresa, função, desligamento (FK: PESSOAS, EMPRESAS, FUNCOES_CARGOS)
-- =============================================================================
