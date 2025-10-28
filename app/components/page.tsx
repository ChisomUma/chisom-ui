// app/page.tsx
import * as React from "react";
import Link from "next/link";
import { getAllRegistryItems } from "@/lib/registry";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle2, Copy } from "lucide-react";

export default function Home() {
  const registryItems = getAllRegistryItems();

  return (
    <div className="max-w-6xl mx-auto flex flex-col min-h-svh px-4 py-8 gap-12">
     
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

    </div>
  );
}