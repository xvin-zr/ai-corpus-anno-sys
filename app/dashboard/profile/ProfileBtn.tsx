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
      className="flex w-24 items-center justify-center bg-blue-bupt text-zinc-50 disabled:cursor-not-allowed"
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
