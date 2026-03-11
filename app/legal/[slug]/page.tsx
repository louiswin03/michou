
import { getLegalPage } from "@/lib/sanity"
import { PortableText } from "@portabletext/react"
import { notFound } from "next/navigation"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import Image from "next/image"
import type { Metadata } from "next"

// Force regeneration on demand
export const revalidate = 60

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const page = await getLegalPage(slug)

    if (!page) {
        return {
            title: "Page introuvable",
        }
    }

    const title = page.seo?.metaTitle || `${page.title} - l'écrin du vignoble`
    const description = page.seo?.metaDescription || `${page.title} du gîte l'écrin du vignoble à Wettolsheim, Alsace.`

    return {
        title,
        description,
        alternates: {
            canonical: `https://lecrinduvignoble.fr/legal/${slug}`,
        },
        openGraph: {
            title,
            description,
            type: "website",
            url: `https://lecrinduvignoble.fr/legal/${slug}`,
            siteName: "l'écrin du vignoble",
            locale: "fr_FR",
        },
        robots: {
            index: true,
            follow: true,
        },
    }
}

export default async function LegalPage({ params }: Props) {
    const { slug } = await params
    const page = await getLegalPage(slug)

    if (!page) {
        notFound()
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-white">
                {/* Simple Hero Section for Legal Pages */}
                <section className="relative bg-anthracite py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
                        <span className="text-gold font-serif text-lg tracking-[0.3em] uppercase mb-4 block">Information</span>
                        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white max-w-4xl mx-auto">{page.title}</h1>
                    </div>
                </section>

                {/* Content */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto max-w-4xl">
                        <div className="prose prose-lg prose-slate max-w-none">
                            <PortableText
                                value={page.content}
                                components={{
                                    block: {
                                        normal: ({ children }) => <p className="mb-6 leading-relaxed text-gray-700">{children}</p>,
                                        h2: ({ children }) => <h2 className="mt-12 mb-6 font-serif text-2xl text-slate">{children}</h2>,
                                        h3: ({ children }) => <h3 className="mt-8 mb-4 font-serif text-xl text-slate">{children}</h3>,
                                    },
                                    list: {
                                        bullet: ({ children }) => <ul className="list-disc pl-5 mb-6 space-y-2">{children}</ul>,
                                        number: ({ children }) => <ol className="list-decimal pl-5 mb-6 space-y-2">{children}</ol>,
                                    }
                                }}
                            />
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    )
}
