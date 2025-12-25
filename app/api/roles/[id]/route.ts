import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { z } from 'zod'

const updateRoleSchema = z.object({
  name: z.string().min(1, 'Role name is required'),
})

// GET single role
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

    const role = await prisma.role.findUnique({
      where: { id },
      include: {
        role_permissions: {
          include: {
            permission: true,
          },
        },
      },
    })

    if (!role) {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ role })
  } catch (error) {
    console.error('Get role error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT update role
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
    const { name } = updateRoleSchema.parse(body)

    const role = await prisma.role.update({
      where: { id },
      data: { name },
    })

    return NextResponse.json({ role })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      )
    }

    console.error('Update role error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE role
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

    await prisma.role.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Role deleted successfully' })
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Role not found' },
        { status: 404 }
      )
    }

    console.error('Delete role error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

