"use client";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toastError, toastSuccess } from "../components/toast";
import { imgCountAtom, uploadedImgsAtom } from "./CldUploadBtn";
import { publishMission } from "./actions";

function PublishBtn() {
  const [imgCount] = useAtom(imgCountAtom);
  const [uploadedImgs, setUploadedImgs] = useAtom(uploadedImgsAtom);
  // const uploadedImgs = useAtomValue(uploadedImgsAtom);
  const { push } = useRouter();

  const publishMissionWithImgs = publishMission.bind(null, uploadedImgs);
  const [publishState, publishMissionAction] = useFormState(
    publishMissionWithImgs,
    {
      success: false,
      msg: "",
    },
  );
  const { pending } = useFormStatus();

  useEffect(() => {
    if (!publishState.msg) return;
    if (publishState.success) {
      toastSuccess(publishState.msg);
      setUploadedImgs([]);
      push("/dashboard/market");
    } else {
      toastError(publishState.msg);
    }
  }, [publishState]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <button
      type="submit"
      className="flex h-10 items-center justify-center gap-1 rounded-md bg-blue-bupt px-6 text-base font-medium text-zinc-50 shadow transition-colors hover:bg-blue-bupt/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 group-invalid:pointer-events-none group-invalid:opacity-50 dark:bg-v-success-dark dark:hover:bg-v-success dark:focus-visible:ring-zinc-300"
      disabled={pending || imgCount == 0} // TODO: disable when no imgs
      aria-disabled={pending || imgCount == 0}
      formAction={publishMissionAction}
    >
      发布{pending && <span className="loading loading-spinner loading-xs" />}
    </button>
  );
}

export default PublishBtn;
