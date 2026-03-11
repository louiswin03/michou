import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { generateContractDoc, ContractData } from '@/lib/generateContractDoc';

export async function POST(req: Request) {
    try {
        const data: ContractData = await req.json();

        // Generate the docx buffer
        const docBuffer = await generateContractDoc(data);

        // Create transporter using Gmail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER, // Votre adresse Gmail (expéditeur)
                pass: process.env.GMAIL_APP_PASSWORD, // Votre mot de passe d'application Gmail
            },
        });

        const filename = `Contrat_${data.clientLastName}_${data.checkInDate.replace(/\//g, '-')}.docx`;

        // Mail options
        const mailOptions = {
            from: '"L écrin du vignoble" <winkelmullerl@gmail.com>', // L'expéditeur DOIT être le compte Gmail authentifié
            to: 'lexcellent.michel@orange.fr', // Le destinataire final (Orange)
            subject: `Nouveau Contrat de Location - ${data.clientLastName} ${data.clientFirstName}`,
            text: `
            
Bonjour,

Veuillez trouver ci-joint le contrat de location pour le séjour de ${data.clientFirstName} ${data.clientLastName}.

Détails du séjour :
- Période : Du ${data.checkInDate} au ${data.checkOutDate}
- Nombre de nuits : ${data.nights}
- Prix total : ${data.totalPrice} €


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
