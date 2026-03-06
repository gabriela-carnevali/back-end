const express = require("express");
const pool = require("./config/database");

const app = express();

app.use(express.json());

const queryAsync = (sql, values = []) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, values, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};


// MÉTODOS DE FILME


app.get("/", (req, res) => {
  res.send("A API cinema está funcionando");
});

app.get("/filme", async (req, res) => {
  try {
    const filmes = await queryAsync("SELECT * FROM filme");
    res.json({
      sucesso: true,
      dados: filmes,
      total: filmes.length,
    });
  } catch (erro) {
    console.error("Erro ao listar filmes: ", erro);
    res.status(500).json({
      //Erro de servidor
      sucesso: false,
      mensagem: "Erro ao listar filmes",
      erro: erro.message,
    });
  }
});

app.get("/filme/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID de filme inválido",
      });
    }

    const filme = await queryAsync("SELECT * FROM filme WHERE id = ?", [id]);

    if (filme.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Filme não encontrado",
      });
    }

    res.json({
      sucesso: true,
      dados: filme[0],
    });
  } catch (erro) {
    console.error("Erro ao listar filmes:", erro);
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao listar filmes",
      erro: erro.message,
    });
  }
});

app.post("/filme", async (req, res) => {
  try {
    const { titulo, genero, duracao, classificacao, data_lancamento } =
      req.body;

    if (!titulo || !genero || !duracao) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Título, gênero e duração são obrigatórios",
      });
    }

    if (typeof duracao !== "number" || duracao <= 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Duração deve ser um número positivo",
      });
    }

    const novoFilme = {
      titulo: titulo.trim(),
      genero: genero.trim(),
      duracao: duracao,
      classificacao: classificacao || null,
      data_lancamento: data_lancamento || null,
    };

    const resultado = await queryAsync("INSERT INTO filme SET ?", [novoFilme]);

    res.status(201).json({
      sucesso: true,
      mensagem: "Filme criado com sucesso",
      id: resultado.insertId,
    });
  } catch (erro) {
    console.error("Erro ao criar filmes: ", erro);
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao criar filmes",
      message: erro.message,
    });
  }
});

app.put("/filme/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, genero, duracao, classificacao, data_lancamento } =
      req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID de filme inválido",
      });
    }

    const filmeExiste = await queryAsync("SELECT * FROM filme WHERE id = ?", [
      id,
    ]);

    if (filmeExiste.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Filme não encontrado",
      });
    }

    const filmeAtualizado = {};

    if (titulo !== undefined) filmeAtualizado.titulo = titulo.trim();
    if (genero !== undefined) filmeAtualizado.genero = genero.trim();
    if (duracao !== undefined) {
      if (typeof duracao !== "number" || duracao <= 0)
        return res.status(400).json({
          sucesso: false,
          mensagem: "Duração deve ser um número positivo",
        });
      filmeAtualizado.duracao = duracao;
    }

    if (classificacao !== undefined)
      filmeAtualizado.classificacao = classificacao.trim();
    if (data_lancamento !== undefined)
      filmeAtualizado.data_lancamento = data_lancamento;

    if (Object.keys(filmeAtualizado).length === 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Não há nenhuma informação para ser atualizada",
      });
    }

    await queryAsync("UPDATE filme SET ? WHERE id = ?", [filmeAtualizado, id]);
    res.json({
      sucesso: true,
      mensagem: "Filme atualizado!",
    });
  } catch (erro) {
    console.error("Erro ao atulizar filme: ", erro);
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao atualizar filme",
      message: erro.message,
    });
  }
});

app.delete("/filme/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID de filme inválido",
      });
    }

    const filmeExiste = await queryAsync("SELECT * FROM filme WHERE id = ?", [
      id,
    ]);

    if (filmeExiste.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Filme não encontrado",
      });
    }

    await queryAsync("DELETE FROM filme WHERE id = ?", [id]);

    res.json({
      sucesso: true,
      mensagem: "Filme deletado com sucesso!",
    });
  } catch (erro) {
    console.error("Erro ao atulizar filme: ", erro);
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao atualizar filme",
      message: erro.message,
    });
  }
});


// MÉTODOS DE SALA


app.get("/sala", async (req, res) => {
  try {
    const salas = await queryAsync("SELECT * FROM sala");
    res.json({
      sucesso: true,
      dados: salas,
      total: salas.length,
    });
  } catch (erro) {
    console.error("Erro ao listar salas: ", erro);
    res.status(500).json({
      //Erro de servidor
      sucesso: false,
      mensagem: "Erro ao listar salas",
      erro: erro.message,
    });
  }
});

app.get("/sala/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID de sala inválido",
      });
    }

    const sala = await queryAsync("SELECT * FROM sala WHERE id = ?", [id]);

    if (sala.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Sala não encontrada",
      });
    }

    res.json({
      sucesso: true,
      dados: sala[0],
    });
  } catch (erro) {
    console.error("Erro ao listar salas:", erro);
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao listar salas",
      erro: erro.message,
    });
  }
});

app.post("/sala", async (req, res) => {
  try {
    const { nome, capacidade } = req.body;

    if (!capacidade || !nome) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Nome e capacidade da sala são obrigatórios",
      });
    }

    if (typeof capacidade !== "number" || capacidade <= 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Capacidade deve ser um número positivo",
      });
    }

    const novaSala = {
      nome: nome.trim(),
      capacidade: capacidade,
    };

    const resultado = await queryAsync("INSERT INTO sala SET ?", [novaSala]);

    res.status(201).json({
      sucesso: true,
      mensagem: "Sala criada com sucesso",
      id: resultado.insertId,
    });
  } catch (erro) {
    console.error("Erro ao criar salas: ", erro);
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao criar salas",
      message: erro.message,
    });
  }
});

app.put("/sala/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, capacidade } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID de sala inválido",
      });
    }

    const salaExiste = await queryAsync("SELECT * FROM sala WHERE id = ?", [
      id,
    ]);

    if (salaExiste.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Sala não encontrada",
      });
    }

    const salaAtualizada = {};

    if (nome !== undefined) salaAtualizada.nome = nome.trim();
    if (capacidade !== undefined) {
      if (typeof capacidade !== "number" || capacidade <= 0)
        return res.status(400).json({
          sucesso: false,
          mensagem: "Capacidade deve ser um número positivo",
        });
      salaAtualizada.capacidade = capacidade;
    }

    if (Object.keys(salaAtualizada).length === 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Não há nenhuma informação para ser atualizada",
      });
    }

    await queryAsync("UPDATE sala SET ? WHERE id = ?", [salaAtualizada, id]);
    res.json({
      sucesso: true,
      mensagem: "Sala atualizada!",
    });
  } catch (erro) {
    console.error("Erro ao atulizar sala: ", erro);
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao atualizar sala",
      message: erro.message,
    });
  }
});

app.delete("/sala/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID de sala inválido",
      });
    }

    const salaExiste = await queryAsync("SELECT * FROM sala WHERE id = ?", [
      id,
    ]);

    if (salaExiste.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Sala não encontrada",
      });
    }

    await queryAsync("DELETE FROM sala WHERE id = ?", [id]);

    res.json({
      sucesso: true,
      mensagem: "Sala deletada com sucesso!",
    });
  } catch (erro) {
    console.error("Erro ao atulizar sala: ", erro);
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao atualizar sala",
      message: erro.message,
    });
  }
});

module.exports = app;
