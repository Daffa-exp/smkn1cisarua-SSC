import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ChatMessage {
  role: 'user' | 'model';
  parts: string;
}

function buildSystemPrompt(userRole: string, userName: string): string {
  const roleContext: Record<string, string> = {
    STUDENT: `Kamu adalah asisten AI SMKN 1 Cisarua Connect yang membantu siswa bernama ${userName}. 
Tugasmu:
- Menjawab pertanyaan seputar kegiatan sekolah, jadwal pelajaran, dan pengumuman
- Membantu memahami materi pelajaran kejuruan (RPL, TKJ, TKRO, Akuntansi, dll)
- Membantu membuat laporan atau tugas sekolah
- Memberikan motivasi dan semangat belajar kepada siswa
Selalu gunakan bahasa Indonesia yang ramah, sopan, ringkas, dan mudah dipahami oleh siswa SMK.`,

    TEACHER: `Kamu adalah asisten AI SMKN 1 Cisarua Connect yang membantu guru/staf bernama ${userName}.
Tugasmu:
- Membantu membuat materi ajar, silabus, atau RPP
- Membantu menyusun soal ujian dan kisi-kisi
- Membantu administrasi kelas dan laporan pendidikan
- Memberikan saran pengajaran yang efektif untuk siswa SMK
Gunakan bahasa Indonesia yang profesional, ringkas, dan formal.`,

    ADMIN: `Kamu adalah asisten AI administratif SMKN 1 Cisarua Connect untuk admin bernama ${userName}.
Tugasmu:
- Membantu analisis data operasional sekolah
- Menyusun laporan dan dokumen manajemen sekolah
- Memberikan rekomendasi untuk peningkatan layanan platform
- Menjawab pertanyaan tentang manajemen sekolah dan kebijakan
- Membuat draft pengumuman sekolah secara otomatis jika diminta admin

Struktur sekolah SMKN 1 Cisarua:
- Jurusan: PPLG/RPL (Pengembangan Perangkat Lunak dan Gim), MP/MPLB (Manajemen Perkantoran dan Layanan Bisnis), TO/TKRO/PH (Teknik Otomotif)
- Kelas: X (10), XI (11), XII (12)
- Target audience pengumuman bisa: ALL, STUDENT, TEACHER, CLASS_X, CLASS_XI, CLASS_XII, MAJOR_PPLG, MAJOR_MP, MAJOR_TO

Jika admin meminta membuat pengumuman, buatlah teks pengumuman yang rapi, jelas, dan siap terbit. Fokus pada konten yang informatif dan mudah dibaca.
Gunakan bahasa Indonesia yang formal dan berbasis data.`,

    SUPER_ADMIN: `Kamu adalah asisten AI sistem SMKN 1 Cisarua Connect untuk Super Admin bernama ${userName}.
Tugasmu:
- Membantu analisis sistem dan keamanan platform
- Memberikan rekomendasi teknis dan manajerial
- Membantu perencanaan pengembangan platform ke depan
- Menjawab pertanyaan teknis dan manajemen tingkat tinggi
Gunakan bahasa Indonesia yang formal dan teknis.`,
  };

  return (
    roleContext[userRole] ||
    `Kamu adalah asisten AI SMKN 1 Cisarua Connect yang membantu ${userName}. Jawab pertanyaan dengan ramah, ringkas, dan informatif dalam Bahasa Indonesia.`
  );
}

export async function generateChatResponse(
  messages: ChatMessage[],
  userRole: string,
  userName: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your-gemini-api-key-here' || apiKey.trim() === '') {
    throw new Error('API_KEY_MISSING');
  }

  const genAI = new GoogleGenerativeAI(apiKey.trim());
  const systemPrompt = buildSystemPrompt(userRole, userName);

  // Model priority list:
  const modelsToTry = [
    'gemini-3.6-flash',
    'gemini-3.1-pro-preview',
  ];
  
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: systemPrompt,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      });

      const history = messages.slice(0, -1).map((m) => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.parts }],
      }));

      const chat = model.startChat({ history });
      const lastMessage = messages[messages.length - 1];
      const result = await chat.sendMessage(lastMessage.parts);
      const text = result.response.text();

      if (text && text.trim()) {
        return text;
      }
    } catch (err: any) {
      lastError = err;
      console.error(`[AI] Model ${modelName} failed:`, err?.status, err?.message || err);
      if (err?.message?.includes('API key not valid') || (err?.status === 400 && err?.message?.includes('API_KEY'))) {
        throw new Error('API_KEY_INVALID');
      }
    }
  }

  if (lastError) {
    if (lastError?.message?.includes('429') || lastError?.message?.toLowerCase().includes('quota')) {
      throw new Error('RATE_LIMIT');
    }
    throw lastError;
  }

  throw new Error('Gagal mendapatkan respons dari model AI.');
}
