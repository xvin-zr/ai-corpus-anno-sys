"use client";
import "@/annotorious.min.css";
import CocoNumbered from "@/constants/json/coco-numbered.json";
import Image from "next/image";
import { Prisma } from "@prisma/client";
// @ts-ignore
import { Annotorious } from "@recogito/annotorious";
import { atom, useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
// import { annoAtom } from "./AnnoActions";
import { W3CAnno } from "@/app/dashboard/my-missions/[missionId]/anno/[imageIndex]/data";

export const annoAtom = atom(null);

function Annotator({
  url,
  width,
  height, //   w3cAnnos,
}: {
  url: string;
  width: number;
  height: number;
  //   w3cAnnos: Prisma.JsonArray;
}) {
  const imgElRef = useRef(null);
  const [anno, setAnno] = useAtom(annoAtom);

  useEffect(() => {
    let annotorious: Annotorious | null = null;

    if (imgElRef.current) {
      //  init
      annotorious = new Annotorious({
        image: imgElRef.current,
        handleRadius: 4,
        locale: "zh-CN",
        widgets: [{ widget: "TAG", vocabulary: Object.keys(CocoNumbered) }],
      });

      // Attach event handlers here
      annotorious.on("createAnnotation", (annotation: W3CAnno) => {
        console.log("created", annotation);
      });

      annotorious.on(
        "updateAnnotation",
        (annotation: W3CAnno, previous: W3CAnno) => {
          console.log("updated", annotation, previous);
        },
      );

      annotorious.on("deleteAnnotation", (annotation: W3CAnno) => {
        console.log("deleted", annotation);
      });

      //   w3cAnnos.forEach((anno) => {
      //     annotorious.addAnnotation(anno);
      //   });
    }

    setAnno(annotorious);

    return () => annotorious?.destroy();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={``}>
      <Image
        src={url}
        width={width}
        height={height}
        alt={url}
        ref={imgElRef}
        quality={100}
        priority
        // style={{ maxWidth: width, maxHeight: height }}
      />
    </div>
  );
}

export default Annotator;
