import CompleteAnnoBtn from "./CompleteAnnoBtn";

function AnnotationHeader({
  imageIndex,
  imagesCount,
  imageId,
  missionId,
}: {
  imageIndex: number;
  imagesCount: number;
  imageId: string;
  missionId: string;
}) {
  return (
    <header className="flex items-center justify-between text-lg">
      <h1 className=" text-2xl font-semibold">任务标注</h1>
      <div className="flex items-center gap-5 justify-self-center font-semibold">
        <progress
          className="progress w-96 [&::-moz-progress-bar]:bg-blue-bupt [&::-moz-progress-bar]:dark:bg-v-success [&::-webkit-progress-value]:bg-blue-bupt [&::-webkit-progress-value]:dark:bg-v-success"
          value={Number(imageIndex) + 1}
          max={imagesCount}
        ></progress>
        {Number(imageIndex) + 1}&nbsp;/&nbsp;{imagesCount}
      </div>

      <CompleteAnnoBtn
        imageIndex={imageIndex}
        imagesCount={imagesCount}
        imageId={imageId}
        missionId={missionId}
      />
    </header>
  );
}

export default AnnotationHeader;
