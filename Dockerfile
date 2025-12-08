# Imagem base Node.js
FROM node:18-alpine

# Diretório de trabalho no container
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código fonte
COPY . .

# Expor porta
EXPOSE 3000

# Variável de ambiente padrão
ENV NODE_ENV=production

# Comando para iniciar a aplicação
CMD ["node", "index.js"]
