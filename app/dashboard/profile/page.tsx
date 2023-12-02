import ProfileBtn from "./ProfileBtn";

function ProfilePage() {
  const inputStyle = "border ";

  return (
    <div>
      <form className="flex flex-col gap-4">
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

        <ProfileBtn />
      </form>
    </div>
  );
}

export default ProfilePage;
