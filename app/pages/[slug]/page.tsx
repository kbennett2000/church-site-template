import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { getPages, getPage } from "@/content/pages";
import { churchInfo } from "@/lib/church-info";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getPages().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description ?? `${page.title} — ${churchInfo.name}`,
  };
}

export default async function CustomPage({ params }: Props) {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) notFound();

  const html = await marked.parse(page.body);

  return (
    <>
      <section className="border-b border-border bg-muted/40">
        <div className="container py-16 md:py-20">
          <h1 className="max-w-3xl font-serif text-4xl leading-[1.05] md:text-5xl lg:text-6xl">
            {page.title}
          </h1>
          {page.description ? (
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
              {page.description}
            </p>
          ) : null}
        </div>
      </section>

      <section className="container py-16 md:py-20">
        <div
          className="prose prose-stone max-w-3xl"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </section>
    </>
  );
}
