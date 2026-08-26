import { GoogleGenerativeAI } from '@google/generative-ai';

export interface ChatMessage {
  role: 'user' | 'model';
  parts: string;
}

const SSC_FEATURES = `
Platform: SMKN 1 Cisarua Connect (SSC) adalah portal informasi sekolah untuk SMKN 1 Cisarua.
Fitur yang tersedia:
- Dashboard: ringkasan pengumuman, jadwal hari ini, event mendatang
- Pengumuman: daftar pengumuman sekolah dengan kategori, prioritas, dan target audience
- Jadwal Pelajaran: jadwal kelas per hari (Senin–Jumat) dengan mapel, guru, ruangan, dan waktu
- Event Sekolah: daftar kegiatan/agenda sekolah dengan tanggal, waktu, lokasi, dan organizer
- Laporan Fasilitas: siswa bisa membuat laporan kerusakan fasilitas, admin/guru bisa mengubah status
- Lost & Found: siswa bisa memposting barang hilang atau ditemukan, menandai sebagai resolved
- Notifikasi: notifikasi pribadi untuk pengguna
- Profil: pengguna bisa mengedit nama dan avatar
- AI Assistant: chat assistant ini yang sedang kamu wakili
- Admin Command Center: dashboard admin dengan metrics dan navigasi modul
- Emergency Alert: banner darurat yang bisa dipublish admin

Role yang ada: STUDENT, STUDENT_LEADER, TEACHER, ADMIN, SUPER_ADMIN.

Aturan penting:
- Kamu hanya bisa membantu berdasarkan fitur yang ada di SSC.
- Jika informasi tidak tersedia di SSC, katakan dengan jujur: "Maaf, aku belum punya informasi tersebut di SSC."
- Jangan mengarang data sekolah, jadwal, pengumuman, atau fitur yang tidak ada.
- Jangan mengklaim bisa mengakses database atau data realtime jika tidak ada konteksnya.
- Jangan menyebutkan API key, token, password, atau data sensitif lainnya.
`;

function buildSystemPrompt(userRole: string, userName: string): string {
  const base = `Kamu adalah SSC Assistant, asisten AI resmi SMKN 1 Cisarua Connect untuk ${userName}.
Identitas kamu: asisten sekolah yang ramah, informatif, dan mudah dipahami.

${SSC_FEATURES}

`;

  if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
    return `${base}Gaya komunikasi: profesional, berbasis data, dan jelas.
Kamu bisa membantu analisis operasional, menyusun laporan, draft pengumuman, dan rekomendasi pengembangan platform.
Gunakan Bahasa Indonesia yang formal namun tetap natural.`;
  }

  if (userRole === 'TEACHER' || userRole === 'STUDENT_LEADER') {
    return `${base}Gaya komunikasi: profesional namun ramah.
Kamu bisa membantu administrasi kelas, materi ajar, laporan, dan operasional sekolah.
Gunakan Bahasa Indonesia yang jelas dan mudah dipahami.`;
  }

  return `${base}Gaya komunikasi: ramah, ringkas, dan informatif, seperti teman yang membantu.
Jawab dalam Bahasa Indonesia yang natural dan mudah dipahami siswa SMK.
Jika pertanyaan tidak berkaitan dengan SSC, jawab dengan tetap sopan dan arahkan ke fitur SSC yang tersedia.`;
}

function limitHistory(messages: ChatMessage[], maxTurns: number = 10): ChatMessage[] {
  const limit = maxTurns * 2;
  return messages.length > limit ? messages.slice(-limit) : messages;
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
  const recentMessages = limitHistory(messages, 10);

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
          temperature: 0.6,
          maxOutputTokens: 2048,
          topP: 0.9,
          topK: 40,
        },
      });

      const history = recentMessages.slice(0, -1).map((m) => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.parts }],
      }));

      const chat = model.startChat({ history });
      const lastMessage = recentMessages[recentMessages.length - 1];
      const result = await chat.sendMessage(lastMessage.parts);
      const text = result.response.text();

      if (text && text.trim()) {
        return text.trim();
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
