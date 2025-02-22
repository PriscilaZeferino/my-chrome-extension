require('dotenv').config();
const Fastify = require('fastify');
const fastifyCors = require('@fastify/cors');
const { TranslationServiceClient } = require('@google-cloud/translate');

const client = new TranslationServiceClient()

const fastify = Fastify();
fastify.register(fastifyCors, { origin: '*' });

const PROJECT_ID = process.env.PROJECT_ID;
const GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS;
const location = 'global';

if (!PROJECT_ID || !GOOGLE_APPLICATION_CREDENTIALS) {
    console.error('Erro: Variáveis de ambiente não definidas. Verifique seu arquivo .env');
    process.exit(1);
}

fastify.get('/', async (request, reply) => {
    return reply.send({ mensagem: "Servidor esta no ar!" });
});

fastify.get('/traduzir', async (request, reply) => {
    const vocabulary = request.query.texto;
    if (!vocabulary)
        return reply.status(400).send({ erro: "Vocabulário para tradução não fornecido" })

    const translated = await translateVocabulary(vocabulary);

    if (!translated)
        return reply.status(500).send({ erro: "Erro interno ao traduzir o texto." });

    return reply.send({ translated });
});

async function translateVocabulary(vocabulary) {
    const request = {
        parent: `projects/${PROJECT_ID}/locations/${location}`,
        contents: [vocabulary],
        mimeType: 'text/plain',
        sourceLanguageCode: 'en',
        targetLanguageCode: 'pt',
    };

    const traducao = client.translateText(request)
        .then(response => {
            const traduzido = response[0].translations[0].translatedText;
            return traduzido;
        })
        .catch(error => {
            console.error('Erro ao traduzir:', error);
            return null;
        })

    return traducao
}

fastify.listen({ port: 3000, host: '0.0.0.0' }, () => {
    console.log('Servidor rodando na porta 3000');
});