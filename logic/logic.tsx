"use client"
import React, { useMemo, useState } from "react";

// Single-file React app (tailwind ready) for Verde Bites strategy tools
// Usage: place in a React app (Create React App / Vite / Next.js page) with Tailwind CSS enabled.

type WTPPoint = { price: number; pct: number }
type Channel = "D2C" | "Wholesale"

type UnitContribution = { contrib: number; contribPct: number; wsp?: number }

export function StrategyStudio() {
  // WTP curve reference points
  const wtpPoints = useMemo<WTPPoint[]>(() => ([
    { price: 79, pct: 0.85 },
    { price: 99, pct: 0.60 },
    { price: 139, pct: 0.35 },
    { price: 179, pct: 0.15 },
  ]), []);

  // Base per-unit economics
  const baseCOGS = useMemo(() => ({ raw: 22, copack: 8, pack: 5, total: 35 }), []);

  // Channel costs
  const channelCosts = useMemo(() => ({
    d2cFulfill: 45,
    inbound: 1,
    secondary: 4,
    b2bFreight: 8,
    d2cPaymentPct: 0.03,
    wholesaleAllowancesPct: 0.04,
    retailerMarginPct: 0.15,
  }), []);

  // app state
  const [msrp, setMsrp] = useState(139);
  const [channelMixD2C, setChannelMixD2C] = useState(50); // percent
  const [targetBuyers, setTargetBuyers] = useState(50000);
  const [fixedOpCostM, setFixedOpCostM] = useState(250000);

  // Bundles
  const [bundleQty, setBundleQty] = useState(3);
  const [bundlePrice, setBundlePrice] = useState(349);
  const [subscribeDiscountPct, setSubscribeDiscountPct] = useState(10);

  // simple competitive set
  const competitors = useMemo(() => ([
    { name: 'Comp-A', per100: 84.3, note: 'Mass low-cost' },
    { name: 'Comp-B', per100: 89, note: 'Mass premium' },
    { name: 'Comp-C', per100: 139, note: 'Specialty' },
    { name: 'Comp-D', per100: 176.1, note: 'Premium' },
  ]), []);

  // helpers
  function interpolateWTP(p: number): number {
    // linear interpolation on the given wtpPoints to return proportion of target buyers willing to pay >= p
    const pts = wtpPoints.slice().sort((a, b) => a.price - b.price);
    if (p <= pts[0].price) return pts[0].pct;
    if (p >= pts[pts.length-1].price) return pts[pts.length-1].pct;
    for (let i=0;i<pts.length-1;i++){
      const a = pts[i], b = pts[i+1];
      if (p >= a.price && p <= b.price){
        const ratio = (p - a.price) / (b.price - a.price);
        return a.pct + ratio * (b.pct - a.pct);
      }
    }
    return 0;
  }

  function calcWholesaleInvoice(msrpLocal: number): number {
    // WSP (wholesale invoice price) typically = MSRP * (1 - retailerMargin)
    // Then retailer margin is applied by retailer; but we must also account for wholesale allowances (4%) on invoice
    const retailerMargin = channelCosts.retailerMarginPct;
    const wsp = +(msrpLocal * (1 - retailerMargin)).toFixed(2);
    return wsp;
  }

  function calcUnitContribution(msrpLocal: number, channel: Channel): UnitContribution {
    // channel: 'D2C' or 'Wholesale'
    // For D2C: revenue = msrpLocal, payment processing = 3% of sale, shipping = 45, inbound+secondary allocated etc.
    if (channel === 'D2C'){
      const revenue = msrpLocal;
      const paymentFee = revenue * channelCosts.d2cPaymentPct;
      const shipping = channelCosts.d2cFulfill;
      const cogs = baseCOGS.total + channelCosts.inbound + channelCosts.secondary; // include inbound & secondary
      const contrib = +(revenue - paymentFee - shipping - cogs).toFixed(2);
      const contribPct = +(100 * contrib / revenue).toFixed(2);
      return { contrib, contribPct };
    } else {
      // Wholesale: sale via WSP, allowances 4% of invoice reduce revenue, B2B freight 8 per bag, retailer margin already removed from wsp calculation
      const wsp = calcWholesaleInvoice(msrpLocal);
      const allowances = wsp * channelCosts.wholesaleAllowancesPct;
      const freight = channelCosts.b2bFreight;
      const cogs = baseCOGS.total + channelCosts.inbound + channelCosts.secondary;
      const revenue = wsp - allowances;
      const contrib = +(revenue - freight - cogs).toFixed(2);
      const contribPct = +(100 * contrib / revenue).toFixed(2);
      return { contrib, contribPct, wsp: +(wsp.toFixed(2)) };
    }
  }

  // demand and revenue
  const willingPct = interpolateWTP(msrp);
  const estimatedVolumeYear = Math.round(targetBuyers * willingPct);
  const revenueYear = +(estimatedVolumeYear * msrp).toFixed(2);

  // channel volumes based on mix
  const d2cUnits = Math.round(estimatedVolumeYear * (channelMixD2C / 100));
  const wholesaleUnits = estimatedVolumeYear - d2cUnits;

  const d2cUnit = calcUnitContribution(msrp, 'D2C');
  const wholesaleUnit = calcUnitContribution(msrp, 'Wholesale');

  const blendedContribPerUnit = +(((d2cUnit.contrib * d2cUnits + wholesaleUnit.contrib * wholesaleUnits) / Math.max(1, estimatedVolumeYear)).toFixed(2));
  const blendedContribPct = +(100 * blendedContribPerUnit / msrp).toFixed(2);

  // break-even units per month
  const breakEvenUnitsPerMonth = Math.ceil((fixedOpCostM) / Math.max(0.0001, blendedContribPerUnit));
  const breakEvenYear = breakEvenUnitsPerMonth * 12;

  // bundle economics
  function bundleUnitShippingPerBag(qty: number, perOrderShipping = 45): number {
    // assume per-order shipping is still 45, but shared across qty
    return perOrderShipping/qty;
  }
  const bundleShippingPerBag = +(bundleUnitShippingPerBag(bundleQty).toFixed(2));
  const bundleUnitRevenue = +(bundlePrice / bundleQty).toFixed(2);
  const bundlePaymentFee = +(bundleUnitRevenue * channelCosts.d2cPaymentPct).toFixed(2);
  const bundleCOGSperBag = baseCOGS.total + channelCosts.inbound + channelCosts.secondary;
  const bundleContribPerBag = +(bundleUnitRevenue - bundlePaymentFee - bundleShippingPerBag - bundleCOGSperBag).toFixed(2);

  // subscription economics (assume monthly subscription ships once per month with bulk packing saving 20%)
  const subscriptionPricePerBag = +(msrp * (1 - subscribeDiscountPct/100)).toFixed(2);
  const subscriptionShippingPerBag = +(channelCosts.d2cFulfill * 0.8).toFixed(2); // 20% saving
  const subscriptionPaymentFee = +(subscriptionPricePerBag * channelCosts.d2cPaymentPct).toFixed(2);
  const subscriptionContribBag = +(subscriptionPricePerBag - subscriptionPaymentFee - subscriptionShippingPerBag - baseCOGS.total - channelCosts.inbound - channelCosts.secondary).toFixed(2);

  // helpers for charts (simple SVG bars)
  const pctToPx = (pct: number, maxPx = 300): number => Math.max(0, Math.min(maxPx, (pct/1)*maxPx));

  // AI Assistant (rule-based quick recommendations)
  function aiRecommendation(){
    const recs = [];
    // Pricing objective
    if (msrp <= 99) recs.push('Penetration/Share-first: Price is aggressive and will capture a large cohort (60% WTP at ₹99).');
    else if (msrp > 99 && msrp <=139) recs.push('Hybrid: Balances scale and margin; consider bundle promotions to lower effective shipping.');
    else recs.push('Sustainable margin/Profitability: Premium positioning; expect lower volumes but higher margin per bag.');

    // Channel advice
    if (d2cUnit.contrib < 0) recs.push('D2C single-bag economics are negative. Use multi-packs or subscription to reduce per-bag fulfillment cost.');
    if (wholesaleUnit.contrib > 0) recs.push('Wholesale is currently profitable per-unit; use retail presence to build brand and scale distribution.');

    // SKU advice
    if (bundleContribPerBag > d2cUnit.contrib) recs.push('Multi-pack (x3) yields better per-bag contribution — promote as preferred D2C SKU.');
    if (subscriptionContribBag > d2cUnit.contrib) recs.push('Offer a subscription (10% discount shown) to increase LTV and lower churn; subscription gives better per-bag margins due to shipping optimization.');

    // Break-even realism
    if (breakEvenUnitsPerMonth > 50000) recs.push('Break-even requires very high scale at current pricing/mix — revisit channel mix and pricing or reduce fixed costs.');

    return recs;
  }

  const recommendations = aiRecommendation();

  // Render UI
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold">Verde Bites Strategy Studio</h1>
            <p className="text-sm text-gray-600">Interactive pricing, channel, and rollout tools —built for the Verde Bites case.</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Target buyers:</div>
            <div className="font-medium">{targetBuyers.toLocaleString()}</div>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Pricing & Demand */}
          <section className="col-span-1 lg:col-span-2 bg-white p-4 rounded-lg shadow">
            <h2 className="font-bold text-lg mb-2">Pricing Simulator & Demand</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">MSRP (₹ per 113g bag)</label>
                <input type="range" min="79" max="179" step="1" value={msrp} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setMsrp(Number(e.target.value))} className="w-full" />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>₹79</span>
                  <span>₹99</span>
                  <span>₹139</span>
                  <span>₹179</span>
                </div>
                <div className="mt-3 p-3 bg-gray-50 rounded">
                  <div className="text-sm">Selected MSRP: <span className="font-medium">₹{msrp}</span></div>
                  <div className="text-sm">Estimated % of buyers willing to pay: <span className="font-medium">{(willingPct*100).toFixed(1)}%</span></div>
                  <div className="text-sm">Estimated Year-1 Volume: <span className="font-medium">{estimatedVolumeYear.toLocaleString()}</span></div>
                  <div className="text-sm">Year-1 Revenue (rough): <span className="font-medium">₹{revenueYear.toLocaleString()}</span></div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Demand Curve</h3>
                <div className="mt-2 h-40 w-full p-2 bg-white rounded border">
                  {/* Simple SVG chart */}
                  <svg viewBox="0 0 300 120" className="w-full h-full">
                    <polyline
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      points={wtpPoints.map((pt,i)=>`${(i*(300/(wtpPoints.length-1))).toFixed(2)},${(120 - pt.pct*100).toFixed(2)}`).join(' ')}
                    />
                    {wtpPoints.map((pt,i)=>{
                      const x = i*(300/(wtpPoints.length-1));
                      const y = 120 - pt.pct*100;
                      return <g key={i}><circle cx={x} cy={y} r={3} fill="#10b981" /><text x={x} y={y-6} fontSize="8" textAnchor="middle">₹{pt.price}</text></g>
                    })}
                    {/* marker for selected MSRP */}
                    <line x1={( (msrp - 79) / (179-79) * 300).toFixed(2)} x2={( (msrp - 79) / (179-79) * 300).toFixed(2)} y1={0} y2={120} stroke="#f59e0b" strokeDasharray="4" />
                    <text x={((msrp - 79)/(179-79)*300).toFixed(2)} y={12} fontSize="9" textAnchor="middle" fill="#f59e0b">₹{msrp}</text>
                  </svg>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-xs text-gray-500">D2C Unit Contribution</div>
                <div className="text-xl font-medium">₹{d2cUnit.contrib}</div>
                <div className="text-xs text-gray-500">{d2cUnit.contribPct}% of price</div>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-xs text-gray-500">Wholesale Unit Contribution (WSP: ₹{wholesaleUnit.wsp})</div>
                <div className="text-xl font-medium">₹{wholesaleUnit.contrib}</div>
                <div className="text-xs text-gray-500">{wholesaleUnit.contribPct}% of wholesale revenue</div>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-xs text-gray-500">Blended Contribution</div>
                <div className="text-xl font-medium">₹{blendedContribPerUnit}</div>
                <div className="text-xs text-gray-500">{blendedContribPct}% of MSRP</div>
              </div>
            </div>

          </section>

          {/* Right column: Channel Mix, Bundle Builder, Break-even, AI Assistant */}
          <aside className="col-span-1 flex flex-col gap-6">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold">Channel Mix</h3>
              <div className="mt-2 text-sm text-gray-600">D2C vs Wholesale split (Year-1)</div>
              <input type="range" min="0" max="100" value={channelMixD2C} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setChannelMixD2C(Number(e.target.value))} className="w-full mt-2" />
              <div className="flex justify-between text-xs text-gray-600">
                <div>D2C: <span className="font-medium">{channelMixD2C}%</span></div>
                <div>Wholesale: <span className="font-medium">{100 - channelMixD2C}%</span></div>
              </div>
              <div className="mt-3 text-sm">
                <div>D2C units: <strong>{d2cUnits.toLocaleString()}</strong></div>
                <div>Wholesale units: <strong>{wholesaleUnits.toLocaleString()}</strong></div>
              </div>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold">D2C Bundle Builder</h3>
              <div className="text-sm text-gray-600">Create a multi-pack to reduce per-bag fulfillment cost.</div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <label className="text-xs">Quantity (bags per pack)</label>
                <select value={bundleQty} onChange={(e: React.ChangeEvent<HTMLSelectElement>)=>setBundleQty(Number(e.target.value))} className="p-2 border rounded">
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={6}>6</option>
                </select>
                <label className="text-xs">Bundle Price (₹ total)</label>
                <input type="number" value={bundlePrice} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setBundlePrice(Number(e.target.value))} className="p-2 border rounded" />
              </div>
              <div className="mt-3 text-sm bg-gray-50 p-2 rounded">
                <div>Effective price per bag: <strong>₹{(bundlePrice/bundleQty).toFixed(2)}</strong></div>
                <div>Shipping per bag (shared): <strong>₹{bundleShippingPerBag}</strong></div>
                <div>Contribution per bag (bundle): <strong>₹{bundleContribPerBag}</strong></div>
              </div>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold">Subscription Option</h3>
              <div className="text-sm text-gray-600">Discount and shipping gains for recurring orders.</div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <label className="text-xs">Sub discount %</label>
                <input type="range" min="0" max="25" value={subscribeDiscountPct} onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setSubscribeDiscountPct(Number(e.target.value))} />
                <div className="text-sm">Per-bag price (sub): ₹{subscriptionPricePerBag}</div>
                <div className="text-sm">Per-bag contrib (sub): ₹{subscriptionContribBag}</div>
              </div>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold">Break-Even</h3>
              <div className="text-sm text-gray-600">Fixed monthly cost: ₹{fixedOpCostM.toLocaleString()}</div>
              <div className="mt-2 text-md font-medium">Break-even units per month: {breakEvenUnitsPerMonth.toLocaleString()}</div>
              <div className="text-xs text-gray-500">(At current MSRP & channel mix)</div>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold">AI Assistant — Quick Recommendations</h3>
              <ul className="list-disc ml-4 mt-2 text-sm text-gray-700">
                {recommendations.map((r,i)=>(<li key={i}>{r}</li>))}
              </ul>
            </div>
          </aside>
        </main>

        {/* Lower section: Competitive, Personas, Growth Plan, Risk Map */}
        <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Competitive Benchmark</h3>
            <table className="w-full text-sm mt-3">
              <thead>
                <tr className="text-left text-xs text-gray-500"><th>Competitor</th><th>₹/100g</th><th>Note</th></tr>
              </thead>
              <tbody>
                {competitors.map((c,idx)=>(
                  <tr key={idx} className="border-t"><td className="py-2">{c.name}</td><td>{c.per100}</td><td className="text-xs text-gray-600">{c.note}</td></tr>
                ))}
                <tr className="border-t bg-gray-50"><td className="py-2 font-medium">Verde Bites</td><td className="font-medium">{((msrp/113)*100).toFixed(2)}</td><td className="text-xs">High-protein, vegan, gluten-free</td></tr>
              </tbody>
            </table>
          </div>

          <div className="col-span-1 bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Consumer Persona Explorer</h3>
            <div className="mt-2">
              <PersonaCard name="Busy Professional" priceSensitivity="Medium" preferredChannel="D2C / Subscriptions" />
              <PersonaCard name="Fitness-Focused Millennial" priceSensitivity="Low" preferredChannel="Specialty stores / Online" />
              <PersonaCard name="Eco-conscious Shopper" priceSensitivity="Medium" preferredChannel="Specialty stores" />
            </div>
          </div>

          <div className="col-span-1 bg-white p-4 rounded shadow">
            <h3 className="font-semibold">12-month Rollout Snapshot</h3>
            <ol className="list-decimal ml-5 text-sm mt-2 space-y-1">
              <li><strong>Months 1-2:</strong> Soft D2C launch, influencer sampling, collect feedback, A/B price tests.</li>
              <li><strong>Months 3-4:</strong> Introduce bundles & subscription; ramp digital ads; target metros.</li>
              <li><strong>Months 5-7:</strong> Secure listings in 50 specialty retailers; begin wholesale shipments.</li>
              <li><strong>Months 8-10:</strong> Expand regionally; optimize manufacturing & reduce COGS through scale.</li>
              <li><strong>Months 11-12:</strong> National roll-out with larger retail partners and distribution networks.</li>
            </ol>
          </div>
        </section>

        <section className="mt-6 bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Risk & Mitigation</h3>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
            <RiskCard title="High D2C Fulfillment Cost" mitigation="Bundle & subscription. Use local micro-fulfillment or pick-up points to lower last-mile costs." />
            <RiskCard title="Price Sensitivity" mitigation="Tiered SKUs: single premium, multi-pack value, and subscription discounts." />
            <RiskCard title="Retailer Listing Challenges" mitigation="Trade marketing allowance, localized demos, and sampling to retailers." />
          </div>
        </section>

        <footer className="mt-6 text-center text-sm text-gray-500">This interactive studio is a lightweight decision support prototype — plug into your product analytics to replace assumptions with actual data.</footer>
      </div>
    </div>
  );
}

function PersonaCard({name, priceSensitivity, preferredChannel}){
  return (
    <div className="border p-2 rounded mt-2">
      <div className="font-medium">{name}</div>
      <div className="text-xs text-gray-600">Price sensitivity: {priceSensitivity}</div>
      <div className="text-xs text-gray-600">Preferred channel: {preferredChannel}</div>
    </div>
  );
}

function RiskCard({title, mitigation}){
  return (
    <div className="p-3 border rounded">
      <div className="font-semibold">{title}</div>
      <div className="text-xs text-gray-600 mt-1">{mitigation}</div>
    </div>
  );
}

export default StrategyStudio;
