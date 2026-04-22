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
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao listar usuários",
    });
  }
});

  app.get("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await queryAsync("SELECT * FROM usuarios WHERE id = ?", [id]);

    if (validarExistencia(usuario, res, "Usuario")) {
      return; 
    }

  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao listar usuários",
    });
  }
});

//Exercício 2

app.post('/pedidos', async (req, res) => {
    const { cliente, valor } = req.body

    if (!cliente) {
        return res.send("erro")
    }

    if (!valor) {
        return res.send("erro")
    }

    if (typeof valor != "number") {
        return res.send("erro")
    }

    await queryAsync("INSERT INTO pedido SET ?", [req.body])

    res.send("ok")
})

//Exercício 3

app.put('/salas/:id', async (req, res) => {
    const id = req.params
    const dados = req.body

    const s = await queryAsync("SELECT * FROM sala WHERE id = ?", [id])

    if (s.length === 0) {
        return res.send("nao tem")
    }

    await queryAsync("UPDATE sala SET ? WHERE id = ?", [dados, id])

    res.send("foi")
})

app.delete('/salas/:id', async (req, res) => {
    const id = req.params

    const s = await queryAsync("SELECT * FROM sala WHERE id = ?", [id])

    if (s.length === 0) {
        return res.send("nao tem")
    }

    await queryAsync("DELETE FROM sala WHERE id = ?", [id])

    res.send("apagou")
})