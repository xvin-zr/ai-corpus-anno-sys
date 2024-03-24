import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/auth-option";

export async function getCurrUserEmail(): Promise<string | undefined> {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return undefined;
    return session.user?.email ?? undefined;
  } catch (err) {
    console.error(err);
    throw new Error("获取用户邮箱失败");
  }
}
