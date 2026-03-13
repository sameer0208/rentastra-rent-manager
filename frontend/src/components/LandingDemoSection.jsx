import { useState, useEffect, useCallback } from "react";
import { Play, Pause, Users, CreditCard, LayoutGrid, BarChart3, FileText, ChevronRight } from "lucide-react";

const SCENE_DURATION_MS = 5500;

const SCENES = [
  {
    title: "One dashboard for everything",
    subtitle: "Your property, guests, and finances in one place. No more spreadsheets.",
    icon: BarChart3,
    accent: "from-indigo-500 to-violet-500",
  },
  {
    title: "Add & manage guests",
    subtitle: "Assign rooms, store contacts, and track police verification for every tenant.",
    icon: Users,
    accent: "from-emerald-500 to-teal-500",
  },
  {
    title: "Track rent & payments",
    subtitle: "Record full or partial payments, see pending amounts, and never miss a due date.",
    icon: CreditCard,
    accent: "from-amber-500 to-orange-500",
  },
  {
    title: "Rooms & occupancy",
    subtitle: "Multiple properties, rooms with rent, and instant view of what’s available.",
    icon: LayoutGrid,
    accent: "from-rose-500 to-pink-500",
  },
  {
    title: "Receipts in one click",
    subtitle: "Generate and print professional rent receipts the moment payment is recorded.",
    icon: FileText,
    accent: "from-violet-500 to-purple-600",
  },
];

/**
 * Auto-playing "explainer" that plays like a product video.
 * Multiple scenes with narrative + mock UI; no video file required.
 */
export default function LandingDemoSection() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goNext = useCallback(() => {
    setSceneIndex((i) => (i + 1) % SCENES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(goNext, SCENE_DURATION_MS);
    return () => clearInterval(id);
  }, [isPaused, goNext]);

  const scene = SCENES[sceneIndex];
  const Icon = scene.icon;

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden bg-slate-900 dark:bg-slate-950">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/50 via-slate-900 to-violet-950/30 pointer-events-none" />
      <div className="max-w-5xl mx-auto relative">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
            See RentAstra in action
          </h2>
          <p className="text-slate-300 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            One platform for guests, rooms, payments, and receipts. Here’s how it works.
          </p>
        </div>

        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-black/40 ring-1 ring-white/10 demo-section-frame">
          <div className="w-full aspect-video min-h-[300px] sm:min-h-[360px] bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 p-6 sm:p-10">
            {/* Left: narrative */}
            <div className="flex-1 text-center sm:text-left max-w-md">
              <div
                key={sceneIndex}
                className="demo-scene-text"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${scene.accent} mb-4`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  {scene.title}
                </h3>
                <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
                  {scene.subtitle}
                </p>
              </div>
            </div>

            {/* Right: animated mock UI */}
            <div className="flex-1 w-full max-w-sm">
              <div
                key={sceneIndex}
                className="demo-scene-ui rounded-xl bg-slate-800/90 border border-slate-700/80 shadow-xl overflow-hidden p-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-slate-600" />
                  <span className="w-2 h-2 rounded-full bg-slate-600" />
                  <span className="w-2 h-2 rounded-full bg-slate-600" />
                </div>
                <div className="space-y-3">
                  <div className="h-3 w-3/4 rounded bg-slate-700" />
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-16 rounded-lg bg-slate-700/80 border border-slate-600/50 flex items-end p-2"
                      >
                        <div className="h-2 w-full rounded bg-slate-600" />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 flex-1 rounded-lg bg-indigo-500/30 border border-indigo-400/30" />
                    <div className="h-8 w-16 rounded-lg bg-slate-600/80" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress & controls */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between gap-4 px-4 sm:px-6 py-4 bg-black/40 backdrop-blur-sm">
            <div className="flex items-center gap-2 flex-1">
              <button
                type="button"
                onClick={() => setIsPaused((p) => !p)}
                className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label={isPaused ? "Play" : "Pause"}
              >
                {isPaused ? (
                  <Play className="w-5 h-5" fill="currentColor" />
                ) : (
                  <Pause className="w-5 h-5" fill="currentColor" />
                )}
              </button>
              <span className="text-sm text-slate-400">
                {sceneIndex + 1} / {SCENES.length}
              </span>
            </div>
            <div className="flex gap-1.5">
              {SCENES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSceneIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === sceneIndex
                      ? "w-8 bg-white"
                      : "w-1.5 bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to scene ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={goNext}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Next scene"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
