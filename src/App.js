import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";

/* =========================================
   定数・テンプレート
   ========================================= */
const CONCEPT_TEMPLATES = {
  trust: "創業からの歴史と実績を尊重しつつ、現代的な信頼感を表現しました。太めの書体と安定感のあるシンボルは、揺るぎない企業基盤を象徴しています。",
  innovation: "未来への挑戦と技術革新をテーマに構成しました。右肩上がりのラインと鮮やかな配色は、常に変化し成長し続ける企業の姿勢を表しています。",
  friendly: "顧客との距離を縮める、親しみやすさと温かみを重視したデザインです。丸みを帯びたフォルムと柔らかな色使いで、安心感を与えるブランドイメージを構築します。",
  minimal: "無駄を極限まで削ぎ落とし、本質のみを伝えるミニマルデザインです。視認性が高く、Webから看板まであらゆる媒体で機能する普遍的な強さを持ちます。",
};

const DEMO_LOGO_URL = "https://placehold.jp/40/cccccc/ffffff/300x300.png?text=DEMO%20LOGO";

const PLANS = {
  free: { 
    id: "free",
    name: "Free", 
    price: "0", 
    unit: "円", 
    desc: "まずは使い勝手をお試し", 
    features: ["基本構成のプレビュー", "デモ版PDF出力(ロゴ固定)", "設定のブラウザ保存"], 
    isPopular: false,
    rank: 0, // ★ランク付けを追加
    allowCustomHeader: false, allowDesignIntent: false, allowColorCustom: false 
  },
  pro: { 
    id: "pro",
    name: "Pro", 
    price: "1,480", 
    unit: "円/月(税込)", 
    desc: "フリーランスの受注率UPに", 
    features: ["商用PDF出力(ロゴ反映)", "デザイン意図の自動生成", "テーマカラー自由変更", "信頼度が高まるレイアウト"], 
    isPopular: true, 
    badge: "一番人気",
    rank: 1, // ★ランク付けを追加
    stripeUrl: "https://buy.stripe.com/test_dRmaEZ4261S78Ye8Tu8IU02", 
    allowCustomHeader: false, allowDesignIntent: true, allowColorCustom: true 
  },
  agency: { 
    id: "agency",
    name: "Agency", 
    price: "4,800", 
    unit: "円/月(税込)", 
    desc: "制作チーム・代理店向け", 
    features: ["代理店名の記載", "プロジェクト管理ヘッダー", "高精細レイアウト保存", "チーム共有用設定"], 
    isPopular: false,
    rank: 2, // ★ランク付けを追加
    stripeUrl: "https://buy.stripe.com/test_4gMcN72Y2gN10rIb1C8IU03",
    allowCustomHeader: true, allowDesignIntent: true, allowColorCustom: true 
  },
};

/* =========================================
   決済・完了ページ
   ========================================= */
const SuccessPage = ({ onSuccess }) => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const plan = params.get("plan");
    if (plan === "pro" || plan === "agency") {
      onSuccess(plan);
      localStorage.setItem("logo_proposal_plan", plan);
    }
  }, [onSuccess]);

  return (
    <div style={{ textAlign: "center", padding: "100px 20px", fontFamily: '"Inter", sans-serif' }}>
      <div style={{ fontSize: 60, marginBottom: 20 }}>🎉</div>
      <h2 style={{ fontSize: 28, fontWeight: "bold", color: "#1f2937" }}>決済が完了しました！</h2>
      <p style={{ color: "#64748b", marginBottom: 40 }}>プロフェッショナルな機能が解放されました。</p>
      <Link to="/" style={{ 
        background: "#3b82f6", color: "#fff", padding: "12px 30px", 
        borderRadius: 50, textDecoration: "none", fontWeight: "bold" 
      }}>
        ジェネレーターに戻る
      </Link>
    </div>
  );
};

const CancelPage = () => (
  <div style={{ textAlign: "center", padding: "100px 20px", fontFamily: '"Inter", sans-serif' }}>
    <h1 style={{ color: "#f59e0b", fontSize: "48px" }}>!</h1>
    <h2>決済がキャンセルされました</h2>
    <Link to="/" style={{ color: "#3b82f6", fontWeight: "bold" }}>戻る</Link>
  </div>
);

/* =========================================
   メインコンポーネント
   ========================================= */
export default function App() {
  const [activePlan, setActivePlan] = useState("free");   
  const [selectedPlan, setSelectedPlan] = useState("free"); 
  const [isSaved, setIsSaved] = useState(false); 

  const [formData, setFormData] = useState({
    client: "",
    price: 50000,
    concept: "",
    agencyName: "",
    projectName: "",
    color: "#3b82f6",
    logoImage: null,
  });

  useEffect(() => {
    const savedPlan = localStorage.getItem("logo_proposal_plan");
    if (savedPlan === "pro" || savedPlan === "agency") {
      setActivePlan(savedPlan);
      setSelectedPlan(savedPlan);
    } else {
      setActivePlan("free");
      setSelectedPlan("free");
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("logo_proposal_data", JSON.stringify(formData));
      localStorage.setItem("logo_proposal_plan", activePlan);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }, 800);
    return () => clearTimeout(timer);
  }, [formData, activePlan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    if (activePlan === "free") {
      alert("🔒 この機能はProプラン限定です。\n商用利用可能な提案書を作成するにはアップグレードしてください。");
      return;
    }
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData((prev) => ({ ...prev, logoImage: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  // ★印刷ガード機能：選択中のプランが契約プランより高い場合はブロックする
  const handlePrint = () => {
    const activeRank = PLANS[activePlan].rank;
    const selectedRank = PLANS[selectedPlan].rank;

    // 契約ランクより上のプランを表示中の場合
    if (selectedRank > activeRank) {
      alert(`🔒 選択中の「${PLANS[selectedPlan].name}」プランのデザインで出力するには、アップグレードが必要です。\n\n現在のプラン (${PLANS[activePlan].name}) のデザインに戻すか、プランを変更してください。`);
      return;
    }

    window.print();
  };

  const ProposalDocument = ({ mode, displayPlan, entitlementPlan }) => {
    const { agencyName, projectName, client, concept, price, color, logoImage } = formData;
    const currentPlan = PLANS[displayPlan];
    const isPreview = mode === "preview";
    const isPdf = mode === "pdf";
    const shouldShowLogo = isPdf || isPreview;

    const isDemoRequired = 
      entitlementPlan === "free" || 
      (entitlementPlan === "pro" && displayPlan === "agency");

    const logoToShow = isDemoRequired ? DEMO_LOGO_URL : logoImage;
    const displayColor = displayPlan === "free" ? "#3b82f6" : color;

    return (
      <div style={{ color: "#1f2937", lineHeight: 1.7, fontFamily: '"Helvetica Neue", Arial, sans-serif' }}>
        {displayPlan === "agency" ? (
          <div style={{ textAlign: "right", borderBottom: `2px solid ${displayColor}`, paddingBottom: 20, marginBottom: 40 }}>
            <p style={{ fontSize: 11, color: "#6b7280", margin: 0, textTransform: "uppercase", letterSpacing: 1 }}>Produced by</p>
            <p style={{ fontSize: 14, fontWeight: "bold", margin: 0 }}>{agencyName || "（代理店名を入力）"}</p>
            <h1 style={{ fontSize: 24, margin: "10px 0 0", color: displayColor }}>{projectName || "PROJECT NAME"}</h1>
          </div>
        ) : (
          <div style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: 24, marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <h1 style={{ fontSize: 20, color: "#9ca3af", letterSpacing: 6, fontWeight: 300, margin: 0 }}>DESIGN PROPOSAL</h1>
            <span style={{ fontSize: 12, color: "#d1d5db" }}>{new Date().toLocaleDateString()}</span>
          </div>
        )}

        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 22, fontWeight: "bold", fontFamily: "serif" }}>{client || "株式会社〇〇"} <span style={{fontSize:16}}>御中</span></p>
        </div>

        {displayPlan === "free" && mode === "preview" && (
          <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1e40af", padding: 12, borderRadius: 8, fontSize: 13, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
            <span>ℹ️</span> <strong>プレビューモード:</strong> PDF出力時にはデモロゴが含まれます。Proプランで解除されます。
          </div>
        )}
        {entitlementPlan === "pro" && displayPlan === "agency" && mode === "preview" && (
          <div style={{ background: "#fffbeb", border: "1px solid #fde68a", color: "#92400e", padding: 12, borderRadius: 8, fontSize: 13, marginBottom: 24 }}>
            ⚠️ Agencyプランのプレビュー中です（契約外のデザインです）
          </div>
        )}

        <div style={{
            background: "#fff",
            borderRadius: 4,
            height: 340,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 48,
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
            border: "1px solid #f3f4f6",
            position: "relative",
            overflow: "hidden"
          }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(#e5e7eb 1px, transparent 1px)", backgroundSize: "20px 20px", opacity: 0.5 }}></div>
          
          <div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {shouldShowLogo && logoToShow ? (
              <img src={logoToShow} alt="Logo" style={{ maxHeight: "60%", maxWidth: "60%", objectFit: "contain", filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.1))" }} />
            ) : (
              <span style={{ color: "#9ca3af", fontSize: 14 }}>ロゴエリア</span>
            )}
          </div>
        </div>

        <h2 style={{ fontSize: 16, fontWeight: "bold", borderLeft: `4px solid ${displayColor}`, paddingLeft: 16, marginBottom: 20, color: "#111827" }}>
          DESIGN CONCEPT
        </h2>
        <p style={{ whiteSpace: "pre-wrap", marginBottom: 48, color: "#374151", fontSize: 15, lineHeight: 1.8 }}>
          {concept || "ここに選択したコンセプトが表示されます。プロフェッショナルな文言でクライアントの信頼を獲得しましょう。"}
        </p>

        {currentPlan.allowDesignIntent && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 48 }}>
            <div style={{ padding: 20, background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0" }}>
              <h4 style={{ margin: "0 0 10px 0", fontSize: 14, color: "#0f172a" }}>◆ 視認性と機能性</h4>
              <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>あらゆるデバイスサイズに対応し、モノクロ印刷時でも品質を損なわない堅牢なデザイン設計を行っています。</p>
            </div>
            <div style={{ padding: 20, background: "#f8fafc", borderRadius: 12, border: "1px solid #e2e8f0" }}>
              <h4 style={{ margin: "0 0 10px 0", fontSize: 14, color: "#0f172a" }}>◆ ブランドの独自性</h4>
              <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>競合調査に基づき、市場における御社の立ち位置を明確にするための独自のフォルムを採用しました。</p>
            </div>
          </div>
        )}

        <div style={{ marginTop: "auto", paddingTop: 30, borderTop: "2px solid #f3f4f6", display: "flex", justifyContent: "flex-end", alignItems: "baseline", gap: 16 }}>
          <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>制作費用（一式）</p>
          <p style={{ fontSize: 36, fontWeight: "800", margin: 0, fontFamily: "sans-serif", letterSpacing: -1 }}>
            ¥{Number(price).toLocaleString()}
            <span style={{ fontSize: 14, fontWeight: "normal", marginLeft: 4, color: "#6b7280" }}>(税込)</span>
          </p>
        </div>
      </div>
    );
  };

  const MainContent = (
    <div style={{ background: "#f8fafc", minHeight: "100vh", fontFamily: '"Inter", sans-serif', color: "#0f172a" }}>
      
      <section className="no-print" style={{ 
        background: "linear-gradient(135deg, #eff6ff 0%, #fff 100%)", 
        padding: "60px 20px", borderBottom: "1px solid #e2e8f0", textAlign: "center"
      }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16, letterSpacing: "-0.02em", color: "#1e293b" }}>
            選ばれる提案書を、<span style={{ color: "#3b82f6" }}>一瞬で。</span>
          </h1>
          <p style={{ color: "#64748b", fontSize: 16, marginBottom: 48, maxWidth: 600, margin: "0 auto 48px" }}>
            デザインの価値を正しく伝え、クライアントの「Yes」を引き出す。
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, alignItems: "start" }}>
            {Object.keys(PLANS).map((key) => {
              const p = PLANS[key];
              const isActive = selectedPlan === key;
              const isCurrent = activePlan === key;
              const isPro = key === "pro";

              return (
                <div 
                  key={key} 
                  onClick={() => {
                    if (isCurrent) { setSelectedPlan(key); return; }
                    setSelectedPlan(key);
                  }} 
                  style={{ 
                    position: "relative", padding: 32, borderRadius: 20, 
                    border: isActive ? `2px solid ${isPro ? "#3b82f6" : "#0f172a"}` : "1px solid #e2e8f0", 
                    background: isActive ? "#fff" : "rgba(255,255,255,0.6)", 
                    cursor: "pointer", textAlign: "left", transition: "all 0.2s ease",
                    transform: isActive ? "translateY(-4px)" : "none",
                    boxShadow: isActive ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" : "none"
                  }}
                >
                  {p.isPopular && (
                    <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "#3b82f6", color: "#fff", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: "bold" }}>{p.badge}</div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: "bold" }}>{p.name}</h3>
                    {isCurrent && <span style={{ background: "#dcfce7", color: "#166534", fontSize: 10, padding: "2px 8px", borderRadius: 4, fontWeight: "bold" }}>契約中</span>}
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <span style={{ fontSize: 32, fontWeight: "900", letterSpacing: -1 }}>{p.price}</span>
                    <span style={{ fontSize: 12, color: "#64748b", fontWeight: "bold" }}>{p.unit}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "#64748b", marginBottom: 24, lineHeight: 1.5 }}>{p.desc}</p>
                  
                  <a 
                    href={isCurrent ? "#" : (p.stripeUrl || "#")}
                    onClick={(e) => {
                      if (isCurrent || key === "free") {
                        e.preventDefault();
                        setSelectedPlan(key);
                      }
                    }}
                    style={{
                      display: "block", textAlign: "center", textDecoration: "none", width: "100%", padding: "10px", borderRadius: 8, border: "none", fontWeight: "bold", marginBottom: 24,
                      background: isActive ? (isPro ? "#3b82f6" : "#1e293b") : "#e2e8f0",
                      color: isActive ? "#fff" : "#64748b",
                      cursor: isCurrent ? "default" : "pointer",
                      boxSizing: "border-box"
                    }}
                  >
                    {isActive ? (isCurrent ? "契約中" : "プランを購入する") : "見る"}
                  </a>

                  <ul style={{ padding: 0, listStyle: "none", fontSize: 13, color: "#475569" }}>
                    {p.features.map(f => (
                      <li key={f} style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ color: isPro ? "#3b82f6" : "#10b981" }}>✔</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="no-print" style={{ maxWidth: 1200, margin: "40px auto", padding: "0 20px", display: "grid", gridTemplateColumns: "380px 1fr", gap: 40, alignItems: "start" }}>
        <aside>
          <div style={{ background: "#fff", padding: 24, borderRadius: 16, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9", position: "sticky", top: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24, alignItems: "center" }}>
              <h2 style={{ fontSize: 15, fontWeight: "bold", margin: 0, display: "flex", alignItems: "center", gap: 6 }}><span>📝</span> 構成内容</h2>
              <span style={{ fontSize: 11, color: isSaved ? "#10b981" : "#9ca3af", background: isSaved ? "#ecfdf5" : "#f3f4f6", padding: "2px 8px", borderRadius: 4 }}>{isSaved ? "Saved" : "Saving..."}</span>
            </div>

            {selectedPlan === "agency" && (
              <div style={{ padding: 12, background: "#f8fafc", borderRadius: 8, marginBottom: 20, border: "1px dashed #cbd5e1" }}>
                <label className="field-label">提出元 (代理店・会社名)</label>
                <input className="field-input" name="agencyName" value={formData.agencyName} onChange={handleChange} placeholder="例: Creative Agency Inc." />
                <label className="field-label">プロジェクト名</label>
                <input className="field-input" style={{ marginBottom: 0 }} name="projectName" value={formData.projectName} onChange={handleChange} />
              </div>
            )}

            {(selectedPlan === "pro" || selectedPlan === "agency") ? (
              <div style={{ marginBottom: 20 }}>
                <label className="field-label">テーマカラー</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#1f2937"].map((c) => (
                    <div key={c} onClick={() => setFormData((p) => ({ ...p, color: c }))}
                      style={{
                        width: 24, height: 24, borderRadius: "50%", background: c, cursor: "pointer",
                        border: formData.color === c ? "2px solid #0f172a" : "2px solid #fff",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)", transform: formData.color === c ? "scale(1.1)" : "scale(1)"
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: 20, opacity: 0.5, pointerEvents: "none" }}>
                 <label className="field-label" style={{ display: "flex", justifyContent: "space-between" }}>テーマカラー <span>🔒 Pro</span></label>
                 <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#ccc" }} />
              </div>
            )}

            <label className="field-label">クライアント名</label>
            <input className="field-input" name="client" value={formData.client} onChange={handleChange} placeholder="株式会社サンプル 様" />
            
            <label className="field-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              ロゴ画像 {activePlan === "free" && <span style={{fontSize: 10, color: "#ef4444", background: "#fef2f2", padding: "1px 6px", borderRadius: 4}}>🔒 Proで解禁</span>}
            </label>
            <div style={{ position: "relative" }}>
              <input type="file" onChange={handleImageUpload} disabled={activePlan === "free"} style={{ fontSize: 12, marginBottom: 20, width: "100%", opacity: activePlan === "free" ? 0.4 : 1, cursor: activePlan === "free" ? "not-allowed" : "pointer" }} />
              {activePlan === "free" && <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "30px", background: "transparent" }} onClick={() => alert("🔒 画像アップロードはProプラン以上の機能です。")}></div>}
            </div>

            {(activePlan === "pro" || activePlan === "agency") ? (
              <div style={{ marginBottom: 20 }}>
                <label className="field-label">コンセプト (AIテンプレート)</label>
                <select className="field-input" onChange={(e) => setFormData((p) => ({ ...p, concept: CONCEPT_TEMPLATES[e.target.value] }))}>
                  <option value="">テンプレートを選択...</option>
                  <option value="trust">信頼・実績</option>
                  <option value="innovation">先進・革新</option>
                  <option value="friendly">親和・安心</option>
                  <option value="minimal">洗練・ミニマル</option>
                </select>
                <textarea className="field-input" name="concept" value={formData.concept} onChange={handleChange} rows={5} placeholder="ロゴに込めた想いを入力..." />
              </div>
            ) : (
              <div style={{ marginBottom: 20 }}>
                 <label className="field-label">コンセプト</label>
                 <div style={{ background: "#f3f4f6", padding: 10, borderRadius: 8, fontSize: 12, color: "#6b7280", textAlign: "center" }}>フリーテキスト入力のみ<br/>(AIテンプレートは 🔒 Pro)</div>
                 <textarea className="field-input" style={{marginTop:8}} name="concept" value={formData.concept} onChange={handleChange} rows={3} />
              </div>
            )}

            <label className="field-label">制作価格 (税込)</label>
            <div style={{ position: "relative", marginBottom: 20 }}>
              <span style={{ position: "absolute", left: 10, top: 10, color: "#64748b", fontSize: 14 }}>¥</span>
              <input className="field-input" type="number" name="price" value={formData.price} onChange={handleChange} style={{ paddingLeft: 24 }} />
            </div>

            {/* ★ここを handlePrint に変更してガードを追加 */}
            <button onClick={handlePrint} className="print-button">
              PDFを出力する
            </button>
            {activePlan === "free" && <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 8, textAlign: "center" }}>※Freeプランはデモロゴでの出力となります</p>}
          </div>
        </aside>

        <main>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
             <h3 style={{ fontSize: 14, fontWeight: "bold", color: "#64748b", margin: 0 }}>プレビュー</h3>
             <div style={{ fontSize: 12, color: "#94a3b8" }}>A4 / 縦向き</div>
          </div>
          <div style={{ background: "#fff", padding: "60px 80px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)", minHeight: 800, borderRadius: 4 }}>
            <ProposalDocument
              mode="preview"
              displayPlan={selectedPlan}
              entitlementPlan={activePlan}
            />
          </div>
        </main>
      </div>

      <div className="print-only">
        {/* ★印刷時も選択中のプランレイアウトを使用する（ガード機能があるので安全） */}
        <ProposalDocument
          mode="pdf"
          displayPlan={selectedPlan} 
          entitlementPlan={activePlan}
        />
      </div>

      <style>{`
        body { background-color: #f8fafc; }
        .field-label { display: block; font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 6px; }
        .field-input { width: 100%; padding: 10px; border: 1px solid #cbd5e1; border-radius: 8px; margin-bottom: 20px; font-size: 14px; box-sizing: border-box; transition: border-color 0.2s; }
        .field-input:focus { outline: none; border-color: #3b82f6; ring: 2px solid #bfdbfe; }
        .print-button { 
          width: 100%; padding: 14px; background: #0f172a; color: #fff; border: none; border-radius: 10px; 
          font-weight: bold; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justifyContent: center; gap: 8;
        }
        .print-button:hover { background: #1e293b; transform: translateY(-1px); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        .print-button:active { transform: translateY(0); }
        @media (max-width: 900px) { .no-print { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={MainContent} />
      <Route path="/success" element={<SuccessPage onSuccess={(plan) => { setActivePlan(plan); setSelectedPlan(plan); }} />} />
      <Route path="/cancel" element={<CancelPage />} />
    </Routes>
  );
}