
-- Create a table to store delivery confirmations for shipments
create table if not exists public.delivery_confirmations (
  id uuid primary key default gen_random_uuid(),
  shipment_id uuid not null references public.shipments(id),
  confirmed_by uuid not null references public.profiles(id),
  confirmed_at timestamp with time zone not null default now(),
  device_info text null,
  status text not null default 'confirmed',
  unique (shipment_id)
);

-- Enable Row Level Security
alter table public.delivery_confirmations enable row level security;

-- Allow only the user confirming (receiver/scanner) to insert a confirmation
create policy "Anyone can confirm delivery for allowed shipment"
on public.delivery_confirmations
for insert
with check (auth.uid() = confirmed_by);

-- Allow the shipper to view the confirmation
create policy "Shipper can view confirmation"
on public.delivery_confirmations
for select
using (
  exists(
    select 1 from public.shipments
    where id = shipment_id and shipper_id = auth.uid()
  )
);

-- Only shipper can delete confirmation (if needed)
create policy "Shipper can delete confirmation"
on public.delivery_confirmations
for delete
using (
  exists(
    select 1 from public.shipments
    where id = shipment_id and shipper_id = auth.uid()
  )
);

-- Only shipper can update confirmation (for rare/admin case)
create policy "Shipper can update confirmation"
on public.delivery_confirmations
for update
using (
  exists(
    select 1 from public.shipments
    where id = shipment_id and shipper_id = auth.uid()
  )
);
