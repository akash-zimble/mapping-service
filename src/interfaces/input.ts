import { MappingConfig, TranslatorEntry } from "./mapping-config";

export interface Input {
    data: Record<string, any>;
    mappingConfig: Record<string, MappingConfig>;
    translator: Record<string, TranslatorEntry[]>;
}