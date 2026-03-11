import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, UnderlineType } from "docx";
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
  securityDeposit: number;
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
        keepNext: true,
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
                  text: "\"L'écrin du vignoble\"",
                  font,
                  size: 26,
                  italics: true,
                  color: "444444"
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 60 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "& CONDITIONS GÉNÉRALES",
                  font,
                  size: 24,
                  bold: true,
                  color: "000000"
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
            createParagraph(`Prix du séjour : ${data.totalPrice} Euros toutes charges et taxes comprises.`, true),
            createParagraph(`Les arrhes de 30 % ont été versées par le locataire : ${data.depositAmount} Euros.`),
            createParagraph(`La somme de ${data.balanceAmount + data.securityDeposit} Euros sera versée le jour de la remise des clés comprenant ${data.securityDeposit} Euros de dépôt de garantie qui sera rendu à la sortie du logement.`),


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
            createParagraph("Du locataire : à plus de 30 jours avant la prise d'effet de la location, le locataire perd les arrhes versées."),
            createParagraph("Du propriétaire : à moins d'un mois avant la prise d'effet de la location, il est tenu de verser le double des arrhes au locataire dans les sept jours suivant le désistement."),

            createSectionTitle("RETARD D'ARRIVÉE"),
            createParagraph("Si un retard de plus de quatre jours par rapport à la date d'arrivée prévue n'a pas été signalé par le locataire, le propriétaire pourra de bon droit essayer de relouer le logement."),

            createSectionTitle("OBLIGATIONS DU LOCATAIRE"),
            createBulletPoint("Occuper les lieux personnellement, les habiter en bon père de famille et les entretenir."),
            createBulletPoint("Toutes les installations sont en état de marche. Toute réclamation survenant plus de 24h après l'entrée en jouissance des lieux ne pourra être admise."),
            createBulletPoint("Les réparations rendues nécessaires par la négligence ou le mauvais entretien en cours de location seront à la charge du locataire."),
            createBulletPoint("Veiller à ce que la tranquillité du voisinage ne soit pas troublée."),

            createSectionTitle("ÉQUIPEMENTS ET MOBILIER"),
            createParagraph("Les locaux sont loués meublés avec matériel de cuisine, vaisselle, verrerie, couvertures et oreillers, tels qu'ils sont dans l'état descriptif. S'il y a lieu, le propriétaire ou son représentant seront en droit de réclamer au locataire, à son départ, la valeur totale au prix de remplacement des objets, mobiliers ou matériels cassés, fêlés, ébréchés ou détériorés et ceux dont l'usure dépasserait la normale pour la durée de la location, le prix de nettoyage des couvertures rendues sales, une indemnité pour les détériorations de toute nature concernant les rideaux, papiers peints, plafonds, tapis, moquette, vitres, literie, etc."),

            createSectionTitle("ASSURANCE"),
            createParagraph("Le locataire s'engage à s'assurer contre les risques locatifs (incendie, dégât des eaux). Le défaut d'assurance, en cas de sinistre, donnera lieu à des dommages et intérêts. Le propriétaire s'engage à assurer le logement contre les risques locatifs pour le compte du locataire, ce dernier ayant l'obligation de lui signaler, dans les 24h, tout sinistre survenu dans le logement, ses dépendances ou accessoires."),

            createSectionTitle("DÉPÔT DE GARANTIE"),
            createParagraph("Le dépôt de garantie sera restitué au départ du locataire sauf en cas de retenue."),

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

            new Paragraph({ children: [new TextRun({ text: "Cuisine", font, size: 24, bold: true })], spacing: { before: 120, after: 60 } }),
            createParagraph("Table en verre avec 4 chaises, lave-vaisselle, lave-linge, sèche-linge, plaque à induction, réfrigérateur avec congélateur, micro-ondes avec four, évier avec mitigeur, cafetière, vaisselle neuve, climatisation et chauffage DAIKIN avec télécommande, meubles de rangement."),

            new Paragraph({ children: [new TextRun({ text: "Salon", font, size: 24, bold: true })], spacing: { before: 120, after: 60 } }),
            createParagraph("Canapé 3 places avec couchage de 1,60 mètres pour 2 personnes, chaîne hifi, téléviseur écran plat avec fibre, meuble TV, 3 tables de salon, grand placard avec coffre sécurisé, climatisation et chauffage DAIKIN avec télécommande."),

            new Paragraph({ children: [new TextRun({ text: "Salle de bain", font, size: 24, bold: true })], spacing: { before: 120, after: 60 } }),
            createParagraph("Douche, lavabo, sèche-serviette chauffant, WC, meuble avec lavabo intégré et mitigeur."),

            new Paragraph({ children: [new TextRun({ text: "Chambre 1", font, size: 24, bold: true })], spacing: { before: 120, after: 60 } }),
            createParagraph("Lit 160 x 190, 1 table de nuit, 2 tablettes de nuit, placard, téléviseur écran plat frame Samsung de 43 pouces."),

            new Paragraph({ children: [new TextRun({ text: "Chambre 2", font, size: 24, bold: true })], spacing: { before: 120, after: 60 } }),
            createParagraph("Lits 90 x 190, 2 tables de nuit avec lampes de chevet, étagère de rangement, meuble TV, téléviseur Sony 32 pouces avec décodeur, meuble bas de rangement, canapé 2 places."),

            new Paragraph({ children: [new TextRun({ text: "Couloir", font, size: 24, bold: true })], spacing: { before: 120, after: 60 } }),
            createParagraph("Deux placards dont un avec penderie. Dans un placard, les vannes d'eau permettent de couper complètement l'eau en cas de fuite. Dans le deuxième placard, un extincteur est mis à disposition."),

            new Paragraph({ children: [new TextRun({ text: "Terrasse", font, size: 24, bold: true })], spacing: { before: 120, after: 60 } }),
            createParagraph("Terrasse de 12 m² avec table en verre, 4 chaises et barbecue électrique Weber transportable et sur pied."),

            createSectionTitle("PRESTATIONS INCLUSES"),
            createBulletPoint("Linge de maison fourni (Draps fournis)"),
            createBulletPoint("Chauffage inclus"),
            createBulletPoint("Ménage de fin de séjour inclus"),

            createSectionTitle("ACCÈS ET INFORMATIONS PRATIQUES"),
            createBulletPoint("Entrée indépendante avec accès par escalier en colimaçon. Escalier facile à monter mais déconseillé aux personnes avec des difficultés de mobilité (personnes plus âgées ou handicapées)."),
            createBulletPoint("L'accueil est fait par le propriétaire ou une personne de confiance. Le propriétaire habite dans la maison principale qui est en mitoyenne avec le gîte. La sonnette est située en face avant sur la boîte aux lettres."),
            createBulletPoint("Il est possible de garer une voiture devant le garage la journée mais un emplacement de parking est également prévu à l'arrière de la maison (sécurisé par une caméra infrarouge)."),
            createBulletPoint("Un garage avec porte télécommandée est disponible pour le stationnement de vélos si besoin."),
            createBulletPoint("Le jacuzzi pour 6 adultes se situe à côté du parking dans la partie jardin de la maison. L'utilisation est sous votre responsabilité. Tout accident survenu lors de son utilisation ne peut être incombé au propriétaire."),
            createBulletPoint("Vous disposez d'une terrasse en IPE avec une table, 4 chaises et deux transats."),

            // FAIT À + SIGNATURES (en fin de document)
            new Paragraph({
              children: [new TextRun({ text: `Fait à WETTOLSHEIM, le ${data.contractDate}`, font, size: baseSize })],
              alignment: AlignmentType.LEFT,
              spacing: { before: 480, after: 480 },
            }),

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
                        new Paragraph({ children: [new TextRun({ text: "Le Propriétaire", font, bold: true, size: 24 })] }),
                        new Paragraph({ children: [new TextRun({ text: "Lu et approuvé", font, italics: true, size: baseSize })], spacing: { before: 720 } }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({ children: [new TextRun({ text: "Le Locataire", font, bold: true, size: 24 })], alignment: AlignmentType.RIGHT }),
                        new Paragraph({ children: [new TextRun({ text: "Lu et approuvé", font, italics: true, size: baseSize })], alignment: AlignmentType.RIGHT, spacing: { before: 720 } }),
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
