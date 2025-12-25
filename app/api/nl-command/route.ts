import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { command } = body

    if (!command || typeof command !== 'string') {
      return NextResponse.json(
        { error: 'Command is required' },
        { status: 400 }
      )
    }

    // Simple pattern matching for common commands
    // In production, you'd use OpenAI/Gemini API here
    const lowerCommand = command.toLowerCase().trim()

    // Pattern: "create a new permission called 'X'"
    const createPermissionMatch = lowerCommand.match(
      /create.*permission.*(?:called|named)?\s*['"]?([^'"]+)['"]?/i
    )
    if (createPermissionMatch) {
      const permissionName = createPermissionMatch[1].trim()
      try {
        const permission = await prisma.permission.create({
          data: { name: permissionName },
        })
        return NextResponse.json({
          message: `Permission '${permissionName}' created successfully`,
          permission,
        })
      } catch (error: any) {
        if (error.code === 'P2002') {
          return NextResponse.json(
            { error: `Permission '${permissionName}' already exists` },
            { status: 400 }
          )
        }
        throw error
      }
    }

    // Pattern: "create a new role called 'X'"
    const createRoleMatch = lowerCommand.match(
      /create.*role.*(?:called|named)?\s*['"]?([^'"]+)['"]?/i
    )
    if (createRoleMatch) {
      const roleName = createRoleMatch[1].trim()
      try {
        const role = await prisma.role.create({
          data: { name: roleName },
        })
        return NextResponse.json({
          message: `Role '${roleName}' created successfully`,
          role,
        })
      } catch (error: any) {
        if (error.code === 'P2002') {
          return NextResponse.json(
            { error: `Role '${roleName}' already exists` },
            { status: 400 }
          )
        }
        throw error
      }
    }

    // Pattern: "give the role 'X' the permission to 'Y'"
    // Pattern: "assign permission 'Y' to role 'X'"
    const assignPermissionMatch =
      lowerCommand.match(
        /(?:give|assign).*role\s*['"]?([^'"]+)['"]?.*permission.*['"]?([^'"]+)['"]?/i
      ) ||
      lowerCommand.match(
        /(?:give|assign).*permission\s*['"]?([^'"]+)['"]?.*role\s*['"]?([^'"]+)['"]?/i
      )

    if (assignPermissionMatch) {
      const roleName = assignPermissionMatch[1].trim()
      const permissionName = assignPermissionMatch[2].trim()

      // Find role and permission
      const role = await prisma.role.findFirst({
        where: { name: { equals: roleName, mode: 'insensitive' } },
      })

      const permission = await prisma.permission.findFirst({
        where: { name: { equals: permissionName, mode: 'insensitive' } },
      })

      if (!role) {
        return NextResponse.json(
          { error: `Role '${roleName}' not found` },
          { status: 404 }
        )
      }

      if (!permission) {
        return NextResponse.json(
          { error: `Permission '${permissionName}' not found` },
          { status: 404 }
        )
      }

      // Check if already assigned
      const existing = await prisma.rolePermission.findUnique({
        where: {
          role_id_permission_id: {
            role_id: role.id,
            permission_id: permission.id,
          },
        },
      })

      if (existing) {
        return NextResponse.json({
          message: `Permission '${permissionName}' is already assigned to role '${roleName}'`,
        })
      }

      await prisma.rolePermission.create({
        data: {
          role_id: role.id,
          permission_id: permission.id,
        },
      })

      return NextResponse.json({
        message: `Permission '${permissionName}' assigned to role '${roleName}' successfully`,
      })
    }

    // Pattern: "remove permission 'Y' from role 'X'"
    const removePermissionMatch = lowerCommand.match(
      /(?:remove|revoke).*permission\s*['"]?([^'"]+)['"]?.*(?:from|of).*role\s*['"]?([^'"]+)['"]?/i
    )

    if (removePermissionMatch) {
      const permissionName = removePermissionMatch[1].trim()
      const roleName = removePermissionMatch[2].trim()

      const role = await prisma.role.findFirst({
        where: { name: { equals: roleName, mode: 'insensitive' } },
      })

      const permission = await prisma.permission.findFirst({
        where: { name: { equals: permissionName, mode: 'insensitive' } },
      })

      if (!role || !permission) {
        return NextResponse.json(
          { error: 'Role or permission not found' },
          { status: 404 }
        )
      }

      await prisma.rolePermission.deleteMany({
        where: {
          role_id: role.id,
          permission_id: permission.id,
        },
      })

      return NextResponse.json({
        message: `Permission '${permissionName}' removed from role '${roleName}' successfully`,
      })
    }

    // Pattern: "delete permission 'X'"
    const deletePermissionMatch = lowerCommand.match(
      /(?:delete|remove).*permission\s*['"]?([^'"]+)['"]?/i
    )

    if (deletePermissionMatch) {
      const permissionName = deletePermissionMatch[1].trim()
      const permission = await prisma.permission.findFirst({
        where: { name: { equals: permissionName, mode: 'insensitive' } },
      })

      if (!permission) {
        return NextResponse.json(
          { error: `Permission '${permissionName}' not found` },
          { status: 404 }
        )
      }

      await prisma.permission.delete({
        where: { id: permission.id },
      })

      return NextResponse.json({
        message: `Permission '${permissionName}' deleted successfully`,
      })
    }

    // Pattern: "delete role 'X'"
    const deleteRoleMatch = lowerCommand.match(
      /(?:delete|remove).*role\s*['"]?([^'"]+)['"]?/i
    )

    if (deleteRoleMatch) {
      const roleName = deleteRoleMatch[1].trim()
      const role = await prisma.role.findFirst({
        where: { name: { equals: roleName, mode: 'insensitive' } },
      })

      if (!role) {
        return NextResponse.json(
          { error: `Role '${roleName}' not found` },
          { status: 404 }
        )
      }

      await prisma.role.delete({
        where: { id: role.id },
      })

      return NextResponse.json({
        message: `Role '${roleName}' deleted successfully`,
      })
    }

    return NextResponse.json(
      {
        error:
          "Could not understand the command. Try: 'Create a permission called X', 'Give role X permission Y', etc.",
      },
      { status: 400 }
    )
  } catch (error) {
    console.error('NL command error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

