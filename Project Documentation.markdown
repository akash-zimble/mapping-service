# Mapper Service Documentation

# 1. Project Overview

The Mapper Service is a TypeScript-based application designed to transform JSON objects from one schema to another, tailored for e-commerce data such as products, customers, orders, and warehouses. The service has been enhanced to support advanced mapping configurations, including field types, constraints, custom transformations, and conditional mappings—all specified directly within the configuration without external functions. Key features include:

- **Field Mapping**: Maps fields from the source to the target schema using a configurable mapping configuration.
- **Value Translation**: Applies value substitutions using a translator array for conditional mappings.
- **Custom Transformations**: Supports operations like concatenation directly in the configuration via a `transform` key.
- **Type and Constraint Validation**: Ensures output adheres to specified data types and constraints (e.g., string length, number ranges).

The service is highly configurable, allowing complex mappings and transformations without modifying the underlying code.

---

## 2. Requirements

### Functional Requirements

- Accept input JSON with the following structure:

  ```json
  {
    "data": {},
    "mapping_config": {},
    "translator": {}
  }
  ```

  - `data`: Source object to be transformed.
  - `mapping_config`: Defines field mappings, including types, constraints, and transformations.
  - `translator`: Contains arrays of key-value pairs for conditional value substitutions.

- Support field mappings with:

  - **Source Fields**: Single or multiple fields from the source data.
  - **Transformations**: Custom operations (e.g., `"concat(' ', source[0], source[1])"`).
  - **Types**: Data types for target fields (e.g., `string`, `number`).
  - **Constraints**: Validation rules (e.g., max string length, number ranges).

- Apply conditional mappings using the `translator` array.

- Produce output JSON conforming to the target schema, with transformations and validations applied.

### Non-Functional Requirements

- Efficiently process large JSON objects without significant performance degradation.
- Scale to handle increasing data volumes and complex configurations.
- Follow TypeScript best practices for maintainability and documentation.

---

## 3. Architecture

The Mapper Service consists of the following components:

- **Input Parser**: Validates and parses the input JSON.
- **Transformation Parser**: Interprets `transform` strings, extracting operations and parameters.
- **Mapper**: Applies field mappings, transformations, and constraints.
- **Translator**: Handles conditional value substitutions using the `translator` array.
- **Output Generator**: Constructs the output JSON in the target schema format.

The architecture is modular, allowing easy extension of transformation operations and validation rules.

---

## 4. API Specification

### Input Format

Below is an example input JSON illustrating the updated configuration:

```json
{
  "data": {
    "first_name": "Jane",
    "last_name": "Smith",
    "age": "25",
    "membership": "gold",
    "product_code": "ABC",
    "product_suffix": "123"
  },
  "mapping_config": {
    "full_name": {
      "source": ["first_name", "last_name"],
      "transform": "concat(source[0], ' ', source[1])",
      "type": "string",
      "constraints": {
        "max_length": 50
      }
    },
    "age": {
      "source": "age",
      "type": "number",
      "constraints": {
        "min": 18,
        "max": 100
      }
    },
    "membership_level": {
      "source": "membership",
      "transform": "translate(source, translator['membership'])",
      "type": "string"
    },
    "product_id": {
      "source": ["product_code", "product_suffix"],
      "transform": "concat(source[0], '-', source[1])",
      "type": "string",
      "constraints": {
        "max_length": 10
      }
    }
  },
  "translator": {
    "membership": [
      {"key": "gold", "value": "Premium"},
      {"key": "silver", "value": "Standard"},
      {"key": "bronze", "value": "Basic"}
    ]
  }
}
```

### Output Format

The output JSON for the example above:

```json
{
  "full_name": "Jane Smith",
  "age": 25,
  "membership_level": "Premium",
  "product_id": "ABC-123"
}
```

---

## 5. Implementation Plan

1. **Set up the TypeScript Project**:

   - Initialize with `npm init` or `yarn init`.
   - Configure `tsconfig.json` for strict type checking and ES6 targeting.

2. **Define Interfaces**:

   - Create TypeScript interfaces for `Input`, `MappingConfig`, `Translator`, and `Output`.
   - Define types for transformation operations and constraints.

3. **Implement Input Parser**:

   - Validate and parse the input JSON into TypeScript objects.

4. **Implement Transformation Parser**:

   - Parse `transform` strings to identify operations (e.g., `concat`, `translate`) and extract parameters.

5. **Implement Mapper**:

   - Map source fields to target fields, applying transformations and enforcing constraints.

6. **Implement Translator**:

   - Substitute values using the `translator` array for fields with `translate` transformations.

7. **Implement Output Generator**:

   - Construct the output JSON from mapped and transformed data.

8. **Error Handling**:

   - Handle errors like invalid transform strings or constraint violations.

9. **Testing**:

   - Write unit and integration tests for the transformation parser, mapper, and translator.

---

## 6. Testing Strategy

- **Unit Tests**:
  - Test transformation parser with various `transform` strings.
  - Verify mapper applies transformations and enforces constraints.
  - Ensure translator substitutes values correctly.
- **Integration Tests**:
  - Test the full mapping process with sample e-commerce data, including edge cases.

---

## 7. Deployment

- Package as a Node.js module for integration into existing projects.
- Optionally containerize using Docker for simplified deployment.
- Optimize for large JSON inputs, considering memory usage and processing time.

---

## Assumptions

- `transform` strings follow a specific syntax (e.g., `concat(separator, fields)`).
- `translator` array is used exclusively for conditional mappings via the `transform` key.
- Nested objects in source data are not supported in this version.

This document outlines the plan for implementing the enhanced Mapper Service, ensuring flexibility and configurability.