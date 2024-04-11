import React from "react";
import CldUploadBtn from "./CldUploadBtn";
import PublishBtn from "./PublishBtn";
import { heading1Style } from "../components/header.style";
import ReviewType from "./ReviewType";

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

        <ReviewType />

        <label className="block">
          <span className="sr-only">上传要求文件</span>
          <input
            type="file"
            name="instruction-file"
            accept=".pdf,.md,application/zip,application/x-7z-compressed"
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
