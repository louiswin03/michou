
import { createClient } from 'next-sanity'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset || !token) {
    process.exit(1)
}

const client = createClient({
    projectId,
    dataset,
    token,
    apiVersion: '2024-01-01',
    useCdn: false,
})

const legalPages = [
    {
        title: 'Mentions Légales',
        slug: 'mentions-legales',
        content: [
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: '1. Éditeur du Site' }],
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    { _type: 'span', text: "Le site internet " },
                    { _type: 'span', text: "https://lecrinduvignoble.fr", marks: ['strong'] }, // Placeholder domain if not known
                    { _type: 'span', text: " (ci-après désigné « le Site ») est édité par :" }
                ],
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    { _type: 'span', text: "Monsieur Michel LEXCELLENT", marks: ['strong'] },
                    { _type: 'span', text: "\nAdresse : 9 Résidence du Château Martinsbourg, 68920 WETTOLSHEIM - France\nTéléphone : +33 6 81 84 25 54\nEmail : lexcellent.michel@orange.fr" },
                ]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    { _type: 'span', text: "Directeur de la publication : Michel LEXCELLENT." }
                ]
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: '2. Hébergement' }],
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    { _type: 'span', text: "Le Site est hébergé par la société " },
                    { _type: 'span', text: "NETLIFY, Inc.", marks: ['strong'] },
                    { _type: 'span', text: "\nSan Francisco, California, États-Unis.\nSite web : www.netlify.com" }
                ]
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: '3. Propriété Intellectuelle' }],
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    { _type: 'span', text: "L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques (images, graphismes, logos, textes). La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication." }
                ]
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: '4. Responsabilité' }],
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    { _type: 'span', text: "Les informations communiquées sur le Site sont fournies à titre indicatif. L'éditeur ne saurait être tenu pour responsable des erreurs, omissions ou d'une absence de disponibilité des informations. L'utilisateur reconnaît utiliser ces informations sous sa responsabilité exclusive." }
                ]
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: '5. Médiation de la consommation' }],
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    { _type: 'span', text: "Conformément à l'article L. 612-1 du Code de la consommation, le consommateur, sous réserve de l'article L.612-2 du code de la consommation, a la faculté d'introduire une demande de résolution amiable par voie de médiation, dans un délai inférieur à un an à compter de sa réclamation écrite auprès du professionnel. " },
                    { _type: 'span', text: "(Coordonnées du médiateur compétent à insérer ici ultérieurement)", marks: ['em'] }
                ]
            }
        ]
    },
    {
        title: 'Conditions Générales de Vente (CGV)',
        slug: 'cgv',
        content: [
            {
                _type: 'block',
                style: 'normal',
                children: [
                    { _type: 'span', text: "Les présentes conditions générales régissent la location saisonnière du gîte " },
                    { _type: 'span', text: "l'écrin du vignoble", marks: ['em'] },
                    { _type: 'span', text: ", situé au 9 Résidence du Château Martinsbourg, 68920 Wettolsheim." }
                ]
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: 'Article 1 - Objet' }],
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    { _type: 'span', text: "Les présentes conditions déterminent les droits et obligations des parties dans le cadre de la location du meublé de tourisme." }
                ]
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: 'Article 2 - Réservation et Paiement' }],
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    { _type: 'span', text: "Toute réservation devient ferme après versement d'arrhes correspondant à " },
                    { _type: 'span', text: "30% du montant total du séjour", marks: ['strong'] },
                    { _type: 'span', text: ". Le paiement de ces arrhes vaut acceptation des présentes conditions générales.\nLe solde du séjour est à régler intégralement le jour de l'arrivée, lors de la remise des clés." }
                ]
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: 'Article 3 - Dépôt de garantie (Caution)' }],
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    { _type: 'span', text: "À l'arrivée du locataire, un dépôt de garantie de " },
                    { _type: 'span', text: "400 €", marks: ['strong'] },
                    { _type: 'span', text: " est demandé par le propriétaire (chèque non encaissé ou espèces). Ce dépôt sera restitué le jour du départ, déduction faite du coût de remise en état des lieux si des dégradations étaient constatées.\nSi le montant des pertes dépasse le montant de ce dépôt, le locataire s'engage à régler la différence." }
                ]
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: "Article 4 - Durée du séjour" }],
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    { _type: 'span', text: "Le locataire signataire du présent contrat conclu pour une durée déterminée ne pourra en aucune circonstance se prévaloir d'un quelconque droit au maintien dans les lieux à l'issue du séjour." }
                ]
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: "Article 5 - Heures d'arrivée et de départ" }],
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    { _type: 'span', text: "Le locataire doit se présenter le jour précisé et à l'heure mentionnée lors de la réservation." }
                ]
            },
            {
                _type: 'block',
                style: 'normal',
                list: 'bullet',
                children: [
                    { _type: 'span', text: "Heure d'arrivée : à partir de 16h00 (merci de prévenir 1h avant)." }
                ]
            },
            {
                _type: 'block',
                style: 'normal',
                list: 'bullet',
                children: [
                    { _type: 'span', text: "Heure de départ : avant 10h00." }
                ]
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: "Article 6 - Annulation par le locataire" }],
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    { _type: 'span', text: "Toute annulation doit être notifiée par lettre recommandée ou email au propriétaire.\na) Annulation plus de 15 jours avant l'arrivée : les arrhes restent acquises au propriétaire.\nb) Annulation moins de 15 jours avant l'arrivée : les arrhes restent acquises, et le propriétaire se réserve le droit de réclamer le solde du prix de l'hébergement.\nc) Si le locataire ne se manifeste pas dans les 24 heures qui suivent la date d'arrivée indiquée sur le contrat : le contrat devient nul et le propriétaire peut disposer de son gîte. Les arrhes restent acquises au propriétaire." }
                ]
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: "Article 7 - Annulation par le propriétaire" }],
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    { _type: 'span', text: "Le propriétaire reverse au locataire le double du montant des arrhes perçues (si l'annulation intervient moins d'un mois avant le début du séjour)." }
                ]
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: "Article 8 - Utilisation des lieux" }],
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    { _type: 'span', text: "Le locataire devra assurer le caractère paisible de la location et en faire usage conformément à la destination des lieux. Il s'engage à rendre le gîte aussi propre qu'il l'aura trouvé à son arrivée." }
                ]
            },
            {
                _type: 'block',
                style: 'normal',
                list: 'bullet',
                children: [
                    { _type: 'span', text: "Gîte NON FUMEUR à l'intérieur." }
                ]
            },
            {
                _type: 'block',
                style: 'normal',
                list: 'bullet',
                children: [
                    { _type: 'span', text: "Animaux non admis (sauf accord exceptionnel du propriétaire)." }
                ]
            },
            {
                _type: 'block',
                style: 'normal',
                list: 'bullet',
                children: [
                    { _type: 'span', text: "Respect de la tranquillité du voisinage (pas de bruit excessif après 22h)." }
                ]
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: "Article 9 - Capacité" }],
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    { _type: 'span', text: "Le présent contrat est établi pour une capacité maximum de 4 personnes (2 chambres). Si le nombre de vacanciers dépasse la capacité d'accueil, le propriétaire peut refuser les personnes supplémentaires. Toute modification ou rupture du contrat sera considérée à l'initiative du client." }
                ]
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: "Article 10 - Assurances" }],
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    { _type: 'span', text: "Le locataire est responsable de tous les dommages survenant de son fait. Il est tenu d'être assuré par un contrat d'assurance type villégiature pour ces différents risques." }
                ]
            }
        ]
    },
    {
        title: 'Politique de Confidentialité',
        slug: 'confidentialite',
        content: [
            {
                _type: 'block',
                style: 'normal',
                children: [
                    { _type: 'span', text: "La protection de vos données personnelles est une priorité pour " },
                    { _type: 'span', text: "l'écrin du vignoble", marks: ['em'] },
                    { _type: 'span', text: ". Cette politique de confidentialité explique comment nous collectons et utilisons vos informations." }
                ]
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: '1. Responsable du traitement' }],
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    { _type: 'span', text: 'Le responsable du traitement des données est Monsieur Michel LEXCELLENT.\nContact : lexcellent.michel@orange.fr' }
                ],
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: '2. Données collectées' }],
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    { _type: 'span', text: "Nous collectons uniquement les données strictement nécessaires à la gestion de votre séjour :" }
                ]
            },
            {
                _type: 'block',
                style: 'normal',
                list: 'bullet',
                children: [
                    { _type: 'span', text: "Identité : Nom, Prénom" }
                ]
            },
            {
                _type: 'block',
                style: 'normal',
                list: 'bullet',
                children: [
                    { _type: 'span', text: "Coordonnées : Adresse postale, Email, Téléphone" }
                ]
            },
            {
                _type: 'block',
                style: 'normal',
                list: 'bullet',
                children: [
                    { _type: 'span', text: "Détails du séjour : Dates, nombre de personnes" }
                ]
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: '3. Finalité du traitement' }],
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    { _type: 'span', text: "Ces données sont utilisées pour :" }
                ]
            },
            {
                _type: 'block',
                style: 'normal',
                list: 'bullet',
                children: [
                    { _type: 'span', text: "Établir le contrat de location" }
                ]
            },
            {
                _type: 'block',
                style: 'normal',
                list: 'bullet',
                children: [
                    { _type: 'span', text: "Gérer la réservation et la facturation" }
                ]
            },
            {
                _type: 'block',
                style: 'normal',
                list: 'bullet',
                children: [
                    { _type: 'span', text: "Communes avec vous avant, pendant et après le séjour" }
                ]
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: '4. Partage des données' }],
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    { _type: 'span', text: "Vos données ne sont JAMAIS vendues, louées ou cédées à des tiers à des fins commerciales. Elles peuvent être transmises aux autorités compétentes uniquement en cas d'obligation légale (ex: fiche de police pour les voyageurs étrangers)." }
                ]
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: '5. Durée de conservation' }],
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    { _type: 'span', text: "Les données sont conservées pendant la durée nécessaire à la gestion de la relation commerciale et le temps des obligations légales (comptabilité, fiscalité), soit généralement 5 ans." }
                ]
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: '6. Cookies' }],
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    { _type: 'span', text: "Ce site utilise uniquement des cookies techniques nécessaires à son bon fonctionnement. Nous n'utilisons pas de cookies publicitaires ou de traçage commercial intrusif." }
                ]
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: '7. Vos droits (RGPD)' }],
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    { _type: 'span', text: "Vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ce droit, veuillez nous contacter par email à : lexcellent.michel@orange.fr" }
                ]
            }
        ]
    }
]

async function migrate() {
    console.log('Updating legal pages with comprehensive content...')

    for (const page of legalPages) {
        const doc = {
            _type: 'legalPage',
            title: page.title,
            slug: { _type: 'slug', current: page.slug },
            content: page.content,
            seo: {
                metaTitle: page.title + " - l'écrin du vignoble",
                metaDescription: "Consultez officiel : " + page.title
            }
        }

        // Find absolute match
        const existing = await client.fetch(`*[_type == "legalPage" && slug.current == $slug][0]`, { slug: page.slug })

        if (existing) {
            await client.patch(existing._id).set(doc).commit()
            console.log(`Updated ${page.title}`)
        } else {
            await client.create(doc)
            console.log(`Created ${page.title}`)
        }
    }
}

migrate()
