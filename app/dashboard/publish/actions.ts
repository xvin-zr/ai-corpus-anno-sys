"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth-option";
import prisma from "@/prisma/client";
import Decimal from "decimal.js";
import { getServerSession } from "next-auth";
import { CldUploadWidgetInfo } from "next-cloudinary";
import { z } from "zod";

interface PublishState {
  success: boolean;
  msg: string;
}

export async function publishMission(
  imgs: CldUploadWidgetInfo[],
  prevState: PublishState,
  formData: FormData,
): Promise<PublishState> {
  const title = formData.get("title");
  const reward = Number(formData.get("reward"));
  const description = formData.get("description");
  console.log(title, reward, description);
  console.log(imgs.map((img) => img.original_filename));

  const parsed = z
    .object({
      title: z.string().min(2, "标题不能为空"),
      reward: z.number().min(1, "报酬范围为 1-99"),
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

  try {
    const session = await getServerSession(authOptions);
    if (!session) return { success: false, msg: "请先登录" };
    const email = session.user?.email as string;
    const contributor = session.user?.name as string;
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
        publisherId: email,
        reward: new Decimal(parsed.data.reward),
        description: parsed.data.description,
        imagesId: images.map((img) => img.id),
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
      },
    });

    console.log(mission);

    if (!mission) {
      return {
        success: false,
        msg: "发布失败",
      };
    } else {
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
