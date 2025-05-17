import { MappingConfig, TranslatorEntry } from '../interfaces/mapping-config';
import { TransformResult, Transformer } from '../interfaces/transformer';

export abstract class BaseTransformer implements Transformer {
  abstract transform(config: MappingConfig, sourceValues: any[], translator: Record<string, TranslatorEntry[]>): TransformResult;

  protected parseTransformExpression(transform: string): { operation: string; params: Array<{ type: 'source', index: number } | { type: 'literal', value: string }> } {
    const match = transform.match(/^(\w+)\((.*)\)$/);
    if (!match) throw new Error(`Invalid transform expression: ${transform}`);
    const [, operation, paramString] = match;

    // Split parameters, handling commas outside quotes
    const params: Array<{ type: 'source', index: number } | { type: 'literal', value: string }> = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < paramString.length; i++) {
      const char = paramString[i];
      if (char === "'" || char === '"') {
        inQuotes = !inQuotes;
        current += char;
      } else if (char === ',' && !inQuotes) {
        const trimmed = current.trim();
        if (trimmed) {
          params.push(this.parseParam(trimmed));
        }
        current = '';
      } else {
        current += char;
      }
    }
    const trimmed = current.trim();
    if (trimmed) {
      params.push(this.parseParam(trimmed));
    }

    return { operation, params };
  }

  private parseParam(param: string): { type: 'source', index: number } | { type: 'literal', value: string } {
    const sourceMatch = param.match(/source\[(\d+)\]/);
    if (sourceMatch) {
      return { type: 'source', index: parseInt(sourceMatch[1]) };
    }
    // Remove surrounding quotes for literals
    const literalMatch = param.match(/^['"](.*)['"]$/);
    return { type: 'literal', value: literalMatch ? literalMatch[1] : param };
  }
}