import { MainNav } from "@/components/main-nav"
import { Logo } from "@/components/logo"
import { RoofEstimator } from "@/components/tools/roof-estimator"

export default function RoofEstimatorPage() {
  return (
    <div className="min-h-screen gradient-bg">
      <MainNav />
      <main className="container pt-24 pb-16">
        <div className="flex flex-col items-center justify-center mt-8 mb-12">
          <Logo />
        </div>

        <RoofEstimator />
      </main>
    </div>
  )
}

