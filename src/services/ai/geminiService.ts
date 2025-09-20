import axios, { AxiosInstance, AxiosError } from 'axios';
import { 
  GeminiAPIRequest, 
  GeminiAPIResponse, 
  ProjectPlan, 
  Phase, 
  Task,
  Optional
} from '../../types';
import { 
  API_CONFIG, 
  AI_PROMPT_TEMPLATES, 
  ERROR_MESSAGES 
} from '../../constants';
import { storageService } from '../storage/storageService';

class GeminiService {
  private apiClient: AxiosInstance;
  private apiKey: string | null = null;

  constructor() {
    this.apiClient = axios.create({
      baseURL: API_CONFIG.GEMINI_BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Initialize API key from storage
    this.initializeApiKey();
  }

  private async initializeApiKey() {
    try {
      this.apiKey = await storageService.getApiKey();
      if (this.apiKey) {
        this.setupApiClient();
      }
    } catch (error) {
      console.warn('Failed to load API key from storage:', error);
    }
  }

  private setupApiClient() {
    if (!this.apiKey) return;

    this.apiClient.defaults.headers.common['Authorization'] = `Bearer ${this.apiKey}`;
  }

  public async setApiKey(apiKey: string): Promise<void> {
    this.apiKey = apiKey;
    this.setupApiClient();
    await storageService.saveApiKey(apiKey);
  }

  public hasApiKey(): boolean {
    return !!this.apiKey;
  }

  private async makeRequest(request: GeminiAPIRequest): Promise<GeminiAPIResponse> {
    if (!this.apiKey) {
      throw new Error(ERROR_MESSAGES.API_KEY_INVALID);
    }

    try {
      const response = await this.apiClient.post('/models/gemini-pro:generateContent', {
        contents: [{
          parts: [{
            text: this.buildPrompt(request.prompt, request.context)
          }]
        }],
        generationConfig: {
          temperature: request.parameters?.temperature ?? 0.7,
          maxOutputTokens: request.parameters?.maxTokens ?? 4096,
          topP: request.parameters?.topP ?? 0.9,
        }
      });

      const content = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!content) {
        throw new Error('No content received from Gemini API');
      }

      return {
        content,
        usage: {
          promptTokens: response.data?.usageMetadata?.promptTokenCount || 0,
          completionTokens: response.data?.usageMetadata?.candidatesTokenCount || 0,
          totalTokens: response.data?.usageMetadata?.totalTokenCount || 0,
        }
      };

    } catch (error) {
      return this.handleApiError(error);
    }
  }

  private buildPrompt(template: string, context?: string): string {
    let prompt = template;
    
    if (context) {
      prompt = prompt.replace('{context}', context);
    }
    
    return prompt;
  }

  private handleApiError(error: any): GeminiAPIResponse {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      
      if (axiosError.response?.status === 401) {
        return { content: '', error: ERROR_MESSAGES.API_KEY_INVALID };
      } else if (axiosError.response?.status === 429) {
        return { content: '', error: ERROR_MESSAGES.API_RATE_LIMIT };
      } else if (!axiosError.response) {
        return { content: '', error: ERROR_MESSAGES.NETWORK_ERROR };
      }
    }
    
    return { 
      content: '', 
      error: error.message || ERROR_MESSAGES.UNKNOWN_ERROR 
    };
  }

  public async analyzeProjectIdea(idea: string, context?: string): Promise<GeminiAPIResponse> {
    const prompt = AI_PROMPT_TEMPLATES.PROJECT_ANALYSIS
      .replace('{idea}', idea)
      .replace('{context}', context || 'No additional context provided');

    return this.makeRequest({
      prompt,
      parameters: {
        temperature: 0.7,
        maxTokens: 3000,
      }
    });
  }

  public async generateRoadmap(
    title: string, 
    description: string, 
    duration: number, 
    complexity: 'low' | 'medium' | 'high'
  ): Promise<GeminiAPIResponse> {
    const prompt = AI_PROMPT_TEMPLATES.ROADMAP_GENERATION
      .replace('{title}', title)
      .replace('{description}', description)
      .replace('{duration}', duration.toString())
      .replace('{complexity}', complexity);

    return this.makeRequest({
      prompt,
      parameters: {
        temperature: 0.6,
        maxTokens: 2500,
      }
    });
  }

  public async breakdownTasks(
    phaseTitle: string,
    phaseDescription: string,
    duration: number,
    deliverables: string[]
  ): Promise<GeminiAPIResponse> {
    const prompt = AI_PROMPT_TEMPLATES.TASK_BREAKDOWN
      .replace('{phaseTitle}', phaseTitle)
      .replace('{phaseDescription}', phaseDescription)
      .replace('{duration}', duration.toString())
      .replace('{deliverables}', deliverables.join(', '));

    return this.makeRequest({
      prompt,
      parameters: {
        temperature: 0.5,
        maxTokens: 2000,
      }
    });
  }

  public async optimizeSchedule(
    tasks: Task[],
    workingDays: number[],
    dailyHours: number,
    startDate: string,
    dependencies: Record<string, string[]>
  ): Promise<GeminiAPIResponse> {
    const prompt = AI_PROMPT_TEMPLATES.SCHEDULE_OPTIMIZATION
      .replace('{tasks}', JSON.stringify(tasks.map(t => ({ 
        id: t.id, 
        title: t.title, 
        estimatedHours: t.estimatedHours,
        priority: t.priority 
      }))))
      .replace('{workingDays}', workingDays.join(', '))
      .replace('{dailyHours}', dailyHours.toString())
      .replace('{startDate}', startDate)
      .replace('{dependencies}', JSON.stringify(dependencies));

    return this.makeRequest({
      prompt,
      parameters: {
        temperature: 0.4,
        maxTokens: 2000,
      }
    });
  }

  // Parse AI response into structured data
  public parseProjectAnalysis(content: string): Optional<ProjectPlan, 'id' | 'createdAt' | 'updatedAt' | 'customizations' | 'schedule' | 'progress'> | null {
    try {
      // This is a simplified parser - in a real implementation, you'd use more sophisticated parsing
      // or ask the AI to return structured JSON
      const lines = content.split('\n').filter(line => line.trim());
      
      const plan: Optional<ProjectPlan, 'id' | 'createdAt' | 'updatedAt' | 'customizations' | 'schedule' | 'progress'> = {
        title: this.extractValue(content, 'Project Title:', 'Title:') || 'Untitled Project',
        description: this.extractValue(content, 'Description:', 'Summary:') || '',
        status: 'draft',
        aiGenerated: {
          originalIdea: '',
          guide: content,
          roadmap: this.parseRoadmap(content),
          estimatedDuration: this.extractDuration(content) || 30,
          complexity: this.extractComplexity(content) || 'medium',
          generatedAt: new Date(),
        }
      };

      return plan;
    } catch (error) {
      console.error('Failed to parse project analysis:', error);
      return null;
    }
  }

  public parseRoadmap(content: string): Phase[] {
    try {
      const phases: Phase[] = [];
      const phasePattern = /Phase \d+:?\s*([^\n]+)/gi;
      let match;
      let phaseIndex = 0;

      while ((match = phasePattern.exec(content)) !== null) {
        const phaseTitle = match[1].trim();
        const phaseId = `phase-${phaseIndex + 1}`;
        
        phases.push({
          id: phaseId,
          title: phaseTitle,
          description: this.extractPhaseDescription(content, phaseTitle),
          order: phaseIndex,
          estimatedDuration: this.extractPhaseDuration(content, phaseTitle) || 7,
          prerequisites: phaseIndex > 0 ? [`phase-${phaseIndex}`] : [],
          deliverables: this.extractDeliverables(content, phaseTitle),
          tasks: [], // Tasks would be generated separately
        });

        phaseIndex++;
      }

      return phases;
    } catch (error) {
      console.error('Failed to parse roadmap:', error);
      return [];
    }
  }

  public parseTasks(content: string, phaseId: string): Task[] {
    try {
      const tasks: Task[] = [];
      const taskPattern = /(?:Task|Step) \d+:?\s*([^\n]+)/gi;
      let match;
      let taskIndex = 0;

      while ((match = taskPattern.exec(content)) !== null) {
        const taskTitle = match[1].trim();
        const taskId = `${phaseId}-task-${taskIndex + 1}`;
        
        tasks.push({
          id: taskId,
          title: taskTitle,
          description: this.extractTaskDescription(content, taskTitle),
          phaseId,
          priority: this.extractTaskPriority(content, taskTitle),
          status: 'todo',
          estimatedHours: this.extractTaskHours(content, taskTitle) || 8,
          dependencies: [],
          tags: this.extractTaskTags(content, taskTitle),
        });

        taskIndex++;
      }

      return tasks;
    } catch (error) {
      console.error('Failed to parse tasks:', error);
      return [];
    }
  }

  // Helper methods for parsing
  private extractValue(content: string, ...patterns: string[]): string | null {
    for (const pattern of patterns) {
      const regex = new RegExp(`${pattern}\\s*([^\n]+)`, 'i');
      const match = content.match(regex);
      if (match) return match[1].trim();
    }
    return null;
  }

  private extractDuration(content: string): number | null {
    const patterns = [
      /(\d+)\s*days?/i,
      /(\d+)\s*weeks?/i,
      /(\d+)\s*months?/i,
    ];

    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match) {
        const value = parseInt(match[1]);
        if (pattern.source.includes('week')) return value * 7;
        if (pattern.source.includes('month')) return value * 30;
        return value;
      }
    }

    return null;
  }

  private extractComplexity(content: string): 'low' | 'medium' | 'high' | null {
    const complexityMatch = content.match(/complexity:?\s*(low|medium|high)/i);
    return complexityMatch ? complexityMatch[1].toLowerCase() as 'low' | 'medium' | 'high' : null;
  }

  private extractPhaseDescription(content: string, phaseTitle: string): string {
    // Implementation would extract description for specific phase
    return `Description for ${phaseTitle}`;
  }

  private extractPhaseDuration(content: string, phaseTitle: string): number | null {
    // Implementation would extract duration for specific phase
    return 7; // Default 1 week
  }

  private extractDeliverables(content: string, phaseTitle: string): string[] {
    // Implementation would extract deliverables for specific phase
    return [];
  }

  private extractTaskDescription(content: string, taskTitle: string): string {
    return `Description for ${taskTitle}`;
  }

  private extractTaskPriority(content: string, taskTitle: string): 'low' | 'medium' | 'high' {
    return 'medium'; // Default priority
  }

  private extractTaskHours(content: string, taskTitle: string): number | null {
    return 8; // Default 1 day
  }

  private extractTaskTags(content: string, taskTitle: string): string[] {
    return [];
  }
}

export const geminiService = new GeminiService();
export default geminiService;