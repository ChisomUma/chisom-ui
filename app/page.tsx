// app/page.tsx
import * as React from "react";
import Link from "next/link";
import { getAllRegistryItems } from "@/lib/registry";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const registryItems = getAllRegistryItems();

  return (
    <div className="max-w-6xl mx-auto flex flex-col min-h-svh px-4 py-8 gap-12">
      {/* Hero Section */}
      <header className="flex flex-col gap-4 text-center py-8">
        <h1 className="text-5xl font-bold tracking-tight">Chisom UI</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A custom component registry for building beautiful, accessible user interfaces with Next.js and Tailwind CSS.
        </p>
      </header>

      {/* Quick Install */}
      <section className="flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Quick Install</h2>
          <p className="text-muted-foreground">
            Add any component with one command:
          </p>
        </div>
        <Card className="max-w-2xl mx-auto w-full">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 bg-muted p-4 rounded-lg font-mono text-sm">
              <code className="flex-1">npx shadcn@latest add @chisom-ui/multi-tag-input</code>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Setup Instructions */}
      <section className="flex flex-col gap-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Setup Instructions</h2>
          <p className="text-muted-foreground">
            Get started with Chisom UI in minutes
          </p>
        </div>

        {/* Prerequisites */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Prerequisites</CardTitle>
            <CardDescription>
              Make sure you have the following before getting started:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[
                "Next.js 13+ project",
                "Tailwind CSS configured",
                "shadcn/ui initialized",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Step-by-step Setup */}
        <div className="grid gap-6">
          {/* Step 1 */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  1
                </div>
                <CardTitle className="text-xl">Setup shadcn/ui (if not already done)</CardTitle>
              </div>
              <CardDescription>
                If you haven&apos;t set up shadcn/ui in your project yet, run:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg">
                <code className="text-sm font-mono">npx shadcn@latest init</code>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Follow the prompts to configure your project. Choose your style, colors, and other preferences.
              </p>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  2
                </div>
                <CardTitle className="text-xl">Configure Custom Registry</CardTitle>
              </div>
              <CardDescription>
                Add the Chisom UI registry to your components.json file:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">
                  <code>{`{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  },
  "registries": {
    "@chisom-ui": "https://chisom-ui.netlify.app/r/{name}.json"
  }
}`}</code>
                </pre>
              </div>
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> Replace the registry URL with your actual deployment URL.
              </p>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  3
                </div>
                <CardTitle className="text-xl">Install Registry Dependencies</CardTitle>
              </div>
              <CardDescription>
                Install the required dependencies for Chisom UI components:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">npm:</p>
                <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm font-mono">
                    npm install class-variance-authority iconsax-react
                  </code>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">yarn:</p>
                <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm font-mono">
                    yarn add class-variance-authority iconsax-react
                  </code>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">pnpm:</p>
                <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm font-mono">
                    pnpm add class-variance-authority iconsax-react
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 4 */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  4
                </div>
                <CardTitle className="text-xl">Add Components</CardTitle>
              </div>
              <CardDescription>
                Now you can add any component from the Chisom UI registry:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Add a single component:</p>
                <div className="bg-muted p-4 rounded-lg">
                  <code className="text-sm font-mono">
                    npx shadcn@latest add @chisom-ui/multi-tag-input
                  </code>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Add multiple components:</p>
                <div className="bg-muted p-4 rounded-lg">
                  <code className="text-sm font-mono">
                    npx shadcn@latest add @chisom-ui/multi-tag-input @chisom-ui/button
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Success Card */}
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
                That&apos;s it!
              </CardTitle>
              <CardDescription className="text-green-900/70">
                Components will be installed to your <code className="bg-green-100 px-1.5 py-0.5 rounded text-xs">components/ui/</code> directory and utilities to <code className="bg-green-100 px-1.5 py-0.5 rounded text-xs">utils/</code>. Start using them in your project immediately.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Available Components */}
      <section className="flex flex-col gap-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Available Components</h2>
          <p className="text-muted-foreground">
            Explore our collection of production-ready components
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {registryItems.map((item) => (
            <Link
              key={item.name}
              href={`/components/${item.name}`}
              className="group"
            >
              <Card className="h-full transition-all hover:shadow-lg hover:border-primary">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {item.title}
                    </CardTitle>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <CardDescription className="line-clamp-2">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      {item.type.replace("registry:", "")}
                    </Badge>
                    {item.dependencies && item.dependencies.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {item.dependencies.length} dep{item.dependencies.length !== 1 ? "s" : ""}
                      </Badge>
                    )}
                    {item.registryDependencies && item.registryDependencies.length > 0 && (
                      <Badge className="text-xs">
                        {item.registryDependencies.length} component{item.registryDependencies.length !== 1 ? "s" : ""}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-muted-foreground py-8 border-t">
        <p>Built with ❤️ using Next.js, shadcn/ui, and Tailwind CSS</p>
      </footer>
    </div>
  );
}