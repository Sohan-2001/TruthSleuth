'use server';
/**
 * @fileOverview This file defines a Genkit flow for analyzing the truthfulness of news content.
 *
 * It takes news text as input and returns a truthfulness percentage based on AI analysis.
 * - analyzeNewsTruthfulness - The function to analyze news truthfulness.
 * - AnalyzeNewsTruthfulnessInput - The input type for the analyzeNewsTruthfulness function.
 * - AnalyzeNewsTruthfulnessOutput - The output type for the analyzeNewsTruthfulness function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeNewsTruthfulnessInputSchema = z.object({
  newsText: z.string().describe('The news text to analyze for truthfulness.'),
});
export type AnalyzeNewsTruthfulnessInput = z.infer<typeof AnalyzeNewsTruthfulnessInputSchema>;

const AnalyzeNewsTruthfulnessOutputSchema = z.object({
  truthfulnessPercentage: z
    .number()
    .min(0)
    .max(100)
    .describe('The percentage likelihood that the news is true.'),
  reason: z.string().optional().describe('The reasoning behind the truthfulness score.'),
  summary: z.string().describe('A brief, neutral summary of the news text, no more than 10 words.'),
});
export type AnalyzeNewsTruthfulnessOutput = z.infer<typeof AnalyzeNewsTruthfulnessOutputSchema>;

export async function analyzeNewsTruthfulness(input: AnalyzeNewsTruthfulnessInput): Promise<AnalyzeNewsTruthfulnessOutput> {
  return analyzeNewsTruthfulnessFlow(input);
}

const analyzeNewsTruthfulnessPrompt = ai.definePrompt({
  name: 'analyzeNewsTruthfulnessPrompt',
  input: {schema: AnalyzeNewsTruthfulnessInputSchema},
  output: {schema: AnalyzeNewsTruthfulnessOutputSchema},
  prompt: `You are an expert fact checker. Analyze the following news text and determine the truthfulness percentage.

News Text: {{{newsText}}}

Provide a truthfulness percentage (0-100), the reasoning behind your assessment, and a brief, neutral summary of the news text (no more than 10 words).
Format your response as a JSON object:
{
  "truthfulnessPercentage": number,
  "reason": string,
  "summary": string
}
`,
});

const analyzeNewsTruthfulnessFlow = ai.defineFlow(
  {
    name: 'analyzeNewsTruthfulnessFlow',
    inputSchema: AnalyzeNewsTruthfulnessInputSchema,
    outputSchema: AnalyzeNewsTruthfulnessOutputSchema,
  },
  async input => {
    const {output} = await analyzeNewsTruthfulnessPrompt(input);
    return output!;
  }
);
