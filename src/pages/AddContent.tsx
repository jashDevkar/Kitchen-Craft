import React, { useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Bg from "../assets/add-bg.avif";
import ImageModal from "../Components/ImageModal";
import {
  fetchSectionContents,
  uploadContent,
  toggleImageVisibility,
  deleteContent,
} from "../services/content";
import type { ContentItem } from "../services/content";
import { MdOutlineFileUpload } from "react-icons/md";
import { FaImage, FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

function AddContent() {
  const { name } = useParams<{ name: string }>();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sectionName = name ?? "unknown";

  const { data: contents = [], isLoading } = useQuery<ContentItem[]>({
    queryKey: ["contents", sectionName],
    queryFn: () => fetchSectionContents(sectionName),
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadContent(sectionName, file),
    onSuccess: (newItem) => {
      queryClient.setQueryData<ContentItem[]>(
        ["contents", sectionName],
        (old = []) => [newItem, ...old],
      );
      setSelectedFile(null);
      setPreview(null);
      queryClient.invalidateQueries({ queryKey: ["contents", sectionName] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (contentId: string) => toggleImageVisibility(contentId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["contents", sectionName] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (contentIds: Array<string | null>) => deleteContent(contentIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contents", sectionName] });
      setSelectedIds([]);
      setDeleteMode(false);
    },
  });

  const handleFileChange = (file: File | null) => {
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleFileChange(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    uploadMutation.mutate(selectedFile);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleDeleteMode = () => {
    setDeleteMode(true);
    setSelectedIds([]);
  };

  const handleCancelDelete = () => {
    setDeleteMode(false);
    setSelectedIds([]);
  };

  const imageUrls = contents.map((item) => item.imageUrl);

  return (
    <div className="relative min-h-full w-full overflow-x-hidden font-sans">
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `url(${Bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="fixed inset-0 -z-10 bg-black/70" />
      <div
        className="fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.72) 100%)",
        }}
      />

      <div className="max-w-2xl mx-auto px-6 py-12 space-y-10">
        <div className="space-y-1">
          <p className="text-xs text-amber-600 font-medium tracking-widest uppercase">
            Section
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white capitalize">
            {decodeURIComponent(sectionName)}
          </h1>
          <p className="text-white/40 text-sm">
            Upload images to populate this section's content.
          </p>
        </div>

        {/* Upload card */}
        <div className="bg-white/4 border border-white/8 rounded-2xl p-6 space-y-5">
          <p className="text-xs font-medium text-white/50 uppercase tracking-widest">
            Upload image
          </p>

          <div
            className={`relative rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-3 text-center ${dragOver ? "border-amber-700 bg-amber-950/30" : preview ? "border-white/10 bg-transparent" : "border-white/15 hover:border-white/30 bg-white/2 hover:bg-white/4"}`}
            style={{ minHeight: preview ? "auto" : "160px" }}
            onClick={() => !preview && fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            {preview ? (
              <div className="w-full relative group">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full max-h-72 object-cover rounded-xl"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClear();
                  }}
                  className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white/70 hover:text-white hover:bg-black/80 border border-white/10 rounded-lg p-1.5 transition-all opacity-0 group-hover:opacity-100"
                >
                  <IoClose />
                </button>
                <div className="px-4 pb-4 pt-3 flex items-center gap-2">
                  <FaImage color="orange" />

                  <span className="text-xs text-white/50 truncate">
                    {selectedFile?.name}
                  </span>
                  <span className="ml-auto text-xs text-white/25">
                    {selectedFile
                      ? (selectedFile.size / 1024).toFixed(0) + " KB"
                      : ""}
                  </span>
                </div>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center">
                  <MdOutlineFileUpload size={30} color="white" />
                </div>
                <div>
                  <p className="text-sm text-white/60">
                    <span className="text-amber-500 font-medium">
                      Click to browse
                    </span>{" "}
                    or drag & drop
                  </p>
                  <p className="text-xs text-white/25 mt-1">
                    PNG, JPG, WEBP up to 10MB
                  </p>
                </div>
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
          />

          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploadMutation.isPending}
            className="cursor-pointer w-full flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-linear-to-br from-amber-900 to-stone-900 text-white text-sm font-medium tracking-wide border border-white/10 hover:brightness-110 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:brightness-100 transition-all duration-150 shadow-lg shadow-amber-950/30"
          >
            {uploadMutation.isPending ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                  />
                </svg>
                Uploading…
              </>
            ) : (
              <>
                <FaPlus />
                Add Content
              </>
            )}
          </button>

          {uploadMutation.isError && (
            <p className="text-red-400 text-xs text-center">
              Upload failed. Please try again.
            </p>
          )}
        </div>

        {/* Contents grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-xs font-medium text-white/50 uppercase tracking-widest">
                Section contents
              </h2>
              <span className="text-xs text-white/25">
                {contents.filter((c) => c.displayOnHomePage).length} shown •{" "}
                {contents.length} {contents.length === 1 ? "image" : "images"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {deleteMode ? (
                <>
                  <button
                    onClick={handleCancelDelete}
                    className="text-xs text-white/40 hover:text-white px-3 py-1.5 rounded-lg border border-white/8 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(selectedIds)}
                    disabled={
                      selectedIds.length === 0 || deleteMutation.isPending
                    }
                    className="text-xs px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-800/40 text-red-400 hover:bg-red-900/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    {deleteMutation.isPending
                      ? "Deleting…"
                      : `Delete (${selectedIds.length})`}
                  </button>
                </>
              ) : (
                <button
                  onClick={handleDeleteMode}
                  disabled={contents.length === 0}
                  className="text-xs text-white/40 hover:text-red-400 px-3 py-1.5 rounded-lg border border-white/8 hover:border-red-800/40 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  Delete
                </button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-xl bg-white/5 animate-pulse aspect-video"
                  style={{ opacity: 1 - i * 0.3 }}
                />
              ))}
            </div>
          ) : contents.length === 0 ? (
            <div className="text-center py-14 text-white/20 text-sm space-y-2">
              <svg
                className="w-10 h-10 mx-auto opacity-30"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p>No content yet. Upload an image above.</p>
            </div>
          ) : (
            <div className="overflow-auto h-fit">
                <div className="grid grid-cols-2 gap-3 ">
              {contents.map((item, index) => {
                const id = item._id ?? "";
                const isSelected = selectedIds.includes(id);

                return (
                  <div
                    key={index}
                    onClick={() => deleteMode && id && toggleSelect(id)}
                    className={`
                      group relative rounded-xl overflow-hidden border transition-all duration-200
                      ${deleteMode ? "cursor-pointer" : ""}
                      ${
                        isSelected
                          ? "border-red-800/50 bg-red-950/20"
                          : "border-white/8 bg-white/3 hover:border-white/20"
                      }
                    `}
                  >
                    {/* Image */}
                    <div
                      onClick={(e) => {
                        if (!deleteMode) {
                          e.stopPropagation();
                          setSelectedImageIndex(index);
                          setIsModalOpen(true);
                        }
                      }}
                    >
                      <img
                        src={item.imageUrl}
                        alt="Section content"
                        className={`w-full aspect-video object-cover transition-transform duration-300 ${!deleteMode ? "group-hover:scale-105 cursor-pointer" : ""}`}
                      />
                    </div>

                    {/* Red overlay when selected */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-red-950/20 pointer-events-none" />
                    )}

                    {deleteMode && (
                      <div
                        className={`absolute top-2 left-2 w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0 ${isSelected ? "bg-red-700 border-red-600" : "border-white/30 bg-black/40 backdrop-blur-sm"}`}
                      >
                        {isSelected && (
                          <svg
                            className="w-2.5 h-2.5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                    )}

                    {/* Date badge */}
                    <div className="absolute bottom-0 inset-x-0 px-3 py-2 bg-linear-to-t from-black/70 to-transparent">
                      <p className="text-xs text-white/60">
                        {formatDate(item.createdAt)}
                      </p>
                    </div>

                    {/* Visibility toggle — hidden in delete mode */}
                    {!deleteMode && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (item._id) toggleMutation.mutate(item._id);
                        }}
                        disabled={toggleMutation.isPending}
                        className={`absolute top-2 right-2 p-2 rounded-lg backdrop-blur-sm border transition-all hover:scale-110 disabled:opacity-50 ${item.displayOnHomePage ? "bg-amber-600/60 border-amber-400/30 text-white" : "bg-white/10 border-white/20 text-white/50"}`}
                        title={
                          item.displayOnHomePage
                            ? "Shown on homepage"
                            : "Hidden from homepage"
                        }
                      >
                        {item.displayOnHomePage ? (
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                          </svg>
                        ) : (
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M11.83 9L5.5 2.67c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.41 11c.05.05.06.13.06.22.06 1.66 1.4 3 3.06 3 .09 0 .17-.01.22-.06l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L12.24 9c-.05-.05-.06-.13-.06-.22-.06-1.66-1.4-3-3.06-3-.09 0-.17.01-.22.06zM12 17c-2.76 0-5-2.24-5-5 0-.65.13-1.26.36-1.83l2.92 2.92c.05.05.06.13.06.22.06 1.66 1.4 3 3.06 3 .09 0 .17-.01.22-.06l2.92 2.92c-.57.23-1.18.36-1.83.36z" />
                          </svg>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            </div>
          )}
        </div>
      </div>

      <ImageModal
        isOpen={isModalOpen}
        images={imageUrls}
        initialIndex={selectedImageIndex ?? 0}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default AddContent;
