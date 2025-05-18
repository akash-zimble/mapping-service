export interface MappingConfig {
    source: string | string[];
    transform?: string;
    type: 'string' | 'number' | 'boolean' | 'null' | 'undefined';
    constraints?: {
      maxLength?: number; // For string
      min?: number; // For number
      max?: number; // For number
    };
  }
  
  export interface TranslatorEntry {
    key: string;
    value: string;
  }

  export type Translator = Record<string, TranslatorEntry[]>;