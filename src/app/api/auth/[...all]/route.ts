// Mock auth handler - auth is handled client-side with mock data
export async function GET() {
  return new Response(JSON.stringify({ message: "Auth not available in mock mode" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST() {
  return new Response(JSON.stringify({ message: "Auth not available in mock mode" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
