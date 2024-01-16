"use client";
import React, { FormEvent, useState } from "react";
import * as Form from "@radix-ui/react-form";
import Link from "next/link";
import { ArrowRightCircle } from "react-feather";
import { useRouter } from "next/navigation";

function SignUpForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("密码不一致");
      return;
    }

    const res = await fetch("/api/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        name,
        password,
      }),
    });

    const data = await res.json();
    if (data.error) {
      alert(data.error);
      return;
    } else {
      alert(`${data.msg}\n${data.name}\n${data.email}`);
      router.push("/dashboard");
    }
  }

  return (
    <>
      <Form.Root onSubmit={onSubmit} className="flex w-7/12 flex-col gap-4">
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
            姓名
          </Form.Label>
          <Form.Control asChild>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 rounded-md border-none bg-zinc-100 px-2 text-xl shadow ring-1 ring-inset ring-zinc-300 focus:ring-1 focus:ring-inset focus:ring-blue-bupt dark:bg-zinc-900"
              min={2}
              required
            />
          </Form.Control>
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

        <Form.Field className="flex flex-col gap-2" name="password">
          <Form.Label className="justify-self-start text-xl font-medium">
            确认密码
          </Form.Label>
          <Form.Control asChild>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-10 rounded-md border-none bg-zinc-100 px-2 text-xl shadow ring-1 ring-inset ring-zinc-300 focus:ring-1 focus:ring-inset focus:ring-blue-bupt dark:bg-zinc-900"
              min={6}
              required
            />
          </Form.Control>
        </Form.Field>

        <Form.Submit asChild>
          <button className="mt-5 flex w-auto items-center justify-center rounded-md bg-blue-bupt py-1.5 font-medium tracking-[4px] text-zinc-50 shadow duration-200 hover:bg-v-success-dark ">
            注册
          </button>
        </Form.Submit>
      </Form.Root>

      <span className=" flex w-auto items-center justify-center">
        已有账号？
        <Link
          href="/auth/signin"
          className="flex items-center gap-2 text-blue-bupt duration-200 hover:text-v-success-dark dark:text-v-success-dark dark:hover:text-v-success"
        >
          去登录 <ArrowRightCircle size={16} />
        </Link>
      </span>
    </>
  );
}

export default SignUpForm;
