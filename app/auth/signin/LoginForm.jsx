"use client";
import React, { useState } from "react";
import * as Form from "@radix-ui/react-form";
import Link from "next/link";
import { ArrowRightCircle, GitHub } from "react-feather";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    console.log(email, password);

    const callbackUrl = "/dashboard";

    try {
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
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Form.Root className="w-7/12 flex flex-col gap-4" onSubmit={onSubmit}>
        <Form.Field className="flex flex-col gap-2" name="email">
          <div className="flex">
            <Form.Label className="justify-self-start text-xl font-medium">
              邮箱地址
            </Form.Label>
            <Form.Message
              className="text-v-warning ml-auto"
              match={"valueMissing"}
            >
              请输入邮箱
            </Form.Message>
            <Form.Message className="text-v-warning ml-auto" match="typeMismatch">
              输入正确的邮箱
            </Form.Message>
          </div>
          <Form.Control asChild>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-zinc-100 dark:bg-zinc-900 h-10 rounded-md text-lg border-none ring-1 ring-inset ring-zinc-300 px-3 focus:ring-1 focus:ring-inset focus:ring-blue-bupt shadow placeholder:text-zinc-400"
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
              className="bg-zinc-100 dark:bg-zinc-900 h-10 rounded-md text-xl border-none ring-1 ring-inset ring-zinc-300 px-2 focus:ring-1 focus:ring-inset focus:ring-blue-bupt shadow"
              min={6}
              required
            />
          </Form.Control>
        </Form.Field>

        <Form.Submit asChild>
          <button className="flex items-center justify-center rounded-md bg-blue-bupt w-auto py-1.5 text-zinc-50 font-medium mt-5 tracking-[4px] shadow hover:bg-v-success-dark duration-200">
            登录
          </button>
        </Form.Submit>
      </Form.Root>
      <div className="or-line flex items-center justify-center gap-5 w-1/2 text-zinc-400">
        <hr className="grow" />
        <p className="flex items-center justify-center">或 者</p>
        <hr className="grow" />
      </div>
      <button onClick={() => signIn("github", { callbackUrl: "/dashboard" })} className="w-7/12 flex gap-2 items-center justify-center rounded-md bg-black  py-1.5 text-zinc-50 font-medium  shadow hover:bg-[#333] duration-200">
        <GitHub size={20} />
        通过 GitHub 登录
      </button>
      <span className=" w-auto flex items-center justify-center">
        还没有帐号？
        <Link
          href="/auth/signup"
          className="flex items-center gap-2 text-blue-bupt hover:text-v-success-dark duration-200"
        >
          去注册 <ArrowRightCircle size={16} />
        </Link>
      </span>
    </>
  );
}

export default LoginForm;
