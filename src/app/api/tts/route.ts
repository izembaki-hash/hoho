import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

// Maximum text length to prevent abuse
const MAX_TEXT_LENGTH = 4096

// Maximum chunk length for a single TTS API call
const MAX_CHUNK_LENGTH = 1000

// Supported response formats for the TTS API
const SUPPORTED_FORMATS = ['wav', 'pcm'] as const
type SupportedFormat = (typeof SUPPORTED_FORMATS)[number]

// Map of format to content-type
const FORMAT_CONTENT_TYPE: Record<SupportedFormat, string> = {
  wav: 'audio/wav',
  pcm: 'audio/pcm',
}

// Supported voices
const SUPPORTED_VOICES = ['tongtong', 'chuichui', 'xiaochen', 'jam', 'kazi', 'douji', 'luodo'] as const
type SupportedVoice = (typeof SUPPORTED_VOICES)[number]

const DEFAULT_VOICE: SupportedVoice = 'tongtong'
const DEFAULT_FORMAT: SupportedFormat = 'wav'

// Singleton ZAI instance
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create()
  }
  return zaiInstance
}

/**
 * Splits long text into chunks that fit within the TTS API's limits.
 * Tries to break at sentence boundaries (Arabic and general punctuation).
 */
function splitTextIntoChunks(text: string, maxLength = MAX_CHUNK_LENGTH): string[] {
  const chunks: string[] = []
  // Split by sentence-ending punctuation (Arabic: ، ؟ . and general: . ! ?)
  const sentences = text.match(/[^.!?\u060C\u061F\u06D4]+[.!?\u060C\u061F\u06D4]+/g) || [text]

  let currentChunk = ''
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length <= maxLength) {
      currentChunk += sentence
    } else {
      if (currentChunk) chunks.push(currentChunk.trim())
      // If a single sentence exceeds maxLength, split by words
      if (sentence.length > maxLength) {
        const words = sentence.split(/\s+/)
        let wordChunk = ''
        for (const word of words) {
          if ((wordChunk + ' ' + word).length <= maxLength) {
            wordChunk = wordChunk ? wordChunk + ' ' + word : word
          } else {
            if (wordChunk) chunks.push(wordChunk.trim())
            wordChunk = word
          }
        }
        currentChunk = wordChunk
      } else {
        currentChunk = sentence
      }
    }
  }
  if (currentChunk) chunks.push(currentChunk.trim())

  return chunks.filter((c) => c.length > 0)
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body: { text?: string; voice?: string; speed?: number; format?: string }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'طلب غير صالح: يجب إرسال JSON صالح' },
        { status: 400 }
      )
    }

    const { text, voice, speed, format } = body

    // Validate text field
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'حقل النص مطلوب ويجب أن يكون نصاً' },
        { status: 400 }
      )
    }

    const trimmedText = text.trim()

    if (trimmedText.length === 0) {
      return NextResponse.json(
        { error: 'لا يمكن أن يكون النص فارغاً' },
        { status: 400 }
      )
    }

    if (trimmedText.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        {
          error: `النص طويل جداً. الحد الأقصى ${MAX_TEXT_LENGTH} حرفاً. النص المُدخل يحتوي على ${trimmedText.length} حرفاً.`,
        },
        { status: 400 }
      )
    }

    // Validate voice parameter
    const selectedVoice: SupportedVoice =
      voice && typeof voice === 'string' && SUPPORTED_VOICES.includes(voice as SupportedVoice)
        ? (voice as SupportedVoice)
        : DEFAULT_VOICE

    // Validate speed parameter
    const selectedSpeed = typeof speed === 'number' && speed >= 0.5 && speed <= 2.0 ? speed : 1.0

    // Validate format parameter
    const selectedFormat: SupportedFormat =
      format && typeof format === 'string' && SUPPORTED_FORMATS.includes(format as SupportedFormat)
        ? (format as SupportedFormat)
        : DEFAULT_FORMAT

    // Initialize the ZAI SDK
    const zai = await getZAI()

    // Split text into chunks if it exceeds max length
    const chunks = splitTextIntoChunks(trimmedText)

    if (chunks.length === 0) {
      return NextResponse.json(
        { error: 'لا يوجد نص صالح للتحويل' },
        { status: 400 }
      )
    }

    // For a single chunk, return the audio directly
    if (chunks.length === 1) {
      const response = await zai.audio.tts.create({
        input: chunks[0],
        voice: selectedVoice,
        speed: selectedSpeed,
        response_format: selectedFormat,
        stream: false,
      })

      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(new Uint8Array(arrayBuffer))

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': FORMAT_CONTENT_TYPE[selectedFormat],
          'Content-Length': buffer.length.toString(),
          'Cache-Control': 'public, max-age=3600',
          'Accept-Ranges': 'bytes',
        },
      })
    }

    // For multiple chunks, concatenate the audio data
    const audioBuffers: Buffer[] = []
    for (const chunk of chunks) {
      const response = await zai.audio.tts.create({
        input: chunk,
        voice: selectedVoice,
        speed: selectedSpeed,
        response_format: selectedFormat,
        stream: false,
      })

      const arrayBuffer = await response.arrayBuffer()
      audioBuffers.push(Buffer.from(new Uint8Array(arrayBuffer)))
    }

    const combinedBuffer = Buffer.concat(audioBuffers)
    const contentType = FORMAT_CONTENT_TYPE[selectedFormat]

    return new NextResponse(combinedBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': combinedBuffer.length.toString(),
        'Cache-Control': 'public, max-age=3600',
        'Accept-Ranges': 'bytes',
        'X-Chunk-Count': chunks.length.toString(),
      },
    })
  } catch (error) {
    console.error('TTS API error:', error)

    if (error instanceof Error) {
      // Handle rate limiting
      if (error.message.includes('429') || error.message.includes('Too many requests')) {
        return NextResponse.json(
          { error: 'تم تجاوز حد الطلبات. يرجى المحاولة مرة أخرى بعد قليل.' },
          { status: 429 }
        )
      }

      // Handle API connection errors
      if (error.message.includes('API request failed')) {
        return NextResponse.json(
          { error: 'فشل في الاتصال بخدمة تحويل النص إلى كلام' },
          { status: 502 }
        )
      }

      // Handle configuration errors
      if (error.message.includes('API key') || error.message.includes('apiKey')) {
        return NextResponse.json(
          { error: 'خطأ في تكوين الخدمة: مفتاح API غير صالح' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { error: 'حدث خطأ غير متوقع أثناء تحويل النص إلى كلام' },
      { status: 500 }
    )
  }
}

// GET endpoint returns API info and supported options
export async function GET() {
  return NextResponse.json(
    {
      message: 'واجهة تحويل النص إلى كلام - TTS API',
      method: 'يرجى استخدام POST لتحويل النص إلى كلام',
      supportedVoices: SUPPORTED_VOICES,
      defaultVoice: DEFAULT_VOICE,
      supportedFormats: SUPPORTED_FORMATS,
      defaultFormat: DEFAULT_FORMAT,
      maxTextLength: MAX_TEXT_LENGTH,
      speedRange: '0.5 - 2.0',
    },
    { status: 200 }
  )
}
