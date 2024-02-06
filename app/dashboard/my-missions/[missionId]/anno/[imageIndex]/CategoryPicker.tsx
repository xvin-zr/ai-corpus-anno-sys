"use client";
import CocoCategory from "@/constants/json/coco-categories.json";
import { useState } from "react";

type SuperCategory = keyof typeof CocoCategory;

const superCategory = Object.keys(CocoCategory) as SuperCategory[];

function CategoryPicker() {
  const [selectedSuperCategory, setSelectedSuperCategory] =
    useState<SuperCategory>(superCategory[0]);
  const subCategory = CocoCategory[selectedSuperCategory];

  return (
    <div className="">
      <label
        className="mb-0.5 inline-block text-lg font-semibold"
        htmlFor="superCategory"
      >
        类别：
      </label>

      <select
        className="h-10 w-48 rounded-md px-4 py-0 shadow ring-inset focus:ring-1 focus:ring-blue-bupt dark:bg-zinc-800 dark:focus:ring-v-success"
        id="superCategory"
        value={selectedSuperCategory}
        onChange={(e) =>
          setSelectedSuperCategory(e.target.value as SuperCategory)
        }
      >
        {superCategory.map((sc) => (
          <option value={sc} key={sc}>
            {sc}
          </option>
        ))}
      </select>

      <select className="ml-4 h-10 w-48 rounded-md px-4 py-0 shadow ring-inset focus:ring-1 focus:ring-blue-bupt dark:bg-zinc-800 dark:focus:ring-v-success">
        {subCategory.map((sc) => (
          <option value={sc} key={sc}>
            {sc}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CategoryPicker;
