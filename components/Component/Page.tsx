// ./components/Component/Page.tsx

"use client";

import * as React from "react";
import { notFound } from "next/navigation";
import { getRegistryItem } from "@/lib/registry";
import { OpenInV0Button } from "@/components/open-in-v0-button";
import { MultiTagInput } from "@/registry/new-york/ui/multi-tag-input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchInput } from "@/registry/new-york/ui/search-input";
import { ColorPickerInput } from "@/registry/new-york/ui/color-picker-input";


// Define base props interface for all components
interface BaseComponentProps {
  className?: string;
  [key: string]: unknown;
}

// Component registry mapping
const componentMap: Record<string, React.ComponentType<BaseComponentProps>> = {
  "multi-tag-input": MultiTagInput,
  "search-input": SearchInput,
  "color-picker-input": ColorPickerInput,
  // Add more components as you create them
};

export default function ComponentPage({
  params,
}: {
  params: { slug: string };
}) {
  const item = getRegistryItem(params.slug);

  if (!item) {
    notFound();
  }

  // Get the component from the map
  const Component = componentMap[params.slug];

  return (
    <div className="max-w-5xl mx-auto flex flex-col min-h-svh px-4 py-8 gap-8">
      {/* Header */}
      <header className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold tracking-tight">{item.title}</h1>
            <p className="text-lg text-muted-foreground">{item.description}</p>
          </div>
          <OpenInV0Button name={item.name} className="w-fit" />
        </div>

        {/* Metadata badges */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            {item.type}
          </Badge>
          {item.dependencies && item.dependencies.length > 0 && (
            <div className="flex gap-1">
              {item.dependencies.map((dep) => (
                <Badge key={dep} variant="secondary" className="text-xs">
                  {dep}
                </Badge>
              ))}
            </div>
          )}
          {item.registryDependencies && item.registryDependencies.length > 0 && (
            <div className="flex gap-1">
              {item.registryDependencies.map((dep) => (
                <Badge key={dep} className="text-xs">
                  {dep}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Demo Section */}
      <main className="flex flex-col gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Demo</CardTitle>
            <CardDescription>
              Interactive demonstration of the {item.title} component
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[400px] flex items-center justify-center">
            {Component ? (
              <div className="w-full max-w-2xl">
                {params.slug === "multi-tag-input" && (
                  <MultiTagInputDemo />
                )}
                {params.slug === "search-input" && (
                  <SearchInputDemo />
                )}
                {params.slug === "color-picker-input" && (
                  <ColorPickerInputDemo />
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">
                Component demo not available yet.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Installation Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Installation</CardTitle>
            <CardDescription>
              Add this component to your project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Using CLI</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code>npx shadcn@latest add @chisom-ui/{item.name}</code>
                </pre>
              </div>
              
              {item.dependencies && item.dependencies.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Dependencies</h3>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code>npm install {item.dependencies.join(" ")}</code>
                  </pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Files */}
        <Card>
          <CardHeader>
            <CardTitle>Files</CardTitle>
            <CardDescription>
              Component files included in this package
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {item.files.map((file, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm font-mono bg-muted p-2 rounded"
                >
                  <Badge variant="outline" className="text-xs">
                    {file.type}
                  </Badge>
                  <span>{file.path}</span>
                  {file.target && (
                    <span className="text-muted-foreground">→ {file.target}</span>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

// Demo component for MultiTagInput
function MultiTagInputDemo() {
  const [tags, setTags] = React.useState<string[]>(["React", "TypeScript", "Next.js"]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">Basic Example</h3>
        <MultiTagInput
          value={tags}
          onChange={setTags}
          placeholder="Try adding tags..."
          maxTags={10}
          label="Skills"
          description="Add your technical skills. Click to edit, drag to reorder."
        />
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Small Size</h3>
        <MultiTagInput
          placeholder="Add tags..."
          maxTags={5}
          size="sm"
        />
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Disabled State</h3>
        <MultiTagInput
          value={["Read-only", "Disabled"]}
          disabled
          label="Read-only Tags"
        />
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Error State</h3>
        <MultiTagInput
          placeholder="Add tags..."
          variant="error"
          error="At least 3 tags are required"
          label="Required Field"
          required
        />
      </div>
    </div>
  );
}

function SearchInputDemo() {
  const [searchValue, setSearchValue] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [recentSearches, setRecentSearches] = React.useState(["React", "TypeScript", "Next.js"]);

  const handleSearch = (value: string) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      if (value && !recentSearches.includes(value)) {
        setRecentSearches([value, ...recentSearches.slice(0, 4)]);
      }
    }, 500);
  };

  return (
    <div className="space-y-6">
      <SearchInput
        value={searchValue}
        onChange={setSearchValue}
        onSearch={handleSearch}
        isLoading={loading}
        showRecentSearches
        recentSearches={recentSearches}
        onRecentSearchClick={handleSearch}
        placeholder="Try searching..."
      />
    </div>
  );
}

function ColorPickerInputDemo() {
  const [color, setColor] = React.useState("#3B82F6");

  return (
    <div className="space-y-6">
      <ColorPickerInput
        value={color}
        onChange={setColor}
        label="Brand Color"
        description="Choose your primary brand color"
      />
    </div>
  );
}