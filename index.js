const express = require('express')
const exphbs = require('express-handlebars')
const mysql = require('mysql')

//chmando a função express()
const app = express()

//middlewares para conseguir ter acesso ao body pelo json
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//conectando o css pelo express
app.use(express.static('public'))

//definindo o handlebars como template engine
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

//rotas
app.get('/', (req, res) => {
  res.render('home')
})

//inserindo dados no banco
app.post('/books/insertbook', (req, res) => {

  const title = req.body.title;
  const pageqty = req.body.pageqty;

  const queryAdd = `INSERT INTO books (title, pageqty) VALUES ('${title}', '${pageqty}')`;

  conn.query(queryAdd, function (err) {

    if (err) {
      console.log(err)
      return;
    }

    res.redirect('/books')
  })
})

//resgatando os dados do banco
app.get('/books', (req, res) => {

  const queryRead = `SELECT * FROM books`;

  conn.query(queryRead, function (err, data) {

    if (err) {
      console.log(err)
      return;
    }

    const books = data;
    console.log(books)

    res.render('books', { books })
  })
})

//resgatando livro específico
app.get('/books/:id', (req, res) => {

  const id = req.params.id;

  const queryWhere = `SELECT * FROM books WHERE id = ${id}`

  conn.query(queryWhere, function (err, data) {

    if (err) {
      console.log(err)
      return
    }

    const book = data[0];

    res.render('book', { book })
  })
})

//editando um livro específico
app.get('/books/edit/:id', (req, res) => {

  const id = req.params.id;

  const queryEdit = `SELECT * FROM books WHERE id = ${id}`;

  conn.query(queryEdit, function (err, data) {

    if (err) {
      console.log(err)
      return
    }

    const book = data[0];

    res.render('editbook', { book })
  })
})

//modificando um livro no banco de dados
app.post('/books/updatebook', (req, res) => {

  const id = req.body.id;
  const title = req.body.title;
  const pageqty = req.body.pageqty;

  const queryUpdate = `UPDATE books SET title = '${title}', pageqty = '${pageqty}' WHERE id = ${id}`;

  conn.query(queryUpdate, function (err) {

    if (err) {
      console.log(err)
      return
    }

    res.redirect('/books')
  })
})

//remover um livro
app.post('/books/remove/:id', (req, res) => {

  const id = req.params.id;

  const queryDelete = `DELETE FROM books WHERE id = ${id}`;

  conn.query(queryDelete, function (err) {

    if (err) {
      console.log(err)
    }

    res.redirect('/books')
  })
})

//configurando o banco de dados
const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'nodemysql'
})

//ligando o servidor
conn.connect(function (err) {
  if (err) {
    console.log(err)
  }

  app.listen(3000, () => {
    console.log('O servidor esta rodando na porta 3000')
  })
})