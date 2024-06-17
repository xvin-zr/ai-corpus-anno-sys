import axios from "axios";
import { ChartName } from "../data";

const cache = new Map();
const MOONSHOT_URL = "https://api.moonshot.cn/v1/chat/completions";

// 请求配置
const header = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.MOONSHOT_API_KEY}`,
};
const model = "moonshot-v1-8k";
const temperature = 0.3;
const messages = [
  {
    role: "system",
    content: "你是一名数据分析师，根据用户给的数据给出业务分析报告",
  },
];

const chartTypeMap = new Map<ChartName, string>([
  ["total-user", "用户增长趋势"],
  ["user-accuracy", "用户任务通过率分布"],
  ["completed-missions", "任务完成数量"],
  ["mission-categories", "任务类别分布"],
  ["mission-passed-rate", "两种任务通过率趋势"],
  ["reward-complete-time", "任务类别、报酬和完成时间"],
]);

export async function fetchDataReport(type: ChartName, content: string) {
  console.log("start");
  if (cache.has(content)) {
    console.log(cache.get(content))
    return cache.get(content);
  }
  const prompts = `${content}
这是众包数据标注系统的${chartTypeMap.get(type)}数据，给出简要业务分析报告`;
  try {
    const report = (
      await axios.post(
        MOONSHOT_URL,
        {
          model,
          temperature,
          max_tokens: 1024,
          messages: messages.concat({ role: "user", content: prompts }),
        },
        {
          headers: header,
        },
      )
    ).data;
    const res = report.choices[0].message?.content as string;
    console.log(res);
    cache.set(content, res);
    return res;
  } catch (err) {
    console.error(err);
    throw new Error("failed in fetch data report");
  }
}
