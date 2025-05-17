import { MappingConfig, TranslatorEntry } from '../interfaces/mapping-config';
import { TransformResult } from '../interfaces/transformer';
import { BaseTransformer } from './base-transformer';

export class TranslateTransformer extends BaseTransformer {
  transform(config: MappingConfig, sourceValues: any[], translator: Record<string, TranslatorEntry[]>): TransformResult {
    if (!config.transform) return { value: sourceValues[0], errors: [] };
    const { params } = this.parseTransformExpression(config.transform);

    // Ensure params[1] is a literal and extract the translator key
    if (params.length < 2 || params[1].type !== 'literal') {
      return { value: sourceValues[0], errors: [`Invalid translator parameter in transform: ${config.transform}`] };
    }
    const translatorKey = params[1].value.match(/translator\['(.+)'\]/)?.[1];
    if (!translatorKey || !translator[translatorKey]) {
      return { value: sourceValues[0], errors: [`Invalid translator key: ${translatorKey}`] };
    }

    const translation = translator[translatorKey].find(t => t.key === sourceValues[0]);
    return { value: translation ? translation.value : sourceValues[0], errors: [] };
  }
}