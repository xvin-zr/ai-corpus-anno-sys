"use client";
import React from "react";
import { updatePassword } from "./actions";
import { useFormState } from "react-dom";
import { CheckCircle, Divide, XCircle } from "react-feather";

const initState = {
  msg: "",
  name: "",
};

function ProfilePage() {
  const [state, formAction] = useFormState(updatePassword, initState);
  const inputStyle = "border ";

  function handleClick() {
    if (state?.msg && state.name) alert(state?.msg + state?.name);
    else if (state?.msg) alert(state?.msg);
  }

  return (
    <div>
      <form action={formAction} className="flex flex-col gap-4">
        <label>
          <span>旧密码</span>
          <input className={inputStyle} type="password" name="oldPassword" />
        </label>

        <label>
          <span>新密码</span>
          <input className={inputStyle} type="password" name="newPassword" />
        </label>

        <label>
          <span>确认密码</span>
          <input
            className={inputStyle}
            type="password"
            name="confirmPassword"
          />
        </label>

        <button onClick={handleClick} className="text-left" type="submit">
          更新密码
        </button>
        {state?.name && (
          <div className="alert bg-v-success-dark rounded-lg flex items-center text-zinc-50 font-medium">
            <CheckCircle />
            {state.msg}
          </div>
        )}
        {!state?.name && state?.msg && (
          <div className="alert bg-v-error rounded-lg text-zinc-50 flex items-center font-medium">
            <XCircle />
            {state?.msg}
          </div>
        )}
      </form>
    </div>
  );
}

export default ProfilePage;
