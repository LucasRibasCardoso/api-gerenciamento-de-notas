const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const exphbs = require('express-handlebars');

dotenv.config();
const app = express();

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configurar Handlebars
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

// Arquivos estáticos (CSS/JS)
app.use(express.static(path.join(__dirname, 'public')));

// Passar BACKEND_URL para as views
app.use((req, res, next) => {
    res.locals.BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';
    next();
});

// Página inicial
app.get('/', (req, res) => {
    res.render('index');
});

// Páginas Handlebars
app.get('/cadastro', (req, res) => {
    res.render('cadastro');
});

app.get('/listagem', (req, res) => {
    res.render('listagem');
});

app.get('/editar/:nome', (req, res) => {
    const nomeEstudante = req.params.nome;
    const nota1 = req.query.nota1;
    const nota2 = req.query.nota2;
    const nota3 = req.query.nota3;

    res.render('editar', {
        nome: nomeEstudante,
        nota1: nota1,
        nota2: nota2,
        nota3: nota3
    });
});

// Porta
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Acesse: http://localhost:${PORT}`);
});
