import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = z
      .object({
        email: z.string().email(),
        oldPassword: z.string(),
        newPassword: z.string().min(6, "密码至少 6 个字符"),
      })
      .safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(parsed.error.errors, { status: 400 });
    }

    // 是否存在用户
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }

    // 密码是否正确
    if (user.hashedPassword) {
      const passwordMatch = await bcrypt.compare(
        body.oldPassword,
        user.hashedPassword!
      );
      if (!passwordMatch) {
        return NextResponse.json({ error: "密码错误" }, { status: 400 });
      }
    }

    const updatedUser = await prisma.user.update({
      where: {
        email: body.email,
      },
      data: {
        hashedPassword: await bcrypt.hash(body.newPassword, 10),
      },
    });

    return NextResponse.json(
      { email: updatedUser.email, name: updatedUser.name },
      { status: 200 }
    );
  } catch (error) {
    console.error("updatePassword: ", error);
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
