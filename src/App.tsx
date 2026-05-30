import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { HomePage } from '@/pages/HomePage';
import { AugmentEncyclopedia } from '@/pages/AugmentEncyclopedia';
import { AugmentDetailPage } from '@/pages/AugmentDetailPage';
import { TripleChoiceHelper } from '@/pages/TripleChoiceHelper';
import { VersionTracker } from '@/pages/VersionTracker';
import { HeroCardsPage } from '@/pages/HeroCardsPage';
import { HeroDetailPage } from '@/pages/HeroDetailPage';
import { InvincibleCombosPage } from '@/pages/InvincibleCombosPage';
import { ItemsPage } from '@/pages/ItemsPage';
import { SimulatorPage } from '@/pages/SimulatorPage';
import { BuildRecommendationsPage } from '@/pages/BuildRecommendationsPage';

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  return (
    <BrowserRouter>
      {showWelcome && <WelcomeScreen onEnter={() => setShowWelcome(false)} />}
      {!showWelcome && (
        <div className="min-h-screen flex flex-col">
          <NavBar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/augments" element={<AugmentEncyclopedia />} />
              <Route path="/augments/:augmentId" element={<AugmentDetailPage />} />
              <Route path="/triple-choice" element={<TripleChoiceHelper />} />
              <Route path="/heroes" element={<HeroCardsPage />} />
              <Route path="/heroes/:heroId" element={<HeroDetailPage />} />
              <Route path="/invincible-combos" element={<InvincibleCombosPage />} />
              <Route path="/simulator" element={<SimulatorPage />} />
            <Route path="/builds" element={<BuildRecommendationsPage />} />
            <Route path="/items" element={<ItemsPage />} />
            <Route path="/versions" element={<VersionTracker />} />
            </Routes>
          </main>
          <Footer />
        </div>
      )}
    </BrowserRouter>
  );
}
