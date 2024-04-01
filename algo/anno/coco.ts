import { Category } from "@/constants";
import CocoCategories from "@/constants/json/coco-categories.json";
import CocoNumbered from "@/constants/json/coco-numbered.json";
import { getSuperCategory } from ".";

export type CocoInfo = {
  year: number;
  version: string;
  description: string;
  contributor: string;
  url: string;
  date_created: Date;
};

export type CocoLicense = {
  id: number;
  name: string;
  url: string;
};

export type CocoCategory = {
  id: number;
  name: string;
  supercategory: string;
};

export type CocoImage = {
  id: string;
  width: number;
  height: number;
  file_name: string;
  license: number;
  flickr_url: string;
  coco_url: string;
  date_captured: Date;
};

export type CocoAnnotation = {
  id: string;
  image_id: string;
  category_id: number;
  segmentation: "RLE";
  area: number;
  bbox: [number, number, number, number];

  iscrowd: 0 | 1;
};

export type CocoFormat = {
  info: CocoInfo;
  licenses: CocoLicense[];
  categories?: CocoCategory[];
  images: CocoImage[];
  annotations: CocoAnnotation[];
};

export const COCO_CATEGORIES = getCocoCategory();

function getCocoCategory(): CocoCategory[] {
  const res = [];
  for (const label in CocoNumbered) {
    res.push({
      id: CocoNumbered[label as Category],
      name: label,
      supercategory: getSuperCategory(label as Category) ?? "",
    });
  }
  return res;
}
