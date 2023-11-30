"use client";
import React from "react";
import { updatePassword } from "./actions";
import { useFormState, useFormStatus } from "react-dom";
import { CheckCircle, Divide, XCircle } from "react-feather";
import ProfileBtn from "./ProfileBtn";

const initState = {
  msg: "",
  name: "",
};

function ProfilePage() {
  const [state, formAction] = useFormState(updatePassword, initState);
  const inputStyle = "border ";


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

        <ProfileBtn />
        {state?.name && (
          <div className="alert flex items-center rounded-lg bg-v-success-dark font-medium text-zinc-50">
            <CheckCircle />
            {state.msg}
          </div>
        )}
        {!state?.name && state?.msg && (
          <div className="alert flex items-center rounded-lg bg-v-error font-medium text-zinc-50">
            <XCircle />
            {state?.msg}
          </div>
        )}
      </form>
    </div>
  );
}

export default ProfilePage;
