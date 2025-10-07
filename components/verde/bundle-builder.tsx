"use client"

import { useMemo, useState } from "react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

type Props = { investorView: boolean }

export function BundleBuilder({ investorView }: Props) {
  const [pack, setPack] = useState(3) // items per pack
  const [subscribe, setSubscribe] = useState(true)

  // Assumptions
  const unitPrice = 99
  const cogs = 40
  const fulfillBase = 20 // per order
  const fulfillPerUnit = 5

  const packPrice = unitPrice * pack * (subscribe ? 0.9 : 1) // 10% off for subscription
  const fulfillCost = fulfillBase + fulfillPerUnit * pack * (pack >= 6 ? 0.9 : 1) // 10% efficiency for 6+
  const cogsTotal = cogs * pack
  const grossMargin = ((packPrice - cogsTotal - fulfillCost) / packPrice) * 100
  const retentionLift = subscribe ? 18 : 0 // %
  const summary = useMemo(
    () => ({
      packPrice,
      fulfillCost,
      cogsTotal,
      grossMargin,
      retentionLift,
    }),
    [packPrice, fulfillCost, cogsTotal, grossMargin, retentionLift],
  )

  return (
    <div>
      <h3 className="text-lg font-semibold">Bundle & Subscription Builder</h3>
      <p className="text-sm text-muted-foreground">Create bundles and subscriptions; see cost and retention impact.</p>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Pack Size</Label>
          <Select value={String(pack)} onValueChange={(v) => setPack(Number.parseInt(v))}>
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3-pack</SelectItem>
              <SelectItem value="6">6-pack</SelectItem>
              <SelectItem value="12">12-pack</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between rounded-md border p-3">
          <div>
            <Label htmlFor="sub">Subscription</Label>
            <div className="text-xs text-muted-foreground">10% off, boosted retention</div>
          </div>
          <Switch id="sub" checked={subscribe} onCheckedChange={setSubscribe} />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPI label="Bundle Price" value={`₹${summary.packPrice.toFixed(0)}`} />
        <KPI label="Fulfillment Cost" value={`₹${summary.fulfillCost.toFixed(0)}`} />
        <KPI label="Gross Margin" value={`${summary.grossMargin.toFixed(1)}%`} />
        <KPI label="Retention Impact" value={`${summary.retentionLift}%`} />
      </div>

      {investorView && (
        <div className="mt-3 text-sm text-muted-foreground">
          Note: larger packs reduce per-unit fulfillment costs and improve LTV/CAC via retention.
        </div>
      )}
    </div>
  )
}

function KPI({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  )
}
