/* EXERCÍCIO 1 - CLASSE SIMPLES 

Crie uma classe chamada Pessoa que possua:
- nome
- idade 

Crie um método apresentar() que exiba no console o nome e a idade da pessoa

*/

class Pessoa {
  constructor(nome, idade) {
    this.nome = nome;
    this.idade = idade;
  }

  apresentar() {
    console.log(`O nome é ${this.nome}, e a idade é ${this.idade}.`);
  }
}

const pessoa1 = new Pessoa("Bruna", 17);
pessoa1.apresentar();

/* EXERCÍCIO 2 - CLASSE SIMPLES 

Crie uma classe produto com:
- nome 
- preco

Crie um método mostrarPreco() que exiba o nome do produto e seu preço */

class Produto {
  constructor(nome, preco) {
    this.nome = nome;
    this.preco = preco;
  }

  mostrarPreco() {
    console.log(`O nome do produto é ${this.nome} e o preco é ${this.preco}`);
  }
}

const produto1 = new Produto("Sabonete Dove", 15.99);
produto1.mostrarPreco();

/* EXERCÍCIO 3 - HERANÇA

Crie uma classe Funcionario com:
- nome 

Crie uma classe Gerente que herda de Funcionario e possui:
- setor 

Crie um método que exiba o nome e o setor do gerente */

class Funcionario {
  constructor(nome) {
    this.nome = nome;
  }
}

class Gerente extends Funcionario {
  constructor(nome, setor) {
    super(nome);
    this.setor = setor;
  }

  nomeSetor() {
    console.log(`O nome do gerente é ${this.nome} e o setor é ${this.setor}`);
  }
}

const funcionario1 = new Gerente("Celso", "finanças");
funcionario1.nomeSetor();

/* EXERCÍCIO 4 - HERANÇA

Crie uma classe Veiculo com:
- marca 

Crie uma classe Carro que herda de Veiculo e possui:
- modelo

Crie um método que exiba a marca e o modelo do carro*/

class Veiculo {
  constructor(marca) {
    this.marca = marca;
  }
}

class Carro extends Veiculo {
  constructor(marca, modelo) {
    super(marca);
    this.modelo = modelo;
  }

  marcaModelo() {
    console.log(
      `Esse veículo é da marca ${this.marca} e do modelo ${this.modelo}`,
    );
  }
}

const carro1 = new Carro("Toyota", "Corolla Cross");
carro1.marcaModelo();

/* EXERCÍCIO 5 - ENCAPSULAMENTO 

Crie uma classe Conta onde:
- o saldo seja um atributo privado
- exista um método depositar(valor)
- exista um método mostrarSaldo () */

class Conta {
  #saldo;
  constructor() {
    this.#saldo = 0;
  }

  depositar(valor) {
    if (valor > 0) {
      this.#saldo += valor;
      console.log("Saldo atualizado com sucesso");
    } else {
      console.log(`Valor incorreto, não pode ser depositado.`);
    }
  }

  mostrarSaldo() {
    console.log(`O saldo é R$${this.#saldo.toFixed(2)}`);
  }
}

const deposito1 = new Conta();
deposito1.depositar(1000);
deposito1.mostrarSaldo();

/* EXERCÍCIO 6 - ENCAPSULAMENTO 

Crie uma classe Aluno onde:
- a nota seja um atributo privado
- exista um método definirNota(nota)
- exista um método mostrarNota()*/

class Aluno {
    #nota 
    constructor() {
        this.#nota = 0 
    }

    definirNota(nota) {
        if (nota >= 0 && nota <= 10) {
            this.#nota = nota 
            console.log ("Nota lançada com sucesso!")
        }
        else {
            console.log(`A nota não pode ser lançada`)
        }
    }

    mostrarNota() {
        console.log (`A nota é ${this.#nota}`)
    }
}

const aluno1 = new Aluno () 
aluno1.definirNota(10)
aluno1.mostrarNota()

