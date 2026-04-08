"use client";
import { Button } from "@/src/components/ui/button";
import BuiltOnIntegrity from "@/src/features/about/components/BuiltOnIntegrity";
import DecentralizingTrust from "@/src/features/about/components/DecentralizingTrust";
import Hero from "@/src/features/about/components/Hero";
import { useRouter } from "next/navigation";

const AboutUs = () => {
  const router = useRouter();
  return (
    <div className="max-w-6xl mx-auto space-y-16">
      <Hero text="Digital Custodians for a Transparent Future" />
      <DecentralizingTrust />
      <BuiltOnIntegrity />

      <section>
        <h3 className="flex justify-center text-3xl text-center font-extrabold text-secondaryText mb-6">
          The Team
        </h3>

        <div className="grid md:grid-cols-4 gap-6 px-25 md:px-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center">
              <div className="w-50 md:w-full h-40 bg-gray-200 rounded-xl mb-3" />
              <p className="font-medium text-secondaryText">Member Name</p>
              <p className="text-sm">Role Title</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-linear-to-tr from-tertiary via-tertiary to-tertiary/95 text-white rounded-2xl p-10 flex flex-col items-center">
        <h3 className="text-2xl font-semibold">Join our ecosystem</h3>

        <p className="mt-3 opacity-90 text-center self-center w-sm">
          Start your journey toward transparent giving. Connect your wallet or
          browse active causes seeking support today.
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <Button
            size={"normal"}
            className="bg-white/10"
            textClassName="text-white text-lg px-6 font-bold"
            text="Browse Cases"
            onClick={() => {
              router.push("/explore");
            }}
          />
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
