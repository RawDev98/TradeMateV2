"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, Info } from "lucide-react"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function RoofEstimator() {
  const [length, setLength] = useState<string>("")
  const [width, setWidth] = useState<string>("")
  const [pitch, setPitch] = useState<string>("")
  const [overhang, setOverhang] = useState<string>("0.3")
  const [results, setResults] = useState<{
    roofArea: number
    tilesNeeded: number
    battensNeeded: number
    fasciaMeterNeeded: number
    gutterMeterNeeded: number
    ridgeCappingNeeded: number
  } | null>(null)
  const [activeTab, setActiveTab] = useState<string>("calculator")

  // Constants for calculations
  const TILE_SIZE = 0.19 * 0.33 // m² per tile
  const BATTEN_SPACING = 0.6 // meters
  const WASTE_FACTOR = 1.1 // 10% waste

  const calculateRoofMaterials = () => {
    // Convert inputs to numbers
    const lengthNum = Number.parseFloat(length)
    const widthNum = Number.parseFloat(width)
    const pitchNum = Number.parseFloat(pitch)
    const overhangNum = Number.parseFloat(overhang)

    // Validate inputs
    if (isNaN(lengthNum) || isNaN(widthNum) || isNaN(pitchNum)) {
      return
    }

    // Calculate roof area with pitch factor
    const pitchFactor = 1 + pitchNum / 100
    const baseArea = lengthNum * widthNum
    const roofArea = baseArea * pitchFactor

    // Calculate materials needed
    const tilesNeeded = Math.ceil((roofArea / TILE_SIZE) * WASTE_FACTOR)
    const battensNeeded = Math.ceil((lengthNum / BATTEN_SPACING) * widthNum * WASTE_FACTOR)

    // Calculate perimeter materials
    const perimeter = 2 * (lengthNum + widthNum)
    const fasciaMeterNeeded = perimeter
    const gutterMeterNeeded = perimeter

    // Ridge capping (typically along the length of the roof)
    const ridgeCappingNeeded = lengthNum

    setResults({
      roofArea: Number.parseFloat(roofArea.toFixed(2)),
      tilesNeeded,
      battensNeeded,
      fasciaMeterNeeded: Number.parseFloat(fasciaMeterNeeded.toFixed(2)),
      gutterMeterNeeded: Number.parseFloat(gutterMeterNeeded.toFixed(2)),
      ridgeCappingNeeded: Number.parseFloat(ridgeCappingNeeded.toFixed(2)),
    })

    setActiveTab("results")
  }

  const resetCalculator = () => {
    setLength("")
    setWidth("")
    setPitch("")
    setOverhang("0.3")
    setResults(null)
    setActiveTab("calculator")
  }

  return (
    <Card className="glass-card max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Roof Estimator</CardTitle>
        <CardDescription>Calculate materials needed for your roofing project</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calculator">
              <Calculator className="h-4 w-4 mr-2" />
              Calculator
            </TabsTrigger>
            <TabsTrigger value="results" disabled={!results}>
              Results
            </TabsTrigger>
            <TabsTrigger value="info">
              <Info className="h-4 w-4 mr-2" />
              Info
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="length">Roof Length (m)</Label>
                <Input
                  id="length"
                  type="number"
                  placeholder="e.g., 10"
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="bg-white/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="width">Roof Width (m)</Label>
                <Input
                  id="width"
                  type="number"
                  placeholder="e.g., 8"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="bg-white/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pitch">Roof Pitch (degrees)</Label>
                <Input
                  id="pitch"
                  type="number"
                  placeholder="e.g., 22.5"
                  value={pitch}
                  onChange={(e) => setPitch(e.target.value)}
                  className="bg-white/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="overhang">Eave Overhang (m)</Label>
                <Input
                  id="overhang"
                  type="number"
                  placeholder="e.g., 0.3"
                  value={overhang}
                  onChange={(e) => setOverhang(e.target.value)}
                  className="bg-white/20"
                />
              </div>
            </div>

            <Button onClick={calculateRoofMaterials} className="w-full mt-4" disabled={!length || !width || !pitch}>
              Calculate Materials
            </Button>
          </TabsContent>

          <TabsContent value="results" className="space-y-4 mt-4">
            {results && (
              <>
                <Alert>
                  <AlertTitle>Calculation Complete</AlertTitle>
                  <AlertDescription>
                    Based on a {length}m × {width}m roof with a {pitch}° pitch
                  </AlertDescription>
                </Alert>

                <Table>
                  <TableCaption>Estimated materials needed for your roof project</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Total Roof Area</TableCell>
                      <TableCell className="text-right">{results.roofArea} m²</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Roof Tiles</TableCell>
                      <TableCell className="text-right">{results.tilesNeeded} tiles</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Roof Battens</TableCell>
                      <TableCell className="text-right">{results.battensNeeded} pieces</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Fascia</TableCell>
                      <TableCell className="text-right">{results.fasciaMeterNeeded} meters</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Guttering</TableCell>
                      <TableCell className="text-right">{results.gutterMeterNeeded} meters</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Ridge Capping</TableCell>
                      <TableCell className="text-right">{results.ridgeCappingNeeded} meters</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <div className="flex justify-between mt-4">
                  <Button variant="outline" onClick={resetCalculator}>
                    Reset Calculator
                  </Button>
                  <Button>Save Estimate</Button>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="info" className="space-y-4 mt-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">How to Use This Calculator</h3>
              <p>Enter the dimensions of your roof to estimate the materials needed for your project:</p>

              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Length:</strong> The longest dimension of your roof (in meters)
                </li>
                <li>
                  <strong>Width:</strong> The shortest dimension of your roof (in meters)
                </li>
                <li>
                  <strong>Pitch:</strong> The angle of your roof in degrees (typical pitches range from 15° to 45°)
                </li>
                <li>
                  <strong>Overhang:</strong> The distance the roof extends beyond the wall (default is 0.3m)
                </li>
              </ul>

              <p className="text-sm text-muted-foreground mt-4">
                Note: This calculator provides estimates only. Always consult with a professional for accurate
                measurements and material requirements for your specific project.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

