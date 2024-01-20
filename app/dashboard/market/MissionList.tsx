import Link from "next/link";

const tempArr = [
  "item1",
  "item2",
  "item3",
  "item4",
  "item5",
  "item6",
  "item7",
  "item8",
];

function MissionList({ query, currPage }: { query: string; currPage: number }) {
  return (
    <ul className="grid grid-cols-4 grid-rows-2 gap-4">
      {tempArr.map((item) => (
        <li key={item} className="mission-item">
          <Link
            href={"/dashboard/profile"}
            className="flex h-56 cursor-pointer list-none flex-col divide-y overflow-hidden rounded-lg bg-transparent shadow transition-all hover:-translate-y-2 hover:shadow-md"
          >
            <figure className="image basis-7/12"></figure>

            <div className="basis-5/12 space-y-0.5 p-3 dark:bg-zinc-800">
              <h2 className="text-lg font-medium">任务主题任务主题任务</h2>
              <span className="flex items-center px-1">
                <span className="text-xl opacity-[0.85] ">¥&nbsp;999</span>

                <time className="ml-auto mr-3 opacity-60" dateTime="">
                  2024/1/20
                </time>
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default MissionList;
