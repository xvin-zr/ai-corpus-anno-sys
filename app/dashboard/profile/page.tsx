"use client";
import { useFormState } from "react-dom";
import ProfileBtn from "./ProfileBtn";
import { updatePassword } from "./actions";
import { Toaster } from "react-hot-toast";

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
          <input
            className={inputStyle}
            type="password"
            name="oldPassword"
            min={6}
          />
        </label>

        <label>
          <span>新密码</span>
          <input
            className={inputStyle}
            type="password"
            name="newPassword"
            min={6}
            required
          />
        </label>

        <label>
          <span>确认密码</span>
          <input
            className={inputStyle}
            type="password"
            name="confirmPassword"
            min={6}
            required
          />
        </label>

        <ProfileBtn state={state} />
      </form>
    </div>
  );
}

export default ProfilePage;
