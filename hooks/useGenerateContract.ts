import { jsPDF } from 'jspdf';

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
}

export function useGenerateContract() {
  const generatePDF = (data: ContractData) => {
    const doc = new jsPDF();

    let yPos = 25;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 25;
    const maxWidth = pageWidth - 2 * margin;

    // Couleurs
    const goldColor: [number, number, number] = [184, 134, 11];
    const darkGray: [number, number, number] = [50, 50, 50];
    const mediumGray: [number, number, number] = [100, 100, 100];
    const lightGray: [number, number, number] = [140, 140, 140];

    // Helper functions
    const checkPageBreak = (spaceNeeded: number = 30) => {
      if (yPos + spaceNeeded > pageHeight - 25) {
        doc.addPage();
        yPos = 25;
        return true;
      }
      return false;
    };

    const addSpace = (space: number = 6) => {
      yPos += space;
    };

    const addTitle = (text: string, size: number = 16) => {
      checkPageBreak(15);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(size);
      doc.setTextColor(...goldColor);
      doc.text(text, pageWidth / 2, yPos, { align: 'center' });
      yPos += size / 2 + 5;
    };

    const addSubtitle = (text: string, size: number = 11) => {
      checkPageBreak(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(size);
      doc.setTextColor(...darkGray);
      doc.text(text, margin, yPos);
      yPos += size / 2 + 5;
    };

    const addParagraph = (text: string, size: number = 9.5) => {
      checkPageBreak(20);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(size);
      doc.setTextColor(...mediumGray);
      const lines = doc.splitTextToSize(text, maxWidth);

      lines.forEach((line: string) => {
        checkPageBreak(6);
        doc.text(line, margin, yPos);
        yPos += 4.5;
      });
      yPos += 1;
    };

    const addInfoRow = (label: string, value: string) => {
      checkPageBreak(8);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(...mediumGray);
      doc.text(label, margin, yPos);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...darkGray);
      const valueLines = doc.splitTextToSize(value, maxWidth - 55);
      valueLines.forEach((line: string, index: number) => {
        doc.text(line, margin + 55, yPos + (index * 5));
      });
      yPos += Math.max(5, valueLines.length * 5 + 1);
    };

    const addSeparator = () => {
      checkPageBreak(5);
      doc.setDrawColor(...goldColor);
      doc.setLineWidth(0.3);
      doc.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 10;
    };

    const addBulletPoint = (text: string, size: number = 9.5) => {
      checkPageBreak(15);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(size);
      doc.setTextColor(...mediumGray);

      const bulletX = margin + 2;
      doc.text('•', bulletX, yPos);

      const textLines = doc.splitTextToSize(text, maxWidth - 8);
      textLines.forEach((line: string) => {
        checkPageBreak(6);
        doc.text(line, margin + 8, yPos);
        yPos += 4.5;
      });
      yPos += 2;
    };

    // ========== PAGE 1: CONTRAT PRINCIPAL ==========

    // En-tête
    addTitle('CONTRAT DE LOCATION SAISONNIÈRE', 17);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...lightGray);
    doc.text('Gîte de charme en Alsace - 9 Résidence du Château Martinsbourg', pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;

    addSeparator();

    // Partie 1: Le propriétaire
    addSubtitle('LE PROPRIÉTAIRE');
    addInfoRow('Nom et Prénom :', 'LEXCELLENT Michel');
    addInfoRow('Adresse :', '9 Résidence du Château Martinsbourg, 68920 WETTOLSHEIM');
    addInfoRow('Téléphone :', '+33 6 81 84 25 54');
    addSpace(8);

    // Partie 2: Le locataire
    addSubtitle('LE LOCATAIRE');
    addInfoRow('Nom et Prénom :', `${data.clientLastName.toUpperCase()} ${data.clientFirstName}`);
    addInfoRow('Adresse :', data.clientAddress);
    addInfoRow('Téléphone :', data.clientPhone);
    addInfoRow('Email :', data.clientEmail);
    addSpace(8);

    addSeparator();

    // Partie 3: Détails de la location
    addSubtitle('DÉTAILS DE LA LOCATION');
    addInfoRow('Période :', `Du ${data.checkInDate} au ${data.checkOutDate}`);
    addInfoRow('Adresse du gîte :', '9 Résidence du Château Martinsbourg, 68920 WETTOLSHEIM');
    addInfoRow('Type :', 'Appartement de 68 m²');
    addSpace(8);

    // Partie 4: Conditions financières
    addSubtitle('CONDITIONS FINANCIÈRES');

    // Encadré prix
    checkPageBreak(45);
    doc.setFillColor(250, 248, 243);
    doc.roundedRect(margin, yPos, maxWidth, 38, 3, 3, 'F');
    yPos += 9;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(...darkGray);
    doc.text('Prix total du séjour :', margin + 6, yPos);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(...goldColor);
    doc.text(`${data.totalPrice} €`, pageWidth - margin - 6, yPos, { align: 'right' });
    yPos += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...mediumGray);
    doc.text('Toutes charges et taxes comprises', margin + 6, yPos);
    yPos += 7;

    doc.text(`Arrhes versées (30%) : ${data.depositAmount} € (chèque non encaissé)`, margin + 6, yPos);
    yPos += 5;
    doc.text(`Solde restant : ${data.balanceAmount} €`, margin + 6, yPos);
    yPos += 5;
    doc.text('Dépôt de garantie : 400 € (chèque non encaissé)', margin + 6, yPos);
    yPos += 13;

    addParagraph('Le solde et le dépôt de garantie seront versés le jour de la remise des clés.');
    addSpace(10);

    addSeparator();

    // Date
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(...lightGray);
    doc.text(`Fait à Wettolsheim, le ${data.contractDate}`, margin, yPos);
    yPos += 10;

    // ========== PAGE 2: CONDITIONS GÉNÉRALES ==========
    doc.addPage();
    yPos = 25;

    addTitle('CONDITIONS GÉNÉRALES DE LOCATION', 15);
    addSpace(5);

    addParagraph('La présente location est faite aux conditions ordinaires et de droit en pareille matière et notamment à celles ci-après que le locataire s\'oblige à exécuter, sous peine de tous dommages et intérêts et même de résiliations des présentes, si bon semble au propriétaire et sans pouvoir réclamer la diminution du loyer.');
    addSpace(5);

    addParagraph('Les heures d\'arrivée sont normalement prévues à partir de 16 h (prévenir par téléphone ou sms 1 heure avant l\'arrivée), possibilité d\'une arrivée anticipée en fonction de l\'occupation du gîte. Les heures de départ sont normalement prévues le matin avant 10 heures (si locataires arrivant le même jour, sinon dans l\'après-midi).');
    addSpace(8);

    addSubtitle('EN CAS DE DÉSISTEMENT');
    addParagraph('Du locataire : à plus de 15 jours avant la prise d\'effet de la location, le locataire perd les arrhes versées.');
    addSpace(3);
    addParagraph('Du propriétaire : à moins d\'un mois avant la prise d\'effet de la location, il est tenu de verser le double des arrhes au locataire dans les sept jours suivant le désistement.');
    addSpace(8);

    addSubtitle('RETARD D\'ARRIVÉE');
    addParagraph('Si un retard de plus de quatre jours par rapport à la date d\'arrivée prévue n\'a pas été signalé par le locataire, le propriétaire pourra de bon droit essayer de relouer le logement tout en conservant la faculté de se retourner contre le locataire.');
    addSpace(8);

    addSubtitle('OBLIGATIONS DU LOCATAIRE');
    addBulletPoint('Occuper les lieux personnellement, les habiter en bon père de famille et les entretenir.');
    addBulletPoint('Toutes les installations sont en état de marche. Toute réclamation survenant plus de 24h après l\'entrée en jouissance des lieux ne pourra être admise.');
    addBulletPoint('Les réparations rendues nécessaires par la négligence ou le mauvais entretien en cours de location seront à la charge du locataire.');
    addBulletPoint('Veiller à ce que la tranquillité du voisinage ne soit pas troublée.');
    addSpace(8);

    checkPageBreak(60);

    addSubtitle('ÉQUIPEMENTS ET MOBILIER');
    addParagraph('Les locaux sont loués meublés avec matériel de cuisine, vaisselle, verrerie, couvertures et oreillers, tels qu\'ils sont dans l\'état descriptif. S\'il y a lieu, le propriétaire ou son représentant seront en droit de réclamer au locataire, à son départ, la valeur totale au prix de remplacement des objets, mobiliers ou matériels cassés, fêlés, ébréchés ou détériorés.');
    addSpace(8);

    addSubtitle('ASSURANCE');
    addParagraph('Le locataire s\'engage à s\'assurer contre les risques locatifs (incendie, dégât des eaux). Le défaut d\'assurance, en cas de sinistre, donnera lieu à des dommages et intérêts. Le propriétaire s\'engage à assurer le logement contre les risques locatifs pour le compte du locataire, ce dernier ayant l\'obligation de lui signaler, dans les 24h, tout sinistre survenu dans le logement.');
    addSpace(8);

    addSubtitle('DÉPÔT DE GARANTIE');
    addParagraph('Le dépôt de garantie sera restitué au départ du locataire sauf en cas de retenue justifiée.');

    // ========== PAGE 3: ÉTAT DESCRIPTIF ==========
    doc.addPage();
    yPos = 25;

    addTitle('ÉTAT DESCRIPTIF DE LA LOCATION', 15);
    addSpace(5);

    addSubtitle('INFORMATIONS GÉNÉRALES');
    addInfoRow('Adresse :', '9 Résidence du Château Martinsbourg, 68920 WETTOLSHEIM');
    addInfoRow('Type :', 'Appartement');
    addInfoRow('Surface habitable :', '68 m²');
    addSpace(8);

    addSubtitle('DÉTAILS DES PIÈCES');
    addSpace(3);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...darkGray);
    doc.text('Cuisine', margin, yPos);
    yPos += 5;
    addParagraph('Table en verre avec 4 chaises, lave-vaisselle, lave-linge, sèche-linge, plaque à induction, réfrigérateur avec congélateur, micro-ondes avec four, évier avec mitigeur, cafetière, vaisselle neuve, climatisation et chauffage DAIKIN avec télécommande, meubles de rangement.');
    addSpace(5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...darkGray);
    doc.text('Salon', margin, yPos);
    yPos += 5;
    addParagraph('Canapé 3 places avec couchage de 1,60 mètres pour 2 personnes, chaîne hifi, téléviseur écran plat avec fibre, meuble TV, 3 tables de salon, grand placard avec coffre sécurisé, climatisation et chauffage DAIKIN avec télécommande.');
    addSpace(5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...darkGray);
    doc.text('Salle de bain', margin, yPos);
    yPos += 5;
    addParagraph('Douche, lavabo, sèche-serviette chauffant, WC, meuble avec lavabo intégré et mitigeur.');
    addSpace(5);

    checkPageBreak(60);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...darkGray);
    doc.text('Chambre 1', margin, yPos);
    yPos += 5;
    addParagraph('Lit 160 x 190, 1 table de nuit, 2 tablettes de nuit, placard, téléviseur écran plat frame Samsung de 43 pouces.');
    addSpace(5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...darkGray);
    doc.text('Chambre 2', margin, yPos);
    yPos += 5;
    addParagraph('Lits 90 x 190, 2 tables de nuit avec lampes de chevet, étagère de rangement, meuble TV, téléviseur Sony 32 pouces avec décodeur, meuble bas de rangement, canapé 2 places.');
    addSpace(5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...darkGray);
    doc.text('Couloir', margin, yPos);
    yPos += 5;
    addParagraph('Deux placards dont un avec penderie. Dans un placard, les vannes d\'eau permettent de couper complètement l\'eau en cas de fuite. Dans le deuxième placard, un extincteur est mis à disposition.');
    addSpace(5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...darkGray);
    doc.text('Terrasse', margin, yPos);
    yPos += 5;
    addParagraph('Terrasse de 12 m² avec table en verre, 4 chaises et barbecue électrique Weber transportable et sur pied.');
    addSpace(8);

    addSubtitle('PRESTATIONS INCLUSES');
    addSpace(3);

    checkPageBreak(40);

    // Encadré prestations
    doc.setFillColor(250, 248, 243);
    doc.roundedRect(margin, yPos, maxWidth, 28, 3, 3, 'F');
    yPos += 7;

    const prestationX = margin + 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(...darkGray);
    doc.text('✓ Linge de maison fourni', prestationX, yPos);
    doc.text('✓ Draps fournis', prestationX + 85, yPos);
    yPos += 6;
    doc.text('✓ Chauffage', prestationX, yPos);
    doc.text('✓ Ménage de fin de séjour', prestationX + 85, yPos);
    yPos += 12;

    addSpace(8);

    addSubtitle('ACCÈS ET INFORMATIONS PRATIQUES');
    addBulletPoint('Entrée indépendante avec accès par escalier en colimaçon. Escalier facile à monter mais déconseillé aux personnes avec des difficultés de mobilité.');
    addBulletPoint('L\'accueil est fait par le propriétaire ou une personne de confiance. Le propriétaire habite dans la maison mitoyenne.');
    addBulletPoint('Parking : possibilité de garer une voiture devant le garage la journée. Emplacement sécurisé (caméra infrarouge) à l\'arrière de la maison pour la nuit.');
    addBulletPoint('Jacuzzi 6 places situé à côté du parking dans la partie jardin. Utilisation sous votre responsabilité.');
    addBulletPoint('Terrasse en IPE avec table, 4 chaises et deux transats.');
    addSpace(15);

    // Signatures finales
    checkPageBreak(30);
    addSeparator();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...darkGray);
    doc.text('Le Propriétaire', margin + 15, yPos);
    doc.text('Le Locataire', pageWidth - margin - 35, yPos);
    yPos += 15;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(...lightGray);
    doc.text('Lu et approuvé', pageWidth - margin - 30, yPos);

    // Sauvegarder le PDF
    const fileName = `Contrat_${data.clientLastName}_${data.checkInDate.replace(/\//g, '-')}.pdf`;
    doc.save(fileName);
  };

  return { generatePDF };
}
