"use client"

type Props = { investorView: boolean }

const phases = [
  { phase: "Phase 1", title: "D2C Foundations", months: "M1–M4", detail: "Site, CAC tests, bundles & subscriptions" },
  {
    phase: "Phase 2",
    title: "Retail Expansion",
    months: "M5–M8",
    detail: "Key accounts, wholesale ops, fulfillment scale",
  },
  { phase: "Phase 3", title: "Marketplace", months: "M9–M12", detail: "Amazon/Flipkart growth, reviews, ratings moat" },
]

export function Roadmap({ investorView }: Props) {
  return (
    <div>
      <h3 className="text-lg font-semibold">Growth Strategy Roadmap</h3>
      <p className="text-sm text-muted-foreground">12-month rollout timeline</p>

      <ol className="mt-4 grid gap-3 md:grid-cols-3">
        {phases.map((p, i) => (
          <li key={p.phase} className="rounded-md border p-4">
            <div className="text-xs text-muted-foreground">{p.months}</div>
            <div className="mt-1 font-semibold">
              {p.phase}: {p.title}
            </div>
            <div className="text-sm text-muted-foreground">{p.detail}</div>
          </li>
        ))}
      </ol>

      {investorView && (
        <div className="mt-3 text-sm text-muted-foreground">
          Milestones can be mapped to funding tranches and CAC/LTV gates.
        </div>
      )}
    </div>
  )
}
