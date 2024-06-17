import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChartName } from "../data";

const chartTypeMap = new Map<ChartName, string>([
  ["total-user", "用户增长趋势"],
  ["user-accuracy", "用户任务通过率分布"],
  ["completed-missions", "任务完成数量"],
  ["mission-categories", "任务类别分布"],
  ["mission-passed-rate", "两种任务通过率趋势"],
  ["reward-complete-time", "任务类别、报酬和完成时间"],
]);
const cache = new Map();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function fetchDataReport(type: ChartName, content: string) {
  if (cache.has(content)) {
    return cache.get(content);
  }
  const prompt = `${content}
这是众包数据标注系统的${chartTypeMap.get(
    type,
  )}数据，你作为一名数据分析师，给出简要业务分析报告`;

  try {
    const result = await model.generateContent(prompt);
    const resp = result.response;
    const text = resp.text();
    console.log(text);
    cache.set(content, text);
    return text;
  } catch (err) {
    console.error(err);
    throw new Error("failed in fetch data report");
  }
}
