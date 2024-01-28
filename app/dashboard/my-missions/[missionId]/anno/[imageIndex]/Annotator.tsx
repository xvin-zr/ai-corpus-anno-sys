"use client";
import "@/annotorious.min.css";
import CocoNumbered from "@/constants/json/coco-numbered.json";
import Image from "next/image";
// @ts-ignore
import { Annotorious } from "@recogito/annotorious";
import { useAtom } from "jotai";
import { useEffect, useRef } from "react";
import { annoAtom } from "./AnnoActions";
import { W3CAnno } from "./data";

function Annotator({
  url,
  width,
  height,
}: {
  url: string;
  width: number;
  height: number;
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
    }

    setAnno(annotorious);

    return () => annotorious?.destroy();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <Image src={url} width={width} height={height} alt={url} ref={imgElRef} />
    </div>
  );
}

export default Annotator;
