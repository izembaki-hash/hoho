import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, lessonId } = body

    if (!name || !email || !lessonId) {
      return NextResponse.json(
        { error: 'الاسم والبريد الإلكتروني ومعرّف الدرس مطلوبون' },
        { status: 400 }
      )
    }

    const lesson = await db.liveLesson.findUnique({
      where: { id: lessonId },
    })

    if (!lesson) {
      return NextResponse.json(
        { error: 'الدرس غير موجود' },
        { status: 404 }
      )
    }

    const existingRegistration = await db.lessonRegistration.findFirst({
      where: { email, lessonId },
    })

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'أنت مسجل بالفعل في هذا الدرس' },
        { status: 409 }
      )
    }

    const registration = await db.lessonRegistration.create({
      data: {
        name,
        email,
        phone: phone || null,
        lessonId,
      },
    })

    return NextResponse.json(
      { success: true, message: 'تم التسجيل بنجاح', id: registration.id },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء التسجيل' },
      { status: 500 }
    )
  }
}
