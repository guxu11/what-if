import OpenAI from 'openai';
import dotenv from 'dotenv';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load environment variables
dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '../../.env') });

class GLMService {
  constructor() {
    if (!process.env.GLM_API_KEY) {
      console.warn('GLM_API_KEY not found in environment variables');
    }

    this.client = new OpenAI({
      apiKey: process.env.GLM_API_KEY || '',
      baseURL: 'https://api.z.ai/api/paas/v4/'
    });

    this.defaultModel = 'glm-4.7';
  }

  /**
   * Generate a story prompt based on user input
   */
  generateStoryPrompt(scenario, outputLanguage = 'en') {
    const languageMap = {
      en: 'English',
      es: 'Spanish',
      fr: 'French',
      de: 'German',
      zh: 'Chinese (Simplified)',
      ja: 'Japanese',
      pt: 'Portuguese'
    };

    const language = languageMap[outputLanguage] || 'English';

    return {
      role: 'system',
      content: `You are a master storyteller creating epic, emotionally resonant interactive stories. Your task is to write in ${language} with the following characteristics:

1. **Epic Quality**: Create stories that are deeply moving, with emotional depth, rich characters, and meaningful consequences. Each story should feel "dàng qì huí cháng" (荡气回肠) - soul-stirring and unforgettable.

2. **Engaging Narrative**: Write compelling narratives that draw the reader in. Use vivid descriptions, dialogue, and pacing that keeps readers invested.

3. **Meaningful Choices**: Present choices that matter. Each option should lead to different, equally valid paths with unique consequences.

4. **Character Development**: Create characters with depth, motivations, and growth arcs.

5. **World Building**: Establish a vivid setting that feels real and immersive.

6. **Theme and Message**: Each story should explore universal themes (love, sacrifice, ambition, redemption, etc.) in a thoughtful way.

Format your response as JSON with this structure:
{
  "text": "The main story text (1-3 paragraphs)",
  "choices": [
    {
      "text": "Choice 1 (clear and compelling)",
      "outcome": "Brief hint of consequences"
    },
    ...
  ],
  "isEnding": false
}

Keep each response under 500 words for the story text. Make choices distinct and meaningful. Never make choices obvious or stereotypical.`
    };
  }

  /**
   * Generate story content using GLM
   */
  async generateStory(scenario, userChoice = null, storyHistory = [], outputLanguage = 'en') {
    try {
      const messages = [
        this.generateStoryPrompt(scenario, outputLanguage)
      ];

      // Add scenario context
      messages.push({
        role: 'user',
        content: `Create a story scenario based on this prompt: "${scenario}"${userChoice ? `\n\nThe player just chose: "${userChoice}"` : ''}${storyHistory.length > 0 ? `\n\nStory history so far:\n${storyHistory.map(h => `- ${h}`).join('\n')}` : ''}\n\nGenerate the next part of this epic story with meaningful choices.`
      });

      const response = await this.client.chat.completions.create({
        model: this.defaultModel,
        messages,
        temperature: 0.8,
        max_tokens: 1500,
      });

      const content = response.choices[0].message.content;
      
      // Try to parse JSON response
      try {
        const parsed = JSON.parse(content);
        return parsed;
      } catch (parseError) {
        // If parsing fails, return the raw text with default choices
        return {
          text: content,
          choices: [
            { text: "Continue forward", outcome: "Unknown path awaits" },
            { text: "Take a different approach", outcome: "Risky but may yield rewards" }
          ],
          isEnding: false
        };
      }
    } catch (error) {
      console.error('GLM API error:', error);
      throw new Error(`Failed to generate story: ${error.message}`);
    }
  }

  /**
   * Generate a story ending/reflection
   */
  async generateEnding(storyHistory, finalChoice, outputLanguage = 'en') {
    try {
      const languageMap = {
        en: 'English',
        es: 'Spanish',
        fr: 'French',
        de: 'German',
        zh: 'Chinese (Simplified)',
        ja: 'Japanese',
        pt: 'Portuguese'
      };

      const language = languageMap[outputLanguage] || 'English';

      const messages = [
        {
          role: 'system',
          content: `You are a wise storyteller providing profound reflections on completed journeys. Write in ${language}. Create a thoughtful, moving reflection that:
1. Summarizes the journey
2. Explores the themes of the choices made
3. Offers wisdom about life, choices, and the human experience
4. Is soul-stirring and memorable ("dàng qì huí cháng")
5. Is 200-400 words`
        },
        {
          role: 'user',
          content: `The player completed a story journey with these key moments:\n${storyHistory.map(h => `- ${h}`).join('\n')}\n\nFinal choice: "${finalChoice}"\n\nWrite a profound, moving reflection on this journey.`
        }
      ];

      const response = await this.client.chat.completions.create({
        model: this.defaultModel,
        messages,
        temperature: 0.9,
        max_tokens: 800,
      });

      return {
        text: response.choices[0].message.content,
        isEnding: true
      };
    } catch (error) {
      console.error('GLM API error:', error);
      throw new Error(`Failed to generate ending: ${error.message}`);
    }
  }

  /**
   * Stream story generation
   */
  async *generateStoryStream(scenario, userChoice = null, storyHistory = [], outputLanguage = 'en') {
    try {
      const messages = [
        this.generateStoryPrompt(scenario, outputLanguage)
      ];

      messages.push({
        role: 'user',
        content: `Create a story scenario based on this prompt: "${scenario}"${userChoice ? `\n\nThe player just chose: "${userChoice}"` : ''}${storyHistory.length > 0 ? `\n\nStory history so far:\n${storyHistory.map(h => `- ${h}`).join('\n')}` : ''}\n\nGenerate the next part of this epic story with meaningful choices.`
      });

      const stream = await this.client.chat.completions.create({
        model: this.defaultModel,
        messages,
        temperature: 0.8,
        max_tokens: 1500,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          yield content;
        }
      }
    } catch (error) {
      console.error('GLM streaming error:', error);
      throw new Error(`Failed to stream story: ${error.message}`);
    }
  }

  /**
   * Detect language from text
   */
  detectLanguage(text) {
    // Simple heuristic-based language detection
    // Note: Japanese should be checked before Chinese since it shares kanji
    const patterns = {
      ja: /[\u3040-\u309f\u30a0-\u30ff]/,
      zh: /[\u4e00-\u9fff]/,
      de: /\b(der|die|das|ist|und|ich|du|er|sie)\b/i,
      fr: /\b(le|la|les|un|une|des|de|à|au)\b/i,
      es: /\b(el|la|los|las|un|una|de|en|por|para)\b/i,
      pt: /\b(o|a|os|as|um|uma|de|em|por|para)\b/i
    };

    for (const [lang, pattern] of Object.entries(patterns)) {
      if (pattern.test(text)) {
        return lang;
      }
    }

    return 'en'; // Default to English
  }
}

// Export singleton instance
export default new GLMService();
