import React from "react";
import HeroImg from "@/public/anno-hero.jpg";
import Image from "next/image";
import SignUpForm from "./SignUpForm";

function SignUpPage() {
  return (
    <div className="grid h-[95vh] grid-cols-2">
      <div className="hero-img-section rounded-md shadow-lg">
        <Image
          className="h-full rounded-md object-cover object-right duration-[1.5s] ease-in-out hover:object-left"
          src={HeroImg}
          alt="image with annotations"
          priority
        ></Image>
      </div>

      <div className="hero-form-section flex flex-col items-center justify-center gap-4">
        {/* <div className="icon h-[24px] w-[24px] text-xl -mt-5 ">&times;</div> */}
        <svg
          className="with-icon_icon__MHUeb h-12 w-12 stroke-blue-bupt dark:stroke-v-success-dark"
          data-testid="geist-icon"
          fill="none"
          shapeRendering="geometricPrecision"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
        <h1 className="text-4xl font-bold">AI 语料标注系统</h1>
        <h2 className="mt-5 text-3xl font-medium">注&nbsp;&nbsp;册</h2>
        <SignUpForm />
      </div>
    </div>
  );
}

export default SignUpPage;
