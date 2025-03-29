import Image from "next/image"
import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="flex flex-col items-center justify-center">
      <div className="relative h-24 w-24 mb-2">
        <Image src="/logo.svg" alt="TradeMate Logo" fill priority className="object-contain" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight">TradeMate</h1>
      <p className="text-sm text-muted-foreground mt-1">Tools for Australian Tradespeople</p>
    </Link>
  )
}

