import { NextRequest, NextResponse } from 'next/server';
import { supportAgent } from '../../../mastra/src/mastra/agents/support-agent';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, threadId } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const result = await supportAgent.generate(message, { threadId });

    // Extraer el texto de respuesta de diferentes lugares posibles
    let responseText = result.text;

    if (!responseText && result.steps && result.steps.length > 0) {
      const lastStep = result.steps[result.steps.length - 1];
      const textContent = lastStep.content?.find((c: { type: string; text?: string }) => c.type === 'text');
      responseText =
        lastStep.text ||
        (textContent && 'text' in textContent ? textContent.text : undefined) ||
        '';
    }

    if (!responseText && result.response?.messages) {
      const lastMessage =
        result.response.messages[result.response.messages.length - 1];
      if (typeof lastMessage?.content === 'string') {
        responseText = lastMessage.content;
      } else if (Array.isArray(lastMessage?.content)) {
        const textPart = lastMessage.content.find((c): c is { type: 'text'; text: string } => c.type === 'text');
        if (textPart && 'text' in textPart) {
          responseText = textPart.text;
        }
      }
    }

    if (!responseText) {
      responseText = 'Lo siento, no pude generar una respuesta.';
    }

    return NextResponse.json({
      response: responseText,
      threadId: threadId,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to handle request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
