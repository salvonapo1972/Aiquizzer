
import { z } from 'zod';

export const quizSchema = z.object({
  quizTitle: z.string(),

  questions: z.array(
    z.object({
      questionText: z.string(),

      options: z.array(
        z.string()
      ),

      correctAnswer: z.enum([
        'A',
        'B',
        'C',
        'D',
      ]),
      correctAnswerIndex: z
        .number()
        .min(0)
        .max(3),

      explanation: z.string(),
    })
  ),
});
