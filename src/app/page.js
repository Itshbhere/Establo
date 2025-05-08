import Navbar from "@/components/navbar";
import HeroSection from "@/components/heroSection";
import StatCard from "@/components/StatCards";
export default function Home() {
  const dummyData = {
    title: "Revenue",
    value: "$12.5K",
    live: true,
    prefix: "$",
    suffix: "K",
    delay: 0.2,
    inView: true,
  };

  return (
    <>
      <Navbar />
      <div className="main">
        <HeroSection />
        <StatCard
          title="Revenue"
          value="23.4"
          prefix="$"
          suffix="M"
          live={true}
        />
      </div>
    </>
  );
}
