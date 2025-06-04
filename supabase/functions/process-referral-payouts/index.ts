
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get pending payouts with user email
    const { data: pendingPayouts, error: payoutsError } = await supabaseClient
      .from('referral_payouts')
      .select(`
        *,
        profiles!referrer_id (
          id
        )
      `)
      .eq('status', 'pending')
      .gte('amount', 10) // Minimum $10 for payout

    if (payoutsError) throw payoutsError

    if (!pendingPayouts || pendingPayouts.length === 0) {
      return new Response(JSON.stringify({ processed: 0, message: 'No pending payouts found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // Group payouts by user to batch them
    const userPayouts = pendingPayouts.reduce((acc: any, payout: any) => {
      const userId = payout.referrer_id
      if (!acc[userId]) {
        acc[userId] = {
          total: 0,
          payouts: [],
          email: null
        }
      }
      acc[userId].total += payout.amount
      acc[userId].payouts.push(payout)
      return acc
    }, {})

    // Get user emails for payouts
    for (const userId of Object.keys(userPayouts)) {
      const { data: authUser } = await supabaseClient.auth.admin.getUserById(userId)
      if (authUser.user) {
        userPayouts[userId].email = authUser.user.email
      }
    }

    // Process PayPal batch payout
    const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID')
    const paypalClientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET')
    const paypalBaseURL = 'https://api-m.paypal.com'

    // Get PayPal access token
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

    // Create batch payout
    const payoutItems = Object.entries(userPayouts)
      .filter(([_, userData]: any) => userData.email)
      .map(([userId, userData]: any, index: number) => ({
        recipient_type: 'EMAIL',
        amount: {
          value: userData.total.toFixed(2),
          currency: 'USD'
        },
        receiver: userData.email,
        note: 'iShip Referral Commission',
        sender_item_id: `payout_${userId}_${Date.now()}`
      }))

    if (payoutItems.length === 0) {
      return new Response(JSON.stringify({ processed: 0, message: 'No valid emails for payouts' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    const batchResponse = await fetch(`${paypalBaseURL}/v1/payments/payouts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        sender_batch_header: {
          sender_batch_id: `batch_${Date.now()}`,
          email_subject: 'iShip Referral Payout',
          email_message: 'Thank you for referring new users to iShip!'
        },
        items: payoutItems
      })
    })

    const batchData = await batchResponse.json()

    if (batchData.batch_header) {
      // Update payout records
      const payoutIds = pendingPayouts.map(p => p.id)
      
      await supabaseClient
        .from('referral_payouts')
        .update({
          status: 'processing',
          paypal_batch_id: batchData.batch_header.payout_batch_id,
          processed_at: new Date().toISOString()
        })
        .in('id', payoutIds)
    }

    return new Response(JSON.stringify({ 
      processed: pendingPayouts.length,
      batchId: batchData.batch_header?.payout_batch_id 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error processing referral payouts:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
