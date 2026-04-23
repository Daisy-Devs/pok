"use client";

import { Button } from "@/src/components/ui/button";
import { hideWalletAddress } from "@/src/lib/utils";
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
import React, { useRef, useState } from "react";
import { useConnect, useConnection, useConnectors, useDisconnect } from "wagmi";
import { useConnectWalletMutation } from "@/src/store/services/api/walletApi";
import { useDispatch } from "react-redux";
import { loggedIn } from "@/src/store/services/slice/authSlice";
import {
  useDeleteProfileImageMutation,
  useDonorProfileQuery,
  useUpdateProfileImageMutation,
} from "@/src/store/services/api/donorAuthApi";
import { toast } from "sonner";

const Details = () => {
  const { data, isLoading } = useDonorProfileQuery({});

  // Fixed spelling from isUpadating
  const [updateProfileImage, { isLoading: isUpdating }] =
    useUpdateProfileImageMutation();
  const [deleteProfileImage, { isLoading: isDeleting }] =
    useDeleteProfileImageMutation();

  const [preview, setPreview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { isConnected, address } = useConnection();
  const { mutate } = useConnect();
  const connectors = useConnectors();
  const { mutate: disconnect } = useDisconnect();
  const [connectWallet, { isLoading: isWalletLoading }] =
    useConnectWalletMutation();
  const dispatch = useDispatch();

  const profile = data?.profile;
  const displayName = profile?.name || "Anonymous User";
  const profileImage = preview || profile?.profileImage || null;

  // Added 'async' keyword here to fix the "await" error
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDeleteImage = async () => {
    try {
      await deleteProfileImage(undefined).unwrap();
      toast.success("Profile picture removed");
      setPreview(null);
    } catch (error) {
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
    if (!connectors.length) return;

    mutate(
      { connector: connectors[0] },
      {
        onSuccess: (data) => {
          const walletAddr = data.accounts?.[0];
          if (!walletAddr) return;

          connectWallet({ walletAddress: walletAddr })
            .unwrap()
            .then(() => {
              dispatch(loggedIn({ role: "DONOR" }));
            });
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
          {preview ? (
            <Image
              src={preview}
              alt="avatar"
              fill
              className="object-cover rounded-xl"
            />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-neutral-100 border border-dashed border-muted flex items-center justify-center">
              <User />
            </div>
          )}

          <div className="absolute inset-0 rounded-xl bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <CameraIcon color="white" />
          </div>

          <input
            id="profile-upload"
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            aria-label="Upload profile picture"
            // REMOVED onClick here to prevent infinite loop
          />
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold text-secondaryText mb-0.5 truncate">
            {displayName}
          </h2>
          <div className="flex items-center gap-1.5 mb-3">
            <WalletIcon size={14} className="text-primaryText" />
            <span className="text-sm">{shortAddress}</span>
            {address && (
              <button
                onClick={copyAddress}
                className="text-primaryText hover:text-secondaryText transition-colors"
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

            {profile?.profileImage && (
              <Button
                onClick={handleDeleteImage}
                text="Remove"
                variant="grey" // Adjust variant based on your UI library
                leftIcon={<Trash2 size={14} />}
                disabled={isDeleting}
              />
            )}

            <Button
              onClick={handleWalletConnect}
              text={isConnected ? "Disconnect wallet" : "Connect wallet"}
              variant="grey"
              disabled={isWalletLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
