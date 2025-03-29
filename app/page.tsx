import { MainNav } from "@/components/main-nav"
import { Logo } from "@/components/logo"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  const categories = [
    {
      name: "GENERAL",
      image: "/images/general.jpg",
      href: "/category/general",
    },
    {
      name: "TRADE",
      image: "/images/trade.jpg",
      href: "/category/trade",
    },
    {
      name: "FINANCE",
      image: "/images/finance.jpg",
      href: "/category/finance",
    },
    {
      name: "IDENTIFY",
      image: "/images/identify.jpg",
      href: "/category/identify",
    },
    {
      name: "COMING SOON",
      image: "/images/coming-soon.jpg",
      href: "#",
    },
  ]

  return (
    <div className="min-h-screen gradient-bg">
      <MainNav />
      <main className="container pt-24 pb-16">
        <div className="flex flex-col items-center justify-center mt-8 mb-12">
          <Logo />
        </div>

        <div className="grid grid-cols-1 gap-4 mt-8">
          {categories.map((category) => (
            <Link key={category.name} href={category.href} className="block">
              <div className="category-card glass-card">
                <Image src={category.image || "/placeholder.svg"} alt={category.name} fill className="object-cover" />
                <div className="category-label">{category.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

