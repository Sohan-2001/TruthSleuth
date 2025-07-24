
'use server';
/**
 * @fileOverview This file defines a Genkit flow for analyzing the truthfulness of news from a URL.
 *
 * It uses a web scraping service to fetch the content from the URL and then passes it to the
 * news analysis flow.
 * - analyzeUrlTruthfulness - The function to analyze news truthfulness from a URL.
 * - AnalyzeUrlTruthfulnessInput - The input type for the analyzeUrlTruthfulness function.
 * - AnalyzeUrlTruthfulnessOutput - The output type for the analyzeUrlTruthfulness function.
 */

import { ai } from '@/ai/genkit';
import { AnalyzeUrlTruthfulnessInputSchema, type AnalyzeUrlTruthfulnessInput, type AnalyzeNewsTruthfulnessOutput, AnalyzeNewsTruthfulnessOutputSchema } from '@/lib/types';
import { analyzeNewsTruthfulness } from './analyze-news-truthfulness';

export type AnalyzeUrlTruthfulnessOutput = AnalyzeNewsTruthfulnessOutput;

async function fetchUrlContent(url: string): Promise<string> {
  const jinaUrl = `https://r.jina.ai/${url}`;
  try {
    const response = await fetch(jinaUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.JINA_API_KEY}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Failed to fetch URL content from Jina API. Status: ${response.status}. Body: ${errorBody}`);
    }

    const data = await response.json();
    return data.data.content;
  } catch (error) {
    console.error('Error fetching URL content:', error);
    throw new Error('Could not retrieve content from the provided URL.');
  }
}

export async function analyzeUrlTruthfulness(input: AnalyzeUrlTruthfulnessInput): Promise<AnalyzeUrlTruthfulnessOutput> {
  return analyzeUrlTruthfulnessFlow(input);
}

const analyzeUrlTruthfulnessFlow = ai.defineFlow(
  {
    name: 'analyzeUrlTruthfulnessFlow',
    inputSchema: AnalyzeUrlTruthfulnessInputSchema,
    outputSchema: AnalyzeNewsTruthfulnessOutputSchema,
  },
  async ({ url }) => {
    const newsText = await fetchUrlContent(url);
    if (!newsText || newsText.trim().length === 0) {
      throw new Error('Could not extract meaningful content from the URL.');
    }
    // Now, call the existing text analysis flow with the scraped content
    return await analyzeNewsTruthfulness({ newsText });
  }
);
