import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { z } from 'zod'

const updatePermissionSchema = z.object({
  name: z.string().min(1, 'Permission name is required').optional(),
  description: z.string().optional(),
})

// GET single permission
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = request.cookies.get('token')?.value
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const permission = await prisma.permission.findUnique({
      where: { id },
      include: {
        role_permissions: {
          include: {
            role: true,
          },
        },
      },
    })

    if (!permission) {
      return NextResponse.json(
        { error: 'Permission not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ permission })
  } catch (error) {
    console.error('Get permission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT update permission
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = request.cookies.get('token')?.value
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = updatePermissionSchema.parse(body)

    const permission = await prisma.permission.update({
      where: { id },
      data: {
        ...data,
        description: data.description === undefined ? undefined : (data.description || null),
      },
    })

    return NextResponse.json({ permission })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Permission not found' },
        { status: 404 }
      )
    }

    console.error('Update permission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE permission
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = request.cookies.get('token')?.value
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.permission.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Permission deleted successfully' })
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Permission not found' },
        { status: 404 }
      )
    }

    console.error('Delete permission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

