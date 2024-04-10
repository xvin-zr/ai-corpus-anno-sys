import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/auth-option";
import { redirect } from "next/navigation";

export async function getCurrUserEmail(): Promise<string> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      redirect("/auth/signin");
    }
    return session.user.email;
  } catch (err) {
    console.error(err);
    throw new Error("获取用户邮箱失败");
  }
}
