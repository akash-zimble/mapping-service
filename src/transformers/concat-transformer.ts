import { MappingConfig } from '../interfaces/mapping-config';
import { TransformResult } from '../interfaces/transformer';
import { BaseTransformer } from './base-transformer';

export class ConcatTransformer extends BaseTransformer {
  transform(config: MappingConfig, sourceValues: any[]): TransformResult {
    if (!config.transform) return { value: sourceValues[0], errors: [] };
    const { params } = this.parseTransformExpression(config.transform);

    const errors: string[] = [];
    const parts: string[] = [];

    for (const param of params) {
      if (param.type === 'source') {
        if (param.index < 0 || param.index >= sourceValues.length) {
          errors.push(`Invalid source index ${param.index} in transform: ${config.transform}`);
        } else {
          parts.push(String(sourceValues[param.index]));
        }
      } else {
        parts.push(param.value);
      }
    }

    if (errors.length > 0) {
      return { value: null, errors };
    }

    const value = parts.join('');
    return { value, errors: [] };
  }
}