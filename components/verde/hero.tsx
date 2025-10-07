"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"

export function Hero({ investorView }: { investorView: boolean }) {
  return (
    <header className="relative">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-snacks.jpg"
          alt="Healthy vegan snacks background"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-background/70" />
      </div>

      <div className="relative container mx-auto px-4 py-14 md:py-20">
        <div className="flex items-center gap-3 mb-4">
          <Image
            src="/images/logos/verde-bites-logo.jpg"
            alt="Verde Bites logo"
            width={36}
            height={36}
            className="rounded-md"
          />
          <span className="text-sm uppercase tracking-wide text-muted-foreground">Verde Bites</span>
        </div>
        <h1 className="text-balance text-3xl md:text-5xl font-semibold leading-tight">
          AI-Driven Pricing and Channel Strategy for Healthy Snack Brands
        </h1>
        <p className="mt-3 md:mt-4 text-muted-foreground max-w-2xl">
          Make confident decisions on pricing, D2C vs. wholesale mix, bundles, and subscriptions—powered by live
          simulations.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <a href="#pricing">Try Simulator</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="#insights">Get Insights</a>
          </Button>
          <Button variant="secondary" asChild>
            <a href="/verde/strategy">Open Strategy Studio</a>
          </Button>
        </div>
      </div>
    </header>
  )
}
