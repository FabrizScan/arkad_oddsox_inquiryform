// Cloudflare Workers backend per OddSox Leads Form
// Gestisce le chiamate a Supabase e N8N in modo sicuro

export default {
  async fetch(request, env, ctx) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders
      });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: corsHeaders
      });
    }

    try {
      const formData = await request.json();
      
      // Validate required fields
      const requiredFields = ['user_type', 'event_type', 'start_date', 'location', 'indoor_outdoor', 'guests', 'concert_duration', 'full_name', 'email'];
      const missingFields = requiredFields.filter(field => !formData[field] || formData[field].toString().trim() === '');
      
      if (missingFields.length > 0) {
        return new Response(JSON.stringify({ 
          error: `Missing required fields: ${missingFields.join(', ')}` 
        }), {
          status: 400,
          headers: corsHeaders
        });
      }

      // Send to Supabase
      const supabaseResult = await sendToSupabase(formData, env);
      
      // Send to N8N (non-blocking)
      let n8nResult = null;
      try {
        n8nResult = await sendToN8n(formData, env);
      } catch (n8nError) {
        console.error('N8N webhook error (non-blocking):', n8nError);
        // N8N errors don't block the form submission
      }

      return new Response(JSON.stringify({
        success: true,
        message: 'Form submitted successfully',
        supabase: supabaseResult,
        n8n: n8nResult
      }), {
        status: 200,
        headers: corsHeaders
      });

    } catch (error) {
      console.error('Backend error:', error);
      return new Response(JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }), {
        status: 500,
        headers: corsHeaders
      });
    }
  }
};

// Send data to Supabase
async function sendToSupabase(formData, env) {
  const SUPABASE_URL = env.SUPABASE_URL;
  const SUPABASE_ANON_KEY = env.SUPABASE_ANON_KEY;
  const SUPABASE_TABLE = "n8n_oddsox_leads_form";

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Supabase configuration missing');
  }

  const url = `${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_ANON_KEY,
      "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      "Prefer": "return=representation"
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase error: HTTP ${response.status}: ${errorText}`);
  }

  return await response.json();
}

// Send data to N8N webhook
async function sendToN8n(formData, env) {
  const N8N_WEBHOOK_URL = env.N8N_WEBHOOK_URL;

  if (!N8N_WEBHOOK_URL) {
    throw new Error('N8N webhook URL missing');
  }

  // Create a payload more suitable for N8N
  const webhookPayload = {
    ...formData,
    soundSystemRequired: formData.soundSystemRequired || false,
    submitted_at: new Date().toISOString(),
    source: 'oddsox-leads-form'
  };

  const response = await fetch(N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(webhookPayload)
  });

  if (!response.ok) {
    throw new Error(`N8N webhook error: HTTP ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}
