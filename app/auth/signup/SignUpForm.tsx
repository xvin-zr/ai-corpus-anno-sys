"use client";
import React, { FormEvent, useState } from "react";
import * as Form from "@radix-ui/react-form";
import Link from "next/link";
import { ArrowRightCircle, GitHub } from "react-feather";
import { signIn } from "next-auth/react";
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
      <Form.Root onSubmit={onSubmit} className="w-7/12 flex flex-col gap-4">
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
            姓名
          </Form.Label>
          <Form.Control asChild>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-zinc-100 dark:bg-zinc-900 h-10 rounded-md text-xl border-none ring-1 ring-inset ring-zinc-300 px-2 focus:ring-1 focus:ring-inset focus:ring-blue-bupt shadow"
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
              className="bg-zinc-100 dark:bg-zinc-900 h-10 rounded-md text-xl border-none ring-1 ring-inset ring-zinc-300 px-2 focus:ring-1 focus:ring-inset focus:ring-blue-bupt shadow"
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
              className="bg-zinc-100 dark:bg-zinc-900 h-10 rounded-md text-xl border-none ring-1 ring-inset ring-zinc-300 px-2 focus:ring-1 focus:ring-inset focus:ring-blue-bupt shadow"
              min={6}
              required
            />
          </Form.Control>
        </Form.Field>

        <Form.Submit asChild>
          <button className="flex items-center justify-center rounded-md bg-blue-bupt w-auto py-1.5 text-zinc-50 font-medium mt-5 tracking-[4px] shadow hover:bg-v-success-dark duration-200">
            注册
          </button>
        </Form.Submit>
      </Form.Root>

      <span className=" w-auto flex items-center justify-center">
        已有帐号？
        <Link
          href="/auth/signin"
          className="flex items-center gap-2 text-blue-bupt hover:text-v-success-dark duration-200"
        >
          去登陆 <ArrowRightCircle size={16} />
        </Link>
      </span>
    </>
  );
}

export default SignUpForm;
