"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { z } from "zod";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

export async function updatePassword(preState: any, formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return;
    const email = session.user?.email;
    const oldPassword = formData.get("oldPassword");
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    const parsed = z
      .object({
        email: z.string().email(),
        oldPassword: z.string(),
        newPassword: z.string().min(6, "密码至少 6 个字符"),
        confirmPassword: z.string().min(6, "密码至少 6 个字符"),
      })
      .safeParse({
        email,
        oldPassword,
        newPassword,
        confirmPassword,
      });
    if (!parsed.success) {
      revalidatePath("/dashboard/profile");
      return { msg: "密码长度至少为 6" };
    }

    // 两次密码不一致
    if (newPassword !== confirmPassword) {
      revalidatePath("/dashboard/profile");
      return { msg: "请输入两次相同的密码" };
    }

    // 是否存在用户
    const user = await prisma.user.findUnique({
      where: {
        email: parsed.data.email,
      },
    });
    if (!user) {
      revalidatePath("/dashboard/profile");
      return { msg: "用户不存在" };
    }

    // 密码是否正确
    if (user.hashedPassword) {
      const passwordMatch = await bcrypt.compare(
        parsed.data.oldPassword,
        user.hashedPassword
      );
      if (!passwordMatch) {
        revalidatePath("/dashboard/profile");
        return { msg: "旧密码不正确" };
      }
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        hashedPassword: await bcrypt.hash(parsed.data.newPassword, 10),
      },
    });

    revalidatePath("/dashboard/profile");
    return { msg: "更新成功", name: updatedUser.name };
  } catch (error) {
    console.error("UPDATE PASSWORD", error);
    revalidatePath("/dashboard/profile");
    return { msg: "更新密码失败，稍后再试" };
  }
}
