const API_KEY = process.env.AUDIENCELAB_API_KEY;
const BASE_URL = 'https://api.audiencelab.io';

async function testEnrichmentsAPI() {
  try {
    console.log('Testing GET /enrichments...\n');
    
    const response = await fetch(`${BASE_URL}/enrichments?page=1&page_size=5`, {
      method: 'GET',
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('Status:', response.status, response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('\nResponse JSON:');
      console.log(JSON.stringify(data, null, 2));
      
      if (data.data && data.data.length > 0) {
        console.log('\n=== FIRST ENRICHMENT JOB STRUCTURE ===');
        console.log('Available keys:', Object.keys(data.data[0]));
        console.log('\nFirst job details:');
        console.log(JSON.stringify(data.data[0], null, 2));
      }
    } else {
      const errorText = await response.text();
      console.log('\nError response:', errorText);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testEnrichmentsAPI();
