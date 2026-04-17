//Exercício 1

app.get("/pedidos", async (req, res) => {
  try {
    const pedido = await queryAsync("SELECT * FROM pedidos");
    res.json({
      sucesso: true,
      dados: pedido,
      total: pedido.length,
    });
  } catch (erro) {
    console.error("Erro ao listar pedidos: ", erro);
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao listar pedidos",
      message: erro.message,
    });
  }
});

app.get("/pedidos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID de pedido inválido",
      });
    }

    const pedido = await queryAsync("SELECT * FROM pedidos WHERE id = ?", [id]);

    if (pedido.length === 0) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Pedido não encontrado",
      });
    }

    res.json({
      sucesso: true,
      dados: pedido[0],
    });
  } catch (erro) {
    console.error("Erro ao listar filmes:", erro);
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao listar filmes",
      message: erro.message,
    });
  }
});

//Exercício 2

app.post("/pedidos", async (req, res) => {
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

    const novoPedido = {
      cliente: cliente.trim(),
      valor: valor,
    };

    const resultado = await queryAsync("INSERT INTO pedido SET ?", [
      novoPedido,
    ]);

    res.status(201).json({
      sucesso: true,
      mensagem: "Pedido criado com sucesso",
      id: resultado.insertId,
    });
  } catch (erro) {
    console.error("Erro ao criar pedido: ", erro);
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao criar pedido",
      message: erro.message,
    });
  }
});

//Exercício 3

app.put("/pedidos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { cliente, valor } = req.body;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID de pedido inválido",
      });
    }

    const pedidoExiste = await queryAsync("SELECT * FROM pedido WHERE id = ?", [
      id,
    ]);

    if (pedidoExiste.length === 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Pedido não encontrado",
      });
    }

    const pedidoAtualizado = {};

    if (cliente !== unefined) pedidoAtualizado.cliente = cliente.trim();
    if (valor !== undefined) {
      if (typeof valor !== "number" || valor <= 0) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Valor deve ser um numero positivo",
        });

        pedidoAtualizado.valor = valor;
      }
    }

    if (Object.keys(pedidoAtualizado).length === 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Não há nenhuma informação para ser atualizada",
      });
    }

    await queryAsync("UPDATE pedido SET ? WHERE id = ?", [
      pedidoAtualizado,
      id,
    ]);

    res.json({
      sucesso: true,
      mensagem: "Pedido atualizado com sucesso",
    });
  } catch (erro) {
    console.error("Erro ao atulizar pedido: ", erro);
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao atualizar pedido",
      message: erro.message,
    });
  }
});

app.delete("/pedidos/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "ID de filme inválido",
      });
    }

    const pedidoExiste = await queryAsync("SELECT * FROM pedido WHERE id = ?", [
      id,
    ]);

    if (pedidoExiste.length === 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Pedido não encontrado",
      });
    }

    await queryAsync("DELETE FROM pedido WHERE id = ?", [id]);

    res.json({
      sucesso: true,
      mensagem: "Pedido deletado com sucesso!",
    });
  } catch (erro) {
    console.error("Erro ao deletar pedido: ", erro)
    res.status(500).json ({
        sucesso: false,
        mensagem: "Erro ao deletar pedido",
        message: erro.message,
    })
  }
});
