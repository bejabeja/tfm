import Groq from 'groq-sdk';

export class AIService {
  constructor() {
    this.client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  async generateTextPrompt(destination, totalDays, context = {}) {
    const { category, numberOfTravellers, budget, currency, intention, language } = context;

    const contextLines = [
      category && category !== 'other' ? `- Trip style: ${category}` : null,
      numberOfTravellers ? `- Travelers: ${numberOfTravellers}` : null,
      budget && currency ? `- Budget: ${budget} ${currency} total` : null,
    ].filter(Boolean).join('\n');

    const intentionBlock = intention?.trim() ? `
TRAVELER'S SPECIFIC WISHES — THIS IS YOUR PRIMARY DIRECTIVE:
"${intention.trim()}"

You MUST:
1. If the traveler mentioned specific places, landmarks, or activities — include them EXACTLY (e.g. "Santa Claus Village" → include it; "snowmobile" → include a snowmobile activity; "fly to Helsinki" → include a flight/airport step).
2. Build the remaining places around those specific requests.
3. Never substitute or ignore what the traveler explicitly asked for.
` : '';

    const languageInstruction = language === 'es'
      ? '\nGenerate ALL text fields (title, description, label) in Spanish.'
      : '';

    const systemPrompt = `You are an expert travel planner creating highly personalized itineraries.
Your most important job is to read the traveler's specific wishes and satisfy them directly.
Output ONLY valid raw JSON. No markdown, no explanation, no extra text.`;

    const userPrompt = `Create a ${totalDays}-day itinerary for ${destination}.
${intentionBlock}
${contextLines ? `Trip context:\n${contextLines}` : ''}
${languageInstruction}

Generate exactly ${totalDays * 3} places total — 3 per day, days 1 to ${totalDays}.

Each place must be a JSON object with:
- title: name of the place or activity (string)
- description: 1-2 engaging sentences (string)
- label: very short label, max 3 words (string)
- latitude: real decimal coordinate (number)
- longitude: real decimal coordinate (number)
- category: exactly one of [nature, beach, city, park, monument, camping, island, sport, vineyard, other]
- dayNumber: which day, 1 to ${totalDays} (number)

Output ONLY this JSON structure:
{
  "destination": "${destination}",
  "totalDays": ${totalDays},
  "places": [ ... ]
}`;

    try {
      const response = await this.client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user',   content: userPrompt },
        ],
        temperature: 0.4,
        max_tokens: 4000,
      });

      const text = response.choices[0]?.message?.content;
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No valid JSON found in response');
      return jsonMatch[0];
    } catch (error) {
      console.error('Error generating itinerary:', error);
      throw error;
    }
  }
}
