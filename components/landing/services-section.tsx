import { cn } from "@/lib/utils"
import { SERVICE_CATEGORIES } from "./data"
import { PackageCard } from "./package-card"

export function ServicesSection() {
  return (
    <section id="servicios" className="relative z-10 px-6 py-20 md:py-28 border-t border-white/[0.04]">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-violet-300 text-[10px] font-normal tracking-[0.22em] uppercase">
            Servicios
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-4 tracking-tight">
            Paquetes exclusivos
          </h2>
        </div>

        <div className="space-y-16">
          {SERVICE_CATEGORIES.map((category) => (
            <div key={category.id}>
              <div className="mb-7">
                <h3 className="text-xl font-bold text-white tracking-tight">{category.title}</h3>
                <p className="text-sm text-zinc-500 font-normal mt-1">{category.subtitle}</p>
              </div>
              <div
                className={cn(
                  "grid gap-5 sm:grid-cols-2",
                  category.packages.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2",
                )}
              >
                {category.packages.map((pkg) => (
                  <PackageCard key={pkg.name} pkg={pkg} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
