"use client";

export default function DownloadInsFileBtn({
  fileBufferJson,
  filename,
}: {
  fileBufferJson: {
    type: "Buffer";
    data: number[];
  };
  filename: string;
}) {
  console.log(filename);

  return (
    <button
      aria-label="download instruction file button"
      className="flex h-10 items-center justify-center gap-1 rounded-md bg-zinc-600 px-4 text-base font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:bg-zinc-700 dark:hover:bg-zinc-800 dark:focus-visible:ring-zinc-300"
      onClick={handleDownload}
    >
      下载指导文件
    </button>
  );

  function handleDownload() {
    const downloadUrl = window.URL.createObjectURL(
      new Blob([Buffer.from(fileBufferJson.data)]),
    );
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(downloadUrl);
  }
}
