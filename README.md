# Atividade - Locadora de carros
Atividade do dia 25-02 - Manipulação de Strings e Arrays no JavaScript
- Documento enviado pelo professor de PWBE 2 que explica algumas funções nativas do JavaScript usadas para manipular strings e arrays.
- https://github.com/reenye-lima/SENAI-2026/tree/main/1%C2%BA%20Semestre/PWBE2/Aula%2004
- Acima o link do git hub do professor, onde está todo o conteúdo da atividade do dia.


# Strings
Strings representam textos.

let nome = "João Silva";
.length
Retorna o tamanho da string.

let nome = "Ana";
console.log(nome.length); // 3
Também funciona para arrays.

.trim()
Remove espaços no início e no final da string.

let texto = "   Olá mundo   ";
console.log(texto.trim()); 
// "Olá mundo"
Não altera a string original, retorna uma nova.

.toLowerCase()
Converte todos os caracteres para minúsculo.

let email = "TESTE@EMAIL.COM";
console.log(email.toLowerCase());
// "teste@email.com"
.toUpperCase()
Converte todos os caracteres para maiúsculo.

let nome = "joão";
console.log(nome.toUpperCase());
// "JOÃO"
.includes()
Verifica se a string contém determinado valor.

Retorna true ou false.

let email = "teste@email.com";

console.log(email.includes("@"));
// true
.split()
Divide uma string em partes e retorna um array.

let nomeCompleto = "João Silva";
let partes = nomeCompleto.split(" ");

console.log(partes);
// ["João", "Silva"]
O parâmetro define onde a divisão será feita.

.endsWith()
Verifica se a string termina com determinado valor.

let arquivo = "documento.pdf";

console.log(arquivo.endsWith(".pdf"));
// true
.replace(" ", "")
Substitui a primeira ocorrencia em uma string.

let frase = "olá mundo, olá novamente";
frase.replace("olá", "oi");
//oi mundo, olá novamente
.replaceAll(" ", "")
Substitui todas as ocorrencias em uma string.

let frase = "olá mundo, olá novamente";
frase.replaceAll("olá", "oi");
//oi mundo, oi novamente
.typeof(variavel)
Retorna o tipo da variável informada.

let numero = 1234;
typeof(numero);
//number

let texto = "1234";
typeof(texto);
//string
Arrays
Arrays armazenam listas de valores.

let numeros = [1, 2, 3, 4];
.push()
Adiciona um elemento ao final do array.

let lista = [1, 2];
lista.push(3);

console.log(lista);
// [1, 2, 3]
.splice()
Remove ou adiciona elementos em posições específicas.

Removendo:

let lista = [1, 2, 3];
lista.splice(1, 1);

console.log(lista);
// [1, 3]
.forEach()
Percorre todos os elementos do array.

let numeros = [1, 2, 3];

numeros.forEach(n => {
  console.log(n);
});
Não retorna novo array.

.map()
Percorre o array e retorna um novo array transformado.

let numeros = [1, 2, 3];

let dobrado = numeros.map(n => n * 2);

console.log(dobrado);
// [2, 4, 6]
.filter()
Retorna um novo array com elementos que atendem a uma condição.

let numeros = [1, 2, 3, 4];

let pares = numeros.filter(n => n % 2 === 0);

console.log(pares);
// [2, 4]
.find()
Retorna o primeiro elemento que atende à condição.

let numeros = [1, 2, 3, 4];

let resultado = numeros.find(n => n > 2);

console.log(resultado);
// 3
.some()
Verifica se pelo menos um elemento atende à condição.

Retorna true ou false.

let numeros = [1, 2, 3];

let existeMaiorQue2 = numeros.some(n => n > 2);

console.log(existeMaiorQue2);
// true
.every()
Verifica se todos os elementos atendem à condição.

let numeros = [2, 4, 6];

let todosPares = numeros.every(n => n % 2 === 0);

console.log(todosPares);
// true
