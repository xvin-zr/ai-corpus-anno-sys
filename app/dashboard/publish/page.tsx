import React from "react";
import CldUploadBtn from "./CldUploadBtn";
import PublishBtn from "./PublishBtn";
import { heading1Style } from "../components/header.style";

function PublishMissionPage() {
  const labelStyle = "block space-y-1";
  const labelSpanStyle = "block text-xl font-medium";
  return (
    <>
      <h1 className={heading1Style}>发布任务</h1>

      <form className="group space-y-4" action="">
        <label className="block space-y-1">
          <span className={labelSpanStyle}>主题</span>
          <input
            type="text"
            name="title"
            className="peer inline-block rounded px-2 py-1 shadow-sm  ring-inset focus:ring-blue-bupt dark:bg-zinc-800 dark:focus:ring-v-success"
            minLength={2}
            maxLength={10}
            required
          />
          <span className="invisible ml-3 inline-block text-v-error-dark peer-invalid:peer-focus:visible dark:text-v-error-light">
            主题长度为 2&ndash;10 个字符
          </span>
        </label>

        <label className="block space-y-1">
          <span className={labelSpanStyle}>报酬</span>
          <input
            type="number"
            name="reward"
            className="peer inline-block w-36 rounded px-2 py-1  shadow-sm ring-inset focus:ring-blue-bupt dark:bg-zinc-800 dark:focus:ring-v-success"
            min={1}
            max={999}
            step={1}
            required
          />
          <span className="invisible ml-3 inline-block text-v-error-dark peer-invalid:peer-focus:visible dark:text-v-error-light">
            请输入 1&ndash;999 之间的报酬金额
          </span>
        </label>

        <div className=" space-y-1">
          <span className={labelSpanStyle}>审核类型</span>
          <div className="flex items-center">
            <input
              type="radio"
              name="review-type"
              // className="peer inline-block rounded px-2 py-1 shadow-sm  ring-inset focus:ring-blue-bupt dark:bg-zinc-800 dark:focus:ring-v-success"
              value={"system"}
              id="system"
              defaultChecked
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
            />
            <label htmlFor="human" className="ml-1 inline-block">
              人工审核
            </label>

            <input
              type="email"
              name="specified-email"
              className="ml-6 hidden rounded px-2 py-1 shadow-sm  ring-inset focus:ring-blue-bupt peer-checked/human:inline-block dark:bg-zinc-800 dark:focus:ring-v-success"
              placeholder="指定标注人员邮箱（可选）"
              accept=".pdf,.md,application/zip,application/x-7z-compressed"
            />
          </div>
        </div>

        <label className="block space-y-1">
          <span className="block text-xl font-medium">任务描述和指导文件</span>
          <textarea
            name="description"
            className="block rounded px-2 py-2 text-base shadow-sm focus:border-blue-bupt dark:bg-zinc-800 dark:focus:ring-v-success"
            cols={23}
            rows={4}
            maxLength={50}
          />
        </label>

        <label className="block">
          <span className="sr-only">上传要求文件</span>
          <input
            type="file"
            name="instruction-file"
            className="w-full text-sm file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-zinc-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-zinc-50 file:shadow file:transition-colors hover:file:bg-zinc-500 file:dark:bg-zinc-700 file:dark:hover:bg-zinc-800
    "
          />
        </label>

        <CldUploadBtn />

        <span
          className="block text-base opacity-60"
          style={{ marginTop: "1.2rem", marginBottom: "-0.3rem" }}
        >
          所需费用 = 报酬 + 图片数量
        </span>

        <PublishBtn />
      </form>
    </>
  );
}

export default PublishMissionPage;
