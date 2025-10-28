
// app/components/[slug]/page.tsx
import * as React from "react";
import { getRegistryItem, getRegistryItemSlugs } from "@/lib/registry";
import ComponentPage from "@/components/Component/Page";

// Generate static params for all registry items
export async function generateStaticParams() {
  const slugs = getRegistryItemSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

// Generate metadata for each page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const item = getRegistryItem((await params).slug);

  if (!item) {
    return {
      title: "Component Not Found",
    };
  }

  return {
    title: `${item.title} - Chisom UI`,
    description: item.description,
  };
}

const Page = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {

return <ComponentPage params={await params} />
}

export default Page;