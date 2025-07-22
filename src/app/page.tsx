import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center gap-8 px-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Profound
          </h1>
          <p className="text-xl text-muted-foreground">
            Answer Engine Optimization Platform
          </p>
          <p className="text-sm text-muted-foreground max-w-md">
            Understand and optimize your brand&apos;s presence across AI-powered search engines and chatbots.
          </p>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/setup">Get Started</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/dashboard">View Dashboard</Link>
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
