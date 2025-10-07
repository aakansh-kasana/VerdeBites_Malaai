"use client"

import { useMemo, useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

type Props = { investorView: boolean }

export function PricingSimulator({ investorView }: Props) {
  const [price, setPrice] = useState(99) // ₹
  // Assumptions
  const COGS = 40
  const baseDemand = 1000 // units at baseline price
  const baselinePrice = 99
  const priceElasticity = 1.4 // higher = more sensitive

  const demandCurve = useMemo(() => {
    const points: { price: number; demand: number }[] = []
    for (let p = 79; p <= 179; p += 5) {
      // Simple elasticity model around baseline
      const elasticity = Math.max(0, 1 - Math.pow((p - baselinePrice) / baselinePrice, 2) * priceElasticity)
      points.push({ price: p, demand: Math.round(baseDemand * elasticity) })
    }
    return points
  }, [])

  const selectedDemand = useMemo(() => {
    const elasticity = Math.max(0, 1 - Math.pow((price - baselinePrice) / baselinePrice, 2) * priceElasticity)
    return Math.round(baseDemand * elasticity)
  }, [price])

  const marginPct = useMemo(() => ((price - COGS) / price) * 100, [price])

  return (
    <div>
      <h3 className="text-lg font-semibold">Pricing Simulator</h3>
      <p className="text-sm text-muted-foreground">Explore price between ₹79–₹179 and see demand and margin.</p>

      <div className="mt-4">
        <Label htmlFor="price">Price: ₹{price}</Label>
        <Slider
          id="price"
          min={79}
          max={179}
          step={1}
          value={[price]}
          onValueChange={(v) => setPrice(v[0])}
          className="mt-2"
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="rounded-md border p-3">
          <div className="text-xs text-muted-foreground">Estimated Demand</div>
          <div className="text-2xl font-semibold">
            {selectedDemand.toLocaleString()} <span className="text-sm font-normal">units</span>
          </div>
        </div>
        <div className="rounded-md border p-3">
          <div className="text-xs text-muted-foreground">Gross Margin</div>
          <div className="text-2xl font-semibold">{marginPct.toFixed(1)}%</div>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={demandCurve}>
            <CartesianGrid strokeDasharray="4 4" />
            <XAxis dataKey="price" tickFormatter={(v) => `₹${v}`} />
            <YAxis />
            <Tooltip
              formatter={(v: any, name) => [v, name === "demand" ? "Demand" : name]}
              labelFormatter={(l) => `₹${l}`}
            />
            <Line type="monotone" dataKey="demand" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {investorView && (
        <div className="mt-4 text-sm text-muted-foreground">
          ROI note: improving price realization by 5% at constant demand can expand gross margin by{" "}
          {((5 / price) * 100).toFixed(1)}% pts.
        </div>
      )}
    </div>
  )
}
