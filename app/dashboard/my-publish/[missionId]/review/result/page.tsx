"use client";
import React, { useState, useTransition } from "react";
import PassReviewBtn from "./PassReviewBtn";
import ImproveBtn from "./ImproveBtn";

function ReviewResultPage({
  params: { missionId },
}: {
  params: { missionId: string };
}) {
  const [comment, setComment] = useState("");
  return (
    <>
      <h1 className="text-3xl font-semibold">发布审核结果</h1>

      <section className="mt-16 space-y-4 text-center">
        <textarea
          className="rounded-md text-lg"
          placeholder={"评论待改进的地方...\n或通过审核"}
          name="comment"
          cols={30}
          rows={8}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>

        <div className="flex items-center justify-center gap-6">
          <PassReviewBtn missionId={missionId} />

          <ImproveBtn missionId={missionId} comment={comment} />
        </div>
      </section>
    </>
  );
}

export default ReviewResultPage;
