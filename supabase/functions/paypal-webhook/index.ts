
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

    const { event_type, resource } = await req.json()

    console.log('PayPal webhook received:', event_type)

    switch (event_type) {
      case 'CHECKOUT.ORDER.APPROVED':
        await handleOrderApproved(supabaseClient, resource)
        break
      case 'PAYMENT.CAPTURE.COMPLETED':
        await handlePaymentCompleted(supabaseClient, resource)
        break
      case 'PAYMENT.CAPTURE.DENIED':
        await handlePaymentFailed(supabaseClient, resource)
        break
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('PayPal webhook error:', error)
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

async function handleOrderApproved(supabase: any, resource: any) {
  const { data, error } = await supabase
    .from('transactions')
    .update({ 
      paypal_status: 'approved',
      status: 'processing'
    })
    .eq('paypal_order_id', resource.id)

  if (error) {
    console.error('Error updating order status:', error)
  }
}

async function handlePaymentCompleted(supabase: any, resource: any) {
  const captureId = resource.id
  const amount = parseFloat(resource.amount.value)
  
  // Update transaction status
  const { data: transaction, error } = await supabase
    .from('transactions')
    .update({ 
      paypal_capture_id: captureId,
      paypal_status: 'completed',
      status: 'completed'
    })
    .eq('paypal_order_id', resource.supplementary_data?.related_ids?.order_id)
    .select()
    .single()

  if (error) {
    console.error('Error updating transaction:', error)
    return
  }

  // Process referral commission if applicable
  if (transaction.referral_commission > 0) {
    await processReferralCommission(supabase, transaction)
  }

  // Release escrow payment if applicable
  if (transaction.shipment_id) {
    await releaseEscrowPayment(supabase, transaction.shipment_id)
  }
}

async function handlePaymentFailed(supabase: any, resource: any) {
  const { data, error } = await supabase
    .from('transactions')
    .update({ 
      paypal_status: 'failed',
      status: 'failed'
    })
    .eq('paypal_order_id', resource.supplementary_data?.related_ids?.order_id)

  if (error) {
    console.error('Error updating failed payment:', error)
  }
}

async function processReferralCommission(supabase: any, transaction: any) {
  // Find the referral record
  const { data: referral } = await supabase
    .from('referrals')
    .select('*')
    .eq('referred_user_id', transaction.user_id)
    .eq('status', 'active')
    .single()

  if (referral) {
    // Create referral payout record
    await supabase
      .from('referral_payouts')
      .insert({
        referrer_id: referral.referrer_id,
        referral_id: referral.id,
        amount: transaction.referral_commission,
        currency: transaction.currency,
        status: 'pending'
      })

    // Update referral total earnings
    await supabase
      .from('referrals')
      .update({ 
        total_earnings: (referral.total_earnings || 0) + transaction.referral_commission
      })
      .eq('id', referral.id)
  }
}

async function releaseEscrowPayment(supabase: any, shipmentId: string) {
  const { data, error } = await supabase
    .from('payments_escrow')
    .update({
      payment_status: 'released',
      released_at: new Date().toISOString()
    })
    .eq('shipment_id', shipmentId)

  if (error) {
    console.error('Error releasing escrow payment:', error)
  }
}
