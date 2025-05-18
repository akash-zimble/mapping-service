import { MappingConfig, TranslatorEntry } from '../interfaces/mapping-config';

interface Mapping {
  id: string;
  config: Record<string, MappingConfig>;
}

interface Translator {
  id: string;
  config: Record<string, TranslatorEntry[]>;
}

const mappings: Mapping[] = [
  {
    id: 'user-profile',
    config: {
      'profile.name.full': {
        source: ['user.first_name', 'user.last_name'],
        transform: "concat(source[0], ' ', source[1])",
        type: 'string',
        constraints: { maxLength: 50 }
      },
      'profile.age': {
        source: 'age',
        type: 'number',
        constraints: { min: 18, max: 100 }
      },
      'membership_level': {
        source: 'membership',
        transform: "translate(source, translator['membership'])",
        type: 'string'
      },
      'product_id': {
        source: ['product.details.code', 'product.details.suffix', 'product.details.extra'],
        transform: "concat(source[0], '-', source[1], '[', source[2], ']')",
        type: 'string',
        constraints: { maxLength: 15 }
      },
      'product_name': {
        source: ['product.details.code', 'product.details.suffix', 'product.details.extra', 'membership'],
        transform: "concat(source[0], '-', source[1], '[', source[2], ']', source[3])",
        type: 'string',
        constraints: { maxLength: 20 }
      },
      'is_active': {
        source: 'is_active',
        type: 'boolean'
      },
      'null_field': {
        source: 'null_field',
        type: 'null'
      },
      'undefined_field': {
        source: 'undefined_field',
        type: 'undefined'
      },
      'profile.address.city': {
        source: 'user.address.city',
        type: 'string',
        constraints: { maxLength: 100 }
      },
      'profile.address.country': {
        source: 'user.address.country',
        type: 'string',
        constraints: { maxLength: 100 }
      }
    }
  }
];

const translators: Translator[] = [
  {
    id: 'membership',
    config: {
      'membership': [
        { key: 'gold', value: 'Premium' },
        { key: 'silver', value: 'Standard' },
        { key: 'bronze', value: 'Basic' }
      ]
    }
  }
];

const mappingCache = new Map<string, Record<string, MappingConfig>>();
const translatorCache = new Map<string, Record<string, TranslatorEntry[]>>();

export function getMappingConfig(mapId: string): Record<string, MappingConfig> {
  if (mappingCache.has(mapId)) return mappingCache.get(mapId)!;
  const mapping = mappings.find(m => m.id === mapId);
  if (!mapping) throw new Error(`Mapping configuration not found for mapId: ${mapId}`);
  mappingCache.set(mapId, mapping.config);
  return mapping.config;
}

export function getTranslatorConfig(translatorIds: string[]): Record<string, TranslatorEntry[]> {
    const cacheKey = JSON.stringify(translatorIds);
    if (translatorCache.has(cacheKey)) return translatorCache.get(cacheKey)!;
  
    const translatorConfig: Record<string, TranslatorEntry[]> = {};
    for (const id of translatorIds) {
      const translator = translators.find(t => t.id === id);
      if (!translator) {
        throw new Error(`Translator configuration not found for translatorId: ${id}`);
      }
      Object.assign(translatorConfig, translator.config);
    }
  
    translatorCache.set(cacheKey, translatorConfig);
    return translatorConfig;
  }