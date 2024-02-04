"use client";

function CompleteAnnoBtn({
  imageIndex,
  imagesCount,
}: {
  imageIndex: number;
  imagesCount: number;
}) {
  return (
    <button
      className="flex h-10 items-center justify-center gap-1 rounded-md bg-green-800 px-6 text-base font-medium text-zinc-50 shadow transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-green-700 dark:hover:bg-green-600 dark:focus-visible:ring-zinc-300"
      disabled={imageIndex != imagesCount - 1}
    >
      完成标注
    </button>
  );
}

export default CompleteAnnoBtn;
