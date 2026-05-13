import React from "react";

export default function HeroSection() {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="max-w-lg">
            <h1 className="text-5xl font-extrabold text-tertiary mb-3">
              <span className="text-primary">Kindness</span> powered by
              <br />
              code
            </h1>
            <p className="text-foreground text-md leading-relaxed">
              Discover and fuel high-impact projects through transparent,
              blockchain-verified philanthropy.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
