"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

import { Hero } from "./hero"
import { PricingSimulator } from "./pricing-simulator"
import { ChannelMixOptimizer } from "./channel-mix-optimizer"
import { BundleBuilder } from "./bundle-builder"
import { CompetitiveBenchmark } from "./competitive-benchmark"
import { AIInsights } from "./ai-insights"
import { Roadmap } from "./roadmap"
import { RiskMitigation } from "./risk-mitigation"
import { SiteFooter } from "./site-footer"

export function Dashboard() {
  const [investorView, setInvestorView] = useState(false)

  return (
    <main className="min-h-dvh">
      <Hero investorView={investorView} />

      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-pretty text-2xl font-semibold tracking-tight">Strategy Dashboard</h2>
          <div className="flex items-center gap-3">
            <Label htmlFor="investor-view" className="text-sm">
              Investor View
            </Label>
            <Switch id="investor-view" checked={investorView} onCheckedChange={setInvestorView} />
          </div>
        </div>

        <div className={cn("grid gap-6", "md:grid-cols-2", "xl:grid-cols-3")}>
          <Card className="p-4 md:p-6" id="pricing">
            <PricingSimulator investorView={investorView} />
          </Card>
          <Card className="p-4 md:p-6">
            <ChannelMixOptimizer investorView={investorView} />
          </Card>
          <Card className="p-4 md:p-6">
            <BundleBuilder investorView={investorView} />
          </Card>
          <Card className="p-4 md:p-6" id="benchmark">
            <CompetitiveBenchmark investorView={investorView} />
          </Card>
          <Card className="p-0 md:p-0 overflow-hidden" id="insights">
            <AIInsights investorView={investorView} />
          </Card>
          <Card className="p-4 md:p-6">
            <Roadmap investorView={investorView} />
          </Card>
          <Card className="p-4 md:p-6 md:col-span-2 xl:col-span-3">
            <RiskMitigation investorView={investorView} />
          </Card>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
