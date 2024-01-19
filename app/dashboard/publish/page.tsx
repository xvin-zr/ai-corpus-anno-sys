import React from "react";
import CldUploadBtn from "./CldUploadBtn";
import PublishBtn from "./PublishBtn";

function PublishMissionPage() {
  const labelStyle = "block space-y-1";
  const labelSpanStyle = "block text-xl font-medium";
  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">发布任务</h1>

      <form className="group space-y-4" action="">
        <label className="block space-y-1">
          <span className={labelSpanStyle}>主题</span>
          <input
            type="text"
            name="title"
            className="peer inline-block rounded px-2 py-1 shadow-sm  ring-inset focus:ring-blue-bupt dark:bg-zinc-800 dark:focus:ring-v-success"
            minLength={2}
            maxLength={20}
            required
          />
          <span className="invisible ml-3 inline-block text-v-error-dark peer-invalid:peer-focus:visible dark:text-v-error-light">
            主题长度为 2&ndash;20 个字符
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

        <label className="block space-y-1">
          <span className="block text-xl font-medium">任务描述</span>
          <textarea
            name="description"
            className="block rounded px-2 py-2 text-base shadow-sm focus:border-blue-bupt dark:bg-zinc-800 dark:focus:ring-v-success"
            cols={23}
            rows={4}
            maxLength={50}
          />
        </label>

        <CldUploadBtn />

        <PublishBtn />
      </form>
    </>
  );
}

export default PublishMissionPage;
