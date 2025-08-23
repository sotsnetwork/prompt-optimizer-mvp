import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const aimlApiKey = Deno.env.get('AIMLAPI_KEY');
    if (!aimlApiKey) {
      console.error('AIMLAPI_KEY not found in environment');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const optimizationPrompt = `You are an expert prompt engineer. Your task is to optimize the following prompt to make it more effective, clear, and likely to produce better results from AI models.

Guidelines for optimization:
- Make the prompt more specific and detailed
- Add relevant context and constraints
- Improve clarity and remove ambiguity
- Add examples if helpful
- Structure the prompt logically
- Use clear, direct language
- Add role-based instructions if appropriate

Original prompt to optimize:
"${prompt}"

Please provide only the optimized prompt without any explanations or additional text.`;

    console.log('Calling AIMLAPI with prompt:', prompt);

    const response = await fetch('https://api.aimlapi.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${aimlApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: optimizationPrompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AIMLAPI error response:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: `API request failed: ${response.status}` }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    console.log('AIMLAPI response:', data);

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid response structure from AIMLAPI:', data);
      return new Response(
        JSON.stringify({ error: 'Invalid response from AI service' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const optimizedPrompt = data.choices[0].message.content.trim();

    return new Response(
      JSON.stringify({ 
        originalPrompt: prompt,
        optimizedPrompt: optimizedPrompt 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in optimize-prompt function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});