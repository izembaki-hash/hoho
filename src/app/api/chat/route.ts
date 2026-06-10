import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

// Rate limiting: max messages per request
const MAX_HISTORY_LENGTH = 20

// System prompt for the educational AI assistant
const SYSTEM_PROMPT = `أنت مساعد ذكي متخصص في منصة التحرير الكتابي والشفهي. دورك هو مساعدة الطلبة والأساتذة والتلاميذ في جميع ما يتعلق بمهارات التعبير الكتابي والشفهي.

مجالات خبرتك:
1. اللغة العربية والنحو والصرف والبلاغة
2. مهارات التعبير الشفهي: الخطابة، الإلقاء، لغة الجسد، العرض التقديمي، المناظرة، المحادثة
3. مهارات التحرير الكتابي: المقال، التلخيص، التقرير، الرسالة الإدارية، المقال التحليلي، المقال الجدلي، السيرة الذاتية، البحث العلمي، فن الخطابة
4. المنهجية الأكاديمية والبحث العلمي: كتابة البحوث، توثيق المصادر، المنهج العلمي
5. تقنيات الكتابة الإبداعية والتعبير الفني

إرشادات الاستجابة:
- أجب دائماً باللغة العربية الفصحى
- كن ودوداً ومشجعاً ومحفزاً للتعلم
- قدم أمثلة عملية توضيحية عند الحاجة
- استخدم أسلوباً سهلاً ومباشراً يناسب المستوى التعليمي للسائل
- إذا سُئلت عن شيء خارج تخصصك، وجّه السائل بلطف إلى المجال المناسب
- قدم نصائح عملية وقابلة للتطبيق
- رتّب إجاباتك بشكل منظم باستخدام العناوين والنقاط عند الحاجة
- لا تتجاوز الإجابة 500 كلمة إلا إذا كان الموضوع يتطلب تفصيلاً أكثر`

// Singleton ZAI instance
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create()
  }
  return zaiInstance
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body: { message?: string; history?: Array<{ role: string; content: string }> }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'طلب غير صالح: يجب إرسال JSON صالح' },
        { status: 400 }
      )
    }

    const { message, history } = body

    // Validate message field
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'حقل الرسالة مطلوب ويجب أن يكون نصاً' },
        { status: 400 }
      )
    }

    const trimmedMessage = message.trim()

    if (trimmedMessage.length === 0) {
      return NextResponse.json(
        { error: 'لا يمكن أن تكون الرسالة فارغة' },
        { status: 400 }
      )
    }

    if (trimmedMessage.length > 500) {
      return NextResponse.json(
        { error: 'الرسالة طويلة جداً. الحد الأقصى 500 حرف.' },
        { status: 400 }
      )
    }

    // Validate and limit history
    const safeHistory: ChatMessage[] = Array.isArray(history)
      ? history
          .filter(
            (m): m is { role: string; content: string } =>
              typeof m === 'object' &&
              m !== null &&
              typeof m.role === 'string' &&
              typeof m.content === 'string' &&
              (m.role === 'user' || m.role === 'assistant')
          )
          .slice(-MAX_HISTORY_LENGTH)
      : []

    // Build messages array for the LLM
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: SYSTEM_PROMPT },
      // Include last 10 messages from history for context
      ...safeHistory.slice(-10).map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user', content: trimmedMessage },
    ]

    // Initialize the ZAI SDK
    const zai = await getZAI()

    // Call the LLM
    const response = await zai.chat.completions.create({
      messages,
      thinking: { type: 'disabled' },
    })

    // Extract the assistant's reply
    const assistantMessage = response.choices?.[0]?.message?.content || 'عذراً، لم أتمكن من معالجة طلبك. يرجى المحاولة مرة أخرى.'

    return NextResponse.json(
      {
        message: assistantMessage,
        role: 'assistant',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Chat API error:', error)

    if (error instanceof Error) {
      // Handle rate limiting
      if (error.message.includes('429') || error.message.includes('Too many requests')) {
        return NextResponse.json(
          { error: 'تم تجاوز حد الطلبات. يرجى المحاولة مرة أخرى بعد قليل.' },
          { status: 429 }
        )
      }

      // Handle API connection errors
      if (error.message.includes('API request failed') || error.message.includes('fetch')) {
        return NextResponse.json(
          { error: 'فشل في الاتصال بخدمة الذكاء الاصطناعي' },
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
      { error: 'حدث خطأ غير متوقع أثناء معالجة رسالتك' },
      { status: 500 }
    )
  }
}

// GET endpoint returns API info
export async function GET() {
  return NextResponse.json(
    {
      message: 'واجهة المساعد الذكي - Chat API',
      method: 'يرجى استخدام POST لإرسال رسالة',
      maxMessageLength: 500,
      maxHistoryLength: MAX_HISTORY_LENGTH,
    },
    { status: 200 }
  )
}
