import { SettingNav, SettingNavSvg } from "@/components/setting-navigation"

export default function Home() {
  return (
    <div className="absolute inset-0 overflow-y-scroll sm:pt-3.5 pb-[144px]" style={{ scrollbarGutter: "stable both-edges" }}>
      <SettingNavSvg className="z-20 h-16 w-20" />
      <SettingNav />
      <div className="mx-auto flex w-full max-w-3xl flex-col space-y-12 px-4 py-10">
        <div className="flex h-[calc(100vh-20rem)] items-start justify-center">
          <div className="w-full space-y-6 px-2 pt-[calc(max(15vh,2.5rem))] duration-300 animate-in fade-in-50 zoom-in-95 sm:px-8">
            <h2 className="text-3xl font-semibold">
              Welcome
            </h2>
          </div>
        </div>
      </div>
    </div>
  )
}
