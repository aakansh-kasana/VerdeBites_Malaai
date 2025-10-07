"use client"

type Props = { investorView: boolean }
type Item = { risk: string; solution: string }

const items: Item[] = [
  { risk: "High Shipping Costs", solution: "Bundle strategy and 6/12 packs reduce per-unit costs" },
  { risk: "Volatile CAC", solution: "Diversify channels, focus on retention via subscriptions" },
  { risk: "Wholesale Margin Compression", solution: "Negotiate MOQs, optimize pack sizes" },
  { risk: "Inventory Obsolescence", solution: "Lean forecasting with demand signals from D2C" },
]

export function RiskMitigation({ investorView }: Props) {
  return (
    <div>
      <h3 className="text-lg font-semibold">Risk & Mitigation</h3>
      <p className="text-sm text-muted-foreground">Key risks and corresponding strategies</p>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {items.map((it) => (
          <div key={it.risk} className="rounded-md border p-4">
            <div className="font-semibold">{it.risk}</div>
            <div className="text-sm text-muted-foreground">{it.solution}</div>
          </div>
        ))}
      </div>

      {investorView && (
        <div className="mt-3 text-sm text-muted-foreground">Add probability x impact scoring for prioritization.</div>
      )}
    </div>
  )
}
