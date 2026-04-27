import { Button } from "@/src/components/ui/button";
import { hideWalletAddress } from "@/src/lib/utils";
import {
  useDeleteProfileImageMutation,
  useDonorProfileQuery,
  useUpdateProfileImageMutation,
  useValidateUserAuthQuery,
} from "@/src/store/services/api/donorAuthApi";
import {
  CameraIcon,
  CheckIcon,
  CopyIcon,
  PencilIcon,
  User,
  WalletIcon,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useConnect, useConnection, useConnectors, useDisconnect } from "wagmi";
import { useConnectWalletMutation } from "@/src/store/services/api/walletApi";
import { useDispatch } from "react-redux";
import { loggedIn } from "@/src/store/services/slice/authSlice";
import { toast } from "sonner";
import { CAUSE_CATEGORIES } from "@/src/constants/misc";

const Details = () => {
  const { data: profileData, isLoading: isProfileLoading } =
    useDonorProfileQuery({});
  const { data: user, isLoading: isUserLoading } = useValidateUserAuthQuery({});
  useEffect(() => {
    if (profileData) {
      console.log("📥 [Profile Data Sync]:", profileData.profile);
      console.log("📸 [Current Image URL]:", profileData.profile?.profileImage?.url || profileData.profile?.profileImage);
    }
  }, [profileData]);

  const [preview, setPreview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const displayName =
    user?.data?.name || profileData?.profile?.name || "Anonymous";

  const profile = profileData?.profile || profileData?.data?.profile;

const profileImage =
  preview ||
  (profile?.profileImage?.url) || // If it's an object
  (typeof profile?.profileImage === "string" ? profile.profileImage : null);

  const [updateProfileImage, { isLoading: isUpdating }] =
    useUpdateProfileImageMutation();
  const [deleteProfileImage, { isLoading: isDeleting }] =
    useDeleteProfileImageMutation();

  

  

  const { isConnected, address } = useConnection();
  const { mutate } = useConnect();
  const connectors = useConnectors();
  const { mutate: disconnect } = useDisconnect();
  const [connectWallet, { isLoading: isWalletLoading }] =
    useConnectWalletMutation();
  const dispatch = useDispatch();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      console.log("📤 [Uploading Image]...");
      const response = await updateProfileImage(formData).unwrap();
      
      // 2. LOG: Check exactly what the server sent back after upload
      console.log("✅ [Upload Success - Server Response]:", response);
      
      toast.success("Profile picture updated!");
    } catch (err) {
      console.error("❌ [Upload Error]:", err);
      toast.error("Failed to upload image");
      setPreview(null);
    } finally {
      URL.revokeObjectURL(localUrl);
    }
  };

  const handleDeleteImage = async (e: React.MouseEvent) => {
    e.stopPropagation();
   try {
      console.log("🗑️ [Attempting to Delete Image]...");
      const response = await deleteProfileImage(undefined).unwrap();
      
      // 3. LOG: Check response after deletion
      console.log("✅ [Delete Success - Server Response]:", response);
      
      toast.success("Profile picture removed");
      setPreview(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (error) {
      console.error("❌ [Delete Error]:", error);
      toast.error("Failed to remove image");
    }
  };

  const shortAddress = address ? hideWalletAddress(address) : "—";

  const copyAddress = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleWalletConnect = () => {
    if (isConnected) {
      disconnect();
      return;
    }

    if (!connectors.length) {
      console.log("No wallet connectors available");
      return;
    }

    mutate(
      { connector: connectors[0] },
      {
        onSuccess: (data) => {
          const address = data.accounts?.[0];
          if (!address) return;

          connectWallet({ walletAddress: address })
            .unwrap()
            .then(() => {
              dispatch(
                loggedIn({
                  name: user?.data?.name || "Donor",
                  email: user?.data?.email || "",
                  role: "Donor",
                }),
              );
            })
            .catch((err) => {
              console.log("Wallet connect API failed:", err);
            });
        },
        onError: (error) => {
          console.log("Wallet connection failed:", error);
        },
      },
    );
  };
  return (
    <div className="bg-white rounded-xl p-5">
      <div className="flex items-start gap-4">
        <div
          className="relative w-20 h-20 shrink-0 cursor-pointer group"
          onClick={() => inputRef.current?.click()}
        >
          {profileImage ? (
            <Image
              src={profileImage}
              alt="avatar"
              fill
              className="object-cover rounded-xl"
            />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-neutral-100 border border-dashed border-muted flex items-center justify-center">
              <User className="text-muted-foreground" />
            </div>
          )}
          <div className="absolute inset-0 rounded-xl bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            {profileImage ? (
              <button
                onClick={handleDeleteImage}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                title="Remove image"
                disabled={isDeleting}
              >
                <Trash2 color="white" size={24} />
              </button>
            ) : (
              <CameraIcon color="white" size={24} />
            )}
          </div>
          <input
            id="profile-upload"
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            aria-label="Upload profile picture"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold text-secondaryText mb-0.5 truncate">
            {displayName}
          </h2>
          <div className="flex items-center gap-1.5 mb-3">
            <WalletIcon size={14} className="text-primaryText" />
            <span className="text-sm">
              {isProfileLoading ? "Loading…" : shortAddress}
            </span>
            {address && (
              <button
                onClick={copyAddress}
                className="text-primaryText hover:text-secondaryText transition-colors"
                title="Copy address"
              >
                {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
              </button>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={() => inputRef.current?.click()}
              text={isUpdating ? "Updating..." : "Change picture"}
              leftIcon={<PencilIcon size={14} />}
              disabled={isUpdating}
            />
            <Button
              onClick={handleWalletConnect}
              text={isConnected ? "Disconnect wallet" : "Connect wallet"}
              variant="grey"
              disabled={isWalletLoading}
            />{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
