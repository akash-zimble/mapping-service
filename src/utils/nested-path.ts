export function getNestedValue(obj: Record<string, any>, path: string): any {
    try {
      return path.split('.').reduce((current, key) => {
        if (current === undefined || current === null) {
          throw new Error(`Cannot access property '${key}' of ${current}`);
        }
        return current[key];
      }, obj);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Unknown error resolving path '${path}'`;
      throw new Error(`Failed to resolve path '${path}': ${errorMessage}`);
    }
  }
  
  export function setNestedValue(obj: Record<string, any>, path: string, value: any): void {
    const keys = path.split('.');
    let current = obj;
  
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (!current[key] || typeof current[key] !== 'object') {
        current[key] = {};
      }
      current = current[key];
    }
  
    current[keys[keys.length - 1]] = value;
}