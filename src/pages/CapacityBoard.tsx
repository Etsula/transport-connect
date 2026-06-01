import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plane, Truck, Ship, Train, Plus, Globe, MapPin, Calendar, Package } from "lucide-react";
import Disclaimers from "@/components/disclaimers/Disclaimers";

type Listing = {
  id: string;
  provider_id: string;
  provider_type: string;
  provider_name: string;
  contact_phone: string | null;
  contact_email: string | null;
  origin_city: string;
  origin_country: string;
  destination_city: string;
  destination_country: string;
  is_international: boolean;
  transport_mode: string;
  departure_date: string;
  arrival_date: string | null;
  available_kg: number;
  price_per_kg: number;
  currency: string;
  min_kg: number | null;
  accepts_documents: boolean;
  accepts_fragile: boolean;
  notes: string | null;
  status: string;
};

const modeIcon = (m: string) => {
  if (m === "air") return <Plane className="h-4 w-4" />;
  if (m === "sea") return <Ship className="h-4 w-4" />;
  if (m === "rail") return <Train className="h-4 w-4" />;
  return <Truck className="h-4 w-4" />;
};

export default function CapacityBoard() {
  const { toast } = useToast();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "intl" | "local">("intl");
  const [search, setSearch] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [bookingFor, setBookingFor] = useState<Listing | null>(null);
  const [bookingKg, setBookingKg] = useState("");
  const [bookingDesc, setBookingDesc] = useState("");

  const [form, setForm] = useState({
    provider_type: "traveler",
    provider_name: "",
    contact_phone: "",
    contact_email: "",
    origin_city: "",
    origin_country: "Kenya",
    destination_city: "",
    destination_country: "",
    transport_mode: "air",
    departure_date: "",
    arrival_date: "",
    available_kg: "",
    price_per_kg: "",
    currency: "KES",
    min_kg: "1",
    accepts_documents: true,
    accepts_fragile: false,
    notes: "",
  });

  const load = async () => {
    setLoading(true);
    let q = supabase
      .from("capacity_listings")
      .select("*")
      .eq("status", "open")
      .gte("departure_date", new Date().toISOString().slice(0, 10))
      .order("departure_date", { ascending: true });

    if (filter === "intl") q = q.eq("is_international", true);
    if (filter === "local") q = q.eq("is_international", false);

    const { data, error } = await q;
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else setListings((data || []) as Listing[]);
    setLoading(false);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUserId(data.session?.user.id ?? null));
  }, []);

  useEffect(() => {
    load();
  }, [filter]);

  const filtered = listings.filter((l) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      l.origin_city.toLowerCase().includes(s) ||
      l.destination_city.toLowerCase().includes(s) ||
      l.origin_country.toLowerCase().includes(s) ||
      l.destination_country.toLowerCase().includes(s) ||
      l.provider_name.toLowerCase().includes(s)
    );
  });

  const submitListing = async () => {
    if (!userId) {
      toast({ title: "Sign in required", description: "Please log in to publish capacity.", variant: "destructive" });
      return;
    }
    const isIntl = form.origin_country.trim().toLowerCase() !== form.destination_country.trim().toLowerCase();
    const payload = {
      provider_id: userId,
      provider_type: form.provider_type,
      provider_name: form.provider_name,
      contact_phone: form.contact_phone || null,
      contact_email: form.contact_email || null,
      origin_city: form.origin_city,
      origin_country: form.origin_country,
      destination_city: form.destination_city,
      destination_country: form.destination_country,
      is_international: isIntl,
      transport_mode: form.transport_mode,
      departure_date: form.departure_date,
      arrival_date: form.arrival_date || null,
      available_kg: parseFloat(form.available_kg),
      price_per_kg: parseFloat(form.price_per_kg),
      currency: form.currency,
      min_kg: form.min_kg ? parseFloat(form.min_kg) : 1,
      accepts_documents: form.accepts_documents,
      accepts_fragile: form.accepts_fragile,
      notes: form.notes || null,
    };
    const { error } = await supabase.from("capacity_listings").insert(payload);
    if (error) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Published", description: "Your capacity is now visible to shippers." });
    setOpenCreate(false);
    load();
  };

  const submitBooking = async () => {
    if (!userId || !bookingFor) {
      toast({ title: "Sign in required", variant: "destructive" });
      return;
    }
    const kg = parseFloat(bookingKg);
    if (!kg || kg <= 0 || kg > bookingFor.available_kg) {
      toast({ title: "Invalid weight", description: `Must be between ${bookingFor.min_kg || 1} and ${bookingFor.available_kg} kg`, variant: "destructive" });
      return;
    }
    const total = kg * bookingFor.price_per_kg;
    const { error } = await supabase.from("capacity_bookings").insert({
      listing_id: bookingFor.id,
      shipper_id: userId,
      kg_booked: kg,
      total_price: total,
      currency: bookingFor.currency,
      package_description: bookingDesc || null,
    });
    if (error) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Booking requested", description: `Provider will be notified. Total: ${bookingFor.currency} ${total.toFixed(2)}` });
    setBookingFor(null);
    setBookingKg("");
    setBookingDesc("");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Globe className="h-7 w-7 text-primary" /> Open Capacity Board
          </h1>
          <p className="text-muted-foreground mt-1">
            Travelers, shuttle SACCOs, bus drivers, cargo agents & airlines — publish space. Shippers — find the cheapest route.
          </p>
        </div>
        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Publish Capacity</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Publish Available Capacity</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 py-2">
              <div className="md:col-span-2">
                <Label>Provider type</Label>
                <Select value={form.provider_type} onValueChange={(v) => setForm({ ...form, provider_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="traveler">Individual traveler / relative</SelectItem>
                    <SelectItem value="sacco">Shuttle SACCO (e.g. North Rift)</SelectItem>
                    <SelectItem value="bus">Bus / coach driver</SelectItem>
                    <SelectItem value="cargo_agent">Cargo agent</SelectItem>
                    <SelectItem value="airline">Airline cargo</SelectItem>
                    <SelectItem value="company">Logistics company</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label>Provider / company name</Label>
                <Input value={form.provider_name} onChange={(e) => setForm({ ...form, provider_name: e.target.value })} placeholder="e.g. North Rift Shuttle - Eldoret office" />
              </div>
              <div>
                <Label>Contact phone</Label>
                <Input value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} placeholder="+254..." />
              </div>
              <div>
                <Label>Contact email</Label>
                <Input value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} />
              </div>
              <div>
                <Label>Origin city</Label>
                <Input value={form.origin_city} onChange={(e) => setForm({ ...form, origin_city: e.target.value })} placeholder="Nairobi" />
              </div>
              <div>
                <Label>Origin country</Label>
                <Input value={form.origin_country} onChange={(e) => setForm({ ...form, origin_country: e.target.value })} />
              </div>
              <div>
                <Label>Destination city</Label>
                <Input value={form.destination_city} onChange={(e) => setForm({ ...form, destination_city: e.target.value })} placeholder="Eldoret / London" />
              </div>
              <div>
                <Label>Destination country</Label>
                <Input value={form.destination_country} onChange={(e) => setForm({ ...form, destination_country: e.target.value })} />
              </div>
              <div>
                <Label>Transport mode</Label>
                <Select value={form.transport_mode} onValueChange={(v) => setForm({ ...form, transport_mode: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="road">Road</SelectItem>
                    <SelectItem value="air">Air</SelectItem>
                    <SelectItem value="sea">Sea</SelectItem>
                    <SelectItem value="rail">Rail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Currency</Label>
                <Select value={form.currency} onValueChange={(v) => setForm({ ...form, currency: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KES">KES</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="UGX">UGX</SelectItem>
                    <SelectItem value="TZS">TZS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Departure date</Label>
                <Input type="date" value={form.departure_date} onChange={(e) => setForm({ ...form, departure_date: e.target.value })} />
              </div>
              <div>
                <Label>Arrival date (optional)</Label>
                <Input type="date" value={form.arrival_date} onChange={(e) => setForm({ ...form, arrival_date: e.target.value })} />
              </div>
              <div>
                <Label>Available kg</Label>
                <Input type="number" step="0.1" value={form.available_kg} onChange={(e) => setForm({ ...form, available_kg: e.target.value })} />
              </div>
              <div>
                <Label>Price per kg</Label>
                <Input type="number" step="0.01" value={form.price_per_kg} onChange={(e) => setForm({ ...form, price_per_kg: e.target.value })} />
              </div>
              <div>
                <Label>Minimum kg</Label>
                <Input type="number" step="0.1" value={form.min_kg} onChange={(e) => setForm({ ...form, min_kg: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <Label>Notes</Label>
                <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Pickup at office, paid on collection, no liquids, etc." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenCreate(false)}>Cancel</Button>
              <Button onClick={submitListing}>Publish</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="mb-4">
        <TabsList>
          <TabsTrigger value="intl">International</TabsTrigger>
          <TabsTrigger value="local">Local</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
      </Tabs>

      <Input
        placeholder="Search by city, country, or provider..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6"
      />

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            No open capacity yet for this filter. Be the first — click <strong>Publish Capacity</strong>.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((l) => (
            <Card key={l.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {modeIcon(l.transport_mode)}
                      {l.origin_city} → {l.destination_city}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {l.origin_country} → {l.destination_country}
                    </CardDescription>
                  </div>
                  {l.is_international && <Badge>International</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-3 w-3" /> Departs {new Date(l.departure_date).toLocaleDateString()}
                  {l.arrival_date && <> • Arrives {new Date(l.arrival_date).toLocaleDateString()}</>}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Package className="h-3 w-3" /> {l.available_kg} kg available • min {l.min_kg || 1} kg
                </div>
                <div className="text-base font-semibold text-foreground">
                  {l.currency} {l.price_per_kg.toFixed(2)} / kg
                </div>
                <div className="text-xs text-muted-foreground">
                  By <strong>{l.provider_name}</strong> ({l.provider_type.replace("_", " ")})
                </div>
                {l.notes && <p className="text-xs italic">{l.notes}</p>}
                <Button className="w-full mt-2" onClick={() => setBookingFor(l)}>Book Space</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!bookingFor} onOpenChange={(o) => !o && setBookingFor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book capacity</DialogTitle>
          </DialogHeader>
          {bookingFor && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {bookingFor.origin_city} → {bookingFor.destination_city} • {bookingFor.currency} {bookingFor.price_per_kg}/kg
              </p>
              <div>
                <Label>Kg to book (max {bookingFor.available_kg})</Label>
                <Input type="number" step="0.1" value={bookingKg} onChange={(e) => setBookingKg(e.target.value)} />
              </div>
              <div>
                <Label>Package description</Label>
                <Textarea value={bookingDesc} onChange={(e) => setBookingDesc(e.target.value)} placeholder="Documents, clothes, electronics..." />
              </div>
              {bookingKg && !isNaN(parseFloat(bookingKg)) && (
                <p className="text-sm font-semibold">
                  Estimated total: {bookingFor.currency} {(parseFloat(bookingKg) * bookingFor.price_per_kg).toFixed(2)}
                </p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setBookingFor(null)}>Cancel</Button>
            <Button onClick={submitBooking}>Request booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mt-8">
        <Disclaimers type="all" />
      </div>
    </div>
  );
}
