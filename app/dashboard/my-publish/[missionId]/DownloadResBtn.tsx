"use client";

import { fetchDefaultAnnos } from "@/algo/soft-NMS/data";
import { Fragment, useState, useTransition } from "react";
import { downloadAnnoResultAction } from "./actions";
import { useRouter } from "next/navigation";
import { Dialog, Transition } from "@headlessui/react";

function DownloadResBtn({ missionId }: { missionId: string }) {
  const [isPending, downloadAnnoResTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const { replace } = useRouter();
  const [annoResType, setAnnoResType] = useState<"coco" | "yolo">("coco");

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function handleDownload() {
    // TODO: 完成标注下载
    downloadAnnoResTransition(async function downloadAnnoRes() {
      const res = await downloadAnnoResultAction(missionId, annoResType);
      //   const blob = new Blob([JSON.stringify(res)], {
      //     type: annoResType == "coco" ? "application/json" : "text/plain",
      //   });
      const blob =
        annoResType == "coco"
          ? new Blob([JSON.stringify(res)], {
              type: "application/json",
            })
          : new Blob([res as string], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `mission-${missionId}-result.${
        annoResType == "coco" ? "json" : "txt"
      }`;
      link.click();
      window.URL.revokeObjectURL(url);
      closeModal();
    });
    // var imageId = "wryd2nf91usb6vml7gzi";
    // const defaultAnnos = await fetchDefaultAnnos(imageId);
    // console.log("download");
  }

  return (
    <>
      <button
        className="flex h-10 cursor-pointer items-center justify-center gap-1 rounded-md bg-blue-bupt px-4 text-base font-medium text-zinc-50 shadow transition-colors hover:bg-blue-bupt/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-v-success-dark dark:hover:bg-v-success dark:focus-visible:ring-zinc-300"
        onClick={openModal}
      >
        下载标注结果
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-zinc-50 p-6 pt-8 text-left align-middle shadow-xl transition-all dark:bg-zinc-800 ">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-semibold leading-6 tracking-wide text-zinc-900 dark:text-zinc-100"
                  >
                    选择标注数据类型
                  </Dialog.Title>
                  <div className="mt-3 flex items-center justify-start gap-8 pl-5  text-lg">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="radio"
                        id="coco"
                        value={"coco"}
                        name="anno-res-type"
                        checked={annoResType == "coco"}
                        onChange={() => setAnnoResType("coco")}
                      />
                      <label htmlFor="coco">COCO</label>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <input
                        type="radio"
                        id="yolo"
                        value={"yolo"}
                        name="anno-res-type"
                        checked={annoResType == "yolo"}
                        onChange={() => setAnnoResType("yolo")}
                      />
                      <label htmlFor="yolo">YOLO</label>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-4">
                    <button
                      className="inline-flex justify-center rounded-md border border-transparent  bg-v-success-lighter px-4 py-2 text-base font-medium  text-blue-900 hover:bg-v-success-dark hover:text-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-v-success focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-v-success dark:text-zinc-100 dark:hover:bg-v-success-light"
                      onClick={handleDownload}
                      disabled={isPending}
                    >
                      确认
                    </button>
                    <button
                      className="inline-flex justify-center rounded-md border border-transparent bg-v-error-lighter px-4 py-2 text-base font-medium text-v-error-dark hover:bg-v-error hover:text-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-v-error-dark focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-v-error  dark:text-zinc-100 dark:hover:bg-v-error-light"
                      onClick={closeModal}
                      disabled={isPending}
                    >
                      取消
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default DownloadResBtn;
