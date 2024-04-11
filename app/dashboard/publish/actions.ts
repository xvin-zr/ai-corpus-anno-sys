"use server";

import { getSuperCategory } from "@/algo/anno";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-option";
import { Box } from "@/constants";
import prisma from "@/prisma/client";
import axios from "axios";
import Decimal from "decimal.js";
import { writeFile } from "fs/promises";
import { getServerSession } from "next-auth";
import { CldUploadWidgetInfo } from "next-cloudinary";
import { revalidatePath } from "next/cache";
import path from "path";
import { z } from "zod";
import { fetchBalance } from "../profile/data";

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
  const reviewerEmail = String(formData.get("reviewer-email") ?? "");

  console.log(title, reward, description);
  console.log(reviewType, insFile);
  console.log(specifiedEmail, reviewerEmail);

  if (specifiedEmail && reviewerEmail && specifiedEmail == reviewerEmail) {
    return {
      success: false,
      msg: "标注人员和审核人员不能相同",
    };
  }

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

  // console.table(
  //   parsed.data.description
  //     .trim()
  //     .split(",")
  //     .map((s: string) => s.trim()),
  // );
  // return { success: false, msg: "发布失败" };

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

      // 更新标注人员的任务状态
      // const updatedUserMission = await prisma.userMission.create({
      //   data: {
      //     userEmail: specifiedEmail,
      //     missionId: "",
      //   },
      // });
      // })
    }

    // 获得预标注结果
    var odRes: {
      url: string;
      id: string;
      res: { score: number; label: string; box: Box }[];
    }[] = [];

    if (reviewType == "system") {
      // 系统审核的预标注
      odRes = (
        await axios.post(OD_SERVER, {
          images: imgs.map((img) => {
            return {
              url: img.secure_url,
              id: img.public_id,
            };
          }),
        })
      )?.data?.results;
    } else {
      // 人工审核的预标注
      odRes = (
        await axios.post(`http://localhost:3003/api/zero-shot-OD`, {
          images: imgs.map((img) => {
            return {
              url: img.secure_url,
              id: img.public_id,
            };
          }),
          candidate_labels: parsed.data.description
            .trim()
            .split(",")
            .map((s: string) => s.trim()),
        })
      )?.data?.results;
    }

    // 获得任务的最多的 Super Category
    const mainCategory = getMainCategory(odRes);
    mainCategory.push("_");

    var insFileName: string | undefined;
    if (insFile instanceof File && insFile.size > 0) {
      const insFileBuffer = Buffer.from(await insFile.arrayBuffer());
      insFileName = insFile.name;
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

    // 创建任务
    const mission = await prisma.mission.create({
      data: {
        title: parsed.data.title,
        publisherEmail: email,
        recipientEmail: specifiedEmail ? String(specifiedEmail) : null,
        reward: new Decimal(parsed.data.reward),
        description: parsed.data.description,
        insFileName: insFileName ?? null,
        reviewBySystem: String(reviewType) === "system" && odRes.length > 0,
        status: specifiedEmail ? "ONGOING" : "PENDING_ACCEPT",
        imagesIds: images.map((img) => img.id),
        mainCategories: mainCategory,
        reviewerEmail: reviewerEmail == "" ? null : reviewerEmail,
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

    if (
      reviewType === "human" &&
      typeof specifiedEmail == "string" &&
      specifiedEmail
    ) {
      // 更新标注人员的任务状态
      const updatedUserMission = await prisma.userMission.create({
        data: {
          email: specifiedEmail,
          missionId: mission.id,
          status: "ONGOING",
        },
      });
    }

    // 创建预标注
    const anno = await prisma.w3CAnnotation.createMany({
      data: odRes.map(function (res) {
        return {
          id: res.id,
          imageId: res.id,
          defaultAnnotations: res.res,
        };
      }),
      skipDuplicates: true,
    });

    // 更新用户余额
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

    if (!mission || !updatedUser || !anno) {
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

function getMainCategory(
  odRes: {
    url: string;
    id: string;
    res: { score: number; label: string; box: Box }[];
  }[],
): string[] {
  var max = 0;
  const map = new Map<string, number>();
  const res = new Set<string>();

  for (const { res } of odRes) {
    for (const r of res) {
      const superCategory = getSuperCategory(r.label) ?? "";
      const cnt = map.get(superCategory);
      map.set(superCategory, cnt ? cnt + 1 : 1);
      max = Math.max(max, map.get(superCategory) ?? 0);
    }
  }

  for (const [sc, cnt] of map) {
    if (cnt == max) res.add(sc);
  }
  return Array.from(res);
}
