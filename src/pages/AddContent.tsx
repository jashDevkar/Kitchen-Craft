import React, { useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Bg from '../assets/add-bg.avif'
import axios from 'axios';


// ─── Types ────────────────────────────────────────────────────────────────────

interface ContentItem {
   
    imageUrl: string
    createdAt: string
}

// ─── Dummy API functions (replace with real endpoints) ────────────────────────

const fetchSectionContents = async (sectionName: string): Promise<ContentItem[]> => {
    // TODO: replace with real API call
    // e.g. const res = await fetch(`/api/sections/${sectionName}/contents`)
    //      return res.json()


    try{
        const response = await axios.post('http://localhost:8000/content',{sectionName});
        console.log(response.data.data);
        return response.data.data;

    }catch(err){
        console.log(err);
    }

    return [
        {
           
            imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
            createdAt: '2025-05-14T10:00:00Z',
        },
        {
          
            imageUrl: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=600&q=80',
            createdAt: '2025-05-15T14:30:00Z',
        },
    ]
}

const uploadContent = async (sectionName: string, file: File): Promise<ContentItem> => {

    try {
        const formData = new FormData()

        formData.append('image', file);
        formData.append('sectionName',sectionName);

        const response = await axios.post('http://localhost:8000/add-content',formData);
        const data = response.data;
        console.log(data);
    } catch (err) {
        console.log(err);
    }



    // TODO: replace with real API call
    // e.g. const formData = new FormData()
    //      formData.append('image', file)
    //      const res = await fetch(`/api/sections/${sectionName}/contents`, { method: 'POST', body: formData })
    //      return res.json()

    // Dummy: convert file to a local object URL
    const imageUrl = URL.createObjectURL(file)
    return {
        imageUrl,
        createdAt: new Date().toISOString(),
    }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })

// ─── Component ────────────────────────────────────────────────────────────────

function AddContent() {
    const { name } = useParams<{ name: string }>()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [dragOver, setDragOver] = useState(false)

    const sectionName = name ?? 'unknown'

    // Fetch all content for this section
    const { data: contents = [], isLoading } = useQuery<ContentItem[]>({
        queryKey: ['contents', sectionName],
        queryFn: () => fetchSectionContents(sectionName),
    })

    // Mutation to upload content
    const mutation = useMutation({
        mutationFn: (file: File) => uploadContent(sectionName, file),
        onSuccess: (newItem) => {
            queryClient.setQueryData<ContentItem[]>(['contents', sectionName], (old = []) => [
                newItem,
                ...old,
            ])
            setSelectedFile(null)
            setPreview(null)
        },
    })

    const handleFileChange = (file: File | null) => {
        if (!file) return
        setSelectedFile(file)
        setPreview(URL.createObjectURL(file))
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(false)
        const file = e.dataTransfer.files[0]
        if (file && file.type.startsWith('image/')) handleFileChange(file)
    }

    const handleUpload = () => {
        if (!selectedFile) return
        mutation.mutate(selectedFile)
    }

    const handleClear = () => {
        setSelectedFile(null)
        setPreview(null)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    return (
        <div className="relative min-h-full w-full overflow-x-hidden font-sans">
            {/* ── Background ─────────────────────────────────────────────────────── */}
            <div
                className="fixed inset-0 -z-10"
                style={{
                    backgroundImage: `url(${Bg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <div className="fixed inset-0 -z-10 bg-black/70" />
            <div
                className="fixed inset-0 -z-10"
                style={{
                    background:
                        'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.72) 100%)',
                }}
            />

            
            {/* ── Main ───────────────────────────────────────────────────────────── */}
            <div className="max-w-2xl mx-auto px-6 py-12 space-y-10">

                {/* Heading */}
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

                {/* ── Upload card ─────────────────────────────────────────────────── */}
                <div className="bg-white/4 border border-white/8 rounded-2xl p-6 space-y-5">
                    <p className="text-xs font-medium text-white/50 uppercase tracking-widest">
                        Upload image
                    </p>

                    {/* Drop zone */}
                    <div
                        className={`
              relative rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer
              flex flex-col items-center justify-center gap-3 text-center
              ${dragOver
                                ? 'border-amber-700 bg-amber-950/30'
                                : preview
                                    ? 'border-white/10 bg-transparent'
                                    : 'border-white/15 hover:border-white/30 bg-white/2 hover:bg-white/4'}
            `}
                        style={{ minHeight: preview ? 'auto' : '160px' }}
                        onClick={() => !preview && fileInputRef.current?.click()}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
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
                                {/* Overlay clear button */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleClear() }}
                                    className="
                    absolute top-3 right-3
                    bg-black/60 backdrop-blur-sm text-white/70
                    hover:text-white hover:bg-black/80
                    border border-white/10 rounded-lg p-1.5
                    transition-all opacity-0 group-hover:opacity-100
                  "
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                                <div className="px-4 pb-4 pt-3 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                                    </svg>
                                    <span className="text-xs text-white/50 truncate">{selectedFile?.name}</span>
                                    <span className="ml-auto text-xs text-white/25">
                                        {selectedFile ? (selectedFile.size / 1024).toFixed(0) + ' KB' : ''}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-white/60">
                                        <span className="text-amber-500 font-medium">Click to browse</span> or drag & drop
                                    </p>
                                    <p className="text-xs text-white/25 mt-1">PNG, JPG, WEBP up to 10MB</p>
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

                    {/* Add Content button */}
                    <button
                        onClick={handleUpload}
                        disabled={!selectedFile || mutation.isPending}
                        className="
              w-full flex items-center justify-center gap-2.5
              px-6 py-3.5 rounded-xl
              bg-linear-to-br from-amber-900 to-stone-900
              text-white text-sm font-medium tracking-wide
              border border-white/10
              hover:brightness-110 hover:scale-[1.01]
              active:scale-[0.98]
              disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:brightness-100
              transition-all duration-150
              shadow-lg shadow-amber-950/30
            "
                    >
                        {mutation.isPending ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                                </svg>
                                Uploading…
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m-8-8h16" />
                                </svg>
                                Add Content
                            </>
                        )}
                    </button>

                    {mutation.isError && (
                        <p className="text-red-400 text-xs text-center">Upload failed. Please try again.</p>
                    )}
                </div>

                {/* ── Contents grid ───────────────────────────────────────────────── */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xs font-medium text-white/50 uppercase tracking-widest">
                            Section contents
                        </h2>
                        <span className="text-xs text-white/25">
                            {contents.length} {contents.length === 1 ? 'image' : 'images'}
                        </span>
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
                            <svg className="w-10 h-10 mx-auto opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p>No content yet. Upload an image above.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            {contents.map((item,index) => (
                                <div
                                    key={index}
                                    className="group relative rounded-xl overflow-hidden border border-white/8 bg-white/3 hover:border-white/20 transition-all duration-200"
                                >
                                    <img
                                        src={item.imageUrl}
                                        alt="Section content"
                                        className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {/* Date badge */}
                                    <div className="absolute bottom-0 inset-x-0 px-3 py-2 bg-linear-to-t from-black/70 to-transparent">
                                        <p className="text-xs text-white/60">{formatDate(item.createdAt)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AddContent