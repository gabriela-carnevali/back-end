const validarExistencia = (resultado, res, tipo) => {
  if(resultado.length === 0) {
    res.status(404).json({
      sucesso: false,
      mensagem: `${tipo} não encontrado`
    })
    return false
  }
  return true 
}

//Exercício 1

app.get("/usuarios", async (req, res) => {
  try {
    const listaUsuarios = await queryAsync("SELECT * FROM usuarios");

    res.status(200).json({
      sucesso: true,
      dados: listaUsuarios,
      total: listaUsuarios.length,
    });
  } catch (erro) {
    console.error("Erro ao listar usuários: ", erro);
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao listar usuários",
      message: erro.message,
    });
  }
});

app.get("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await queryAsync("SELECT * FROM usuarios WHERE id = ?", [id]);

    if (validarExistencia(usuario, res, "Usuário")) {
      return 
    }

    res(200).json({
      sucesso: true,
      dados: usuario[0],
    });
  } catch (erro) {
    console.error("Erro ao listar usuários:", erro);
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao listar usuários",
      message: erro.message,
    });
  }
});

//Exercício 2

app.post("/usuarios", async (req, res) => {
  try {
    const { cliente, valor } = req.body;

    if (!cliente || !valor) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Cliente e valor são informações obrigatórias",
      });
    }

    if (typeof valor != "number" || valor <= 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Valor deve ser um número positivo",
      });
    }

    const novoUsuario = {
      cliente: cliente.trim(),
      valor: valor,
    };

    const resultado = await queryAsync("INSERT INTO usuarios SET ?", [
      novoUsuario,
    ]);

    res.status(201).json({
      sucesso: true,
      mensagem: "Usuário criado com sucesso",
      id: resultado.insertId,
    });
  } catch (erro) {
    console.error("Erro ao criar usuário: ", erro);
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao criar usuário",
      message: erro.message,
    });
  }
});

//Exercício 3

app.put("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { cliente, valor } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID de usuário inválido",
      });
    }

    const usuarioExiste = await queryAsync("SELECT * FROM usuarios WHERE id = ?", [
      id,
    ]);

    if (usuarioExiste.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Usuário não encontrado",
      });
    }

    const usuarioAtualizado = {};

    if (cliente !== unefined) usuarioAtualizado.cliente = cliente.trim();
    if (valor !== undefined) {
      if (typeof valor !== "number" || valor <= 0) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Valor deve ser um numero positivo",
        });

        usuarioAtualizado.valor = valor;
      }
    }

    if (Object.keys(usuarioAtualizado).length === 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Não há nenhuma informação para ser atualizada",
      });
    }

    await queryAsync("UPDATE usuarios SET ? WHERE id = ?", [
      usuarioAtualizado,
      id,
    ]);

    res.json({
      sucesso: true,
      mensagem: "Usuário atualizado com sucesso",
    });
  } catch (erro) {
    console.error("Erro ao atulizar usuário: ", erro);
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao atualizar usuário",
      message: erro.message,
    });
  }
});

app.delete("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID de usuário inválido",
      });
    }

    const usuarioExiste = await queryAsync("SELECT * FROM usuarios WHERE id = ?", [
      id,
    ]);

    if (usuarioExiste.length === 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Usuário não encontrado",
      });
    }

    await queryAsync("DELETE FROM usuarios WHERE id = ?", [id]);

    res.json({
      sucesso: true,
      mensagem: "Usuário deletado com sucesso!",
    });
  } catch (erro) {
    console.error("Erro ao deletar usuário: ", erro)
    res.status(500).json ({
        sucesso: false,
        mensagem: "Erro ao deletar usuário",
        message: erro.message,
    })
  }
});