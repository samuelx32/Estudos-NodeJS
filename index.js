const express = require('express');
const server = express();
const path = require('path');
const router = express.Router();
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const { append } = require('express/lib/response');

server.use(express.json());
server.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }));
server.set('view engine', 'handlebars');
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(express.static('public'));

const mysql = require('mysql');
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'pantera2256!',
    database : 'livraria'
})

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
    }else{
        console.log('connected as id ' + connection.threadId);
    }
})


var quantidadePessoas = 1;
var quantidadeLivros = 2;
var pessoas = [{ id: 0, nome: "João", idade: 12 }, { id: 1, nome: "Saulo", idade: 15 }]
var livros = [{ id: 0, nome: "Senhor das Moscas" }, { id: 1, nome: "Admiravel Mundo Novo" }, { id: 2, nome: "Frankenstein" }];



//Geral

server.get('/', function (req, res) {
    res.render('index',{titulo: "Servidor Node"});
})

server.get('/encerrar', function (req, res) {
    connection.end();
    msg="Encerrado";
    res.render('resposta', {msg, titulo: "Encerrado"});
})


//Pessoas

server.get('/lista-pessoas', function (req, res) {
    res.render('listaPessoas', { pessoas, titulo: "Lista de Pessoas" });
})

server.get('/formulario-pessoas', (req, res) => {
    res.render('formulario',{titulo: "Formulário"});
})

server.post('/adicionar-item-pessoa', (req, res) => {
    quantidadePessoas++;
    pessoas.push({ id: quantidadePessoas, nome: req.body.nome, idade: req.body.idade });
    var msg = "Adicionado";
    res.render('resposta', { msg, titulo: "Adicionado" });
})

server.post('/alterar-pessoa-form', (req, res) => {
    var id = req.body.id;
    var nome = req.body.nome;
    var idade = req.body.idade;
    res.render('alterarPessoaForm', { id, nome, idade, titulo: "Alterar Pessoa" });
})

server.post('/alterar-pessoa', (req, res) => {
    var idn = req.body.id;
    var i;
    for (i = 0; i < pessoas.length; i++) {
        if (pessoas[i].id == idn) {
            pessoas[i] = { id: req.body.id, nome: req.body.nome, idade: req.body.idade };
        }
    }
    var msg = "Alterado";
    res.render('resposta', { msg, titulo: "Alterado" });
})

server.post('/deletar-pessoa', (req, res) => {
    var idn = req.body.id;
    var i;
    for (i = 0; i < pessoas.length; i++) {
        if (pessoas[i].id == idn) {
            pessoas.splice(i, 1);
        }
    }
    var msg = "Removido";
    res.render('resposta', { msg, titulo: "Removido" });
})

server.post('/pesquisa-pessoas', (req, res) => {
    const id = req.body.id;
    var msg;

    selecionado = pessoas[id];
    if (id > quantidadePessoas){
        msg = "Nada Encontrado.";
    }
    res.render('listaPessoas', { selecionado, msg, titulo: "Pesquisa" });
})


//Livros

server.get('/lista-livros', function (req, res) {
    res.render('listaLivros', {livros, titulo: "Lista de Livros"});
})

server.get('/formulario-livros', (req, res) => {
    res.render('formularioLivros', {titulo: 'Formulário Livros'});
})

server.post('/adicionar-item-livro', (req, res) => {
    quantidadeLivros++;
    livros.push({ id: quantidadeLivros, nome: req.body.nome });
    var msg = "Adicionado";
    res.render('resposta', { msg, titulo: 'Adicionado'});
})

server.post('/alterar-livro-form', (req, res) => {
    var id = req.body.id;
    var nome = req.body.nome;
    res.render('alterarLivroForm', { id, nome, titulo: 'Alterar Livro' });
})

server.post('/alterar-livro', (req, res) => {
    var idn = req.body.id;
    var i;
    for (i = 0; i < livros.length; i++) {
        if (livros[i].id == idn) {
            livros[i] = { id: req.body.id, nome: req.body.nome };
        }
    }
    var msg = "Adicionado";
    res.render('resposta', { msg, titulo: 'Alterado' });
})

server.post('/deletar-livro', (req, res) => {
    var idn = req.body.id;
    var i;
    for (i = 0; i < livros.length; i++) {
        if (livros[i].id == idn) {
            livros.splice(i, 1);
        }
    }

    var msg = "Removido";
    res.render('resposta', { msg, titulo: 'Deletado' });
});

server.post('/pesquisa-livros', (req, res) => {
    const id = req.body.id;
    var msg;

    selecionado = livros[id];
    if (id > quantidadeLivros){
        msg = "Nada Encontrado.";
    }

    res.render('listaLivros', { selecionado, msg, titulo: 'Pesquisa' });
});

//Passaros

server.get('/lista-passaros', function (req, res) {
    connection.query('SELECT * FROM livros', function (error, results, fields) {
        var passaros = results;
        res.render('listaPassaros', { passaros, titulo: 'Lista de Pássaros' });
    });
})

server.post('/pesquisa-passaros', (req, res) => {
    const id = req.body.id;
    var msg;

    connection.query('SELECT * FROM livros WHERE id_livros='+id, function (error, results, fields) {
        var selecionado = results;
        if (error || results == ""){
            msg = "Nada Encontrado: \n" + error;
        }
        res.render('listaPassaros', { selecionado, msg, titulo: 'Pesquisa' });
    });
})

server.get('/formulario-passaros', (req, res) => {
    res.render('formularioPassaros', {titulo: 'Formulário Pássaros'});
})

server.post('/adicionar-item-passaro', (req, res) => {
    var msg = "Adicionado";

    connection.query('INSERT INTO livros (nome,autor,preco) VALUES (?, ?, ?)',[req.body.nome, req.body.autor, req.body.preco],function(error, results, fields){
        if(error){
            msg = "Não adicionado: "+error;
        }
        res.render('resposta', { msg, titulo: 'Adicionado' });
    });
    
})

server.post('/alterar-passaro-form', (req, res) => {
    var id = req.body.id;
    var nome = req.body.nome;
    var autor = req.body.autor;
    var preco = req.body.preco;
    res.render('alterarPassaroForm', { id, nome, autor, preco, titulo: 'Alterar' });
})


server.post('/alterar-passaro', (req, res) => {
    var msg = "Adicionado";

    connection.query('UPDATE livros SET nome=?, autor=?, preco=? WHERE id_livros=?',[req.body.nome, req.body.autor, req.body.preco, req.body.id],function(error, results, fields){
        if(error){
            msg = "Não adicionado: "+error;
        }
        res.render('resposta', { msg, titulo: 'Alterado' });
    })
})

server.post('/deletar-passaro', (req, res) => {
    var msg = "Deletado";

    connection.query('DELETE FROM livros WHERE id_livros=?',[req.body.id], function(error,results,fields){
        if(error){
            msg = "Não foi excluído: "+error;
        }
        res.render('resposta', { msg, titulo: 'Deletado' });
    })
})


server.listen(3000); 