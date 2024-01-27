import React from "react";

function AnnotationHeader({
  imageIndex,
  imagesCount,
}: {
  imageIndex: number;
  imagesCount: number;
}) {
  return (
    <header className="flex items-center justify-between text-lg">
      <h1 className=" text-2xl font-semibold">标注系统</h1>
      <div className="flex items-center gap-5 justify-self-center font-semibold">
        <progress
          className="progress w-64 [&::-moz-progress-bar]:bg-v-success [&::-webkit-progress-value]:bg-v-success [&::-webkit-progress-value]:dark:bg-v-success"
          value={Number(imageIndex) + 1}
          max={imagesCount}
        ></progress>
        {Number(imageIndex) + 1}&nbsp;/&nbsp;{imagesCount}
      </div>

      <button
        className="flex h-10 items-center justify-center gap-1 rounded-md bg-green-800 px-6 text-base font-medium text-zinc-50 shadow transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-green-700 dark:hover:bg-green-600 dark:focus-visible:ring-zinc-300"
        disabled={imageIndex != imagesCount}
      >
        完成标注
      </button>
    </header>
  );
}

export default AnnotationHeader;
