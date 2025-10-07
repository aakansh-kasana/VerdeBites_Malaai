"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"

type Props = { investorView: boolean }

export function ChannelMixOptimizer({ investorView }: Props) {
  // D2C vs Wholesale ratio
  const [d2c, setD2c] = useState(60) // %
  const wholesale = 100 - d2c

  // Assumptions
  const priceD2C = 99
  const priceWholesale = 69
  const cogs = 40
  const shipD2C = 15
  const shipWholesale = 5
  const fixedMonthly = 100_000

  const marginD2C = ((priceD2C - cogs - shipD2C) / priceD2C) * 100
  const marginWholesale = ((priceWholesale - cogs - shipWholesale) / priceWholesale) * 100

  const blendedMargin = (marginD2C * d2c + marginWholesale * wholesale) / 100

  const contributionPerUnit =
    (d2c / 100) * (priceD2C - cogs - shipD2C) + (wholesale / 100) * (priceWholesale - cogs - shipWholesale)

  const breakEvenUnits = contributionPerUnit > 0 ? Math.ceil(fixedMonthly / contributionPerUnit) : 0

  const data = [
    { name: "D2C", value: d2c, color: "var(--chart-1)" },
    { name: "Wholesale", value: wholesale, color: "var(--chart-2)" },
  ]

  return (
    <div>
      <h3 className="text-lg font-semibold">Channel Mix Optimizer</h3>
      <p className="text-sm text-muted-foreground">Balance D2C and Wholesale to maximize blended margin.</p>

      <div className="mt-4">
        <Label htmlFor="mix">
          D2C: {d2c}% • Wholesale: {wholesale}%
        </Label>
        <Slider
          id="mix"
          min={0}
          max={100}
          step={1}
          value={[d2c]}
          onValueChange={(v) => setD2c(v[0])}
          className="mt-2"
        />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="rounded-md border p-3">
          <div className="text-xs text-muted-foreground">Blended Margin</div>
          <div className="text-2xl font-semibold">{blendedMargin.toFixed(1)}%</div>
        </div>
        <div className="rounded-md border p-3">
          <div className="text-xs text-muted-foreground">Break-even Units / mo</div>
          <div className="text-2xl font-semibold">{breakEvenUnits.toLocaleString()}</div>
        </div>
      </div>

      <div className="mt-4 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
              {data.map((entry, i) => (
                <Cell key={`cell-${i}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {investorView && (
        <div className="text-sm text-muted-foreground">
          Contribution/unit: ₹{contributionPerUnit.toFixed(2)} • Fixed: ₹{fixedMonthly.toLocaleString()}
        </div>
      )}
    </div>
  )
}
