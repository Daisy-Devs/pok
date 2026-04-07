import { Button } from '@/src/components/ui/button'
import { hideWalletAddress } from '@/src/lib/utils'
import { CameraIcon, CheckIcon, CopyIcon, PencilIcon, User, WalletIcon } from 'lucide-react'
import Image from 'next/image'
import React, { useRef, useState } from 'react'

const Details = () => {
    const [preview, setPreview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const shortAddress = hideWalletAddress("0x1234567890123456789012345678901234567890");

  const copyAddress = async () => {
    await navigator.clipboard.writeText("0x1234567890123456789012345678901234567890");
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <div className="bg-white rounded-xl p-5">
        <div className="flex items-start gap-4">
          <div
            className="relative w-20 h-20 flex-shrink-0 cursor-pointer group"
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
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-secondaryText mb-0.5 truncate">
              Pranita Singh
            </h2>
            <div className="flex items-center gap-1.5 mb-3">
              <WalletIcon size={14} className="text-primaryText" />
              <span className="text-sm">
                {shortAddress}
              </span>
              <button
                onClick={copyAddress}
                className="text-primaryText hover:text-secondaryText transition-colors"
                title="Copy address"
              >
                {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => {}}
                text="Edit profile"
                leftIcon={<PencilIcon size={14} />}
              />
              <Button
                onClick={() => {}}
                text="Connect wallet"
                variant="grey"
              />
            </div>
          </div>
        </div>
      </div>
  )
}

export default Details