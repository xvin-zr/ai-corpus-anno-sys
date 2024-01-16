"use client";
import React, { useState } from "react";
import * as Form from "@radix-ui/react-form";
import Link from "next/link";
import { ArrowRightCircle, GitHub } from "react-feather";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";

function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    console.log(email, password);

    const callbackUrl = "/dashboard";

    try {
      setPending(true);
      const res = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
        callbackUrl: callbackUrl, // redirect to if success
      });

      console.log("sign in", res);
      if (!res?.error) {
        router.push(callbackUrl);
      } else {
        console.error("sign in error");
        alert("登录失败，请检查您的邮箱和密码是否正确");
        setPending(false);
      }
    } catch (error) {
      setPending(false);
      console.error(error);
    }
  }

  return (
    <>
      <Form.Root className="flex w-7/12 flex-col gap-4" onSubmit={onSubmit}>
        <Form.Field className="flex flex-col gap-2" name="email">
          <div className="flex">
            <Form.Label className="justify-self-start text-xl font-medium">
              邮箱地址
            </Form.Label>
            <Form.Message
              className="ml-auto text-v-warning"
              match={"valueMissing"}
            >
              请输入邮箱
            </Form.Message>
            <Form.Message
              className="ml-auto text-v-warning"
              match="typeMismatch"
            >
              输入正确的邮箱
            </Form.Message>
          </div>
          <Form.Control asChild>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 rounded-md border-none bg-zinc-100 px-3 text-lg shadow ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-1 focus:ring-inset focus:ring-blue-bupt dark:bg-zinc-900"
              placeholder="bupt@example.com"
              required
            />
          </Form.Control>
          {/* <Form.ValidityState /> */}
        </Form.Field>

        <Form.Field className="flex flex-col gap-2" name="password">
          <Form.Label className="justify-self-start text-xl font-medium">
            密码
          </Form.Label>
          <Form.Control asChild>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 rounded-md border-none bg-zinc-100 px-2 text-xl shadow ring-1 ring-inset ring-zinc-300 focus:ring-1 focus:ring-inset focus:ring-blue-bupt dark:bg-zinc-900"
              min={6}
              required
            />
          </Form.Control>
        </Form.Field>

        <Form.Submit asChild>
          <button
            className="mt-5 flex w-auto items-center justify-center rounded-md bg-blue-bupt py-1.5 font-medium tracking-[4px] text-zinc-50 shadow duration-200 hover:bg-v-success-dark"
            aria-disabled={pending}
          >
            登录{" "}
            {pending && (
              <span className="loading loading-spinner loading-xs"></span>
            )}
          </button>
        </Form.Submit>
      </Form.Root>
      <div className="or-line flex w-1/2 items-center justify-center gap-5 text-zinc-400">
        <hr className="grow" />
        <p className="flex items-center justify-center">或</p>
        <hr className="grow" />
      </div>
      <button
        onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
        className="flex w-7/12 items-center justify-center gap-2 rounded-md bg-black  py-1.5 font-medium text-zinc-50  shadow duration-200 hover:bg-[#333]"
      >
        <GitHub size={20} />
        通过 GitHub 登录
      </button>
      <span className=" flex w-auto items-center justify-center">
        还没有帐号？
        <Link
          href="/auth/signup"
          className="flex items-center gap-2 text-blue-bupt duration-200 hover:text-v-success-dark dark:text-v-success-dark dark:hover:text-v-success"
        >
          去注册 <ArrowRightCircle size={16} />
        </Link>
      </span>
    </>
  );
}

export default LoginForm;
