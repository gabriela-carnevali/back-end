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

app.get("/", (req, res) => {
  res.send("API SABOR DIGITAL");
});

app.get("/produtos", async (req, res) => {
  try {
    const produtos = await queryAsync("SELECT * FROM produto ORDER BY id DESC");

    res.json({
      sucesso: true,
      dados: produtos,
      total: produtos.length,
    });
  } catch (erro) {
    console.error("Erro ao listar produtos: ", erro);

    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao listar produtos",
      erro: erro.message,
    });
  }
});

app.get ('/produtos/:id', async (req, res) => {
    try {
        const {id} = req.params 

        if (!id || isNaN(id)) {
            return res.status(400).json ({
                sucesso: false,
                mensagem: "ID inválido"
            })
        }

        const produto = await queryAsync ("SELECT * FROM produto WHERE id = ?", [id])

        if (produto.length === 0) {
            return res.status(404).json ({
                sucesso: false,
                mensagem: "Produto não encontrado",
            })
        }

        res.json ({
            sucesso: true,
            dados: produto [0],
        })

    } catch (erro) {
        console.error ("Erro ao encontrar produto: ", erro)

        return res.status(500).json ({
            sucesso: false,
            mensagem: "Erro ao encontrar produto",
            erro: erro.message
        })
    }
})

app.post("/produtos", async (req, res) => {
  try {
    const { nome, descricao, preco, disponivel } = req.body;

    if (!nome && !descricao && !preco && disponivel === undefined) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Nome, descrição, preço e disponiblidade são obrigatórios",
      });
    }

    if (typeof preco !== 'number' || preco <= 0) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Preço precisar ser um número positivo",
      });
    }

    if (typeof disponivel !== 'boolean') {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Disponibilidade precisa ser um valor de 'true' ou 'false'",
      });
    }

    const novoProduto = {
      nome: nome,
      descricao: descricao,
      preco: preco,
      disponivel: disponivel,
    };

    const resultado = await queryAsync("INSERT INTO produto SET ?", [novoProduto]);

    res.status(201).json({
      sucesso: true,
      mensagem: "Produto criado com sucesso",
      id: resultado.insertId,
    });
  } catch (erro) {
    console.error("Erro ao criar produto");
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao criar produto",
      erro: erro.message,
    });
  }
});

app.put ('/produtos/:id', async (req, res) => {
    try {
        const {id} = req.params

        const { nome, descricao, preco, disponivel } = req.body;

        if (!id || isNaN(id)) {
            return res.status(400).json ({
                sucesso: false,
                mensagem: "ID inválido"
            })
        }

        const produtoExiste = await queryAsync("SELECT * FROM produto WHERE id = ?", [id])

        if (produtoExiste.length === 0) {
            return res.status(404).json ({
                sucesso: false, 
                mensagem: "ID não existe"
            })
        }

        const produtoAtualizado = {}

        if (nome !== undefined) {
            produtoAtualizado.nome = nome
        }
        if (descricao !== undefined) {
            produtoAtualizado.descricao = descricao
        }
        if (preco !== undefined) {
            if (typeof preco !== 'number' || preco <= 0) {
                return res.status(400).json ({
                    sucesso: false,
                    mensagem: "Preço deve ser um número positivo",
                })
            }
            produtoAtualizado.preco = preco
        }
        if (disponivel !== undefined) {
            if (typeof disponivel !== 'boolean') {
                return res.status(400).json ({
                    sucesso: false,
                    mensagem: "Disponibilidade precisa ser um valor 'true' ou 'false' "
                })
            }
            produtoAtualizado.disponivel = disponivel
        }

        await queryAsync("UPDATE produto SET ? WHERE id = ?", [produtoAtualizado, id])
        
        res.json ({
            sucesso: true,
            mensagem: "Produto atualizado com sucesso"
        })
    } catch (erro) {
        console.error("Erro ao atualizar produto: ", erro)

        return res.status(500).json ({
            sucesso: false, 
            mensagem: "Erro ao atulizar produto",
            erro: erro.message,
        })
    }
})

app.delete ('/produtos/:id', async (req, res) => {
    try {
        const {id} = req.params

        if (!id || isNaN(id)) {
            return res.status(400).json ({
                sucesso: false,
                mensagem: "ID inválido"
            })
        }

        const produtoExiste = await queryAsync("SELECT * FROM produto WHERE id = ?", [id])

        res.json ({
            sucesso: true,
            mensagem: "Produto deletado com sucesso"
        })

    } catch (erro) {
        console.error("Erro ao deletar produto", erro)

        return res.status(500).json (
            {
                sucesso: false, 
                mensagem: "Erro ao deletar produto",
                erro: erro.message
            }
        )
    }
})
module.exports = app;
