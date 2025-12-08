const mongoose = require('mongoose');

/**
 * Classe responsável pela conexão com o MongoDB
 */
class Database {
    constructor() {
        this.connection = null;
    }

    /**
     * Conecta ao banco de dados MongoDB
     * @param {String} uri - URI de conexão do MongoDB
     * @returns {Promise<void>}
     */
    async connect(uri) {
        try {
            if (this.connection) {
                console.log('Já existe uma conexão ativa com o banco de dados');
                return;
            }

            await mongoose.connect(uri);

            this.connection = mongoose.connection;

            this.connection.on('connected', () => {
                console.log('✓ Conexão com MongoDB estabelecida com sucesso');
            });

            this.connection.on('error', (error) => {
                console.error('✗ Erro na conexão com MongoDB:', error.message);
            });

            this.connection.on('disconnected', () => {
                console.log('MongoDB desconectado');
            });

            // Tratamento de encerramento gracioso
            process.on('SIGINT', async () => {
                await this.disconnect();
                process.exit(0);
            });

        } catch (error) {
            console.error('✗ Erro ao conectar ao MongoDB:', error.message);
            throw error;
        }
    }

    /**
     * Desconecta do banco de dados
     * @returns {Promise<void>}
     */
    async disconnect() {
        try {
            if (this.connection) {
                await mongoose.disconnect();
                this.connection = null;
                console.log('Conexão com MongoDB encerrada');
            }
        } catch (error) {
            console.error('Erro ao desconectar do MongoDB:', error.message);
            throw error;
        }
    }

    /**
     * Retorna o status da conexão
     * @returns {String}
     */
    getStatus() {
        const states = {
            0: 'Desconectado',
            1: 'Conectado',
            2: 'Conectando',
            3: 'Desconectando'
        };
        return states[mongoose.connection.readyState] || 'Desconhecido';
    }

    /**
     * Verifica se está conectado
     * @returns {Boolean}
     */
    isConnected() {
        return mongoose.connection.readyState === 1;
    }
}

module.exports = new Database();
