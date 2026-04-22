const validarExistencia = (resultado, res, tipo) => {
  if (resultado.length === 0) {
    res.status(404).json({
      sucesso: false,
      mensagem: `${tipo} não encontrado(a)`,
    });
    return false;
  }
  return true;
};

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

    const usuario = await queryAsync("SELECT * FROM usuarios WHERE id = ?", [
      id,
    ]);

    if (!validarExistencia(usuario, res, "Usuario")) {
      return;
    } // Inverte o valor da função para que o if seja executado mesmo quando o resultado da função é false, para quando for true o valor sair para o resultado abaixo

    res.status(200).json({
      sucesso: true,
      dados: usuario[0], // Exibir só o primeiro usuário cadastrado, caso haja dois (erro)
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao listar usuários",
    });
  }
});

//Exercício 2

const validarDados = ({ cliente, valor }) => {
  if (!cliente || !valor) {
    return "Cliente e valor são obrigatórios";
  }

  if (typeof valor !== "number" || valor <= 0) {
    return "Valor inválido";
  }

  return null; //Pode ser false também. Como trabalhamos com valores será null
};

app.post("/pedidos", async (req, res) => {
  try {
    const erro = validarDados(req.body);

    if (erro) {
      return res.status(400).json({
        sucesso: false,
        mensagem: erro,
      });
    }

    await queryAsync("INSERT INTO pedido SET ?", [req.body]);

    res.status(201).json({
      sucesso: true,
      mensagem: "Pedido criado com sucesso",
    });
  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao criar pedido",
    });
  }
});

//Exercício 3

app.put("/salas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const dados = req.body;

    const sala = await queryAsync("SELECT * FROM sala WHERE id = ?", [id]);

    if (!validarExistencia(sala, res, "Sala")) {
      return;
    }

    if (Object.keys(dados).length === 0) {
      // Object keys verifica a chave dentro dos objetos. Está verificando se alguma coisa foi salva dentro desse objeto. EX: cliente, valor são chaves
      return res.status(400).json({
        sucesso: false,
        mensagem: "Nenhum dado enviado",
      });
    }

    await queryAsync("UPDATE sala SET ? WHERE id = ?", [dados, id]);

    res.json({
      //O status muda apenas o tratamento no front-end, não altera nada para o cliente. É necessário apenas em caso de erro, já que o front pode mudar o tratamento do código caso o erro tenha um status diferente
      sucesso: true,
      mensagem: "Sala atualizada com sucesso",
    });

  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao atualizar sala",
    });
  }
});

app.delete("/salas/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const sala = await queryAsync("SELECT * FROM sala WHERE id = ?", [id]);

    if (!validarExistencia(sala, res, "Sala")) {
      return;
    }

    await queryAsync("DELETE FROM sala WHERE id = ?", [id]);

    res.json ({
      sucesso: true,
      mensagem: "Sala deletada com sucesso"
    })

  } catch (erro) {
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao atualizar sala",
    });
  }
});
