"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useTransition } from "react";
import { deleteMissionAction } from "./actions";
import { toastError, toastSuccess } from "../../components/toast";
import { useRouter } from "next/navigation";

function DeleteMissionBtn({ missionId }: { missionId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startDeleteMissionTransition] = useTransition();
  const { push } = useRouter();

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function handleDeleteMission() {
    startDeleteMissionTransition(async function deleteMission() {
      const deleteRes = await deleteMissionAction.bind(null, missionId)();
      console.log("deleteRes:", deleteRes);
      closeModal();
      if (deleteRes.success) {
        toastSuccess("删除任务成功");
      } else {
        toastError("删除任务失败");
      }
    });
  }

  return (
    <>
      <button
        type="button"
        aria-label="delete mission button"
        className="flex h-10 items-center justify-center gap-1 rounded-md bg-v-error px-6 text-base font-medium text-zinc-50 shadow transition-colors hover:bg-v-error-light focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-v-error-dark dark:hover:bg-v-error dark:focus-visible:ring-zinc-300"
        onClick={openModal}
        //   disabled={userEmail == publisherEmail || pending}
        //   aria-disabled={userEmail == publisherEmail || pending}
        //   formAction={acceptMissionAction}
      >
        删除任务
        {/* {pending && <span className="loading loading-spinner loading-xs" />} */}
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-zinc-50 p-6 text-left align-middle shadow-xl transition-all dark:bg-zinc-800 ">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-semibold leading-6 tracking-wide text-zinc-900 dark:text-zinc-100"
                  >
                    确认删除任务？
                  </Dialog.Title>
                  <div className="mt-3">
                    <p className="text-lg text-zinc-500 dark:text-zinc-400">
                      此操作无法恢复，请确认操作。
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-end gap-4">
                    <button
                      className="inline-flex justify-center rounded-md border border-transparent bg-v-error-lighter px-4 py-2 text-base font-medium text-v-error-dark hover:bg-v-error hover:text-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-v-error-dark focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-v-error  dark:text-zinc-100 dark:hover:bg-v-error-light"
                      onClick={handleDeleteMission}
                      disabled={isPending}
                    >
                      确认
                    </button>
                    <button
                      className="inline-flex justify-center rounded-md border border-transparent  bg-v-success-lighter px-4 py-2 text-base font-medium  text-blue-900 hover:bg-v-success-dark hover:text-zinc-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-v-success focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-v-success dark:text-zinc-100 dark:hover:bg-v-success-light"
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

export default DeleteMissionBtn;
