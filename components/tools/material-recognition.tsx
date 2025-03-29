"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Upload, RefreshCw, Check } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"

type MaterialResult = {
  material: string
  confidence: number
  description: string
}

// Mock data for demonstration purposes
const MOCK_MATERIALS: Record<string, MaterialResult> = {
  timber: {
    material: "Pine Timber",
    confidence: 92,
    description:
      "Softwood commonly used in construction framing, furniture, and decorative elements. Typically light colored with visible grain patterns.",
  },
  brick: {
    material: "Clay Brick",
    confidence: 88,
    description:
      "Traditional building material made from fired clay. Durable, fire-resistant, and provides good thermal mass for energy efficiency.",
  },
  concrete: {
    material: "Concrete",
    confidence: 95,
    description:
      "Composite material made from cement, aggregate (rocks and sand), and water. High compressive strength, used for foundations, slabs, and structural elements.",
  },
  steel: {
    material: "Structural Steel",
    confidence: 87,
    description:
      "Alloy of iron and carbon, used for structural framing, reinforcement, and connections. High tensile strength and durability.",
  },
  gypsum: {
    material: "Gypsum Board",
    confidence: 91,
    description:
      "Also known as drywall or plasterboard. Used for interior wall and ceiling finishes. Fire-resistant and provides good sound insulation.",
  },
}

export function MaterialRecognition() {
  const [image, setImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [result, setResult] = useState<MaterialResult | null>(null)
  const [activeTab, setActiveTab] = useState<string>("camera")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target?.result as string)
        setResult(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCameraCapture = () => {
    // In a real app, this would access the device camera
    // For demo purposes, we'll just use a mock image
    setImage("/placeholder.svg?height=400&width=400")
    setResult(null)
  }

  const analyzeImage = () => {
    if (!image) return

    setIsAnalyzing(true)
    setProgress(0)

    // Simulate analysis progress  return

    setIsAnalyzing(true)
    setProgress(0)

    // Simulate analysis progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsAnalyzing(false)

          // Mock result - in a real app, this would come from an AI service
          const materials = Object.values(MOCK_MATERIALS)
          const randomMaterial = materials[Math.floor(Math.random() * materials.length)]
          setResult(randomMaterial)

          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const resetAnalysis = () => {
    setImage(null)
    setResult(null)
    setProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card className="glass-card max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Material Recognition</CardTitle>
        <CardDescription>Identify building materials using AI technology</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="camera">
              <Camera className="h-4 w-4 mr-2" />
              Camera
            </TabsTrigger>
            <TabsTrigger value="upload">
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="camera" className="space-y-4 mt-4">
            <div className="flex flex-col items-center justify-center">
              {!image ? (
                <div className="border border-dashed rounded-lg p-12 flex flex-col items-center justify-center">
                  <Camera className="h-12 w-12 mb-4 text-muted-foreground" />
                  <p className="text-center text-muted-foreground mb-4">
                    Take a photo of the material you want to identify
                  </p>
                  <Button onClick={handleCameraCapture}>
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photo
                  </Button>
                </div>
              ) : (
                <div className="w-full">
                  <div className="relative aspect-square max-w-md mx-auto mb-4 overflow-hidden rounded-lg">
                    <Image src={image || "/placeholder.svg"} alt="Captured material" fill className="object-cover" />
                  </div>

                  {isAnalyzing ? (
                    <div className="space-y-4">
                      <p className="text-center">Analyzing material...</p>
                      <Progress value={progress} />
                    </div>
                  ) : result ? (
                    <div className="space-y-4">
                      <Alert>
                        <Check className="h-4 w-4" />
                        <AlertTitle>Material Identified</AlertTitle>
                        <AlertDescription>
                          We've identified this material as <strong>{result.material}</strong> with {result.confidence}%
                          confidence.
                        </AlertDescription>
                      </Alert>

                      <div className="p-4 bg-white/20 rounded-lg">
                        <h3 className="font-medium mb-2">Material Information:</h3>
                        <p>{result.description}</p>
                      </div>

                      <div className="flex justify-between">
                        <Button variant="outline" onClick={resetAnalysis}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          New Scan
                        </Button>
                        <Button>Save to Library</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={resetAnalysis}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Retake
                      </Button>
                      <Button onClick={analyzeImage}>Analyze Material</Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4 mt-4">
            <div className="flex flex-col items-center justify-center">
              {!image ? (
                <div className="border border-dashed rounded-lg p-12 flex flex-col items-center justify-center">
                  <Upload className="h-12 w-12 mb-4 text-muted-foreground" />
                  <p className="text-center text-muted-foreground mb-4">
                    Upload a photo of the material you want to identify
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <Button onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Select File
                  </Button>
                </div>
              ) : (
                <div className="w-full">
                  <div className="relative aspect-square max-w-md mx-auto mb-4 overflow-hidden rounded-lg">
                    <Image src={image || "/placeholder.svg"} alt="Uploaded material" fill className="object-cover" />
                  </div>

                  {isAnalyzing ? (
                    <div className="space-y-4">
                      <p className="text-center">Analyzing material...</p>
                      <Progress value={progress} />
                    </div>
                  ) : result ? (
                    <div className="space-y-4">
                      <Alert>
                        <Check className="h-4 w-4" />
                        <AlertTitle>Material Identified</AlertTitle>
                        <AlertDescription>
                          We've identified this material as <strong>{result.material}</strong> with {result.confidence}%
                          confidence.
                        </AlertDescription>
                      </Alert>

                      <div className="p-4 bg-white/20 rounded-lg">
                        <h3 className="font-medium mb-2">Material Information:</h3>
                        <p>{result.description}</p>
                      </div>

                      <div className="flex justify-between">
                        <Button variant="outline" onClick={resetAnalysis}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          New Upload
                        </Button>
                        <Button>Save to Library</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <Button variant="outline" onClick={resetAnalysis}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Change Image
                      </Button>
                      <Button onClick={analyzeImage}>Analyze Material</Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

