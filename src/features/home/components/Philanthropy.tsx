import { Button } from "@/src/components/ui/button";
import { ListChecks } from "lucide-react";
import { nomenclature } from "@/src/constants/nomenclature";
import Image from "next/image";
import React from "react";
import { useConnect, useConnection, useConnectors, useDisconnect } from "wagmi";
import { useConnectWalletMutation } from "@/src/store/services/api/walletApi";
import { useDispatch } from "react-redux";
import { useRouter } from "next/dist/client/components/navigation";
import { loggedIn } from "@/src/store/services/slice/authSlice";
import { useAppSelector } from "@/src/store/store";
import { selectIsAuthenticated } from "@/src/store/services/selectors/authSelectors";
import { toast } from "sonner";

export default function Philanthropy() {
  const { isConnected } = useConnection();
  const isAuthenticated= useAppSelector(selectIsAuthenticated);
  const { mutate } = useConnect();
  const connectors = useConnectors();
  const { mutate: disconnect } = useDisconnect();
  const [connectWallet, { isLoading }] = useConnectWalletMutation();
  const dispatch = useDispatch();
  const router = useRouter();
  const handleWalletConnect = async () => {
    if(!isAuthenticated){
      router.push("/sign-in");
      toast.info("Please sign in to connect your wallet and start donating!");
      return;
    }

    if (isConnected) {
      disconnect();
      return;
    }
    mutate(
      { connector: connectors[0] },
      {
        onSuccess: (data) => {
          connectWallet({
            walletAddress: data.accounts[0],
          }).then((res) => {
            dispatch(
              loggedIn({
                name: "Donor",
                email: "",
                role: "DONOR",
              }),
            );
            document.cookie = `role=DONOR; path=/; max-age=${60 * 60 * 24}`;
            router.push("/explore");
          });
        },
        onError: (error) => {
          console.log(error);
        },
      },
    );
  };

  return (
    <div>
      <section
        className="py-10 relative overflow-hidden"
        style={{ background: "linear-gradient(180deg,#f9f9ff 0%,#fff 100%)" }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-black text-secondary-color mb-3">
              {nomenclature.PHILANTHROPY}
            </h2>
            <p className="text-foreground text-[15px] max-w-md">
              {nomenclature.PHILANTHROPY_PARA}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-5">
            {/* Anonymous Contributions */}
            <div className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(99,102,241,0.15)]">
              <div className="w-11 h-11 bg-primary-light rounded-xl flex items-center justify-center mb-5">
                <Image
                  src={"/home/shieldcheck.svg"}
                  width={20}
                  height={20}
                  alt="gridIcon"
                />
              </div>
              <h3 className="text-2xl font-bold text-secondary-color mb-3">
                {nomenclature.CONTRIBUTE}
              </h3>
              <p className="text-sm text-foreground leading-relaxed max-w-md">
                {nomenclature.CONTRIBUTE_PARA}
              </p>
            </div>

            {/* Near-Zero Fees */}
            <div
              className="rounded-2xl p-7 relative overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(99,102,241,0.15)]"
              style={{
                background: "linear-gradient(135deg,#1e1b3a 0%,#0f0e1f 100%)",
              }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 opacity-10 rounded-full blur-3xl" />
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 relative z-10 bg-secondary-mute">
                <Image
                  src={"/home/bolt.svg"}
                  width={20}
                  height={20}
                  alt="gridIcon"
                  className="h-auto w-auto"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 relative z-10">
                {nomenclature.ZERO_FEES}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6 relative z-10">
                {nomenclature.ZERO_FEES_PARA}
              </p>
              <span className="relative z-10 block mt-4 pt-3 border-t border-gray-700 text-xs font-bold text-green-400 uppercase tracking-widest">
                Save $950 on every $10k donated
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-5 mt-4">
            {" "}
            {/* Verifiable Impact */}
            <div className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(99,102,241,0.15)]">
              <div className="w-11 h-11 bg-background-secondary rounded-xl flex items-center justify-center mb-5">
                <ListChecks className="text-primary" />{" "}
              </div>
              <h3 className="text-lg font-bold text-secondary-color mb-3">
                Verifiable Impact
              </h3>
              <p className="text-sm text-foreground leading-relaxed">
                Track every dollar from transaction to on-the-ground execution
                via immutable smart contract milestones.
              </p>
              <div className="flex gap-2 mt-6">
                <div className="h-1.5 w-16 rounded-full bg-secondary" />
                <div className="h-1.5 w-16 rounded-full bg-secondary" />
                <div className="h-1.5 w-16 rounded-full bg-secondary" />
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-7 flex flex-col justify-center items-center text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(99,102,241,0.15)]">
              <h3 className="text-4xl font-black text-secondary-color mb-3">
                Ready to make an impact?
              </h3>
              <p className="text-sm text-foreground mb-6 leading-relaxed">
                Join over 50,000 anonymous donors who are changing the world
                through transparent crypto philanthropy.
              </p>
              <div className="flex items-center justify-center gap-3">
                {" "}
                <Button
                  text={isConnected ? "Disconnect Wallet" : "Connect Wallet"}
                  variant={"blue"}
                  size={"default"}
                  onClick={handleWalletConnect}
                  disabled={isLoading}
                />
                <Button text="Learn More" variant={"white"} size={"default"} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
