import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/src/components/ui/input-group";
import { nomenclature } from "@/src/constants/nomenclature";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { ChevronDownIcon, Info, WalletIcon } from "lucide-react";
import { Campaign } from "../type";
import { FC } from "react";

type FinancialsProps = {
  campaignData: Campaign;
  setCampaignData: React.Dispatch<React.SetStateAction<Campaign>>;
};
const Financials: FC<FinancialsProps> = ({ campaignData, setCampaignData }) => {
  return (
    <div className="bg-white rounded-lg py-8 px-5 max-w-xs">
      <div className="flex items-center gap-2 mb-5">
        <div className="aspect-square flex justify-center items-center bg-primary-light w-9 rounded-lg">
          <WalletIcon className="text-primary" size={17} />
        </div>
        <h2 className="font-bold text-xl text-secondaryText">
          {nomenclature.FINANCIALS}
        </h2>
      </div>
      <span className="font-semibold text-sm">Goal Amount</span>
      <InputGroup id="goal-amount" className="w-2xs h-13 mt-2">
        <InputGroupInput
          value={campaignData.goalAmount}
          placeholder={nomenclature.GOAL_AMOUNT}
          onChange={(e) =>
            setCampaignData((prev) => ({
              ...prev,
              goalAmount: Number(e.target.value),
            }))
          }
        />{" "}
        <InputGroupAddon align="inline-end">
          <DropdownMenu>
            <DropdownMenuTrigger value={campaignData.goalToken} asChild>
              <InputGroupButton
                className="text-sm"
                text={campaignData.goalToken || "Currency"}
                rightIcon={<ChevronDownIcon size={16} />}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="rounded-sm bg-white p-2 border border-border"
            >
              <DropdownMenuGroup>
                {(["ETH", "USDC", "USDT", "DAI"] as const).map((token) => (
                  <DropdownMenuItem
                    key={token}
                    onSelect={() => {
                      setCampaignData((prev: Campaign) => {
                        return {
                          ...prev,
                          goalToken: token,
                        };
                      });
                    }}
                  >
                    {token}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
      </InputGroup>
      <div className="flex max-w-xs mt-5 bg-green-50 rounded-sm text-secondary-dark p-7">
        <Info size={30} className="mr-2" />
        <p className="text-sm font-semibold w-2xs">
          Funds are securely stored in a smart contract and available for withdrawal on demand.
        </p>
      </div>
    </div>
  );
};

export default Financials;
