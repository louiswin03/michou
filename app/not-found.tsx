import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Page introuvable - l'écrin du vignoble",
    description: "La page que vous recherchez n'existe pas ou a été déplacée.",
    robots: {
        index: false,
        follow: true,
    },
}

export default function NotFound() {
    return (
        <div className="min-h-screen bg-cream flex items-center justify-center px-4">
            <div className="text-center max-w-lg">
                <p className="text-gold font-serif text-8xl font-bold">404</p>
                <h1 className="mt-4 font-serif text-3xl text-slate">
                    Page introuvable
                </h1>
                <p className="mt-4 text-taupe leading-relaxed">
                    La page que vous recherchez n'existe pas ou a été déplacée.
                    Retournez à l'accueil pour découvrir notre gîte de charme en Alsace.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="px-8 py-3 bg-gold text-cream font-medium rounded-full hover:bg-gold-dark transition-colors"
                    >
                        Retour à l'accueil
                    </Link>
                    <Link
                        href="/contact"
                        className="px-8 py-3 border border-gold text-gold font-medium rounded-full hover:bg-gold hover:text-cream transition-colors"
                    >
                        Nous contacter
                    </Link>
                </div>
            </div>
        </div>
    )
}
