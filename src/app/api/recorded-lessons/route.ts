import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const where = category && category !== 'الكل' ? { category } : {}

    const lessons = await db.recordedLesson.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    const lessonsWithAttachments = lessons.map(lesson => ({
      ...lesson,
      attachments: JSON.parse(lesson.attachments),
    }))

    return NextResponse.json(lessonsWithAttachments)
  } catch (error) {
    console.error('Get recorded lessons error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء استرجاع الدروس' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, videoUrl, thumbnailUrl, category, duration, attachments } = body

    if (!title || !videoUrl) {
      return NextResponse.json(
        { error: 'العنوان ورابط الفيديو مطلوبان' },
        { status: 400 }
      )
    }

    const lesson = await db.recordedLesson.create({
      data: {
        title,
        description: description || '',
        videoUrl,
        thumbnailUrl: thumbnailUrl || null,
        category: category || 'general',
        duration: duration || 0,
        attachments: JSON.stringify(attachments || []),
      },
    })

    return NextResponse.json(
      { success: true, lesson },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create recorded lesson error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء الدرس' },
      { status: 500 }
    )
  }
}
