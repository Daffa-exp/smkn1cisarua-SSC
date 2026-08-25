import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { generateChatResponse, ChatMessage } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Harap login terlebih dahulu.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { messages } = body as { messages: ChatMessage[] };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Pesan tidak boleh kosong.' },
        { status: 400 }
      );
    }

    const reply = await generateChatResponse(messages, session.role, session.name);

    return NextResponse.json({ success: true, reply });
  } catch (error: any) {
    console.error('[AI] Chat error:', error?.status, error?.message || error);
    let clientMessage = 'Gagal menghubungi AI. Coba lagi sebentar.';

    if (error?.message === 'API_KEY_MISSING') {
      clientMessage = 'Fitur AI belum aktif. Konfigurasi GEMINI_API_KEY di environment variable server.';
    } else if (error?.message === 'API_KEY_INVALID') {
      clientMessage = 'GEMINI_API_KEY tidak valid. Periksa kunci API Google Gemini pada server.';
    } else if (error?.message === 'RATE_LIMIT') {
      clientMessage = 'Batas penggunaan API AI tercapai sementara. Silakan coba lagi beberapa saat lagi.';
    }

    return NextResponse.json(
      {
        success: false,
        message: clientMessage,
      },
      { status: 500 }
    );
  }
}
