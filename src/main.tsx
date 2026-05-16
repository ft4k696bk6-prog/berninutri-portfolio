import { StrictMode, useEffect, useRef, useState, type ComponentType, type CSSProperties, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import {
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
  Salad,
  Sparkles,
  Target,
  User,
  Utensils,
} from "lucide-react";
import "./styles.css";

type Route = "/login" | "/app" | "/app/add" | "/app/result" | "/app/history" | "/app/stats" | "/app/profile";

type Meal = {
  id: number;
  name: string;
  time: string;
  image: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

const todayMeals: Meal[] = [
  {
    id: 1,
    name: "Greek bowl",
    time: "08:35",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
    calories: 428,
    protein: 29,
    carbs: 42,
    fat: 16,
  },
  {
    id: 2,
    name: "Salmon plate",
    time: "13:10",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=80",
    calories: 612,
    protein: 42,
    carbs: 48,
    fat: 27,
  },
];

const defaultAnalysis: Meal = {
  id: 3,
  name: "Chicken avocado plate",
  time: "Now",
  image:
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80",
  calories: 536,
  protein: 38,
  carbs: 44,
  fat: 22,
};

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

function App() {
  const [route, setRoute] = useState<Route>(currentRoute);
  const [photo, setPhoto] = useState<string>(defaultAnalysis.image);
  const [analysis, setAnalysis] = useState<Meal>(defaultAnalysis);

  useEffect(() => {
    const onPopState = () => setRoute(currentRoute());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (nextRoute: Route) => {
    window.history.pushState(null, "", nextRoute);
    setRoute(nextRoute);
  };

  const setUploadedPhoto = (url: string) => {
    setPhoto(url);
    setAnalysis((prev) => ({ ...prev, image: url }));
  };

  return (
    <div className="app-shell">
      <aside className="portfolio-panel" aria-label="Portfolio summary">
        <div className="brand-lockup">
          <div className="brand-mark">
            <Salad size={24} />
          </div>
          <div>
            <p className="eyebrow">Portfolio build</p>
            <h1>BerniNutri AI</h1>
          </div>
        </div>
        <p className="panel-copy">
          Mobile nutrition tracker rebuilt from the public Lovable app surface, ready for GitHub and Vercel.
        </p>
        <div className="panel-grid">
          <Metric label="Daily goal" value="1,950 kcal" />
          <Metric label="Protein" value="110 g" />
          <Metric label="Streak" value="12 days" />
        </div>
      </aside>

      <section className="phone-stage" aria-label="BerniNutri mobile app">
        <div className="phone-frame">
          {route === "/login" ? (
            <LoginScreen onContinue={() => navigate("/app/add")} />
          ) : (
            <AuthedShell route={route} navigate={navigate}>
              {route === "/app" && <TodayScreen navigate={navigate} />}
              {route === "/app/add" && (
                <AddMealScreen photo={photo} onPhoto={setUploadedPhoto} onAnalyzed={() => navigate("/app/result")} />
              )}
              {route === "/app/result" && <ResultScreen meal={analysis} navigate={navigate} />}
              {route === "/app/history" && <HistoryScreen />}
              {route === "/app/stats" && <StatsScreen />}
              {route === "/app/profile" && <ProfileScreen navigate={navigate} />}
            </AuthedShell>
          )}
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel-metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function LoginScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <main className="screen login-screen">
      <div className="login-art">
        <img
          src="https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=1000&q=80"
          alt=""
        />
      </div>
      <div className="login-content">
        <div className="app-icon">
          <Utensils size={24} />
        </div>
        <p className="eyebrow">NutriLens AI</p>
        <h2>Snap your meal, track your goals</h2>
        <p>Photo-based nutrition estimates with a clean daily log for calories and macros.</p>
        <button className="primary-action" type="button" onClick={onContinue}>
          Continue demo
          <ChevronRight size={18} />
        </button>
      </div>
    </main>
  );
}

function AuthedShell({
  children,
  navigate,
  route,
}: {
  children: ReactNode;
  navigate: (route: Route) => void;
  route: Route;
}) {
  return (
    <div className="authed-shell">
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

function TodayScreen({ navigate }: { navigate: (route: Route) => void }) {
  const eaten = todayMeals.reduce((sum, meal) => sum + meal.calories, 0);
  const remaining = 1950 - eaten;

  return (
    <>
      <Header eyebrow="Today" title="Good rhythm, Berni" />
      <section className="goal-card">
        <div>
          <p>Calories left</p>
          <strong>{remaining}</strong>
          <span>of 1,950 kcal</span>
        </div>
        <div className="progress-ring" style={{ "--progress": "54%" } as CSSProperties}>
          <Flame size={25} />
        </div>
      </section>
      <section className="macro-row">
        <Macro label="Protein" value="71g" percent="65%" />
        <Macro label="Carbs" value="90g" percent="58%" />
        <Macro label="Fat" value="43g" percent="49%" />
      </section>
      <div className="section-heading">
        <h3>Meals</h3>
        <button type="button" onClick={() => navigate("/app/add")}>Add</button>
      </div>
      <div className="meal-list">
        {todayMeals.map((meal) => (
          <MealRow key={meal.id} meal={meal} />
        ))}
      </div>
    </>
  );
}

function AddMealScreen({
  photo,
  onPhoto,
  onAnalyzed,
}: {
  photo: string;
  onPhoto: (url: string) => void;
  onAnalyzed: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const choosePhoto = (file: File | undefined) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    onPhoto(url);
  };

  const analyze = () => {
    setIsAnalyzing(true);
    window.setTimeout(() => {
      setIsAnalyzing(false);
      onAnalyzed();
    }, 850);
  };

  return (
    <>
      <Header eyebrow="Add meal" title="Snap a meal" />
      <p className="muted-copy">AI will estimate calories and macros from the plate photo.</p>
      <section className="photo-panel">
        <img src={photo} alt="" />
        {isAnalyzing && (
          <div className="analysis-overlay">
            <LoaderCircle className="spin" size={42} />
            <strong>Analyzing your meal...</strong>
            <span>This usually takes a few seconds</span>
          </div>
        )}
      </section>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => choosePhoto(event.target.files?.[0])}
      />
      <div className="split-actions">
        <button className="secondary-action" type="button" onClick={() => fileRef.current?.click()}>
          <Camera size={20} />
          Camera
        </button>
        <button className="secondary-action" type="button" onClick={() => fileRef.current?.click()}>
          <GalleryHorizontal size={20} />
          Gallery
        </button>
      </div>
      <button className="primary-action" type="button" onClick={analyze} disabled={isAnalyzing}>
        <Sparkles size={20} />
        {isAnalyzing ? "Analyzing..." : "Analyze with AI"}
      </button>
      <p className="fine-print">AI estimates are approximate. Always review before saving.</p>
    </>
  );
}

function ResultScreen({ meal, navigate }: { meal: Meal; navigate: (route: Route) => void }) {
  return (
    <>
      <Header eyebrow="Analysis" title="Review meal" />
      <section className="result-hero">
        <img src={meal.image} alt="" />
        <div>
          <span>High confidence</span>
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
        {["Grilled chicken", "Avocado", "Rice", "Leafy greens", "Olive dressing"].map((ingredient) => (
          <div key={ingredient}>
            <Check size={17} />
            <span>{ingredient}</span>
          </div>
        ))}
      </section>
      <button className="primary-action" type="button" onClick={() => navigate("/app")}>
        Save meal
      </button>
    </>
  );
}

function HistoryScreen() {
  return (
    <>
      <Header eyebrow="History" title="Recent meals" />
      <div className="meal-list">
        {[...todayMeals, defaultAnalysis].map((meal) => (
          <MealRow key={meal.id} meal={meal} />
        ))}
      </div>
      <section className="soft-panel">
        <Clock3 size={20} />
        <div>
          <strong>Most consistent window</strong>
          <span>Lunch logged between 12:30 and 13:45 for 6 days.</span>
        </div>
      </section>
    </>
  );
}

function StatsScreen() {
  const bars = [68, 84, 55, 77, 92, 71, 63];

  return (
    <>
      <Header eyebrow="Stats" title="Weekly insight" />
      <section className="goal-card compact">
        <div>
          <p>Average intake</p>
          <strong>1,842</strong>
          <span>kcal per day</span>
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
        <Macro label="Goal hit" value="5/7" percent="71%" />
        <Macro label="Protein avg" value="104g" percent="86%" />
        <Macro label="Fiber avg" value="27g" percent="78%" />
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
          <strong>Performance cut</strong>
          <span>Maintain energy, lift protein, keep weekly consistency.</span>
        </div>
      </section>
      <section className="settings-list">
        <Setting label="Daily calories" value="1,950 kcal" />
        <Setting label="Protein target" value="110 g" />
        <Setting label="Hydration" value="2.5 L" />
        <Setting label="Weekly check-in" value="Sunday" />
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
          {meal.time} · {meal.protein}g protein
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
  </StrictMode>
);
