import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  const { client, concept, price } = req.body;

  const prompt = `
あなたは広告代理店のシニアデザイナーです。
以下の条件で、ロゴデザイン提案書にそのまま使える文章を作成してください。

【クライアント】
${client}

【方向性・キーワード】
${concept}

【条件】
・丁寧で信頼感のある日本語
・代理店品質
・営業資料として成立する文章
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  res.status(200).json({
    text: completion.choices[0].message.content,
  });
}