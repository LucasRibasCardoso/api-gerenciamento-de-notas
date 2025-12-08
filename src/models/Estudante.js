const mongoose = require('mongoose');

/**
 * Schema do Estudante
 * Define a estrutura de dados de um estudante no banco de dados
 */
const estudanteSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'O nome é obrigatório'],
        trim: true,
        unique: true
    },
    nota1: {
        type: Number,
        required: [true, 'A nota 1 é obrigatória'],
        min: [0, 'A nota deve ser no mínimo 0'],
        max: [10, 'A nota deve ser no máximo 10']
    },
    nota2: {
        type: Number,
        required: [true, 'A nota 2 é obrigatória'],
        min: [0, 'A nota deve ser no mínimo 0'],
        max: [10, 'A nota deve ser no máximo 10']
    },
    nota3: {
        type: Number,
        required: [true, 'A nota 3 é obrigatória'],
        min: [0, 'A nota deve ser no mínimo 0'],
        max: [10, 'A nota deve ser no máximo 10']
    },
    media: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

/**
 * Middleware pre-save
 * Calcula a média antes de salvar o documento
 * Aplica o princípio Single Responsibility - cálculo da média fica encapsulado
 */
estudanteSchema.pre('save', function (next) {
    this.media = this.calcularMedia();
    next();
});

/**
 * Middleware pre-update
 * Calcula a média antes de atualizar o documento
 */
estudanteSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();

    if (update.nota1 !== undefined || update.nota2 !== undefined || update.nota3 !== undefined) {
        const nota1 = update.nota1 !== undefined ? update.nota1 : this._conditions.nota1;
        const nota2 = update.nota2 !== undefined ? update.nota2 : this._conditions.nota2;
        const nota3 = update.nota3 !== undefined ? update.nota3 : this._conditions.nota3;

        update.media = ((nota1 + nota2 + nota3) / 3).toFixed(1);
    }

    next();
});

/**
 * Método para calcular a média das notas
 * @returns {Number} Média com uma casa decimal
 */
estudanteSchema.methods.calcularMedia = function () {
    const media = (this.nota1 + this.nota2 + this.nota3) / 3;
    return parseFloat(media.toFixed(1));
};

/**
 * Método para validar se o estudante está aprovado
 * @param {Number} mediaMinima - Média mínima para aprovação (padrão: 7.0)
 * @returns {Boolean}
 */
estudanteSchema.methods.estaAprovado = function (mediaMinima = 7.0) {
    return this.media >= mediaMinima;
};

/**
 * Método para obter representação simplificada do estudante
 * @returns {Object}
 */
estudanteSchema.methods.toJSON = function () {
    const estudante = this.toObject();
    return {
        nome: estudante.nome,
        nota1: estudante.nota1,
        nota2: estudante.nota2,
        nota3: estudante.nota3,
        media: estudante.media
    };
};

const Estudante = mongoose.model('Estudante', estudanteSchema);

module.exports = Estudante;
