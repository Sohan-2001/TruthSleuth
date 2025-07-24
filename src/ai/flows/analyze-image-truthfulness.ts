'use server';

/**
 * @fileOverview Analyzes the truthfulness of text extracted from an image.
 *
 * - analyzeImageTruthfulness - A function that handles the analysis of image content and returns a truthfulness percentage.
 * - AnalyzeImageTruthfulnessInput - The input type for the analyzeImageTruthfulness function.
 * - AnalyzeImageTruthfulnessOutput - The return type for the analyzeImageTruthfulness function.
 */

import {ai} from '@/ai/genkit';
import { AnalyzeImageTruthfulnessInputSchema, AnalyzeImageTruthfulnessOutputSchema, type AnalyzeImageTruthfulnessInput, type AnalyzeImageTruthfulnessOutput } from '@/lib/types';


export async function analyzeImageTruthfulness(
  input: AnalyzeImageTruthfulnessInput
): Promise<AnalyzeImageTruthfulnessOutput> {
  return analyzeImageTruthfulnessFlow(input);
}

const analyzeImageTruthfulnessPrompt = ai.definePrompt({
  name: 'analyzeImageTruthfulnessPrompt',
  input: {schema: AnalyzeImageTruthfulnessInputSchema},
  output: {schema: AnalyzeImageTruthfulnessOutputSchema},
  prompt: `Analyze the text within the following image to determine its truthfulness. Provide a percentage score (0-100) indicating the likelihood that the content is true.

Image: {{media url=photoDataUri}}

Consider factors such as the source's reputation, the presence of logical fallacies, and the availability of corroborating evidence. Return ONLY a percentage without any additional text.`, // Modified prompt to request percentage only
});

const analyzeImageTruthfulnessFlow = ai.defineFlow(
  {
    name: 'analyzeImageTruthfulnessFlow',
    inputSchema: AnalyzeImageTruthfulnessInputSchema,
    outputSchema: AnalyzeImageTruthfulnessOutputSchema,
  },
  async input => {
    const {output} = await analyzeImageTruthfulnessPrompt(input);
    return output!;
  }
);
