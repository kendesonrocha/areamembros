// Vercel Serverless Function - Estatísticas da Comunidade
const CIRCLE_API_BASE = 'https://app.circle.so/api/v1';

export default async function handler(req, res) {
  // Permitir CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    console.log('📊 Buscando estatísticas da comunidade...');
    
    const API_TOKEN = process.env.VITE_CIRCLE_API_TOKEN;
    const COMMUNITY_ID = process.env.VITE_CIRCLE_COMMUNITY_ID;
    
    if (!API_TOKEN || !COMMUNITY_ID) {
      throw new Error('Token ou Community ID não configurados');
    }

    const response = await fetch(
      `${CIRCLE_API_BASE}/community/${COMMUNITY_ID}/stats`,
      {
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro da API Circle:', errorText);
      throw new Error(`Circle API Error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Estatísticas carregadas:', data);
    
    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('❌ Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      data: {
        members_count: 0,
        posts_count: 0,
        comments_count: 0
      }
    });
  }
}


