import React from "react";
import { useFormStatus } from "react-dom";

function ProfileBtn() {
  const { pending } = useFormStatus();
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
