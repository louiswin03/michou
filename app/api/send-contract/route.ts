import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { generateContractDoc, ContractData } from '@/lib/generateContractDoc';

export async function POST(req: Request) {
    try {
        const data: ContractData = await req.json();

        // Generate the docx buffer
        const docBuffer = await generateContractDoc(data);

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'winkelmullerl@gmail.com',
                pass: 'qjozgiurccvdnqwu', // App password provided by user
            },
        });

        const filename = `Contrat_${data.clientLastName}_${data.checkInDate.replace(/\//g, '-')}.docx`;

        // Mail options
        const mailOptions = {
            from: '"Michou Gîte" <winkelmullerl@gmail.com>',
            to: 'winkelmullerl@gmail.com', // Sending to the owner as requested
            // Optionally CC the client? The user said "j'e veux l'envoyer sur un mail... à cette adresse", implies sending TO this address.
            // Maybe I should send it to the client AND the owner? 
            // User request: "à la place j eveux l'nvoyer sur un mail... envoi le mail à cette adresse: winkelmullerl@gmail.com"
            // I will send IT TO that address.
            subject: `Nouveau Contrat de Location - ${data.clientLastName} ${data.clientFirstName}`,
            text: `
Bonjour,

Veuillez trouver ci-joint le contrat de location pour le séjour de ${data.clientFirstName} ${data.clientLastName}.

Détails du séjour :
- Période : Du ${data.checkInDate} au ${data.checkOutDate}
- Nombre de nuits : ${data.nights}
- Prix total : ${data.totalPrice} €

Cordialement,
Le site Michou Gîte
      `,
            attachments: [
                {
                    filename: filename,
                    content: docBuffer,
                    contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                },
            ],
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: 'Contract sent successfully' });
    } catch (error) {
        console.error('Error sending contract email:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to send email', error: String(error) },
            { status: 500 }
        );
    }
}
