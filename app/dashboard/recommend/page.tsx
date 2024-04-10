import Link from "next/link";
import { heading1Style } from "../components/header.style";
import { fetchUserRecommendMissions } from "./data";

async function RecommendPage() {
  const recommendMissions = await fetchUserRecommendMissions();
  return (
    <>
      <h1 className={heading1Style}>推荐任务</h1>

      <section className="pb-10">
        <div className="relative mb-6 flex max-h-[544px] w-full flex-col overflow-auto rounded-xl bg-clip-border shadow-md dark:shadow-lg dark:shadow-zinc-700/40">
          <table className="w-full min-w-max table-auto text-left">
            <thead className="sticky top-0 bg-zinc-300 font-medium dark:bg-zinc-700">
              <tr>
                <th className="px-4 py-5 first:rounded-tl-xl last:rounded-tr-xl">
                  <p className="block font-sans text-lg leading-none antialiased opacity-50 dark:opacity-90">
                    任务标题
                  </p>
                </th>
                <th className="px-4 py-5 first:rounded-tl-xl last:rounded-tr-xl">
                  <p className="block font-sans text-lg leading-none antialiased opacity-50 dark:opacity-90">
                    图片数量
                  </p>
                </th>
                <th className="p-4 first:rounded-tl-xl last:rounded-tr-xl">
                  <p className="block font-sans text-lg leading-none antialiased opacity-50 dark:opacity-90">
                    创建时间
                  </p>
                </th>
                <th className="p-4 first:rounded-tl-xl last:rounded-tr-xl">
                  <p className="block font-sans text-lg leading-none antialiased opacity-50 dark:opacity-90"></p>
                </th>
              </tr>
            </thead>

            <tbody className="overflow-y-auto">
              {recommendMissions.length > 0 &&
                recommendMissions.map((mission) => (
                  <tr
                    key={mission.id}
                    className="daek:odd:bg-zinc-800/20 border-b border-zinc-300 text-lg last:border-b-0 even:bg-zinc-100 dark:border-zinc-700 dark:even:bg-zinc-700/30"
                  >
                    <td className="p-4">
                      <p className="block font-normal leading-normal">
                        {mission.title}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="block font-normal leading-normal">
                        {mission.imagesIds.length}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="block font-normal leading-normal">
                        {mission.createdAt.toLocaleString("zh", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </td>
                    <td className="p-4">
                      <Link
                        href={`/dashboard/market/${mission.id}?recommend=true`}
                        className="rounded-md px-2 py-1 text-base font-[475] text-blue-bupt hover:bg-zinc-200/70 dark:hover:bg-zinc-600/60"
                      >
                        详情
                      </Link>
                    </td>
                  </tr>
                ))}

              {recommendMissions.length == 0 && (
                <tr className="text-center">
                  <td colSpan={5} className="py-4 text-xl">
                    没有推荐的任务&nbsp;，去完成任务获取更多推荐任务吧 🤓
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export default RecommendPage;
