export async function onRequestGet(context) {
  return new Response("Hello from Cloudflare API!", {
    headers: { "Content-Type": "text/plain" },
  })
}
