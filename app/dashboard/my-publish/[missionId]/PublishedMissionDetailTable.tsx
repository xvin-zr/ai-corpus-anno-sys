import { MAX_ALLOWED_RECIPIENTS } from "@/constants";
import { MissionStatus } from "@prisma/client";
import Decimal from "decimal.js";
import StatusBadge from "../../components/StatusBadge";
import { tdStyle, trStyle } from "../../market/[missionId]/page";

function PublishedMissionDetailTable({
  title,
  createdAt,
  reward,
  imagesLen,
  status,
  description,
  multiRecipientEmails,
}: {
  title: string;
  createdAt: Date;
  reward: Decimal | null;
  imagesLen: number;
  status: MissionStatus;
  description: string;
  multiRecipientEmails: string[];
}) {
  return (
    <div className="overflow-hidden rounded-md border border-zinc-300 dark:border-zinc-600">
      <table className="max-w-md flex-none table-fixed border-collapse text-lg">
        <tbody className="">
          <tr className={trStyle}>
            <td className={[tdStyle, "border-l-0 border-t-0"].join(" ")}>
              任务标题
            </td>
            <td className={[tdStyle, "border-r-0 border-t-0"].join(" ")}>
              {title}
            </td>
          </tr>
          <tr className={trStyle}>
            <td className={[tdStyle, "border-l-0"].join(" ")}>创建时间</td>
            <td className={[tdStyle, "border-r-0"].join(" ")}>
              {createdAt.toLocaleDateString("zh", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </td>
          </tr>
          <tr className={trStyle}>
            <td className={tdStyle + " border-l-0"}>报酬</td>
            <td className={[tdStyle, "border-r-0"].join(" ")}>
              ¥&nbsp;{reward?.toNumber()}
            </td>
          </tr>
          <tr className={trStyle}>
            <td className={tdStyle + " border-l-0"}>图片数量</td>
            <td className={[tdStyle, "border-r-0"].join(" ")}>{imagesLen}</td>
          </tr>
          <tr className={trStyle}>
            <td className={tdStyle + " border-l-0"}>状态</td>
            <td className={[tdStyle, "border-r-0"].join(" ")}>
              <StatusBadge status={status} />
            </td>
          </tr>
          {multiRecipientEmails.length > 0 && (
            <tr className={trStyle}>
              <td className={tdStyle + " border-l-0"}>接受人数</td>
              <td className={[tdStyle, "border-r-0"].join(" ")}>
                {multiRecipientEmails.length} / {MAX_ALLOWED_RECIPIENTS}
              </td>
            </tr>
          )}
          <tr className={trStyle}>
            <td className={[tdStyle, "border-b-0 border-l-0"].join(" ")}>
              描述
            </td>
            <td className={[tdStyle, "border-b-0 border-r-0"].join(" ")}>
              <textarea
                className="border-none bg-transparent p-0"
                style={{ resize: "none" }}
                cols={23}
                rows={4}
                maxLength={50}
                defaultValue={description || ""}
                disabled
              ></textarea>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default PublishedMissionDetailTable;
