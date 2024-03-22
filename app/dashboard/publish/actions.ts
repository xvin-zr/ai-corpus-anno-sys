"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth-option";
import prisma from "@/prisma/client";
import axios from "axios";
import Decimal from "decimal.js";
import { getServerSession } from "next-auth";
import { CldUploadWidgetInfo } from "next-cloudinary";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { fetchBalance } from "../profile/data";
import { writeFile } from "fs/promises";
import path from "path";

interface PublishState {
  success: boolean;
  msg: string;
}

const acceptFileTypes = ["pdf", "md", "zip", "7z"];
const OD_SERVER = "http://localhost:3003/api/OD";

export async function publishMission(
  imgs: CldUploadWidgetInfo[],
  prevState: PublishState,
  formData: FormData,
): Promise<PublishState> {
  const title = formData.get("title");
  const reward = Number(formData.get("reward"));
  const description = formData.get("description");
  const reviewType = formData.get("review-type");
  const insFile = formData.get("instruction-file");
  const specifiedEmail = formData.get("specified-email");

  console.log(title, reward, description);
  console.log(reviewType, insFile);
  console.log(process.cwd());

  const parsed = z
    .object({
      title: z
        .string()
        .min(2, "标题不能为空")
        .max(10, "标题不能超过 10 个字符"),
      reward: z
        .number()
        .min(1, "报酬范围为 1-999")
        .max(999, "报酬范围为 1-999"),
      description: z.string(),
    })
    .safeParse({
      title,
      reward,
      description,
    });
  if (!parsed.success) {
    return { success: false, msg: parsed.error.errors[0].message };
  }

  // 检查指导文件格式
  if (insFile instanceof File && insFile.size > 0) {
    if (!acceptFileTypes.includes(insFile.name.split(".").at(-1) ?? "")) {
      return {
        success: false,
        msg: "指导文件格式错误，支持的格式有：pdf, md, zip, 7z",
      };
    }
  }

  // return { success: false, msg: "test" };

  try {
    const session = await getServerSession(authOptions);
    if (!session) return { success: false, msg: "请先登录" };
    const email = session.user?.email as string;
    const contributor = session.user?.name as string;

    const balance = await fetchBalance();
    if (!balance) return { success: false, msg: "发布失败，未查询到余额" };
    const fee = parsed.data.reward + imgs.length;
    if (balance < fee) {
      return {
        success: false,
        msg: `发布失败：当前余额为 ¥${balance}，发布需要 ¥${fee}`,
      };
    }

    // 检查指定标注人员是否存在
    if (
      reviewType === "human" &&
      typeof specifiedEmail == "string" &&
      specifiedEmail
    ) {
      const user = await prisma.user.findUnique({
        where: {
          email: specifiedEmail,
        },
      });
      if (!user) {
        return {
          success: false,
          msg: "指定的标注人员不存在",
        };
      }
    }

    const odRes = (
      await axios.post(OD_SERVER, {
        images: imgs.map((img) => {
          return {
            url: img.secure_url,
            id: img.public_id,
          };
        }),
      })
    )?.data?.results;

    console.log(JSON.stringify(odRes, null, 2));

    if (insFile instanceof File && insFile.size > 0) {
      const insFileBuffer = Buffer.from(await insFile.arrayBuffer());
      await writeFile(
        path.join(process.cwd(), `app/api/insFiles/${insFile.name}`),
        insFileBuffer,
      );
    }

    const images = imgs.map((img) => {
      return {
        id: img.public_id,
        url: img.secure_url,
        width: img.width,
        height: img.height,
        filename: img.original_filename,
      };
    });
    console.log(images);

    const mission = await prisma.mission.create({
      data: {
        title: parsed.data.title,
        publisherEmail: email,
        reward: new Decimal(parsed.data.reward),
        description: parsed.data.description,
        imagesIds: images.map((img) => img.id),
        cocoAnnotation: {
          create: {
            info: {
              create: {
                year: new Date().getFullYear(),
                version: "1.0",
                description: parsed.data.description,
                contributor,
              },
            },
            images: {
              create: images,
            },
          },
        },
        images: {
          connect: images.map((img) => ({ id: img.id })),
        },
      },
    });
    console.log(mission);

    const updatedUser = await prisma.user.update({
      where: {
        email,
      },
      data: {
        balance: {
          decrement: fee,
        },
      },
    });

    if (!mission || !updatedUser) {
      return {
        success: false,
        msg: "发布失败",
      };
    } else {
      revalidatePath("/dashboard/market");
      return {
        success: true,
        msg: "发布成功",
      };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      msg: "发布失败",
    };
  }
}
