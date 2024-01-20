"use client";
import { atom, useAtom } from "jotai";
import { CldUploadWidget, CldUploadWidgetInfo } from "next-cloudinary";

const uploadWidgetStyle = {
  palette: {
    window: "#ffffff",
    sourceBg: "#f4f4f5",
    windowBorder: "#90a0b3",
    tabIcon: "#003399",
    inactiveTabIcon: "#555a5f",
    menuIcons: "#555a5f",
    link: "#003399",
    action: "#339933",
    inProgress: "#003399",
    complete: "#339933",
    error: "#EE0000",
    textDark: "#09090B",
    textLight: "#fcfffd",
  },
};

export const uploadedImgsAtom = atom<CldUploadWidgetInfo[]>([]);
export const imgCountAtom = atom((get) => get(uploadedImgsAtom).length);

function CldUploadBtn() {
  const [uploadedImgs, setUploadedImgs] = useAtom(uploadedImgsAtom);
  const [imgCount] = useAtom(imgCountAtom);
  return (
    <>
      <CldUploadWidget
        uploadPreset="oqnnxej0"
        options={{
          sources: ["local", "url"],
          multiple: true,
          maxFiles: 10,
          styles: uploadWidgetStyle,
        }}
        onUpload={(result, widget) => {
          console.log(result);
          if (result.event == "success") {
            const info = result.info as CldUploadWidgetInfo;
            setUploadedImgs((prev) => [...prev, info]);
          }
        }}
      >
        {({ open }) => (
          <button
            className="inline-flex h-8 w-24 items-center justify-center rounded bg-zinc-600 px-4 py-3 text-zinc-50 shadow transition-colors hover:bg-zinc-500 dark:bg-zinc-700 dark:hover:bg-zinc-800"
            onClick={(e) => {
              e.preventDefault();
              open();
            }}
          >
            上传图片
          </button>
        )}
      </CldUploadWidget>
      {imgCount > 0 && (
        <span className="ml-4 inline-block">{`已上传 ${imgCount} 张图片 (${uploadedImgs.map(
          (img) => img.original_filename,
        )})`}</span>
      )}
    </>
  );
}

export default CldUploadBtn;
