const express = require('express');
const winston = require('winston');
const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics(); 


const app = express();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(), 
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs-aplicacao.log' })
  ],
});

app.get('/', (req, res) => {
  logger.info({ message: 'Acesso à rota principal', metodo: 'GET', status: 200 });
  res.send('Aplicação de Teste - Aula 06');
});

app.get('/erro', (req, res) => {
  logger.error({ message: 'Erro crítico simulado', codigo: 500 });
  res.status(500).send('Erro no servidor');
});



// Rota que o Prometheus vai ler
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(3000, () => logger.info({ message: 'Servidor iniciado na porta 3000' }));