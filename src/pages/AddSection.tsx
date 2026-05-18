import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import Bg from '../assets/add-bg.avif'
import { fetchSections, addSection, deleteSections } from '../services/section'
import type { Section } from '../services/section'
import { Plus } from 'lucide-react'





function AddSection() {
  const [sectionName, setSectionName] = useState('')
  const [addedId, setAddedId] = useState<string | null>(null)
  const [deleteMode, setDeleteMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])


  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { data: sections = [], isLoading } = useQuery<Section[]>({
    queryKey: ['sections'],
    queryFn: fetchSections,
  })



  const mutation = useMutation({
    mutationFn: (name: string) => addSection(name),
    onSuccess: (newSection) => {
      queryClient.invalidateQueries({ queryKey: ['sections'] })
      if (newSection) {

        setAddedId(newSection._id);
      }
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (ids: string[]) => deleteSections(ids),
    onSuccess: () => {
      queryClient.setQueryData<Section[]>(['sections'], (old = []) =>
        old.filter((s) => !selectedIds.includes(s._id))
      )
      setSelectedIds([])
      setDeleteMode(false)
    },
  })

  const handleAdd = () => {
    const trimmed = sectionName.trim()
    if (!trimmed) return
    mutation.mutate(trimmed)
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const handleDeleteMode = () => {
    setDeleteMode(true)
    setSelectedIds([])
  }

  const handleCancelDelete = () => {
    setDeleteMode(false)
    setSelectedIds([])
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })

  return (
    <div className="min-h-full text-white font-sans relative">
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `url(${Bg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="fixed inset-0 -z-10 bg-black/85" />


      <div className="w-full mx-auto lg:w-[50%] px-6 lg:py-12 py-8 space-y-10">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Add Section</h1>
          <p className="text-white/40 text-sm">Name your section, then add content blocks to it.</p>
        </div>

        <div className="bg-white/5 border border-white/8 rounded-2xl md:p-6 px-3 space-y-2 py-2">
          <label className="block text-xs font-medium text-white/50 uppercase tracking-widest">
            Section name
          </label>
          <div className="flex md:gap-3 gap-2">
            <input
              type="text"
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="e.g. Hero Banner, Features, Testimonials…"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-amber-800/60 focus:bg-white/[0.07] transition-all duration-150"
            />
            <button
              onClick={handleAdd}
              disabled={!sectionName.trim() || mutation.isPending}
              className="flex items-center gap-2 md:px-6 px-3 md:py-3 py-1 rounded-xl bg-linear-to-br from-amber-900 to-stone-900 text-white text-sm font-medium border border-white/10 hover:brightness-110 hover:scale-[1.02] active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-150 shadow-lg shadow-amber-950/30"
            >
              {mutation.isPending ? (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                </svg>
              ) : (
                <Plus/>
              )}
              {mutation.isPending ? 'Adding…' : 'Add'}
            </button>
          </div>
          {mutation.isError && (
            <p className="text-red-400 text-xs">Something went wrong. Please try again.</p>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-medium text-white/50 uppercase tracking-widest">
                Your sections
              </h2>
              <span className="text-xs text-white/25">
                {sections.length} {sections.length === 1 ? 'section' : 'sections'}
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
                    disabled={selectedIds.length === 0 || deleteMutation.isPending}
                    className="text-xs px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-800/40 text-red-400 hover:bg-red-900/60 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    {deleteMutation.isPending ? 'Deleting…' : `Delete (${selectedIds.length})`}
                  </button>
                </>
              ) : (
                <button
                  onClick={handleDeleteMode}
                  disabled={sections.length === 0}
                  className="text-xs text-white/40 hover:text-red-400 px-3 py-1.5 rounded-lg border border-white/8 hover:border-red-800/40 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  Delete
                </button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 rounded-xl bg-white/5 animate-pulse"
                  style={{ opacity: 1 - i * 0.2 }}
                />
              ))}
            </div>
          ) : sections.length === 0 ? (
            <div className="text-center py-14 text-white/20 text-sm space-y-2">
              <svg className="w-10 h-10 mx-auto opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p>No sections yet. Add your first one above.</p>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto px-2 bg-white/5 py-2 rounded-2xl">
              <ul className="space-y-2">
                {sections.map((section) => (
                  <li
                    key={section._id}
                    onClick={() => deleteMode && toggleSelect(section._id)}
                    className={`
                      flex items-center justify-between border rounded-xl px-5 py-4
                      transition-all duration-200 group
                      ${deleteMode ? 'cursor-pointer' : ''}
                      ${selectedIds.includes(section._id)
                        ? 'border-red-800/50 bg-red-950/20'
                        : addedId === section._id
                          ? 'border-amber-800/40 bg-amber-950/20'
                          : 'border-white/6 bg-white/7 hover:border-white/12 hover:bg-white/5'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      {deleteMode ? (
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0 ${selectedIds.includes(section._id) ? 'bg-red-700 border-red-600' : 'border-white/20 bg-white/5'}`}>
                          {selectedIds.includes(section._id) && (
                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-800 opacity-70 shrink-0" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-white/90">{section.name}</p>
                        <p className="text-xs text-white/30 mt-0.5">{formatDate(section.createdAt)}</p>
                      </div>
                    </div>

                    {!deleteMode && (
                      <button
                        onClick={() => navigate(`/section/${section.name}`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white/50 border border-white/8 hover:border-amber-800/50 hover:text-amber-500 hover:bg-amber-950/20 active:scale-95 transition-all duration-150 opacity-0 group-hover:opacity-100"
                      >
                        Add content
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddSection