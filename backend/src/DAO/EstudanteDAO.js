const Estudante = require('../models/Estudante');
const {
    criarEstudanteSchema,
    atualizarEstudanteSchema
} = require('../models/validations/estudanteValidation');

/**
 * Data Access Object para Estudante
 * Responsável por todas as operações de acesso ao banco de dados
 * Aplica o princípio Single Responsibility - isolamento da camada de dados
 * Aplica o princípio Dependency Inversion - depende de abstrações (modelo Mongoose)
 * Utiliza Yup para validações robustas
 */
class EstudanteDAO {

    /**
     * Lista todos os estudantes
     * @returns {Promise<Array>} Array com todos os estudantes
     */
    async listarTodos() {
        try {
            const estudantes = await Estudante.find().sort({ nome: 1 });
            return estudantes;
        } catch (error) {
            throw new Error(`Erro ao listar estudantes: ${error.message}`);
        }
    }

    /**
     * Busca um estudante por nome
     * @param {String} nome - Nome do estudante
     * @returns {Promise<Object|null>} Estudante encontrado ou null
     */
    async buscarPorNome(nome) {
        try {
            const estudante = await Estudante.findOne({ nome });
            return estudante;
        } catch (error) {
            throw new Error(`Erro ao buscar estudante: ${error.message}`);
        }
    }

    /**
     * Cria um novo estudante
     * @param {Object} dadosEstudante - Dados do estudante {nome, nota1, nota2, nota3}
     * @returns {Promise<Object>} Estudante criado
     */
    async criar(dadosEstudante) {
        try {
            // Validação com Yup
            const dadosValidados = await criarEstudanteSchema.validate(dadosEstudante, {
                abortEarly: false,
                stripUnknown: true
            });

            const { nome, nota1, nota2, nota3 } = dadosValidados;

            // Verifica se já existe um estudante com este nome
            const estudanteExistente = await this.buscarPorNome(nome);
            if (estudanteExistente) {
                throw new Error('Já existe um estudante cadastrado com este nome');
            }

            const novoEstudante = new Estudante({
                nome,
                nota1,
                nota2,
                nota3
            });

            await novoEstudante.save();
            return novoEstudante;
        } catch (error) {
            if (error.name === 'ValidationError') {
                const mensagens = error.errors ? error.errors.join(', ') : error.message;
                throw new Error(mensagens);
            }
            throw new Error(`Erro ao criar estudante: ${error.message}`);
        }
    }

    /**
     * Atualiza os dados de um estudante
     * @param {String} nome - Nome do estudante a ser atualizado
     * @param {Object} dadosAtualizados - Novos dados do estudante
     * @returns {Promise<Object>} Estudante atualizado
     */
    async atualizar(nome, dadosAtualizados) {
        try {
            // Validação com Yup
            const dadosValidados = await atualizarEstudanteSchema.validate(dadosAtualizados, {
                abortEarly: false,
                stripUnknown: true
            });

            const { nota1, nota2, nota3 } = dadosValidados;

            const estudante = await Estudante.findOne({ nome });

            if (!estudante) {
                throw new Error('Estudante não encontrado');
            }

            // Atualiza apenas os campos fornecidos
            if (nota1 !== undefined) estudante.nota1 = nota1;
            if (nota2 !== undefined) estudante.nota2 = nota2;
            if (nota3 !== undefined) estudante.nota3 = nota3;

            // Recalcula a média
            estudante.media = estudante.calcularMedia();

            await estudante.save();
            return estudante;
        } catch (error) {
            if (error.name === 'ValidationError') {
                const mensagens = error.errors ? error.errors.join(', ') : error.message;
                throw new Error(mensagens);
            }
            throw new Error(`Erro ao atualizar estudante: ${error.message}`);
        }
    }

    /**
     * Exclui um estudante
     * @param {String} nome - Nome do estudante a ser excluído
     * @returns {Promise<Object>} Estudante excluído
     */
    async excluir(nome) {
        try {
            const estudante = await Estudante.findOneAndDelete({ nome });

            if (!estudante) {
                throw new Error('Estudante não encontrado');
            }

            return estudante;
        } catch (error) {
            throw new Error(`Erro ao excluir estudante: ${error.message}`);
        }
    }

    /**
     * Busca estudantes por faixa de média
     * @param {Number} mediaMinima - Média mínima
     * @param {Number} mediaMaxima - Média máxima
     * @returns {Promise<Array>} Array de estudantes
     */
    async buscarPorMedia(mediaMinima, mediaMaxima) {
        try {
            const estudantes = await Estudante.find({
                media: { $gte: mediaMinima, $lte: mediaMaxima }
            }).sort({ media: -1 });

            return estudantes;
        } catch (error) {
            throw new Error(`Erro ao buscar estudantes por média: ${error.message}`);
        }
    }

    /**
     * Conta o total de estudantes cadastrados
     * @returns {Promise<Number>} Número de estudantes
     */
    async contarEstudantes() {
        try {
            const total = await Estudante.countDocuments();
            return total;
        } catch (error) {
            throw new Error(`Erro ao contar estudantes: ${error.message}`);
        }
    }
}

module.exports = new EstudanteDAO();
