import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";

const registerSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(6),
});

interface RegisterInfo {
  email: string;
  name: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: RegisterInfo = await request.json();
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(validation.error.errors, {
        status: 400,
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (user) {
      return NextResponse.json({ error: "用户已存在" }, { status: 400 });
    }

    const newUser = await prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        hashedPassword: await bcrypt.hash(body.password, 10),
      },
    });

    return NextResponse.json(
      { email: newUser.email, name: newUser.name },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
  }
}
