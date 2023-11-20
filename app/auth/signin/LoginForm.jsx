"use client";
import React from "react";
import * as Form from "@radix-ui/react-form";
import Link from "next/link";
import { ArrowRightCircle, GitHub } from "react-feather";

function LoginForm() {
  return (
    <>
      <Form.Root className="w-7/12 flex flex-col gap-4">
        <Form.Field className="flex flex-col gap-2" name="email">
          <div className="flex">
            <Form.Label className="justify-self-start text-xl font-medium">
              邮箱地址
            </Form.Label>
            <Form.Message
              className="text-zinc-950 ml-auto"
              match={"valueMissing"}
            >
              输入你的邮箱
            </Form.Message>
            <Form.Message
              className="text-zinc-950 ml-auto"
              match="typeMismatch"
            >
              输入正确的邮箱
            </Form.Message>
          </div>
          <Form.Control asChild>
            <input
              type="email"
              className="bg-zinc-100 h-10 rounded-md text-lg border-none ring-1 ring-inset ring-zinc-300 px-3 focus:ring-1 focus:ring-inset focus:ring-blue-bupt shadow placeholder:text-zinc-400"
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
              className="bg-zinc-100 h-10 rounded-md text-xl border-none ring-1 ring-inset ring-zinc-300 px-2 focus:ring-1 focus:ring-inset focus:ring-blue-bupt shadow"
              required
            />
          </Form.Control>
        </Form.Field>

        <Form.Submit asChild>
          <button className="flex items-center justify-center rounded-md bg-blue-bupt w-auto py-1.5 text-zinc-50 font-medium mt-5 tracking-[4px] shadow hover:bg-success-dark duration-200">
            登录
          </button>
        </Form.Submit>
      </Form.Root>
      <div className="or-line flex items-center justify-center gap-5 w-1/2 text-zinc-400">
        <hr className="grow" />
        <p className="flex items-center justify-center">或 者</p>
        <hr className="grow" />
      </div>
      <button className="w-7/12 flex gap-2 items-center justify-center rounded-md bg-black  py-1.5 text-zinc-50 font-medium  shadow hover:bg-[#333] duration-200">
        <GitHub size={20} />
        通过 GitHub 登录
      </button>
      <span className=" w-auto flex items-center justify-center">
        还没有帐号？
        <Link
          href="#"
          className="flex items-center gap-2 text-blue-bupt hover:text-success-dark duration-200"
        >
          去注册 <ArrowRightCircle size={16} />
        </Link>
      </span>
    </>
  );
}

export default LoginForm;
