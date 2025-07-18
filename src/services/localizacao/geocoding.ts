export async function geocodeCidade(
  cidade: string,
  estado: string
): Promise<{ lat: number; lon: number }> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search` +
      `?city=${encodeURIComponent(cidade)}` +
      `&state=${encodeURIComponent(estado)}` +
      `&country=Brasil&format=json&limit=1`
  );
  const [first] = (await res.json()) as Array<{ lat: string; lon: string }>;
  return { lat: parseFloat(first.lat), lon: parseFloat(first.lon) };
}
