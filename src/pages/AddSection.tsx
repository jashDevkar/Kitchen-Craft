import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

interface Section {
  id: string
  name: string
  createdAt: string
  displayOnHomePage: boolean
}


const fetchSections = async (): Promise<Section[]> => {
  try{
    const response = await axios.get('http://localhost:8000/sections');
    return response.data.data;
  }
  catch(err){
    console.log(err);
  }

}




function AddSection() {
  const [sectionName, setSectionName] = useState('')
  const [addedId, setAddedId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  // Fetch all sections
  const { data: sections = [], isLoading } = useQuery<Section[]>({
    queryKey: ['sections'],
    queryFn: fetchSections,
  })

  const addSection = async (name: string): Promise<Section> => {
    try {
      const response = await axios.post('http://localhost:8000/add-section', {
        name: sectionName,
        displayOnHomePage: false
      });
      console.log('response', response.data);
    } catch (err) {
      console.log(err);
    }
    return {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString(),
      displayOnHomePage:false
    }
  }

  // Mutation to add a section
  const mutation = useMutation({
    mutationFn: (name: string) => addSection(name),
    onSuccess: (newSection) => {

      queryClient.setQueryData<Section[]>(['sections'], (old = []) => [
        ...old,
        newSection,
      ])
      setAddedId(newSection.id)
      setSectionName('')
    },
  })

  const handleAdd = () => {
    const trimmed = sectionName.trim()
    if (!trimmed) return
    mutation.mutate(trimmed)
  }

  const handleNavigateToAddContent = (sectionId: string) => {
    console.log('Navigate to Add Content for section:', sectionId)
    alert(`Navigate to Add Content → Section ID: ${sectionId}`)
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })

  return (
    <div className="min-h-screen bg-stone-950 text-white font-sans flex justify-center items-center">


      <div className="w-full mx-auto lg:w-[50%] px-6 py-12 space-y-10">
        {/* Heading */}
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Add Section</h1>
          <p className="text-white/40 text-sm">
            Name your section, then add content blocks to it.
          </p>
        </div>

        {/* Input card */}
        <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 space-y-4">
          <label className="block text-xs font-medium text-white/50 uppercase tracking-widest">
            Section name
          </label>

          <div className="flex gap-3">
            <input
              type="text"
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="e.g. Hero Banner, Features, Testimonials…"
              className="
                flex-1 bg-white/5 border border-white/10 rounded-xl
                px-4 py-3 text-sm text-white placeholder-white/25
                outline-none focus:border-amber-800/60 focus:bg-white/[0.07]
                transition-all duration-150
              "
            />
            <button
              onClick={handleAdd}
              disabled={!sectionName.trim() || mutation.isPending}
              className="
                flex items-center gap-2 px-6 py-3 rounded-xl
                bg-gradient-to-br from-amber-900 to-stone-900
                text-white text-sm font-medium
                border border-white/10
                hover:brightness-110 hover:scale-[1.02]
                active:scale-[0.97]
                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
                transition-all duration-150
                shadow-lg shadow-amber-950/30
              "
            >
              {mutation.isPending ? (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m-8-8h16" />
                </svg>
              )}
              {mutation.isPending ? 'Adding…' : 'Add'}
            </button>
          </div>

          {mutation.isError && (
            <p className="text-red-400 text-xs">Something went wrong. Please try again.</p>
          )}
        </div>

        {/* Sections list */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-white/50 uppercase tracking-widest">
              Your sections
            </h2>
            <span className="text-xs text-white/25">
              {sections.length} {sections.length === 1 ? 'section' : 'sections'}
            </span>
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
            <ul className="space-y-2 ">
              {sections.map((section) => (
                <li
                  key={section.id}
                  className={`
                    flex items-center justify-between
                    bg-white/[0.03] border rounded-xl px-5 py-4
                    transition-all duration-200 group
                    ${addedId === section.id
                      ? 'border-amber-800/40 bg-amber-950/20'
                      : 'border-white/6 hover:border-white/12 hover:bg-white/[0.05]'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-800 opacity-70" />
                    <div>
                      <p className="text-sm font-medium text-white/90">{section.name}</p>
                      <p className="text-xs text-white/30 mt-0.5">{formatDate(section.createdAt)}</p>
                    </div>
                  </div>

                  {/* Navigate to Add Content */}
                  <button
                    onClick={() => handleNavigateToAddContent(section.id)}
                    className="
                      flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                      text-xs font-medium text-white/50
                      border border-white/8
                      hover:border-amber-800/50 hover:text-amber-500 hover:bg-amber-950/20
                      active:scale-95
                      transition-all duration-150
                      opacity-0 group-hover:opacity-100
                    "
                  >
                    Add content
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default AddSection