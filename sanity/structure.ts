import { StructureBuilder } from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Contenu')
    .items([
      // Page d'Accueil
      S.listItem()
        .title('🏠 Accueil')
        .child(
          S.document()
            .schemaType('homePage')
            .documentId('homePage')
        ),

      // Page Contact
      S.listItem()
        .title('📞 Contact')
        .child(
          S.document()
            .schemaType('contactPage')
            .documentId('contactPage')
        ),

      // Page À Propos
      S.listItem()
        .title('ℹ️ À Propos')
        .child(
          S.document()
            .schemaType('aboutPage')
            .documentId('aboutPage')
        ),

      // Paramètres Généraux
      S.divider(),
      S.listItem()
        .title('⚙️ Paramètres Généraux')
        .child(
          S.document()
            .schemaType('generalSettings')
            .documentId('generalSettings')
        ),
    ])
