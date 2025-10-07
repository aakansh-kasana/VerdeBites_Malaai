"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

type Props = { investorView: boolean }

export function AIInsights({ investorView }: Props) {
  const [output, setOutput] = useState<string | null>(null)

  function runLocalAnalysis() {
    // Simple heuristic demo (no external AI call)
    const suggestions = [
      "Optimal price band appears near ₹99–₹109 with strong margin realization.",
      "Shift 10–15% mix from wholesale to D2C to raise blended margin by ~2–3 pts.",
      "Introduce 6-pack subscription with 10% off; target 18% retention lift.",
      "Benchmark indicates headroom to premiumize flagship SKU by ₹10–₹15.",
    ]
    setOutput(suggestions.join(" "))
  }

  return (
    <div className="flex h-full flex-col">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">AI Insights</h3>
        <p className="text-sm text-muted-foreground">Recommendations based on your current inputs.</p>
      </div>

      <div className="flex-1 p-4">
        <div className="rounded-md border p-4 min-h-32 bg-card">
          <p className="text-sm text-muted-foreground">
            {output ?? "Click “Get Insights” to generate recommendations."}
          </p>
        </div>
      </div>

      <div className="p-4 border-t flex items-center justify-between">
        <Button onClick={runLocalAnalysis} className="bg-primary text-primary-foreground hover:bg-primary/90">
          Get Insights
        </Button>
        {investorView && (
          <div className="text-xs text-muted-foreground">
            Investor View: display ROI, payback, LTV/CAC once inputs are connected.
          </div>
        )}
      </div>
    </div>
  )
}
