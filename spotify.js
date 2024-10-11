const axios = require('axios');

const getTopArtists = async (access_token) => {
  try {
    const response = await axios({
      method: 'get',
      url: 'https://api.spotify.com/v1/me/top/artists?limit=10',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response.data.items;
  } catch (error) {
    console.error('Erro ao obter top artistas', error);
    throw new Error('Não foi possível obter os top artistas');
  }
};

module.exports = getTopArtists;
