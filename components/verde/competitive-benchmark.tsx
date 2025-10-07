"use client"

import Image from "next/image"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Props = { investorView: boolean }

const brands = [
  { name: "Verde Bites", pricePer100g: 95, logo: "/images/logos/verde-bites-logo.jpg" },
  { name: "Comp-A", pricePer100g: 109, logo: "/images/logos/comp-a.jpg" },
  { name: "Comp-B", pricePer100g: 89, logo: "/images/logos/comp-b.jpg" },
  { name: "Comp-C", pricePer100g: 125, logo: "/images/logos/comp-c.jpg" },
  { name: "Comp-D", pricePer100g: 99, logo: "/images/logos/comp-d.jpg" },
]

export function CompetitiveBenchmark({ investorView }: Props) {
  const maxPrice = Math.max(...brands.map((b) => b.pricePer100g))

  return (
    <div>
      <h3 className="text-lg font-semibold">Competitive Benchmark</h3>
      <p className="text-sm text-muted-foreground">Compare price per 100g vs. selected competitors.</p>

      <div className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Brand</TableHead>
              <TableHead>₹/100g</TableHead>
              <TableHead>Position</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.map((b) => (
              <TableRow key={b.name}>
                <TableCell className="flex items-center gap-2">
                  <Image
                    src={b.logo || "/placeholder.svg"}
                    alt={`${b.name} logo`}
                    width={24}
                    height={24}
                    className="rounded"
                  />
                  <span>{b.name}</span>
                </TableCell>
                <TableCell>₹{b.pricePer100g}</TableCell>
                <TableCell>
                  <div className="relative h-2 w-full rounded bg-muted">
                    <div
                      className="absolute left-0 top-0 h-2 rounded bg-primary transition-all"
                      style={{ width: `${(b.pricePer100g / maxPrice) * 100}%` }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {investorView && (
        <div className="mt-3 text-sm text-muted-foreground">
          Pricing position suggests room to premiumize SKUs near ₹110/100g with value-led bundles.
        </div>
      )}
    </div>
  )
}
