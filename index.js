require('dotenv').config();
const express = require('express');
const cors = require('cors');
const database = require('./src/database/connection');
const routes = require('./src/routes/routes');

/**
 * Configuração do servidor Express
 * Aplica separação de responsabilidades e boas práticas
 */
class App {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;

        this.initializeMiddlewares();
        this.initializeRoutes();
    }

    /**
     * Configura os middlewares da aplicação
     */
    initializeMiddlewares() {
        // CORS - permite requisições de diferentes origens
        this.app.use(cors());

        // Body parser - permite ler JSON e URL encoded
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    /**
     * Configura as rotas da aplicação
     */
    initializeRoutes() {
        // Rotas da API
        this.app.use('/api', routes);

        // Rota de health check
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'OK',
                timestamp: new Date().toISOString(),
                database: database.getStatus()
            });
        });

        // Rota 404 - não encontrada
        this.app.use((req, res) => {
            res.status(404).json({
                success: false,
                message: 'Rota não encontrada'
            });
        });

        // Middleware de tratamento de erros global
        this.app.use((error, req, res, next) => {
            console.error('Erro não tratado:', error);
            res.status(500).json({
                success: false,
                message: 'Erro interno do servidor',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        });
    }

    /**
     * Conecta ao banco de dados
     */
    async connectDatabase() {
        try {
            const mongoUri = process.env.MONGODB_URI;

            if (!mongoUri) {
                throw new Error('MONGODB_URI não definida no arquivo .env');
            }

            await database.connect(mongoUri);
        } catch (error) {
            console.error('✗ Erro ao conectar ao banco de dados:', error.message);
            process.exit(1);
        }
    }

    /**
     * Inicia o servidor
     */
    async start() {
        try {
            // Conecta ao banco de dados primeiro
            await this.connectDatabase();

            // Inicia o servidor HTTP
            this.app.listen(this.port, () => {
                console.log(`\n${'='.repeat(50)}`);
                console.log(`🚀 Servidor rodando na porta ${this.port}`);
                console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
                console.log(`🌐 API disponível em: http://localhost:${this.port}/api`);
                console.log(`💚 Health check: http://localhost:${this.port}/health`);
                console.log(`${'='.repeat(50)}\n`);
            });
        } catch (error) {
            console.error('✗ Erro ao iniciar servidor:', error.message);
            process.exit(1);
        }
    }
}

// Inicializa e inicia a aplicação
const app = new App();
app.start();

// Tratamento de exceções não capturadas
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

module.exports = app;
