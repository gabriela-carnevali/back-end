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
    console.error("Erro ao encontrar sala:", erro);
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao encontrar sala",
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


// MÉTODOS DE SESSÃO

app.get("/sessao", async (req, res) => {
  try {
    const sessoes = await queryAsync("SELECT * FROM sessao");
    res.json({
      sucesso: true,
      dados: sessoes,
      total: sessoes.length,
    });
  } catch (erro) {
    console.error("Erro ao listar sessões: ", erro);
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao listar filmes",
      erro: erro.message,
    });
  }
});

app.get("/sessao/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID de sessão inválido",
      });
    }

    const sessao = await queryAsync("SELECT * FROM sessao WHERE id = ?", [id]);

    if (sessao.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Sessão não encontrada",
      });
    }

    res.json({
      sucesso: true,
      dados: sessao[0],
    });
  } catch (erro) {
    console.error("Erro ao encontrar sessão");
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao encontrar sessão",
      erro: erro.message,
    });
  }
});

app.post("/sessao", async (req, res) => {
  try {
    const { sala_id, filme_id, data_hora, preco } = req.body;

    if (!filme_id || !sala_id || !data_hora || !preco) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID de sala e filme, data, hora e preço são obrigatórios",
      });
    }
    if (preco <= 0 || isNaN(preco)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "O preço da sessão precisa ser um número positivo",
      });
    }

    const salaExiste = await queryAsync("SELECT id FROM sala WHERE id = ?", [
      sala_id,
    ]);
    if (salaExiste.length === 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID de sala não existe",
      });
    }

    const filmeExiste = await queryAsync("SELECT id FROM filme WHERE id = ?", [
      filme_id,
    ]);
    if (filmeExiste.length === 0)
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID de filme não existe",
      });

    const novaSessao = {
      sala_id: sala_id,
      filme_id: filme_id,
      data_hora: data_hora,
      preco: preco,
    };

    const resultado = await queryAsync("INSERT INTO sessao SET ?", [
      novaSessao,
    ]);

    res.status(201).json({
      sucesso: true,
      mensagem: "Sessão cadastrada com sucesso",
      id: resultado.insertId,
    });
  } catch (erro) {
    console.error("Erro ao criar sessão", erro);
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao criar sessão",
      erro: erro.message,
    });
  }
});

app.put("/sessao/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { sala_id, filme_id, data_hora, preco } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID de sessão inválido",
      });
    }

    const sessaoExiste = await queryAsync("SELECT * FROM sessao WHERE id = ?", [
      id,
    ]);

    if (sessaoExiste.length === 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Sessão não encontrada",
      });
    }

    const sessaoAtulizada = {};

    if (!isNaN(sala_id) || sala_id !== undefined)
      sessaoAtulizada.sala_id = sala_id;
    if (!isNaN(filme_id) || filme_id !== undefined)
      sessaoAtulizada.filme_id = filme_id;
    if (data_hora !== undefined) sessaoAtulizada.data_hora = data_hora;
    if (preco !== undefined) {
      if (preco <= 0 || isNaN(preco))
        return res.status(404).json({
          sucesso: false,
          mensagem: "Preço deve ser um número positivo",
        });
      sessaoAtulizada.preco = preco;
    }

    if (Object.keys(sessaoAtulizada).length === 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Não há nenhuma informação para ser atualizada",
      });
    }

    await queryAsync("UPDATE sessao SET ? WHERE id = ?", [sessaoAtulizada, id]);
    res.json({
      sucesso: true,
      mensagem: "Atualização feita com sucesso",
    });
  } catch (erro) {
    console.error("Erro ao atulizar sessão", erro);
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao atualizar sessão",
      erro: erro.message,
    });
  }
});

app.delete("/sessao/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID de sessão inválido",
      });
    }

    const sessaoExiste = await queryAsync("SELECT * FROM sessao WHERE id = ?", [
      id,
    ]);

    if (sessaoExiste.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Sessão não encontrada",
      });
    }

    await queryAsync("DELETE FROM sessao WHERE id = ?", [id]);

    res.json({
      sucesso: true,
      mensagem: "Sessão deletada com sucesso",
    });
  } catch (erro) {
    console.error("Erro ao excluir sessão: ", erro);
    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao excluir sessão",
      erro: erro.message,
    });
  }
});


// MÉTODOS DE INGRESSO 

app.get ('/ingresso', async (req, res) => {
  try {
    const ingresso = await queryAsync ("SELECT * FROM ingresso")

    res.json ({
      sucesso: true,
      dados: ingresso,
      total: ingresso.length
    })
  } catch (erro) {
    console.error ("Erro ao listar ingressos: ", erro)
    res.status(400).json ({
      sucesso: false,
      mensagem: "Erro ao listar ingressos",
      erro: erro.message
    })
  }
})

app.get ('/ingresso/:id', async (req, res) => {
  try {
    const {id} = req.params

    if(!id || isNaN(id)) {
      res.status(400).json ({
        sucesso: false,
        mensagem: "ID de ingresso é inválido",
      })
    }

    const ingresso = await queryAsync ("SELECT * FROM ingresso WHERE id = ?", [id])

    if(ingresso.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Ingresso não encontrado",
      })
    }

    res.json({
      sucesso: true,
      dados: ingresso [0],
    })

  } catch (erro) {
    console.error("Erro ao encontrar ingresso: ", erro)
    return res.status(500).json ({
      sucesso: false,
      mensagem: "Erro ao encontrar ingresso",
      erro: erro.message,
    })
  }
})

app.post ('/ingresso', async (req, res) => {
  try {
    const {sessao_id, numero_assento, tipo, valor_pago, status} = req.body

    if (!sessao_id || !numero_assento || !tipo || !valor_pago) {
      return res.status(400).json ({
        sucesso: false,
        mensagem: "ID da sessão, número do assento, tipo de ingresso e valor pago são obrigatórios",
      })
    }

    if(!sessao_id || isNaN(sessao_id)) {
      return res.status(400).json ({
        sucesso: false, 
        mensagem: "ID de ingresso inválido",
      })
    }

    if(!numero_assento || isNaN(numero_assento)) {
      return res.status(400).json ({
        sucesso: false, 
        mensagem: "Número do assento inválido",
      })
    }

    if(tipo !== "inteira" && tipo !== "meia") {
      return res.status(400).json ({
        sucesso: false,
        mensagem: "Tipo de ingresso inválido"
      })
    }

    if(!valor_pago || isNaN(valor_pago) || valor_pago !== 8 && valor_pago !== 2) {
      return res.status(400).json ({
        sucesso: false,
        mensagem: "Valor pago é inválido"
      })
    }

    if (status == undefined) {
      return "reservado"
    }

    if(status !== "reservado" && status !== "pago" && status !== "cancelado") {
      return res.status(400).json ({
        sucesso: false,
        mensagem: "Status é inválido",
      })
    }

    const novoIngresso = {
      sessao_id: sessao_id,
      numero_assento: numero_assento,
      tipo: tipo,
      valor_pago: valor_pago,
      status: status,
    }

    const resultado = await queryAsync ("INSERT INTO ingresso SET ?", [novoIngresso])

    res.status(200).json ({
      sucesso: true,
      mensagem: "Ingresso cadastrado com sucesso",
      id: resultado.insertId,
    })
  } catch (erro) {
    console.error ("Erro ao criar ingresso: ", erro)
    res.status(500).json ({
      sucesso: false, 
      mensagem: "Erro ao criar ingresso",
      erro: erro.message
    })
  }
})

app.put ('/ingresso/:id', async (req, res) => {
  try {
    const {id} = req.params
    const {sessao_id, numero_assento, tipo, valor_pago, status} = req.body

    if (!sessao_id || !numero_assento || !tipo || !valor_pago) {
      return res.status(400).json ({
        sucesso: false,
        mensagem: "ID da sessão, número do assento, tipo de ingresso e valor pago são obrigatórios",
      })
    }

    if(!sessao_id || isNaN(sessao_id)) {
      return res.status(400).json ({
        sucesso: false, 
        mensagem: "ID de ingresso inválido",
      })
    }

    if(!numero_assento || isNaN(numero_assento)) {
      return res.status(400).json ({
        sucesso: false, 
        mensagem: "Número do assento inválido",
      })
    }

    if(tipo !== "inteira" && tipo !== "meia") {
      return res.status(400).json ({
        sucesso: false,
        mensagem: "Tipo de ingresso inválido"
      })
    }

    if(!valor_pago || isNaN(valor_pago) || valor_pago !== 8 && valor_pago !== 2) {
      return res.status(400).json ({
        sucesso: false,
        mensagem: "Valor pago é inválido"
      })
    }

    if (status == undefined) {
      return "reservado"
    }

    if(status !== "reservado" && status !== "pago" && status !== "cancelado") {
      return res.status(400).json ({
        sucesso: false,
        mensagem: "Status é inválido",
      })
    }

    const ingressoExiste = ("SELECT * FROM ingresso WHERE id = ?", [id])

    if (ingressoExiste.length === 0) {
      return res.status(400).json ({
        sucesso: false, 
        mensagem: "Ingresso não existe"
      })
    }

    const ingressoAtualizado = {};

    if (!isNaN(sessao_id) || sessao_id !== undefined)
      ingressoAtualizado.sessao_id = sessao_id;
    if (status === 'reservado' || status ==='pago' || status === 'cancelado')
      ingressoAtualizado.status = status;
  } catch (erro) {
    
  }
})
module.exports = app;
