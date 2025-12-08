const express = require('express');
const router = express.Router();
const EstudanteDAO = require('../DAO/EstudanteDAO');

/**
 * @route GET /api
 * @description Rota principal da API - Status da API
 * @access Public
 */
router.get('/', (req, res) => {
    res.json({
        message: 'API de Gerenciamento de Notas está ativa',
        version: '1.0.0',
        endpoints: {
            listar: 'GET /notas',
            inserir: 'POST /notas/inserir',
            editar: 'PUT /editar/:nome',
            excluir: 'DELETE /excluir/:nome'
        }
    });
});

/**
 * @route GET /notas
 * @description Lista todos os estudantes
 * @access Public
 */
router.get('/notas', async (req, res) => {
    try {
        const estudantes = await EstudanteDAO.listarTodos();

        res.status(200).json({
            success: true,
            total: estudantes.length,
            data: estudantes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao listar estudantes',
            error: error.message
        });
    }
});

/**
 * @route POST /notas/inserir
 * @description Insere um novo estudante
 * @access Public
 * @body {nome, nota1, nota2, nota3}
 */
router.post('/notas/inserir', async (req, res) => {
    try {
        const { nome, nota1, nota2, nota3 } = req.body;

        // Validação básica
        if (!nome || nota1 === undefined || nota2 === undefined || nota3 === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Todos os campos são obrigatórios (nome, nota1, nota2, nota3)'
            });
        }

        const novoEstudante = await EstudanteDAO.criar({
            nome,
            nota1,
            nota2,
            nota3
        });

        res.status(201).json({
            success: true,
            message: 'Estudante cadastrado com sucesso',
            data: novoEstudante
        });
    } catch (error) {
        // Tratamento de erro para estudante duplicado
        if (error.message.includes('Já existe um estudante')) {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }

        res.status(400).json({
            success: false,
            message: 'Erro ao cadastrar estudante',
            error: error.message
        });
    }
});

/**
 * @route PUT /editar/:nome
 * @description Atualiza os dados de um estudante
 * @access Public
 * @param {String} nome - Nome do estudante
 * @body {nota1, nota2, nota3}
 */
router.put('/editar/:nome', async (req, res) => {
    try {
        const { nome } = req.params;
        const { nota1, nota2, nota3 } = req.body;

        // Validação básica
        if (nota1 === undefined && nota2 === undefined && nota3 === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Pelo menos uma nota deve ser informada para atualização'
            });
        }

        const estudanteAtualizado = await EstudanteDAO.atualizar(nome, {
            nota1,
            nota2,
            nota3
        });

        res.status(200).json({
            success: true,
            message: 'Estudante atualizado com sucesso',
            data: estudanteAtualizado
        });
    } catch (error) {
        if (error.message.includes('não encontrado')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        res.status(400).json({
            success: false,
            message: 'Erro ao atualizar estudante',
            error: error.message
        });
    }
});

/**
 * @route DELETE /excluir/:nome
 * @description Exclui um estudante
 * @access Public
 * @param {String} nome - Nome do estudante
 */
router.delete('/excluir/:nome', async (req, res) => {
    try {
        const { nome } = req.params;

        const estudanteExcluido = await EstudanteDAO.excluir(nome);

        res.status(200).json({
            success: true,
            message: 'Estudante excluído com sucesso',
            data: estudanteExcluido
        });
    } catch (error) {
        if (error.message.includes('não encontrado')) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        res.status(500).json({
            success: false,
            message: 'Erro ao excluir estudante',
            error: error.message
        });
    }
});

/**
 * @route GET /notas/:nome
 * @description Busca um estudante específico por nome
 * @access Public
 * @param {String} nome - Nome do estudante
 */
router.get('/notas/:nome', async (req, res) => {
    try {
        const { nome } = req.params;
        const estudante = await EstudanteDAO.buscarPorNome(nome);

        if (!estudante) {
            return res.status(404).json({
                success: false,
                message: 'Estudante não encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: estudante
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar estudante',
            error: error.message
        });
    }
});

module.exports = router;
