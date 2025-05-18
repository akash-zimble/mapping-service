import { Transformer } from '../interfaces/transformer';
import { MappingConfig, Translator } from '../interfaces/mapping-config';

export class CustomTransformer implements Transformer {
  transform(config: MappingConfig, sourceValues: any[], translator?: Translator): { value: any; errors: string[] } {
    const errors: string[] = [];
    let transformFn: (data: any) => any;

    try {
      // Parse the function string, e.g., "(data)=>data.user.first_name+data.user.last_name"
      transformFn = new Function('data', `return (${config.transform})(data);`) as (data: any) => any;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid transform function';
      errors.push(`Invalid transform function: ${errorMessage}`);
      return { value: null, errors };
    }

    try {
      // Use the first source value (full data object for source: 'data', or resolved value)
      const value = transformFn(sourceValues[0]);
      return { value, errors };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Transform function execution failed';
      errors.push(`Transform function execution failed: ${errorMessage}`);
      return { value: null, errors };
    }
  }
}