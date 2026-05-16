import {
  StrictMode,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentType,
  type CSSProperties,
  type ReactNode,
  type TouchEvent,
} from "react";
import { createRoot } from "react-dom/client";
import {
  AlertCircle,
  BarChart3,
  Camera,
  Check,
  ChevronRight,
  Clock3,
  Flame,
  GalleryHorizontal,
  History,
  Home,
  LoaderCircle,
  Plus,
  Sparkles,
  Target,
  Trash2,
  User,
  Utensils,
} from "lucide-react";
import "./styles.css";

type Route = "/login" | "/app" | "/app/add" | "/app/result" | "/app/history" | "/app/stats" | "/app/profile";

type Ingredient = {
  name: string;
  grams: number;
  calories: number;
};

type MealAnalysis = {
  mealName: string;
  totalWeightGrams: number;
  totalCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
  sugarGrams: number;
  sodiumMg: number;
  confidence: "low" | "medium" | "high";
  ingredients: Ingredient[];
  notes: string;
};

type Meal = {
  id: number;
  name: string;
  time: string;
  image: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  weight: number;
  confidence: MealAnalysis["confidence"];
  ingredients: Ingredient[];
  notes: string;
  source: "sample" | "ai";
};

type PhotoState = {
  previewUrl: string;
  imageDataUrl?: string;
  imageUrl?: string;
};

const STORAGE_KEY = "berninutri.meals.v2";
const DAILY_GOAL = 1950;
const PROTEIN_GOAL = 110;
const SAMPLE_PHOTO =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=85";

const sampleMeals: Meal[] = [
  {
    id: 1,
    name: "Greek bowl",
    time: "08:35",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
    calories: 428,
    protein: 29,
    carbs: 42,
    fat: 16,
    fiber: 8,
    sugar: 7,
    sodium: 520,
    weight: 360,
    confidence: "high",
    ingredients: [
      { name: "Greek yogurt sauce", grams: 60, calories: 62 },
      { name: "Chickpeas", grams: 90, calories: 148 },
      { name: "Vegetables", grams: 180, calories: 96 },
    ],
    notes: "Sample meal kept only to make the app useful before the first saved analysis.",
    source: "sample",
  },
  {
    id: 2,
    name: "Salmon plate",
    time: "13:10",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=80",
    calories: 612,
    protein: 42,
    carbs: 48,
    fat: 27,
    fiber: 6,
    sugar: 5,
    sodium: 690,
    weight: 430,
    confidence: "medium",
    ingredients: [
      { name: "Salmon", grams: 160, calories: 330 },
      { name: "Rice", grams: 150, calories: 195 },
      { name: "Greens", grams: 90, calories: 35 },
    ],
    notes: "Sample meal for the daily dashboard.",
    source: "sample",
  },
];

function currentRoute(): Route {
  const path = window.location.pathname;
  if (path === "/login") return "/login";
  if (path === "/app/add") return "/app/add";
  if (path === "/app/result") return "/app/result";
  if (path === "/app/history") return "/app/history";
  if (path === "/app/stats") return "/app/stats";
  if (path === "/app/profile") return "/app/profile";
  return "/app";
}

function loadMeals(): Meal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return sampleMeals;
    const parsed = JSON.parse(raw) as Meal[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : sampleMeals;
  } catch {
    return sampleMeals;
  }
}

function saveMeals(meals: Meal[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(meals));
}

function mealFromAnalysis(analysis: MealAnalysis, image: string): Meal {
  return {
    id: Date.now(),
    name: analysis.mealName,
    time: new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit" }).format(new Date()),
    image,
    calories: Math.round(analysis.totalCalories),
    protein: Math.round(analysis.proteinGrams),
    carbs: Math.round(analysis.carbsGrams),
    fat: Math.round(analysis.fatGrams),
    fiber: Math.round(analysis.fiberGrams),
    sugar: Math.round(analysis.sugarGrams),
    sodium: Math.round(analysis.sodiumMg),
    weight: Math.round(analysis.totalWeightGrams),
    confidence: analysis.confidence,
    ingredients: analysis.ingredients,
    notes: analysis.notes,
    source: "ai",
  };
}

function macroPercent(value: number, goal: number) {
  return `${Math.min(100, Math.round((value / goal) * 100))}%`;
}

async function fileToDataUrl(file: File): Promise<string> {
  const image = new Image();
  const objectUrl = URL.createObjectURL(file);

  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("Could not load selected image"));
      image.src = objectUrl;
    });

    const maxSide = 1200;
    const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
    const width = Math.max(1, Math.round(image.width * scale));
    const height = Math.max(1, Math.round(image.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not prepare image");

    context.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL("image/jpeg", 0.86);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function App() {
  const [route, setRoute] = useState<Route>(currentRoute);
  const [photo, setPhoto] = useState<PhotoState>({ previewUrl: SAMPLE_PHOTO, imageUrl: SAMPLE_PHOTO });
  const [meals, setMeals] = useState<Meal[]>(loadMeals);
  const [pendingMeal, setPendingMeal] = useState<Meal | null>(null);

  useEffect(() => {
    const onPopState = () => setRoute(currentRoute());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    saveMeals(meals);
  }, [meals]);

  const navigate = (nextRoute: Route) => {
    window.history.pushState(null, "", nextRoute);
    setRoute(nextRoute);
  };

  const saveMeal = (meal: Meal) => {
    const withoutSamples = meals.filter((item) => item.source !== "sample");
    const nextMeals = [meal, ...withoutSamples, ...sampleMeals].slice(0, 12);
    setMeals(nextMeals);
    setPendingMeal(null);
    navigate("/app");
  };

  const resetMeals = () => {
    setMeals(sampleMeals);
    setPendingMeal(null);
  };

  return (
    <div className="mobile-app">
      {route === "/login" ? (
        <LoginScreen onContinue={() => navigate("/app/add")} />
      ) : (
        <AuthedShell route={route} navigate={navigate}>
          {route === "/app" && <TodayScreen meals={meals} navigate={navigate} />}
          {route === "/app/add" && (
            <AddMealScreen
              photo={photo}
              onPhoto={setPhoto}
              onMealAnalyzed={(meal) => {
                setPendingMeal(meal);
                navigate("/app/result");
              }}
            />
          )}
          {route === "/app/result" && <ResultScreen meal={pendingMeal} navigate={navigate} onSave={saveMeal} />}
          {route === "/app/history" && <HistoryScreen meals={meals} onReset={resetMeals} />}
          {route === "/app/stats" && <StatsScreen meals={meals} />}
          {route === "/app/profile" && <ProfileScreen navigate={navigate} />}
        </AuthedShell>
      )}
    </div>
  );
}

function LoginScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <main className="screen login-screen">
      <div className="login-art">
        <img src="https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=1000&q=80" alt="" />
      </div>
      <div className="login-content">
        <div className="app-icon">
          <Utensils size={24} />
        </div>
        <p className="eyebrow">NutriLens AI</p>
        <h2>Snap your meal, track your goals</h2>
        <p>Photo-based nutrition estimates with a clean daily log for calories and macros.</p>
        <button className="primary-action" type="button" onClick={onContinue}>
          Continue
          <ChevronRight size={18} />
        </button>
      </div>
    </main>
  );
}

const swipeRoutes: Route[] = ["/app", "/app/history", "/app/add", "/app/stats", "/app/profile"];

function AuthedShell({ children, navigate, route }: { children: ReactNode; navigate: (route: Route) => void; route: Route }) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.changedTouches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = touchStart.current;
    const touch = event.changedTouches[0];
    touchStart.current = null;

    if (!start || route === "/app/result") return;

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    if (Math.abs(deltaX) < 72 || Math.abs(deltaY) > 48) return;

    const currentIndex = swipeRoutes.indexOf(route);
    if (currentIndex < 0) return;

    const nextIndex = deltaX < 0 ? currentIndex + 1 : currentIndex - 1;
    const nextRoute = swipeRoutes[nextIndex];
    if (nextRoute) navigate(nextRoute);
  };

  return (
    <div className="authed-shell" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <main className="screen">{children}</main>
      <nav className="tab-bar" aria-label="App navigation">
        <TabButton icon={Home} label="Today" active={route === "/app"} onClick={() => navigate("/app")} />
        <TabButton icon={History} label="History" active={route === "/app/history"} onClick={() => navigate("/app/history")} />
        <button className="tab-add" type="button" aria-label="Add meal" onClick={() => navigate("/app/add")}>
          <Plus size={28} />
        </button>
        <TabButton icon={BarChart3} label="Stats" active={route === "/app/stats"} onClick={() => navigate("/app/stats")} />
        <TabButton icon={User} label="Profile" active={route === "/app/profile"} onClick={() => navigate("/app/profile")} />
      </nav>
    </div>
  );
}

function TabButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: ComponentType<{ size?: number; strokeWidth?: number }>;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button className={`tab-button ${active ? "is-active" : ""}`} type="button" onClick={onClick}>
      <Icon size={20} strokeWidth={active ? 2.6 : 2} />
      <span>{label}</span>
    </button>
  );
}

function TodayScreen({ meals, navigate }: { meals: Meal[]; navigate: (route: Route) => void }) {
  const eaten = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const protein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const carbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const fat = meals.reduce((sum, meal) => sum + meal.fat, 0);
  const remaining = Math.max(0, DAILY_GOAL - eaten);

  return (
    <>
      <Header eyebrow="Today" title="Good rhythm, Berni" />
      <section className="goal-card">
        <div>
          <p>Calories left</p>
          <strong>{remaining}</strong>
          <span>of {DAILY_GOAL.toLocaleString("en")} kcal</span>
        </div>
        <div className="progress-ring" style={{ "--progress": macroPercent(eaten, DAILY_GOAL) } as CSSProperties}>
          <Flame size={25} />
        </div>
      </section>
      <section className="macro-row">
        <Macro label="Protein" value={`${protein}g`} percent={macroPercent(protein, PROTEIN_GOAL)} />
        <Macro label="Carbs" value={`${carbs}g`} percent={macroPercent(carbs, 240)} />
        <Macro label="Fat" value={`${fat}g`} percent={macroPercent(fat, 70)} />
      </section>
      <div className="section-heading">
        <h3>Meals</h3>
        <button type="button" onClick={() => navigate("/app/add")}>
          Add
        </button>
      </div>
      <div className="meal-list">
        {meals.map((meal) => (
          <MealRow key={meal.id} meal={meal} />
        ))}
      </div>
    </>
  );
}

function AddMealScreen({
  photo,
  onPhoto,
  onMealAnalyzed,
}: {
  photo: PhotoState;
  onPhoto: (photo: PhotoState) => void;
  onMealAnalyzed: (meal: Meal) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const choosePhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    const imageDataUrl = await fileToDataUrl(file);
    onPhoto({ previewUrl: imageDataUrl, imageDataUrl });
    event.target.value = "";
  };

  const analyze = async () => {
    setIsAnalyzing(true);
    setError("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: photo.imageDataUrl,
          imageUrl: photo.imageDataUrl ? undefined : photo.imageUrl,
        }),
      });

      const body = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(body?.message ?? "The AI analysis failed.");
      }

      onMealAnalyzed(mealFromAnalysis(body.analysis as MealAnalysis, photo.previewUrl));
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "The AI analysis failed.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <Header eyebrow="Add meal" title="Snap a meal" />
      <p className="muted-copy">Upload or use the sample photo. The app sends it to the AI endpoint and saves the result.</p>
      <section className="photo-panel">
        <img src={photo.previewUrl} alt="" />
        {isAnalyzing && (
          <div className="analysis-overlay">
            <LoaderCircle className="spin" size={42} />
            <strong>Analyzing your meal...</strong>
            <span>This calls the AI backend now</span>
          </div>
        )}
      </section>
      <input ref={fileRef} type="file" accept="image/*" hidden onChange={choosePhoto} />
      <div className="split-actions">
        <button className="secondary-action" type="button" onClick={() => fileRef.current?.click()} disabled={isAnalyzing}>
          <Camera size={20} />
          Camera
        </button>
        <button className="secondary-action" type="button" onClick={() => fileRef.current?.click()} disabled={isAnalyzing}>
          <GalleryHorizontal size={20} />
          Gallery
        </button>
      </div>
      <button className="primary-action" type="button" onClick={analyze} disabled={isAnalyzing}>
        <Sparkles size={20} />
        {isAnalyzing ? "Analyzing..." : "Analyze with AI"}
      </button>
      {error && (
        <div className="error-panel">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}
      <p className="fine-print">AI estimates are approximate. Always review before saving.</p>
    </>
  );
}

function ResultScreen({
  meal,
  navigate,
  onSave,
}: {
  meal: Meal | null;
  navigate: (route: Route) => void;
  onSave: (meal: Meal) => void;
}) {
  if (!meal) {
    return (
      <>
        <Header eyebrow="Analysis" title="No result yet" />
        <section className="soft-panel">
          <AlertCircle size={20} />
          <div>
            <strong>Analyze a photo first</strong>
            <span>Go to Add and run the AI analysis to create a meal result.</span>
          </div>
        </section>
        <button className="primary-action" type="button" onClick={() => navigate("/app/add")}>
          Add meal
        </button>
      </>
    );
  }

  return (
    <>
      <Header eyebrow="Analysis" title="Review meal" />
      <section className="result-hero">
        <img src={meal.image} alt="" />
        <div>
          <span>{meal.confidence} confidence</span>
          <h3>{meal.name}</h3>
        </div>
      </section>
      <section className="nutrition-grid">
        <Nutrition label="Calories" value={meal.calories} unit="kcal" />
        <Nutrition label="Protein" value={meal.protein} unit="g" />
        <Nutrition label="Carbs" value={meal.carbs} unit="g" />
        <Nutrition label="Fat" value={meal.fat} unit="g" />
      </section>
      <section className="ingredients">
        <h3>Detected ingredients</h3>
        {meal.ingredients.map((ingredient) => (
          <div key={`${ingredient.name}-${ingredient.grams}`}>
            <Check size={17} />
            <span>
              {ingredient.name} · {ingredient.grams}g · {ingredient.calories} kcal
            </span>
          </div>
        ))}
      </section>
      <section className="soft-panel">
        <Sparkles size={20} />
        <div>
          <strong>AI note</strong>
          <span>{meal.notes}</span>
        </div>
      </section>
      <button className="primary-action" type="button" onClick={() => onSave(meal)}>
        Save meal
      </button>
    </>
  );
}

function HistoryScreen({ meals, onReset }: { meals: Meal[]; onReset: () => void }) {
  return (
    <>
      <Header eyebrow="History" title="Recent meals" />
      <div className="meal-list">
        {meals.map((meal) => (
          <MealRow key={meal.id} meal={meal} />
        ))}
      </div>
      <button className="secondary-action full danger" type="button" onClick={onReset}>
        <Trash2 size={18} />
        Reset saved meals
      </button>
      <section className="soft-panel">
        <Clock3 size={20} />
        <div>
          <strong>Saved locally</strong>
          <span>Meals are stored in this browser so the app works without a separate database.</span>
        </div>
      </section>
    </>
  );
}

function StatsScreen({ meals }: { meals: Meal[] }) {
  const total = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const avg = Math.round(total / Math.max(1, meals.length));
  const protein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const bars = [68, 84, 55, 77, 92, 71, Math.max(28, Math.min(100, Math.round((total / DAILY_GOAL) * 72)))];

  return (
    <>
      <Header eyebrow="Stats" title="Weekly insight" />
      <section className="goal-card compact">
        <div>
          <p>Average intake</p>
          <strong>{avg}</strong>
          <span>kcal per meal log</span>
        </div>
        <Target size={34} />
      </section>
      <section className="chart-card">
        <div className="bar-chart">
          {bars.map((height, index) => (
            <div key={index} style={{ height: `${height}%` }} />
          ))}
        </div>
        <div className="week-labels">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
            <span key={`${day}-${index}`}>{day}</span>
          ))}
        </div>
      </section>
      <section className="macro-row">
        <Macro label="Logged" value={`${meals.length}`} percent={macroPercent(meals.length, 7)} />
        <Macro label="Protein" value={`${protein}g`} percent={macroPercent(protein, PROTEIN_GOAL * 2)} />
        <Macro label="Goal" value={`${Math.round((total / DAILY_GOAL) * 100)}%`} percent={macroPercent(total, DAILY_GOAL)} />
      </section>
    </>
  );
}

function ProfileScreen({ navigate }: { navigate: (route: Route) => void }) {
  return (
    <>
      <Header eyebrow="Profile" title="Berni" />
      <section className="profile-card">
        <div className="avatar">B</div>
        <div>
          <strong>Functional nutrition tracker</strong>
          <span>Uses an AI endpoint for photo analysis and local browser storage for the meal log.</span>
        </div>
      </section>
      <section className="settings-list">
        <Setting label="Daily calories" value={`${DAILY_GOAL.toLocaleString("en")} kcal`} />
        <Setting label="Protein target" value={`${PROTEIN_GOAL} g`} />
        <Setting label="AI model" value="gpt-4.1-mini" />
        <Setting label="Backend" value="/api/analyze" />
      </section>
      <button className="secondary-action full" type="button" onClick={() => navigate("/login")}>
        View sign-in screen
      </button>
    </>
  );
}

function Header({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <header className="screen-header">
      <p>{eyebrow}</p>
      <h2>{title}</h2>
    </header>
  );
}

function Macro({ label, value, percent }: { label: string; value: string; percent: string }) {
  return (
    <div className="macro-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <div>
        <i style={{ width: percent }} />
      </div>
    </div>
  );
}

function MealRow({ meal }: { meal: Meal }) {
  return (
    <article className="meal-row">
      <img src={meal.image} alt="" />
      <div>
        <strong>{meal.name}</strong>
        <span>
          {meal.time} · {meal.protein}g protein · {meal.source === "ai" ? "AI" : "sample"}
        </span>
      </div>
      <em>{meal.calories}</em>
    </article>
  );
}

function Nutrition({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="nutrition-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{unit}</small>
    </div>
  );
}

function Setting({ label, value }: { label: string; value: string }) {
  return (
    <div className="setting-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
