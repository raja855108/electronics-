import React, { useState, useRef } from 'react';
import { Upload, X, ArrowLeft, ArrowRight, Trash2, Image as ImageIcon, Link as LinkIcon, RefreshCw, Eye } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext.tsx';
import { useToast } from '../../context/ToastContext.tsx';

interface SingleUploadProps {
  mode: 'single';
  value: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
}

interface GalleryUploadProps {
  mode: 'gallery';
  values: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  helperText?: string;
  maxFiles?: number;
}

type ImageUploadFieldProps = SingleUploadProps | GalleryUploadProps;

export const ImageUploadField: React.FC<ImageUploadFieldProps> = (props) => {
  const { token } = useAdminAuth();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const uploadFile = async (file: File): Promise<string | null> => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast(`"${file.name}" is not an image file.`, 'error');
      return null;
    }

    // 15MB limit
    if (file.size > 15 * 1024 * 1024) {
      showToast(`"${file.name}" exceeds the 15MB file size limit.`, 'error');
      return null;
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = reader.result as string;
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              filename: file.name,
              data: base64Data,
              contentType: file.type
            })
          });

          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Server upload failed');
          }

          const data = await res.json();
          resolve(data.url);
        } catch (err: any) {
          showToast(err.message || 'Upload error', 'error');
          resolve(null);
        }
      };
      reader.onerror = () => {
        showToast('Failed to read file locally.', 'error');
        resolve(null);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      if (props.mode === 'single') {
        const file = files[0];
        const uploadedUrl = await uploadFile(file);
        if (uploadedUrl) {
          props.onChange(uploadedUrl);
          showToast('Image uploaded successfully to server storage!', 'success');
        }
      } else {
        const fileList = Array.from(files);
        const uploadedUrls: string[] = [];

        for (const file of fileList) {
          const url = await uploadFile(file);
          if (url) uploadedUrls.push(url);
        }

        if (uploadedUrls.length > 0) {
          props.onChange([...props.values, ...uploadedUrls]);
          showToast(`Uploaded ${uploadedUrls.length} gallery image(s)!`, 'success');
        }
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFilesSelected(e.dataTransfer.files);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    if (props.mode === 'single') {
      props.onChange(urlInput.trim());
      showToast('Image URL assigned.', 'info');
    } else {
      props.onChange([...props.values, urlInput.trim()]);
      showToast('Image added to gallery.', 'info');
    }
    setUrlInput('');
    setShowUrlInput(false);
  };

  // Gallery reordering handlers
  const handleMove = (index: number, direction: 'left' | 'right') => {
    if (props.mode !== 'gallery') return;
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= props.values.length) return;

    const newArr = [...props.values];
    const temp = newArr[index];
    newArr[index] = newArr[targetIndex];
    newArr[targetIndex] = temp;
    props.onChange(newArr);
  };

  const handleRemoveGalleryImage = (index: number) => {
    if (props.mode !== 'gallery') return;
    const removed = props.values[index];
    const newArr = props.values.filter((_, i) => i !== index);
    props.onChange(newArr);

    // If it was an upload on our server, attempt cleanup
    if (removed.startsWith('/uploads/')) {
      const filename = removed.replace('/uploads/', '');
      fetch(`/api/upload/${filename}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {});
    }
    showToast('Gallery image removed.', 'info');
  };

  const handleRemoveSingleImage = () => {
    if (props.mode !== 'single') return;
    const removed = props.value;
    props.onChange('');

    if (removed.startsWith('/uploads/')) {
      const filename = removed.replace('/uploads/', '');
      fetch(`/api/upload/${filename}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {});
    }
    showToast('Image removed.', 'info');
  };

  return (
    <div className="space-y-2.5">
      {/* Label & Controls header */}
      <div className="flex items-center justify-between text-xs">
        <label className="font-semibold text-slate-300">
          {props.label || (props.mode === 'single' ? 'Product Image' : 'Gallery Images')}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? 'Use File Upload' : 'Paste URL Manually'}</span>
        </button>
      </div>

      {/* Manual URL input drawer */}
      {showUrlInput && (
        <form onSubmit={handleUrlSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="https://... or /uploads/..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium"
          >
            Apply URL
          </button>
        </form>
      )}

      {/* ---------------- SINGLE IMAGE VIEW ---------------- */}
      {props.mode === 'single' && (
        <div>
          {props.value ? (
            <div className="relative group w-full sm:w-48 aspect-square rounded-2xl bg-[#070a10] border border-slate-800 overflow-hidden p-2 flex items-center justify-center">
              <img
                src={props.value}
                alt="Product Preview"
                className="w-full h-full object-contain rounded-xl"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium shadow-md transition-all"
                  title="Replace Image"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleRemoveSingleImage}
                  className="p-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-medium shadow-md transition-all"
                  title="Remove Image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                isDragOver
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-800 hover:border-blue-500/40 bg-slate-900/40 hover:bg-slate-900/70'
              }`}
            >
              {uploading ? (
                <div className="space-y-2">
                  <RefreshCw className="w-6 h-6 text-blue-400 animate-spin mx-auto" />
                  <span className="text-xs text-slate-300">Writing to server disk...</span>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-slate-200">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-[11px] text-slate-500">
                      PNG, JPG, WEBP, or SVG up to 15MB
                    </p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* ---------------- GALLERY MULTI-IMAGE VIEW ---------------- */}
      {props.mode === 'gallery' && (
        <div className="space-y-3">
          {/* Gallery Thumbnails Grid with Reordering */}
          {props.values.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {props.values.map((url, idx) => (
                <div
                  key={`${url}-${idx}`}
                  className="relative group aspect-square rounded-xl bg-[#070a10] border border-slate-800 overflow-hidden p-2 flex flex-col justify-between"
                >
                  {/* Position Badge */}
                  <span className="absolute top-1.5 left-1.5 bg-black/70 text-slate-300 font-mono text-[10px] px-1.5 py-0.5 rounded border border-slate-700 z-10">
                    #{idx + 1}
                  </span>

                  <img
                    src={url}
                    alt={`Gallery ${idx + 1}`}
                    className="w-full h-full object-contain rounded-lg"
                  />

                  {/* Hover Reordering & Removal Controls */}
                  <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2 backdrop-blur-sm z-20">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 'left')}
                        disabled={idx === 0}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-20 text-white transition-colors"
                        title="Move Earlier in Gallery"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 'right')}
                        disabled={idx === props.values.length - 1}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-20 text-white transition-colors"
                        title="Move Later in Gallery"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(idx)}
                      className="px-2 py-1 rounded bg-rose-600/80 hover:bg-rose-500 text-white text-[10px] font-medium flex items-center gap-1 transition-colors"
                      title="Remove from Gallery"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upload Drop Zone for Gallery */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all flex items-center justify-center gap-3 ${
              isDragOver
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-slate-800 hover:border-blue-500/40 bg-slate-900/30 hover:bg-slate-900/60'
            }`}
          >
            {uploading ? (
              <div className="flex items-center gap-2 text-xs text-blue-400">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Uploading batch to persistent server storage...</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-medium text-slate-200">
                    Add gallery images (select multiple)
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Upload angles, lifestyle shots, or macro details
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={props.mode === 'gallery'}
        className="hidden"
        onChange={(e) => handleFilesSelected(e.target.files)}
      />

      {props.helperText && (
        <p className="text-[11px] text-slate-500">{props.helperText}</p>
      )}
    </div>
  );
};
