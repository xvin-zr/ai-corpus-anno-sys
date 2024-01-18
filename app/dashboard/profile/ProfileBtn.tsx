"use client";
import "animate.css";
import clsx from "clsx";
import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { CheckCircle, XCircle } from "react-feather";
import toast from "react-hot-toast";
import { updatePassword } from "./actions";

const initState = {
  msg: "",
  name: "",
};

function ProfileBtn() {
  const { pending } = useFormStatus();
  const [state, updatePasswordAction] = useFormState(updatePassword, initState);

  useEffect(() => {
    if (!state || !state.msg) return;
    const toastStyle = clsx(
      "animate__animated animate__fadeInRight animate__faster flex items-center gap-2 rounded-md px-5 py-3 text-lg font-semibold tracking-wider text-zinc-50 shadow",
    );
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
      className="mt-4 flex h-10 w-36 items-center justify-center rounded-md bg-blue-bupt px-6 text-base font-medium text-zinc-50 shadow transition-colors hover:bg-blue-bupt/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 group-invalid:pointer-events-none group-invalid:opacity-50 dark:bg-v-success-dark dark:hover:bg-v-success dark:focus-visible:ring-zinc-300"
      aria-disabled={pending}
      disabled={pending}
      formAction={updatePasswordAction}
    >
      更新密码{" "}
      {pending && <span className="loading loading-spinner loading-xs" />}
    </button>
  );
}

export default ProfileBtn;
