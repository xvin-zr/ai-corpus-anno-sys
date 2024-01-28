import CocoCategories from "@/constants/json/coco-categories.json";
import CocoNumbered from "@/constants/json/coco-numbered.json";
import prisma from "@/prisma/client";
import { error } from "console";

type Category = keyof typeof CocoNumbered;

export async function uploadCategories() {
  const categories = Object.entries(CocoCategories).flatMap(
    ([supercategory, categories]) =>
      categories.map((category) => ({
        name: category,
        supercategory,
        id: CocoNumbered[category as Category],
      })),
  );

  try {
    const createdCategories = await prisma.category.createMany({
      data: categories,
      skipDuplicates: true,
    });
    console.log(createdCategories);
  } catch (err) {
    error(err);
    throw new Error("error in upload categories");
  }
}

uploadCategories();
