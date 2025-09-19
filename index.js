// Proxy FDA per ITA4USA - Root Version
const handler = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.status(200).json({
      message: 'ITA4USA FDA Proxy - Use POST method',
      status: 'ready'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  try {
    const { searchTerm, authUser, authKey } = req.body;

    const response = await fetch('https://www.accessdata.fda.gov/rest/pcbapi/v1/product/name/', {
      method: 'POST',
      headers: {
        'Authorization-User': authUser,
        'Authorization-Key': authKey,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `payload=${encodeURIComponent(searchTerm)}`
    });

    const data = await response.json();

    return res.status(200).json({
      success: true,
      searchTerm,
      results: data.RESULT || [],
      message: data.MESSAGE || 'Success'
    });

  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

export default handler;
