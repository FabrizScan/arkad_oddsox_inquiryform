/**
 * Airtable API helper per Create e Update record
 * Usa fetch per consistenza con Supabase
 */

const AIRTABLE_TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN;
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const TABLE_NAME = 'Leads';

const BASE_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

/**
 * Crea un record in Airtable
 */
export async function createLead(data) {
  try {
    console.log('=== AIRTABLE CREATE DEBUG ===');
    console.log('Data to send:', data);
    
    const requestBody = {
      records: [{ fields: data }],
      typecast: true
    };
    console.log('Full request body:', requestBody);
    
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Response status:', res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Airtable error response:', errorText);
      throw new Error(`HTTP ${res.status}: ${res.statusText} - ${errorText}`);
    }

    const result = await res.json();
    console.log('Airtable success response:', result);
    return result;
  } catch (err) {
    console.error('Errore creazione record Airtable:', err.message);
    throw err;
  }
}

/**
 * Aggiorna un record in Airtable
 */
export async function updateLead(recordId, data) {
  try {
    console.log('=== AIRTABLE UPDATE DEBUG ===');
    console.log('Record ID:', recordId);
    console.log('Data to update:', data);
    
    const res = await fetch(`${BASE_URL}/${recordId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: data,
        typecast: true
      })
    });

    console.log('Update response status:', res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Airtable update error response:', errorText);
      throw new Error(`HTTP ${res.status}: ${res.statusText} - ${errorText}`);
    }

    const result = await res.json();
    console.log('Airtable update success response:', result);
    return result;
  } catch (err) {
    console.error('Errore update record Airtable:', err.message);
    throw err;
  }
} 