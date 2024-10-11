const axios = require('axios');

const generatePrompt = (artists) => {
    const artistDetails = artists.map(artist => {
        const genres = artist.genres.join(', ');
        return `${artist.name} (${genres})`;
    }).join('\n');

    return `
    Crie um texto engraçado e levemente provocativo sobre o gosto musical de uma pessoa com base nos seguintes artistas.
    Analise o estilo musical de cada artista e o que isso diz sobre a personalidade da pessoa. 
    Aqui estão os artistas e seus gêneros:
    
    ${artistDetails}
    
    Faça a análise como se estivesse brincando com a pessoa, mas de forma engraçada, descontraída e levemente ácida. 
    Não é necessário mencionar todos os artistas, apenas os mais marcantes.
    `;
};

const getMusicTasteAnalysis = async (artists) => {
    const prompt = generatePrompt(artists);

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4o-mini',
            messages: [
                { role: 'system', content: 'Você é um assistente gen-z engraçado e provocativo.' },
                { role: 'user', content: prompt }
            ],
            max_tokens: 1000,
            temperature: 0.7,
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Erro ao gerar análise musical com OpenAI:', error.response ? error.response.data : error.message);
        throw error;
    }
};

module.exports = getMusicTasteAnalysis;
