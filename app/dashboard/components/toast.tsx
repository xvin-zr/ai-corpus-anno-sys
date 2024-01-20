import "animate.css";
import clsx from "clsx";
import { CheckCircle, XCircle } from "react-feather";
import toast from "react-hot-toast";

export function toastSuccess(msg: string): void {
  const toastStyle = clsx(
    "animate__animated animate__fadeInRight animate__faster flex items-center gap-2 rounded-md bg-v-success-dark px-5 py-3 text-lg font-semibold tracking-wider text-zinc-50 shadow",
  );
  toast.custom(
    <div className={toastStyle}>
      <CheckCircle />
      <p>{msg}</p>
    </div>,
  );
}

export function toastError(msg: string): void {
  const toastStyle = clsx(
    "animate__animated animate__fadeInRight animate__faster flex items-center gap-2 rounded-md bg-v-error px-5 py-3 text-lg font-semibold tracking-wider text-zinc-50 shadow",
  );
  toast.custom(
    <div className={toastStyle}>
      <XCircle />
      <p>{msg}</p>
    </div>,
  );
}
