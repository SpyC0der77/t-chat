// Empty API route - kept for structure but no functionality
export const maxDuration = 30;
export const runtime = 'edge';

export async function POST(req: Request) {
  return new Response('Not implemented', {
    status: 501,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
