import ProfileBtn from "./ProfileBtn";
import { heading1Style } from "../components/header.style";
import { fetchBalance } from "./data";

export const dynamic = "force-dynamic";



async function ProfilePage() {
  const inputStyle =
    "peer inline-block rounded px-2 py-1 shadow-sm ring-inset focus:ring-blue-bupt dark:bg-zinc-800 dark:focus:ring-v-success";
  const labelStyle = "block space-y-1";
  const labelSpanStyle = "block text-xl font-medium";

  const balance = await fetchBalance();

  return (
    <>
      <h1 className={heading1Style}>个人资料</h1>

      <form className="flex flex-col gap-4">
        <label className={labelStyle}>
          <span className={labelSpanStyle}>余额</span>
          <input
            className={inputStyle}
            type="number"
            value={balance}
            readOnly
            disabled
          />
        </label>

        <hr className="my-2 w-72 text-zinc-500" />

        <label className={labelStyle}>
          <span className={labelSpanStyle}>旧密码</span>
          <input
            className={inputStyle}
            type="password"
            name="oldPassword"
            minLength={6}
          />
          <span className="invisible ml-3 inline-block text-v-warning peer-focus:visible">
            如果未设置密码，则无需输入
          </span>
        </label>

        <label className={labelStyle}>
          <span className={labelSpanStyle}>新密码</span>
          <input
            className={inputStyle}
            type="password"
            name="newPassword"
            minLength={6}
            required
          />
          <span className="invisible ml-3 inline-block text-v-error-light peer-invalid:peer-focus:visible">
            密码长度至少为 6
          </span>
        </label>

        <label className={labelStyle}>
          <span className={labelSpanStyle}>确认密码</span>
          <input
            className={inputStyle}
            type="password"
            name="confirmPassword"
            minLength={6}
            required
          />
          <span className="invisible ml-3 inline-block text-v-error-light peer-invalid:peer-focus:visible">
            密码长度至少为 6
          </span>
        </label>

        <ProfileBtn />
      </form>
    </>
  );
}


export default ProfilePage;
