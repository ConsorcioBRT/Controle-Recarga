"use client";

import { Camera } from "lucide-react";

type Props = {
  onChange: (files: FileList | null) => void;
};

export default function QuestionPhotoUploader({ onChange }: Props) {
  return (
    <label className="flex items-center justify-center gap-2 w-full h-12 rounded-md border border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition">
      <Camera className="w-4 h-4" />
      <span className="text-sm font-medium">Tirar foto / Escolher imagem</span>

      <input
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        className="hidden"
        onChange={(e) => onChange(e.target.files)}
      />
    </label>
  );
}
