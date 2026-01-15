import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, UnderlineType, Convert } from "docx";
import { saveAs } from "file-saver";

export interface ContractData {
  clientLastName: string;
  clientFirstName: string;
  clientAddress: string;
  clientPhone: string;
  clientEmail: string;
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  depositAmount: number;
  balanceAmount: number;
  contractDate: string;
  nights: number;
  cleaningFee: number;
  touristTax: number;
}

export function useGenerateContract() {
  const generatePDF = async (data: ContractData) => {
    // Styles de base
    const font = "Calibri";
    const baseSize = 22; // 11pt
    const titleSize = 28; // 14pt

    // Helper pour créer une ligne d'info (Label : Valeur)
    const createInfoLine = (label: string, value: string) => {
      return new Paragraph({
        children: [
          new TextRun({ text: label, bold: true, font, size: baseSize, color: "000000" }),
          new TextRun({ text: " " + value, font, size: baseSize, color: "000000" }),
        ],
        spacing: { after: 120 },
      });
    };

    // Helper pour les titres de section
    const createSectionTitle = (title: string) => {
      return new Paragraph({
        children: [
          new TextRun({
            text: title,
            bold: true,
            font,
            size: 24, // 12pt
            color: "000000",
            underline: {
              type: UnderlineType.SINGLE,
              color: "000000",
            }
          })
        ],
        spacing: { before: 360, after: 240 },
        alignment: AlignmentType.LEFT,
      });
    };

    // Helper pour paragraphes simples
    const createParagraph = (text: string, bold = false) => {
      return new Paragraph({
        children: [new TextRun({ text: text, bold: bold, font, size: baseSize, color: "000000" })],
        spacing: { after: 120 },
        alignment: AlignmentType.JUSTIFIED,
      });
    };

    // Helper pour les listes à puces
    const createBulletPoint = (text: string) => {
      return new Paragraph({
        children: [new TextRun({ text: text, font, size: baseSize, color: "000000" })],
        bullet: {
          level: 0,
        },
        spacing: { after: 120 },
        alignment: AlignmentType.JUSTIFIED,
      });
    };

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // TITRE PRINCIPAL
            new Paragraph({
              children: [
                new TextRun({
                  text: "CONTRAT DE LOCATION SAISONNIÈRE",
                  bold: true,
                  font,
                  size: 32, // 16pt
                  color: "000000"
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 120 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Gîte de charme en Alsace - 9 Résidence du Château Martinsbourg",
                  font,
                  size: 24,
                  italics: true,
                  color: "444444"
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 480 },
            }),

            // LE PROPRIÉTAIRE
            createSectionTitle("LE PROPRIÉTAIRE"),
            createInfoLine("Nom et Prénom :", "LEXCELLENT Michel"),
            createInfoLine("Adresse :", "9 Résidence du Château Martinsbourg, 68920 WETTOLSHEIM"),
            createInfoLine("Téléphone :", "+33 6 81 84 25 54"),

            // LE LOCATAIRE
            createSectionTitle("LE LOCATAIRE"),
            createInfoLine("Nom et Prénom :", `${data.clientLastName.toUpperCase()} ${data.clientFirstName}`),
            createInfoLine("Adresse :", data.clientAddress),
            createInfoLine("Téléphone :", data.clientPhone),
            createInfoLine("Email :", data.clientEmail),

            // DÉTAILS DE LA LOCATION
            createSectionTitle("DÉTAILS DE LA LOCATION"),
            createInfoLine("Période :", `Du ${data.checkInDate} au ${data.checkOutDate}`),
            createInfoLine("Adresse du gîte :", "9 Résidence du Château Martinsbourg, 68920 WETTOLSHEIM"),
            createInfoLine("Type :", "Appartement de 68 m²"),

            // CONDITIONS FINANCIÈRES
            createSectionTitle("CONDITIONS FINANCIÈRES"),
            // Tableau pour encadrer proprement les finances
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({ text: "Prix total du séjour : ", font, size: baseSize, bold: true }),
                            new TextRun({ text: `${data.totalPrice} €`, font, size: 28, bold: true, color: "000000" }),
                          ],
                          spacing: { before: 120, after: 120 }
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({ text: `Détail : ${data.nights} nuits • Ménage ${data.cleaningFee}€ • Taxe de séjour ${data.touristTax.toFixed(2)}€`, font, size: 20, color: "666666" })
                          ],
                          spacing: { after: 120 }
                        }),
                        new Paragraph({
                          children: [new TextRun({ text: "Toutes charges et taxes comprises", font, size: baseSize, italics: true })],
                          spacing: { after: 240 },
                        }),
                        new Paragraph({
                          children: [new TextRun({ text: `Arrhes versées (30%) : ${data.depositAmount} € (chèque non encaissé)`, font, size: baseSize })]
                        }),
                        new Paragraph({
                          children: [new TextRun({ text: `Solde restant : ${data.balanceAmount} €`, font, size: baseSize })]
                        }),
                        new Paragraph({
                          children: [new TextRun({ text: `Dépôt de garantie : 400 € (chèque non encaissé)`, font, size: baseSize })],
                          spacing: { after: 120 }
                        }),
                      ],
                      margins: { top: 200, bottom: 200, left: 200, right: 200 },
                    }),
                  ],
                }),
              ],
            }),

            new Paragraph({
              children: [
                new TextRun({ text: `Le solde et le dépôt de garantie seront versés le jour de la remise des clés.`, font, size: baseSize, bold: true })
              ],
              spacing: { before: 360, after: 240 }
            }),
            new Paragraph({
              text: `Fait à Wettolsheim, le ${data.contractDate}`,
              alignment: AlignmentType.RIGHT,
              spacing: { before: 120, after: 480 },
              run: { font, size: baseSize }
            }),


            // CONDITIONS GÉNÉRALES DE LOCATION
            new Paragraph({
              children: [new TextRun({ text: "CONDITIONS GÉNÉRALES DE LOCATION", font, size: 28, bold: true })],
              heading: HeadingLevel.HEADING_1,
              pageBreakBefore: true,
              alignment: AlignmentType.CENTER,
              spacing: { after: 480 },
            }),

            createParagraph("La présente location est faite aux conditions ordinaires et de droit en pareille matière et notamment à celles ci-après que le locataire s'oblige à exécuter, sous peine de tous dommages et intérêts et même de résiliations des présentes, si bon semble au propriétaire et sans pouvoir réclamer la diminution du loyer."),
            createParagraph("Les heures d'arrivée sont normalement prévues à partir de 16 h (prévenir par téléphone ou sms 1 heure avant l'arrivée), possibilité d'une arrivée anticipée en fonction de l'occupation du gîte. Les heures de départ sont normalement prévues le matin avant 10 heures (si locataires arrivant le même jour, sinon dans l'après-midi)."),

            createSectionTitle("EN CAS DE DÉSISTEMENT"),
            createParagraph("Du locataire : à plus de 15 jours avant la prise d'effet de la location, le locataire perd les arrhes versées."),
            createParagraph("Du propriétaire : à moins d'un mois avant la prise d'effet de la location, il est tenu de verser le double des arrhes au locataire dans les sept jours suivant le désistement."),

            createSectionTitle("RETARD D'ARRIVÉE"),
            createParagraph("Si un retard de plus de quatre jours par rapport à la date d'arrivée prévue n'a pas été signalé par le locataire, le propriétaire pourra de bon droit essayer de relouer le logement tout en conservant la faculté de se retourner contre le locataire."),

            createSectionTitle("OBLIGATIONS DU LOCATAIRE"),
            createBulletPoint("Occuper les lieux personnellement, les habiter en bon père de famille et les entretenir."),
            createBulletPoint("Toutes les installations sont en état de marche. Toute réclamation survenant plus de 24h après l'entrée en jouissance des lieux ne pourra être admise."),
            createBulletPoint("Les réparations rendues nécessaires par la négligence ou le mauvais entretien en cours de location seront à la charge du locataire."),
            createBulletPoint("Veiller à ce que la tranquillité du voisinage ne soit pas troublée."),

            createSectionTitle("ÉQUIPEMENTS ET MOBILIER"),
            createParagraph("Les locaux sont loués meublés avec matériel de cuisine, vaisselle, verrerie, couvertures et oreillers, tels qu'ils sont dans l'état descriptif. S'il y a lieu, le propriétaire ou son représentant seront en droit de réclamer au locataire, à son départ, la valeur totale au prix de remplacement des objets, mobiliers ou matériels cassés, fêlés, ébréchés ou détériorés."),

            createSectionTitle("ASSURANCE"),
            createParagraph("Le locataire s'engage à s'assurer contre les risques locatifs (incendie, dégât des eaux). Le défaut d'assurance, en cas de sinistre, donnera lieu à des dommages et intérêts. Le propriétaire s'engage à assurer le logement contre les risques locatifs pour le compte du locataire, ce dernier ayant l'obligation de lui signaler, dans les 24h, tout sinistre survenu dans le logement."),

            createSectionTitle("DÉPÔT DE GARANTIE"),
            createParagraph("Le dépôt de garantie sera restitué au départ du locataire sauf en cas de retenue justifiée."),

            // ÉTAT DESCRIPTIF
            new Paragraph({
              children: [new TextRun({ text: "ÉTAT DESCRIPTIF DE LA LOCATION", font, size: 28, bold: true })],
              heading: HeadingLevel.HEADING_1,
              pageBreakBefore: true,
              alignment: AlignmentType.CENTER,
              spacing: { after: 480 },
            }),

            createSectionTitle("INFORMATIONS GÉNÉRALES"),
            createInfoLine("Adresse :", "9 Résidence du Château Martinsbourg, 68920 WETTOLSHEIM"),
            createInfoLine("Type :", "Appartement"),
            createInfoLine("Surface habitable :", "68 m²"),

            createSectionTitle("DÉTAILS DES PIÈCES"),

            new Paragraph({ text: "Cuisine", font, size: 24, bold: true, spacing: { before: 120, after: 60 } }),
            createParagraph("Table en verre avec 4 chaises, lave-vaisselle, lave-linge, sèche-linge, plaque à induction, réfrigérateur avec congélateur, micro-ondes avec four, évier avec mitigeur, cafetière, vaisselle neuve, climatisation et chauffage DAIKIN avec télécommande, meubles de rangement."),

            new Paragraph({ text: "Salon", font, size: 24, bold: true, spacing: { before: 120, after: 60 } }),
            createParagraph("Canapé 3 places avec couchage de 1,60 mètres pour 2 personnes, chaîne hifi, téléviseur écran plat avec fibre, meuble TV, 3 tables de salon, grand placard avec coffre sécurisé, climatisation et chauffage DAIKIN avec télécommande."),

            new Paragraph({ text: "Salle de bain", font, size: 24, bold: true, spacing: { before: 120, after: 60 } }),
            createParagraph("Douche, lavabo, sèche-serviette chauffant, WC, meuble avec lavabo intégré et mitigeur."),

            new Paragraph({ text: "Chambre 1", font, size: 24, bold: true, spacing: { before: 120, after: 60 } }),
            createParagraph("Lit 160 x 190, 1 table de nuit, 2 tablettes de nuit, placard, téléviseur écran plat frame Samsung de 43 pouces."),

            new Paragraph({ text: "Chambre 2", font, size: 24, bold: true, spacing: { before: 120, after: 60 } }),
            createParagraph("Lits 90 x 190, 2 tables de nuit avec lampes de chevet, étagère de rangement, meuble TV, téléviseur Sony 32 pouces avec décodeur, meuble bas de rangement, canapé 2 places."),

            new Paragraph({ text: "Couloir", font, size: 24, bold: true, spacing: { before: 120, after: 60 } }),
            createParagraph("Deux placards dont un avec penderie. Dans un placard, les vannes d'eau permettent de couper complètement l'eau en cas de fuite. Dans le deuxième placard, un extincteur est mis à disposition."),

            new Paragraph({ text: "Terrasse", font, size: 24, bold: true, spacing: { before: 120, after: 60 } }),
            createParagraph("Terrasse de 12 m² avec table en verre, 4 chaises et barbecue électrique Weber transportable et sur pied."),

            createSectionTitle("PRESTATIONS INCLUSES"),
            createBulletPoint("Linge de maison fourni (Draps fournis)"),
            createBulletPoint("Chauffage inclus"),
            createBulletPoint("Ménage de fin de séjour inclus"),

            createSectionTitle("ACCÈS ET INFORMATIONS PRATIQUES"),
            createBulletPoint("Entrée indépendante avec accès par escalier en colimaçon. Escalier facile à monter mais déconseillé aux personnes avec des difficultés de mobilité."),
            createBulletPoint("L'accueil est fait par le propriétaire ou une personne de confiance. Le propriétaire habite dans la maison mitoyenne."),
            createBulletPoint("Parking : possibilité de garer une voiture devant le garage la journée. Emplacement sécurisé (caméra infrarouge) à l'arrière de la maison pour la nuit."),
            createBulletPoint("Jacuzzi 6 places situé à côté du parking dans la partie jardin. Utilisation sous votre responsabilité."),
            createBulletPoint("Terrasse en IPE avec table, 4 chaises et deux transats."),

            // SIGNATURES (moved to end)

            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: BorderStyle.NONE },
                bottom: { style: BorderStyle.NONE },
                left: { style: BorderStyle.NONE },
                right: { style: BorderStyle.NONE },
                insideHorizontal: { style: BorderStyle.NONE },
                insideVertical: { style: BorderStyle.NONE },
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({ text: "Le Propriétaire", font, bold: true, size: 24 }),
                        new Paragraph({ text: "Lu et approuvé", font, italics: true, size: baseSize, spacing: { before: 720 } }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({ text: "Le Locataire", font, bold: true, alignment: AlignmentType.RIGHT, size: 24 }),
                        new Paragraph({ text: "Lu et approuvé", font, italics: true, alignment: AlignmentType.RIGHT, size: baseSize, spacing: { before: 720 } }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `Contrat_${data.clientLastName}_${data.checkInDate.replace(/\//g, '-')}.docx`);
    });
  };

  return { generatePDF };
}
