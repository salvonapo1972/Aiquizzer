import { streamObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { db } from '@/app/lib/db';
import { quizSchema } from '../chat/schema';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: Request) {
  console.log('=== POST /api/quiz ===');
  const { userId } = await auth.protect();
  try {
    const body = await req.json();

    const articleId = body?.articleId;
    const limitSup = body?.limitSup;
    const limitDown = body?.limitDown;

    console.log('articleId:', articleId);
    console.log('limitSup:', limitSup);
    console.log('limitDown:', limitDown);

    /*
     * =====================================================
     * LETTURA DATABASE
     * =====================================================
     *
     * Per il momento leggiamo tutto il contenuto.
     */

    const { rows } = await db.query(`
      SELECT content
        FROM (
            SELECT ROW_NUMBER() OVER () AS rownum, * 
            FROM document_sections ds 
        ) sub
        WHERE rownum BETWEEN ${limitDown} AND ${limitSup}; 
    `);

    console.log(
      'Numero sezioni:',
      rows?.length ?? 0
    );

    if (!rows || rows.length === 0) {
      return Response.json(
        {
          error: 'Contenuto non trovato',
        },
        {
          status: 404,
        }
      );
    }

    /*
     * =====================================================
     * COSTRUZIONE CONTENUTO
     * =====================================================
     */

    const content = rows
      .map(
        (row: { content?: string }) =>
          row.content
      )
      .filter(
        (value): value is string =>
          typeof value === 'string' &&
          value.trim().length > 0
      )
      .join('\n\n');

    console.log(
      'Caratteri contenuto:',
      content.length
    );

    if (!content.trim()) {
      return Response.json(
        {
          error:
            'Il database non contiene contenuto valido',
        },
        {
          status: 404,
        }
      );
    }

    /*
     * =====================================================
     * GENERAZIONE QUIZ
     * =====================================================
     */

    const result = streamObject({
      model: openai('gpt-5.6-luna'),

      schema: quizSchema,

      system: `
Sei un professore esperto.

Devi creare un quiz utilizzando ESCLUSIVAMENTE
le informazioni contenute nel testo fornito.

Regole obbligatorie:

- genera esattamente 50 domande;
- ogni domanda deve avere esattamente 4 opzioni;
- una sola opzione deve essere corretta;
- correctAnswerIndex deve essere:
  0 = prima opzione
  1 = seconda opzione
  2 = terza opzione
  3 = quarta opzione;
- fornisci una spiegazione chiara;
- non usare informazioni esterne;
- non inventare informazioni;
- le domande devono essere diverse;
- evita domande ambigue.
      `,

      prompt: `
Crea il quiz utilizzando esclusivamente
il seguente contenuto.

--------------------------------
CONTENUTO
--------------------------------

${content}

--------------------------------
FINE CONTENUTO
--------------------------------
      `,
    });

    console.log(
      'Quiz stream creato'
    );

    /*
     * =====================================================
     * RISPOSTA
     * =====================================================
     */

    return result.toTextStreamResponse();

  } catch (error) {
    console.error(
      'Errore generazione quiz:',
      error
    );

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Errore interno del server',
      },
      {
        status: 500,
      }
    );
  }
}