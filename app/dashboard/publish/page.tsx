import React from "react";

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
          <span className="block text-xl font-medium">任务描述</span>
          <textarea
            className="block rounded px-2 py-2 text-base shadow-sm focus:border-blue-bupt dark:bg-zinc-800 dark:focus:ring-v-success"
            cols={23}
            rows={4}
            maxLength={50}
          />
        </label>

        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-md bg-blue-bupt px-6 text-base font-medium text-zinc-50 shadow transition-colors hover:bg-blue-bupt/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 group-invalid:pointer-events-none group-invalid:opacity-50 dark:bg-v-success-dark dark:hover:bg-v-success dark:focus-visible:ring-zinc-300"
        >
          发布
        </button>
      </form>
    </>
  );
}

export default PublishMissionPage;
