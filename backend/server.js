// 必要なモジュールのインポート
const express = require("express");
const Stripe = require("stripe");
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// サーバーのセットアップ
const app = express();
app.use(express.json()); // JSONのリクエストボディを処理

// プランごとのPrice ID（Stripe Dashboardで取得したPrice IDを使います）
const PLANS = {
  free: { priceId: "" }, // Freeプランは決済対象外なので空にしておきます
  pro: { priceId: "price_1SqddhRXRdYD6hYTMNaDK30v" },  // ProプランのPrice ID
  agency: { priceId: "price_1Sqde9RXRdYD6hYTnZ4yrbWj" },  // AgencyプランのPrice ID
};

// セッション作成エンドポイント
app.post("/create-checkout-session", async (req, res) => {
  const { selectedPlan } = req.body; // クライアントから送られてきた選択したプラン

  // 無効なプランが選択されていた場合
  if (!PLANS[selectedPlan]) {
    return res.status(400).send("無効なプランです。");
  }

  try {
    // Stripe Checkoutセッションを作成
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // 支払い方法
      line_items: [
        {
          price: PLANS[selectedPlan].priceId, // プランに応じたPrice IDを使用
          quantity: 1,
        },
      ],
      mode: "payment", // 決済モード
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`, // 成功URL（実際に動作させる場合はfrontend_urlをセット）
      cancel_url: `${process.env.FRONTEND_URL}/cancel`, // キャンセルURL
    });

    // セッションIDを返却
    res.json({ id: session.id });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// 決済情報を取得するエンドポイント
app.get("/retrieve-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    res.json(session);  // セッション情報を返却
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Webhook（オプション）：決済完了後の処理（Stripeからの通知）

const endpointSecret = "whsec_XXXXX"; // Webhookのシークレット（Stripe Dashboardから設定）
app.post("/webhook", express.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  // セッションの支払い成功時に実行
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // 支払いが成功した場合の処理
    // 例えば、サーバーに購入プランを記録するなど
    console.log(`Payment for session ${session.id} was successful.`);
    // 必要に応じてDBに情報を保存したり、メール通知を送ったりします
  }

  res.status(200).send("Event received");
});

// サーバーの起動
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});