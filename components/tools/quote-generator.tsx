"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Printer, Save, Plus, Trash } from "lucide-react"

type LineItem = {
  id: string
  description: string
  quantity: string
  unitPrice: string
  total: number
}

export function QuoteGenerator() {
  const [clientName, setClientName] = useState<string>("")
  const [clientEmail, setClientEmail] = useState<string>("")
  const [projectName, setProjectName] = useState<string>("")
  const [quoteDate, setQuoteDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [validUntil, setValidUntil] = useState<string>("")
  const [notes, setNotes] = useState<string>("")
  const [taxRate, setTaxRate] = useState<string>("10") // Default 10% GST in Australia
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: "1", description: "", quantity: "1", unitPrice: "0", total: 0 },
  ])
  const [activeTab, setActiveTab] = useState<string>("details")

  // Calculate expiry date 30 days from now for default validUntil
  useState(() => {
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
    setValidUntil(thirtyDaysFromNow.toISOString().split("T")[0])
  })

  const handleLineItemChange = (id: string, field: keyof LineItem, value: string) => {
    setLineItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }

          // Recalculate total if quantity or unitPrice changes
          if (field === "quantity" || field === "unitPrice") {
            const quantity = Number.parseFloat(updatedItem.quantity) || 0
            const unitPrice = Number.parseFloat(updatedItem.unitPrice) || 0
            updatedItem.total = quantity * unitPrice
          }

          return updatedItem
        }
        return item
      }),
    )
  }

  const addLineItem = () => {
    const newId = (lineItems.length + 1).toString()
    setLineItems([...lineItems, { id: newId, description: "", quantity: "1", unitPrice: "0", total: 0 }])
  }

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((item) => item.id !== id))
    }
  }

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + item.total, 0)
  }

  const calculateTax = () => {
    const subtotal = calculateSubtotal()
    const taxRateValue = Number.parseFloat(taxRate) || 0
    return subtotal * (taxRateValue / 100)
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  const generateQuote = () => {
    // In a real app, this would generate a PDF or save to a database
    setActiveTab("preview")
  }

  const isFormValid = () => {
    return (
      clientName && projectName && lineItems.some((item) => item.description && Number.parseFloat(item.quantity) > 0)
    )
  }

  return (
    <Card className="glass-card max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Quote Generator</CardTitle>
        <CardDescription>Create professional quotes for your clients</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Client Details</TabsTrigger>
            <TabsTrigger value="items">Line Items</TabsTrigger>
            <TabsTrigger value="preview">Quote Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  id="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Enter client name"
                  className="bg-white/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientEmail">Client Email</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="Enter client email"
                  className="bg-white/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name"
                  className="bg-white/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  placeholder="Enter tax rate"
                  className="bg-white/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quoteDate">Quote Date</Label>
                <Input
                  id="quoteDate"
                  type="date"
                  value={quoteDate}
                  onChange={(e) => setQuoteDate(e.target.value)}
                  className="bg-white/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="validUntil">Valid Until</Label>
                <Input
                  id="validUntil"
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="bg-white/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter any additional notes or terms"
                className="bg-white/20 min-h-[100px]"
              />
            </div>

            <Button
              onClick={() => setActiveTab("items")}
              className="w-full mt-4"
              disabled={!clientName || !projectName}
            >
              Next: Add Line Items
            </Button>
          </TabsContent>

          <TabsContent value="items" className="space-y-4 mt-4">
            <div className="space-y-4">
              {lineItems.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5 space-y-2">
                    <Label htmlFor={`description-${item.id}`}>Description</Label>
                    <Input
                      id={`description-${item.id}`}
                      value={item.description}
                      onChange={(e) => handleLineItemChange(item.id, "description", e.target.value)}
                      placeholder="Item description"
                      className="bg-white/20"
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor={`quantity-${item.id}`}>Qty</Label>
                    <Input
                      id={`quantity-${item.id}`}
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleLineItemChange(item.id, "quantity", e.target.value)}
                      className="bg-white/20"
                    />
                  </div>
                  <div className="col-span-3 space-y-2">
                    <Label htmlFor={`unitPrice-${item.id}`}>Unit Price ($)</Label>
                    <Input
                      id={`unitPrice-${item.id}`}
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => handleLineItemChange(item.id, "unitPrice", e.target.value)}
                      className="bg-white/20"
                    />
                  </div>
                  <div className="col-span-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLineItem(item.id)}
                      disabled={lineItems.length === 1}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="col-span-1">
                    <div className="text-right font-medium">${item.total.toFixed(2)}</div>
                  </div>
                </div>
              ))}

              <Button variant="outline" onClick={addLineItem} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Line Item
              </Button>

              <div className="flex flex-col space-y-2 text-right">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({taxRate}%):</span>
                  <span>${calculateTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setActiveTab("details")}>
                Back to Details
              </Button>
              <Button onClick={generateQuote} disabled={!isFormValid()}>
                Generate Quote
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4 mt-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">QUOTE</h2>
                  <p className="text-gray-500">
                    #
                    {Math.floor(Math.random() * 10000)
                      .toString()
                      .padStart(4, "0")}
                  </p>
                </div>
                <div className="text-right">
                  <h3 className="font-bold text-gray-800">TradeMate</h3>
                  <p className="text-gray-500">ABN: 12 345 678 901</p>
                  <p className="text-gray-500">contact@trademate.com.au</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mt-8">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Bill To:</h4>
                  <p className="text-gray-800">{clientName}</p>
                  {clientEmail && <p className="text-gray-500">{clientEmail}</p>}
                </div>
                <div className="text-right">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Quote Date:</span>
                    <span className="text-gray-800">{new Date(quoteDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Valid Until:</span>
                    <span className="text-gray-800">{new Date(validUntil).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Project:</span>
                    <span className="text-gray-800">{projectName}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lineItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">${Number.parseFloat(item.unitPrice).toFixed(2)}</TableCell>
                        <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex justify-end mt-4">
                  <div className="w-1/3">
                    <div className="flex justify-between py-2">
                      <span className="font-semibold">Subtotal:</span>
                      <span>${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="font-semibold">Tax ({taxRate}%):</span>
                      <span>${calculateTax().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 font-bold text-lg">
                      <span>Total:</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {notes && (
                  <div className="mt-8 p-4 bg-gray-50 rounded-md">
                    <h4 className="font-semibold text-gray-700 mb-2">Notes:</h4>
                    <p className="text-gray-600 whitespace-pre-line">{notes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setActiveTab("items")}>
                Edit Quote
              </Button>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

