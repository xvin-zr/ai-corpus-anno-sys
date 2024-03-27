import CocoCategory from "./json/coco-categories.json";
import CocoSubCategory from "./json/coco-numbered.json";

export const MAX_ALLOWED_RECIPIENTS = 3;
export const REWARD_PERCENTAGE = 0.3;

export const SERVER_URL = "http://localhost:3000";

export type Box = {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
};

export type SuperCategory = keyof typeof CocoCategory;
export type Category = keyof typeof CocoSubCategory;
