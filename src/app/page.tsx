import CinematicLayout from '@/components/hero/CinematicLayout';
import HeroSection from '@/components/hero/HeroSection';

export default function Home() {
  // Mock login state for now
  const isLogged = false;

  return (
    <CinematicLayout>
      <HeroSection isLogged={isLogged} />
    </CinematicLayout>
  );
}