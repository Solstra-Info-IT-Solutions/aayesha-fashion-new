"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Play, X } from "lucide-react";
import toast from "react-hot-toast";

import {
  MAX_REVIEW_IMAGE_BYTES,
  MAX_REVIEW_MEDIA,
  MAX_REVIEW_VIDEO_BYTES,
  uploadReviewMedia,
  type OwnReviewMedia,
} from "@/lib/api/reviews";

import "./ReviewMedia.css";

const ACCEPT = "image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime";

interface ReviewMediaPickerProps {
  value: OwnReviewMedia[];
  onChange: (next: OwnReviewMedia[]) => void;
  accessToken: string;
}

export function ReviewMediaPicker({
  value,
  onChange,
  accessToken,
}: ReviewMediaPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(0);

  const hasVideo = value.some((item) => item.type === "video");

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    let current = value;
    let videoUsed = hasVideo;

    for (const file of Array.from(files)) {
      if (current.length >= MAX_REVIEW_MEDIA) {
        toast.error(`You can add up to ${MAX_REVIEW_MEDIA} photos / videos.`);
        break;
      }

      const isVideo = file.type.startsWith("video/");

      if (isVideo && videoUsed) {
        toast.error("Only one video can be added to a review.");
        continue;
      }

      if (isVideo && file.size > MAX_REVIEW_VIDEO_BYTES) {
        toast.error(`${file.name}: videos must be 25 MB or smaller.`);
        continue;
      }

      if (!isVideo && file.size > MAX_REVIEW_IMAGE_BYTES) {
        toast.error(`${file.name}: photos must be 5 MB or smaller.`);
        continue;
      }

      try {
        setUploading((count) => count + 1);

        const uploaded = await uploadReviewMedia(file, accessToken);

        current = [...current, uploaded];
        videoUsed = videoUsed || isVideo;
        onChange(current);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Upload failed.",
        );
      } finally {
        setUploading((count) => count - 1);
      }
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  const full = value.length >= MAX_REVIEW_MEDIA;

  return (
    <div className="review-media-picker">
      <ul className="review-media-picker__grid">
        {value.map((item) => (
          <li key={item.publicId} className="review-media-picker__item">
            {item.type === "video" ? (
              <>
                <video src={item.url} muted preload="metadata" />
                <span className="review-media-picker__play" aria-hidden="true">
                  <Play size={16} />
                </span>
              </>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.url} alt="Review upload" />
            )}

            <button
              type="button"
              aria-label="Remove"
              className="review-media-picker__remove"
              onClick={() =>
                onChange(value.filter((m) => m.publicId !== item.publicId))
              }
            >
              <X size={14} />
            </button>
          </li>
        ))}

        {uploading > 0 ? (
          <li className="review-media-picker__item review-media-picker__item--busy">
            <Loader2 size={18} className="review-media-picker__spin" />
          </li>
        ) : null}

        {!full ? (
          <li>
            <button
              type="button"
              className="review-media-picker__add"
              onClick={() => inputRef.current?.click()}
              disabled={uploading > 0}
            >
              <ImagePlus size={20} strokeWidth={1.4} />
              <span>Add photo / video</span>
            </button>
          </li>
        ) : null}
      </ul>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple
        hidden
        onChange={(event) => void handleFiles(event.target.files)}
      />

      <p className="review-media-picker__hint">
        Up to {MAX_REVIEW_MEDIA} files: photos up to 5 MB, one video up to 25 MB.
      </p>
    </div>
  );
}
