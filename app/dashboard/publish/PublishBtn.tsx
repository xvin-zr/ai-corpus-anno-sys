"use client";
import { useAtom, useAtomValue } from "jotai";
import React, { useEffect } from "react";
import { imgCountAtom, uploadedImgsAtom } from "./CldUploadBtn";
import { publishMission } from "./actions";
import { useFormState, useFormStatus } from "react-dom";

function PublishBtn() {
  const [imgCount] = useAtom(imgCountAtom);
  const uploadedImgs = useAtomValue(uploadedImgsAtom);

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
    console.log("publishState\n", publishState);
  }, [publishState]);

  return (
    <button
      type="submit"
      className="flex h-10 items-center justify-center gap-1 rounded-md bg-blue-bupt px-6 text-base font-medium text-zinc-50 shadow transition-colors hover:bg-blue-bupt/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 group-invalid:pointer-events-none group-invalid:opacity-50 dark:bg-v-success-dark dark:hover:bg-v-success dark:focus-visible:ring-zinc-300"
      style={{ marginTop: "1.5rem" }}
      disabled={pending}
      aria-disabled={pending}
      formAction={publishMissionAction}
    >
      发布{pending && <span className="loading loading-spinner loading-xs" />}
    </button>
  );
}

export default PublishBtn;
