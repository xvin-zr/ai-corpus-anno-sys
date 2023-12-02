"use client";
import * as Toast from "@radix-ui/react-toast";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle, XCircle } from "react-feather";

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
  const [open, setOpen] = useState(false);
  const timerRef = useRef(0);
  const rootStyle = clsx("rounded-md p-4 shadow-md", {
    "bg-v-error": !state?.name,
    "bg-v-success-dark": state?.name,
  });

  useEffect(() => {
    const t = timerRef.current;
    return () => clearTimeout(t);
  }, []);

  return (
    <Toast.Provider>
      <button
        className="flex w-24 items-center justify-center bg-blue-bupt text-zinc-50 disabled:cursor-not-allowed"
        type="submit"
        aria-disabled={pending}
        disabled={pending}
        onClick={() => {
          setOpen(false);
          window.clearTimeout(timerRef.current);
          timerRef.current = window.setTimeout(() => {
            setOpen(true);
          }, 500);
        }}
      >
        更新密码{" "}
        {pending && <span className="loading loading-spinner loading-xs" />}
      </button>

      <Toast.Root
        className={rootStyle}
        duration={4000}
        open={open}
        onOpenChange={setOpen}
      >
        <Toast.Title className="flex items-center gap-2 text-lg font-semibold text-zinc-50">
          {state?.name && <CheckCircle />}
          {!state?.name && <XCircle />}
          {state?.msg}
        </Toast.Title>
      </Toast.Root>
      <Toast.Viewport className="fixed bottom-0 right-0 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-[10px] p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
    </Toast.Provider>
  );
}

export default ProfileBtn;
