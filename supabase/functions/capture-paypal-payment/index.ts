
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { orderId } = await req.json()

    const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID')
    const paypalClientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET')
    const paypalBaseURL = 'https://api-m.paypal.com'

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get access token
    const auth = btoa(`${paypalClientId}:${paypalClientSecret}`)
    const tokenResponse = await fetch(`${paypalBaseURL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    })

    const { access_token } = await tokenResponse.json()

    // Capture payment
    const captureResponse = await fetch(`${paypalBaseURL}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`,
      },
    })

    const captureData = await captureResponse.json()

    if (captureData.status === 'COMPLETED') {
      // Update transaction in database
      const captureId = captureData.purchase_units[0].payments.captures[0].id
      
      await supabaseClient
        .from('transactions')
        .update({
          paypal_capture_id: captureId,
          paypal_status: 'completed',
          status: 'completed'
        })
        .eq('paypal_order_id', orderId)
    }

    return new Response(JSON.stringify(captureData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error capturing PayPal payment:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
