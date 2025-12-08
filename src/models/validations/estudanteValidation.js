const yup = require('yup');

/**
 * Schemas de validação usando Yup
 * Aplica o princípio Single Responsibility - validações isoladas
 * Aplica DRY - reutilização de schemas
 */

// Schema para validação de nota individual
const notaSchema = yup
    .number()
    .typeError('A nota deve ser um número')
    .required('A nota é obrigatória')
    .min(0, 'A nota deve ser no mínimo 0')
    .max(10, 'A nota deve ser no máximo 10')
    .test('decimal', 'A nota deve ter no máximo uma casa decimal', (value) => {
        if (value === undefined || value === null) return true;
        return /^\d+(\.\d{1})?$/.test(value.toString());
    });

/**
 * Schema para criação de estudante
 */
const criarEstudanteSchema = yup.object().shape({
    nome: yup
        .string()
        .required('O nome é obrigatório')
        .trim()
        .min(3, 'O nome deve ter no mínimo 3 caracteres')
        .max(100, 'O nome deve ter no máximo 100 caracteres')
        .matches(/^[a-zA-ZÀ-ÿ\s]+$/, 'O nome deve conter apenas letras'),

    nota1: notaSchema,
    nota2: notaSchema,
    nota3: notaSchema
});

/**
 * Schema para atualização de estudante
 * Todos os campos são opcionais na atualização
 */
const atualizarEstudanteSchema = yup.object().shape({
    nota1: notaSchema.optional(),
    nota2: notaSchema.optional(),
    nota3: notaSchema.optional()
}).test(
    'at-least-one',
    'Pelo menos uma nota deve ser informada',
    (value) => {
        return value.nota1 !== undefined || value.nota2 !== undefined || value.nota3 !== undefined;
    }
);

/**
 * Schema para validação de parâmetro nome
 */
const nomeParamSchema = yup.object().shape({
    nome: yup
        .string()
        .required('O nome é obrigatório')
        .trim()
});

/**
 * Schema para busca por média
 */
const buscaPorMediaSchema = yup.object().shape({
    mediaMinima: yup
        .number()
        .typeError('A média mínima deve ser um número')
        .min(0, 'A média mínima deve ser no mínimo 0')
        .max(10, 'A média mínima deve ser no máximo 10')
        .default(0),

    mediaMaxima: yup
        .number()
        .typeError('A média máxima deve ser um número')
        .min(0, 'A média máxima deve ser no mínimo 0')
        .max(10, 'A média máxima deve ser no máximo 10')
        .default(10)
        .test(
            'maior-que-minima',
            'A média máxima deve ser maior ou igual à média mínima',
            function (value) {
                return value >= this.parent.mediaMinima;
            }
        )
});

module.exports = {
    criarEstudanteSchema,
    atualizarEstudanteSchema,
    nomeParamSchema,
    buscaPorMediaSchema,
    notaSchema
};
