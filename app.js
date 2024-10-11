const express = require('express');
const axios = require('axios');
require('dotenv').config();
const getTopArtists = require('./spotify');
const getMusicTasteAnalysis = require('./judge');

const app = express();
const CLIENT_ID = SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = REDIRECT_URI; 
const FRONTEND_URL = SPOTASTE_PROFILE_URL;

// Login e redirecionamento para a página de autenticação do Spotify
app.get('/auth/login', (req, res) => {
  const scope = 'user-top-read';
  res.redirect(
    `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${scope}&redirect_uri=${REDIRECT_URI}`
  );
});

// Callback que lida com o retorno do Spotify com o código de autorização
app.get('/auth/callback', async (req, res) => {
  const code = req.query.code || null;

  try {
    const tokenResponse = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      params: {
        code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      },
    });

    const { access_token } = tokenResponse.data;

    const artists = await getTopArtists(access_token);

    const analysis = await getMusicTasteAnalysis(artists);

    const encodedAnalysis = encodeURIComponent(analysis);

    res.json({ analysisId: analysis });
    
  } catch (error) {
    console.error('Erro no processo de autenticação', error);
    res.status(400).send('Erro ao obter token de acesso ou top artistas');
  }
});

exports.spotifyAuth = app;
