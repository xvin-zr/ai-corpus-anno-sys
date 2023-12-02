"use client";
import * as Toast from "@radix-ui/react-toast";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle, XCircle } from "react-feather";
import toast from "react-hot-toast";

interface Props {
  state:
    | {
        msg: string;
        name?: string | null;
      }
    | undefined;
}

function ProfileBtn({ state }: Props) {
  const { pending } = useFormStatus();


  useEffect(() => {
    if (!state) return;
    const toastStyle =
      "flex items-center gap-2 rounded-md shadow px-4 py-3 text-lg font-semibold text-zinc-50 tracking-wider";
    if (!state.name) {
      toast.custom(
        <div className={toastStyle + " " + "bg-v-error"}>
          <XCircle />
          <p>{state.msg}</p>
        </div>,
      );
    } else {
      toast.custom(
        <div className={toastStyle + " " + "bg-v-success-dark"}>
          <CheckCircle />
          <p>{state.msg}</p>
        </div>,
      );
    }
  }, [state]);

  return (
    <button
      className="flex w-24 items-center justify-center bg-blue-bupt text-zinc-50 disabled:cursor-not-allowed"
      type="submit"
      aria-disabled={pending}
      disabled={pending}
    >
      更新密码{" "}
      {pending && <span className="loading loading-spinner loading-xs" />}
    </button>
  );
}

export default ProfileBtn;
