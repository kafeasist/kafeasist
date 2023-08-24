import { Metadata } from "next";

export const metadata: Metadata = {
  title: "kafeasist",
  description: "kafeasist is a restaurant management SaaS for the modern age",
  openGraph: {
    title: "kafeasist",
    description: "kafeasist is a restaurant management SaaS for the modern age",
    url: "https://kafeasist.com",
    siteName: "kafeasist",
  },
  twitter: {
    card: "summary_large_image",
    site: "@kafeasist",
    creator: "@kafeasist",
  },
};

export default function HomePage() {
  return (
    <main className="flex h-screen flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="flex flex-1 flex-col items-center justify-center">
        <h1 className="text-6xl font-bold">kafeasist</h1>
        <p className="text-2xl">
          kafeasist is a restaurant management SaaS for the modern age
        </p>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center">
        <h2 className="text-4xl font-bold">Get Started</h2>
        <p className="text-2xl">
          kafeasist is currently in private beta. If you would like to join,
          please email <a href="mailto:destek@kafeasist.com">here.</a>
        </p>
      </div>
    </main>
  );
}
