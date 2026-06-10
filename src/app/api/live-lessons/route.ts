import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const lessons = await db.liveLesson.findMany({
      orderBy: { scheduledAt: 'asc' },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    })

    return NextResponse.json(lessons)
  } catch (error) {
    console.error('Get live lessons error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء استرجاع الدروس' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, scheduledAt, duration, category, meetingLink } = body

    if (!title || !scheduledAt) {
      return NextResponse.json(
        { error: 'العنوان والتاريخ مطلوبان' },
        { status: 400 }
      )
    }

    const lesson = await db.liveLesson.create({
      data: {
        title,
        description: description || '',
        scheduledAt: new Date(scheduledAt),
        duration: duration || 60,
        category: category || 'general',
        meetingLink: meetingLink || null,
      },
    })

    return NextResponse.json(
      { success: true, lesson },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create live lesson error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء الدرس' },
      { status: 500 }
    )
  }
}
