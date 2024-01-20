import { authOptions } from "@/app/api/auth/[...nextauth]/auth-option";
import prisma from "@/prisma/client";
import { User } from "@prisma/client";
import { getServerSession } from "next-auth";

async function fetchBalance(): Promise<number> {
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!user?.email) return NaN;
  try {
    const { balance } = (await prisma.user.findUnique({
      where: {
        email: user.email,
      },
      select: {
        balance: true,
      },
    })) as User;
    if (balance) return balance.toNumber();
    else return NaN;
  } catch (error) {
    console.error(error);
    return NaN;
  }
}

export { fetchBalance };
