import { Transformer } from '../interfaces/transformer';
import { MappingConfig, Translator } from '../interfaces/mapping-config';
import { VM } from 'vm2';

export class CustomTransformer implements Transformer {
  transform(config: MappingConfig, sourceValues: any[], translator?: Translator): { value: any; errors: string[] } {
    const errors: string[] = [];

    // Initialize VM2 sandbox
    const vm = new VM({
      timeout: 1000, // Limit execution time to 1 second
      sandbox: {}, // Empty sandbox to prevent access to global objects
      eval: false, // Disable eval
      wasm: false, // Disable WebAssembly
    });

    try {
      // Prepare the transform function string
      // Return a function directly instead of using module.exports
      const script = `
        (function(data) {
          const fn = ${config.transform};
          return fn(data);
        })
      `;

      // Run the script in the VM to get the wrapper function
      const wrapperFn = vm.run(script);

      // Execute the wrapper function with the first source value as 'data'
      const value = wrapperFn(sourceValues[0]);
      return { value, errors };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Transform function execution failed';
      errors.push(`Transform function execution failed: ${errorMessage}`);
      return { value: null, errors };
    }
  }
}