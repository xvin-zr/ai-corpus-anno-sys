import React from "react";
import HeroImg from "@/public/anno-hero.jpg";
import Image from "next/image";
import LoginForm from "./LoginForm";

function SignInPage() {
  return (
    <div className="grid grid-cols-2 h-[95vh]">
      <div className="hero-img-section shadow-lg rounded-md">
        <Image className="h-full object-cover object-right hover:object-left duration-[1.5s] ease-in-out rounded-md" src={HeroImg} alt="image with annotations" priority></Image>
      </div>

      <div className="hero-form-section flex flex-col items-center justify-center gap-4">
        {/* <div className="icon h-[24px] w-[24px] text-xl -mt-5 ">&times;</div> */}
        <svg className="with-icon_icon__MHUeb h-12 w-12 stroke-blue-bupt" data-testid="geist-icon" fill="none" shapeRendering="geometricPrecision"  strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" ><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
        <h1 className="text-4xl font-bold">AI 锟斤拷烫烫屯屯锘锘
          </h1>
        <h2 className="text-3xl mt-5 font-medium">登录</h2>
        <LoginForm />
      </div>
    </div>
  );
}

export default SignInPage;
