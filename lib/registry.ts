// lib/registry.ts
export interface RegistryItem {
  name: string;
  type: string;
  title: string;
  description: string;
  registryDependencies?: string[];
  dependencies?: string[];
  files: {
    path: string;
    type: string;
    target?: string;
  }[];
}

export interface Registry {
  $schema: string;
  name: string;
  homepage: string;
  items: RegistryItem[];
}

// Import your registry.json
import registryData from "@/registry.json";

export const registry: Registry = registryData as Registry;

export function getRegistryItem(name: string): RegistryItem | undefined {
  return registry.items.find((item) => item.name === name);
}

export function getAllRegistryItems(): RegistryItem[] {
  return registry.items;
}

export function getRegistryItemSlugs(): string[] {
  return registry.items.map((item) => item.name);
}