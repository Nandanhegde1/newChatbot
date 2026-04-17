export default {
  async fetch(request, env) {
    // 1. Define who is allowed to talk to this worker
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*", // Allows any site to talk to your worker
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // 2. Handle the "Preflight" check (Browser asking for permission)
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // 3. Only process POST requests
    if (request.method === "POST") {
      try {
        const body = await request.json();
        
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01"
          },
          body: JSON.stringify(body)
        });

        const data = await response.json();

        return new Response(JSON.stringify(data), { 
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { 
          status: 500, 
          headers: corsHeaders 
        });
      }
    }

    return new Response("Not Found", { status: 404 });
  }
};
