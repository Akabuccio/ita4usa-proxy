// Proxy FDA per ITA4USA - Deploy Vercel Ready
// File: index.js (metti nella root del repository)

export default async function handler(req, res) {
  console.log('🚀 ITA4USA FDA Proxy - Richiesta ricevuta');

  // CORS per browser
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Solo POST accettato' });
  }

  try {
    const { searchTerm, authUser, authKey } = req.body;

    if (!searchTerm || !authUser || !authKey) {
      return res.status(400).json({ 
        success: false, 
        error: 'Parametri mancanti: searchTerm, authUser, authKey' 
      });
    }

    console.log('📡 Chiamata FDA API per:', searchTerm);

    // Chiamata all'API FDA (stessi parametri di Postman)
    const response = await fetch(
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

    if (!response.ok) {
      throw new Error(`FDA API Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ FDA API Success:', data.MESSAGE);

    // Risposta pulita per l'app
    return res.status(200).json({
      success: true,
      searchTerm,
      results: data.RESULT || [],
      message: data.MESSAGE || 'Success'
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
