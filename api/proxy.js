// api/proxy.js - Vercel Function per FDA API
export default async function handler(req, res) {
  console.log('🚀 FDA Proxy Function chiamata');

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      message: 'ITA4USA FDA Proxy Function',
      status: 'ready',
      endpoint: 'POST /api/proxy'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method allowed' });
  }

  try {
    const { searchTerm, authUser, authKey } = req.body;

    if (!searchTerm || !authUser || !authKey) {
      return res.status(400).json({
        success: false,
        error: 'Missing parameters: searchTerm, authUser, authKey'
      });
    }

    console.log('📡 Calling FDA API for:', searchTerm);

    // Chiamata FDA API
    const fdaResponse = await fetch(
      'https://www.accessdata.fda.gov/rest/pcbapi/v1/product/name/',
      {
        method: 'POST',
        headers: {
          'Authorization-User': authUser,
          'Authorization-Key': authKey,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `payload=${encodeURIComponent(searchTerm)}`
      }
    );

    if (!fdaResponse.ok) {
      throw new Error(`FDA API returned ${fdaResponse.status}`);
    }

    const fdaData = await fdaResponse.json();
    console.log('✅ FDA API Success');

    return res.status(200).json({
      success: true,
      searchTerm: searchTerm,
      results: fdaData.RESULT || [],
      message: fdaData.MESSAGE || 'Success'
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
