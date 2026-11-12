const express = require('express');
const cors = require('cors');
const pool = require('./banco');

const app = express();

app.use(cors());
app.use(express.json());

const COLUNAS = 'id, nome, email, nascimento, telefone';

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function nascimentoValido(nascimento) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(nascimento)) return false;

  const [ano, mes, dia] = nascimento.split('-').map(Number);
  const data = new Date(ano, mes - 1, dia);
  // O JavaScript "corrige" datas inexistentes (31/02 vira 03/03); comparar de volta as rejeita
  if (data.getFullYear() !== ano || data.getMonth() !== mes - 1 || data.getDate() !== dia) {
    return false;
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return data <= hoje;
}

// Devolve { status, erro } se houver problema, ou null se os dados estiverem corretos
function validarDados(corpo) {
  const { nome, email, nascimento } = corpo ?? {};

  if (!nome || !email || !nascimento) {
    return { status: 400, erro: 'Nome, e-mail e nascimento são obrigatórios' };
  }
  if (!REGEX_EMAIL.test(email)) {
    return { status: 400, erro: 'Formato de e-mail inválido' };
  }
  if (!nascimentoValido(nascimento)) {
    return { status: 400, erro: 'Data de nascimento inválida ou no futuro' };
  }
  return null;
}

function idValido(id) {
  return Number.isInteger(id) && id > 0 && id <= 2147483647;
}

function tratarErro(res, erro) {
  console.error(erro);

  if (erro.code === '23505') {
    // violação da restrição UNIQUE (e-mail repetido)
    return res.status(409).json({ erro: 'Já existe um paciente com este e-mail' });
  }

  res.status(500).json({ erro: 'Erro interno do servidor' });
}

// READ (lista) — GET /pacientes  (aceita ?nome=ana)
app.get('/pacientes', async (req, res) => {
  const { nome } = req.query;

  try {
    if (nome) {
      // Exercício 3: ILIKE é um LIKE que ignora maiúsculas/minúsculas.
      // O % significa "qualquer sequência de caracteres": '%ana%' encontra "Ana", "Mariana"...
      // Escapamos \, % e _ digitados pelo usuário para valerem como texto comum.
      const termo = String(nome).trim().replace(/[\\%_]/g, '\\$&');
      const resultado = await pool.query(
        `SELECT ${COLUNAS} FROM pacientes WHERE nome ILIKE $1 ORDER BY id`,
        [`%${termo}%`]
      );
      return res.json(resultado.rows);
    }

    const resultado = await pool.query(`SELECT ${COLUNAS} FROM pacientes ORDER BY id`);
    res.json(resultado.rows);
  } catch (erro) {
    tratarErro(res, erro);
  }
});

// READ (total) — GET /pacientes/total
// Exercício 2: precisa vir ANTES de '/pacientes/:id', senão o Express trata "total" como um id.
app.get('/pacientes/total', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT COUNT(*)::int AS total FROM pacientes');
    res.json({ total: resultado.rows[0].total });
  } catch (erro) {
    tratarErro(res, erro);
  }
});

// READ (um) — GET /pacientes/:id
app.get('/pacientes/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!idValido(id)) {
    return res.status(400).json({ erro: 'ID inválido' });
  }

  try {
    const resultado = await pool.query(
      `SELECT ${COLUNAS} FROM pacientes WHERE id = $1`,
      [id]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({ erro: 'Paciente não encontrado' });
    }

    res.json(resultado.rows[0]);
  } catch (erro) {
    tratarErro(res, erro);
  }
});

// CREATE — POST /pacientes
app.post('/pacientes', async (req, res) => {
  const problema = validarDados(req.body);
  if (problema) {
    return res.status(problema.status).json({ erro: problema.erro });
  }

  // telefone é opcional (Exercício 4): o frontend atual não envia esse campo
  const { nome, email, nascimento, telefone = null } = req.body;

  try {
    const resultado = await pool.query(
      `INSERT INTO pacientes (nome, email, nascimento, telefone)
       VALUES ($1, $2, $3, $4)
       RETURNING ${COLUNAS}`,
      [nome, email, nascimento, telefone]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    tratarErro(res, erro);
  }
});

// UPDATE (completo) — PUT /pacientes/:id
app.put('/pacientes/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!idValido(id)) {
    return res.status(400).json({ erro: 'ID inválido' });
  }

  const problema = validarDados(req.body);
  if (problema) {
    return res.status(problema.status).json({ erro: problema.erro });
  }

  const { nome, email, nascimento, telefone = null } = req.body;

  try {
    // COALESCE($4, telefone): se o cliente não enviar telefone, mantém o que já estava gravado
    const resultado = await pool.query(
      `UPDATE pacientes
          SET nome = $1, email = $2, nascimento = $3, telefone = COALESCE($4, telefone)
        WHERE id = $5
        RETURNING ${COLUNAS}`,
      [nome, email, nascimento, telefone, id]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({ erro: 'Paciente não encontrado' });
    }

    res.json(resultado.rows[0]);
  } catch (erro) {
    tratarErro(res, erro);
  }
});

// UPDATE (parcial) — PATCH /pacientes/:id
app.patch('/pacientes/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!idValido(id)) {
    return res.status(400).json({ erro: 'ID inválido' });
  }

  const campos = req.body ?? {};
  const enviados = ['nome', 'email', 'nascimento', 'telefone'].filter(
    (c) => campos[c] !== undefined
  );
  if (enviados.length === 0) {
    return res
      .status(400)
      .json({ erro: 'Envie ao menos um campo: nome, email, nascimento ou telefone' });
  }

  try {
    const atual = await pool.query(`SELECT ${COLUNAS} FROM pacientes WHERE id = $1`, [id]);
    if (atual.rowCount === 0) {
      return res.status(404).json({ erro: 'Paciente não encontrado' });
    }

    // Valida o resultado final (campos novos + os que já existiam)
    const final = { ...atual.rows[0] };
    enviados.forEach((c) => {
      final[c] = campos[c];
    });

    const problema = validarDados(final);
    if (problema) {
      return res.status(problema.status).json({ erro: problema.erro });
    }

    const resultado = await pool.query(
      `UPDATE pacientes
          SET nome = $1, email = $2, nascimento = $3, telefone = $4
        WHERE id = $5
        RETURNING ${COLUNAS}`,
      [final.nome, final.email, final.nascimento, final.telefone, id]
    );

    res.json(resultado.rows[0]);
  } catch (erro) {
    tratarErro(res, erro);
  }
});

// DELETE — DELETE /pacientes/:id
app.delete('/pacientes/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (!idValido(id)) {
    return res.status(400).json({ erro: 'ID inválido' });
  }

  try {
    const resultado = await pool.query('DELETE FROM pacientes WHERE id = $1', [id]);

    if (resultado.rowCount === 0) {
      return res.status(404).json({ erro: 'Paciente não encontrado' });
    }

    res.status(204).send();
  } catch (erro) {
    tratarErro(res, erro);
  }
});

const PORTA = process.env.PORT || 3000;

app.listen(PORTA, () => {
  console.log(`Servidor rodando na porta ${PORTA}`);
});
