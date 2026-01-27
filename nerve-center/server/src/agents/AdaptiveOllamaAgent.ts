
/**
 * 🧠 Adaptive Ollama Agent - Local AI Interface
 * Wrapper for interacting with local LLMs via Ollama.
 */

import axios from 'axios';

export class AdaptiveOllamaAgent {
    private model: string;
    private baseUrl: string;

    constructor(model: string = 'llama3', baseUrl: string = 'http://localhost:11434') {
        this.model = model;
        this.baseUrl = baseUrl;
        console.log(`[AdaptiveOllamaAgent] Initialized with model: ${model}`);
    }

    public async generateResponse(prompt: string): Promise<string> {
        try {
            const response = await axios.post(`${this.baseUrl}/api/generate`, {
                model: this.model,
                prompt: prompt,
                stream: false
            });
            return response.data.response;
        } catch (error) {
            console.error('[AdaptiveOllamaAgent] Generation failed:', error);
            return "AI_OFFLINE_OR_UNREACHABLE";
        }
    }
}
