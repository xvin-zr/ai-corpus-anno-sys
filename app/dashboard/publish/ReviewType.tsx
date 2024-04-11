"use client";

import { useState } from "react";

const labelSpanStyle = "block text-xl font-medium";

function ReviewType() {
  const [reviewType, setReviewType] = useState<"system" | "human">("system");
  console.log("reviewType:", reviewType);
  return (
    <>
      <div className=" space-y-1">
        <span className={labelSpanStyle}>审核类型</span>
        <div className="flex items-center">
          <input
            type="radio"
            name="review-type"
            // className="peer inline-block rounded px-2 py-1 shadow-sm  ring-inset focus:ring-blue-bupt dark:bg-zinc-800 dark:focus:ring-v-success"
            value={"system"}
            id="system"
            checked={reviewType == "system"}
            onChange={() => setReviewType("system")}
          />
          <label htmlFor="system" className="ml-1 inline-block">
            系统审核
          </label>

          <input
            type="radio"
            name="review-type"
            className="peer/human ml-4"
            // className="peer inline-block rounded px-2 py-1 shadow-sm  ring-inset focus:ring-blue-bupt dark:bg-zinc-800 dark:focus:ring-v-success"
            value={"human"}
            id="human"
            checked={reviewType == "human"}
            onChange={() => setReviewType("human")}
          />
          <label htmlFor="human" className="ml-1 inline-block">
            人工审核
          </label>

          <input
            type="email"
            name="specified-email"
            className="ml-6 hidden rounded px-2 py-1 shadow-sm  ring-inset focus:ring-blue-bupt peer-checked/human:inline-block dark:bg-zinc-800 dark:focus:ring-v-success"
            placeholder="指定标注人员邮箱（可选）"
          />

          <input
            type="email"
            name="reviewer-email"
            className="ml-2 hidden rounded px-2 py-1 shadow-sm  ring-inset focus:ring-blue-bupt peer-checked/human:inline-block dark:bg-zinc-800 dark:focus:ring-v-success"
            placeholder="指定审核人员邮箱（可选）"
          />
        </div>
      </div>

      <label className="block space-y-1">
        <span className="block text-xl font-medium">
          任务{`${reviewType == "system" ? "描述" : "标签"}`}和指导文件
        </span>
        <textarea
          name="description"
          className="block overflow-y-auto rounded px-2 py-2 text-base shadow-sm focus:border-blue-bupt dark:bg-zinc-800 dark:focus:ring-v-success"
          placeholder={
            reviewType == "system" ? undefined : "输入任务标签，用 `, ` 分隔"
          }
          cols={23}
          rows={4}
          maxLength={500}
        />
      </label>
    </>
  );
}

export default ReviewType;
