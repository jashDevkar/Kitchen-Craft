import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ImageModal from '../Components/ImageModal';
import * as Accordion from '@radix-ui/react-accordion';
import Bg from '../assets/add-bg.avif'
import { FaChevronDown } from 'react-icons/fa';

interface Section {
  id: string;
  name: string;
}

interface ContentItem {
  id: string;
  _id?: string;
  imageUrl: string;
  createdAt: string;
}

const fetchAllSections = async (): Promise<Section[]> => {
  const res = await axios.get('http://localhost:8000/sections');
  return res.data.data ?? [];
};

const fetchSectionContent = async (sectionName: string): Promise<ContentItem[]> => {
  const res = await axios.post('http://localhost:8000/content', {
    sectionName,
    mode: 'viewall',
  });
  return res.data.data ?? [];
};

export default function ViewAll() {
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageUrls, setCurrentImageUrls] = useState<string[]>([]);

  const { data: sections = [], isLoading: sectionsLoading } = useQuery<Section[]>({
    queryKey: ['all-sections'],
    queryFn: fetchAllSections,
  });

  const { data: contentMap = {} } = useQuery({
    queryKey: ['all-content', sections],
    queryFn: async () => {
      const map: Record<string, ContentItem[]> = {};
      await Promise.all(
        sections.map(async (section) => {
          map[section.name] = await fetchSectionContent(section.name);
        })
      );
      return map;
    },
    enabled: sections.length > 0,
  });

  const openImageModal = (images: string[], index: number) => {
    setCurrentImageUrls(images);
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const totalImages = Object.values(contentMap).reduce((s, a) => s + a.length, 0);

  return (
    <div className="relative min-h-full w-full overflow-x-hidden">

      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `url(${Bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="fixed inset-0 -z-10 bg-black/70" />
      <header className="sticky top-0 z-20 border-b border-amber-900/20 bg-linear-to-br from-amber-900 to-stone-900 px-6 py-4 flex items-center justify-between shadow-lg">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h1 className="text-2xl font-bold text-white">Portfolio</h1>
        <div className="w-8" />
      </header>

  
      <div className="max-w-5xl mx-auto px-6 py-10">

        {sectionsLoading ? (
          <div className="flex flex-col items-center justify-center py-48 gap-4">
            <div className="w-8 h-8 rounded-full border-2 border-stone-200 border-t-amber-800 animate-spin" />
            <p className="text-sm text-stone-400">Loading collections…</p>
          </div>

        ) : sections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-48 gap-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white border border-stone-200 flex items-center justify-center shadow-sm">
              <svg className="w-7 h-7 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 3h18M3 21h18" />
              </svg>
            </div>
            <p className="text-stone-600 font-medium">No collections yet</p>
            <p className="text-stone-400 text-sm">Add some content to get started</p>
          </div>

        ) : (
          <>
            <div className="flex items-center gap-2 mb-8 text-sm text-stone-400">
              <span>{sections.length} {sections.length === 1 ? 'collection' : 'collections'}</span>
              <span className="text-stone-300">·</span>
              <span>{totalImages} {totalImages === 1 ? 'image' : 'images'}</span>
            </div>

            <Accordion.Root type="multiple" className="space-y-3">
              {sections.map((section) => {
                const sectionContent = contentMap[section.name] || [];
                const imageUrls = sectionContent.map((item) => item.imageUrl);
                const preview = sectionContent.slice(0, 4);

                return (
                  <Accordion.Item
                    key={section.id}
                    value={section.name}
                    className="bg-white/50 rounded-2xl border border-stone-200/50 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    {/* Trigger */}
                    <Accordion.Trigger className="w-full px-6 py-5 flex items-center gap-4 text-left outline-none [&[data-state=open]_.chevron-icon]:rotate-180 [&[data-state=open]_.section-title]:text-amber-900 cursor-pointer">

                      {/* Preview thumbnails */}
                      <div className="shrink-0 -space-x-2 hidden sm:flex">
                        {preview.length > 0 ? (
                          preview.map((item, i) => (
                            <div
                              key={i}
                              className="w-10 h-10 rounded-lg border-2 border-white overflow-hidden bg-stone-100"
                              style={{ zIndex: preview.length - i }}
                            >
                              <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
                            </div>
                          ))
                        ) : (
                          <div className="w-10 h-10 rounded-lg border-2 border-white bg-stone-100 flex items-center justify-center">
                            <svg className="w-4 h-4 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Label */}
                      <div className="flex-1 min-w-0">
                        <p className="section-title text-base font-semibold text-stone-800 capitalize transition-colors duration-200 truncate">
                          {section.name}
                        </p>
                        <p className="text-sm text-white mt-0.5">
                          {sectionContent.length === 0
                            ? 'Empty collection'
                            : `${sectionContent.length} ${sectionContent.length === 1 ? 'image' : 'images'}`}
                        </p>
                      </div>

                      {/* Chevron */}
                      <div className="chevron-icon w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center flex-shrink-0 transition-transform duration-300">
                        <FaChevronDown />

                      </div>
                    </Accordion.Trigger>

                    {/* Content */}
                    <Accordion.Content className="overflow-hidden data-[state=open]:animate-[accordionOpen_0.3s_ease] data-[state=closed]:animate-[accordionClose_0.25s_ease]">
                      <div className="px-6 pb-6 border-t border-stone-100">
                        {sectionContent.length === 0 ? (
                          <div className="py-10 flex flex-col items-center gap-2 text-center">
                            <p className="text-sm text-stone-400">Nothing here yet</p>
                          </div>
                        ) : (
                          <div className="pt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {sectionContent.map((item, index) => (
                              <button
                                key={index}
                                onClick={() => openImageModal(imageUrls, index)}
                                className="group/img relative rounded-xl overflow-hidden aspect-square bg-stone-100 outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2"
                              >
                                <img
                                  src={item.imageUrl}
                                  alt={`${section.name} ${index + 1}`}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/25 transition-colors duration-300 flex items-center justify-center">
                                  <div className="opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 bg-white rounded-full p-1.5 shadow-md">
                                    <svg className="w-3.5 h-3.5 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z" />
                                    </svg>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </Accordion.Content>
                  </Accordion.Item>
                );
              })}
            </Accordion.Root>
          </>
        )}
      </div>

      <ImageModal
        isOpen={isModalOpen}
        images={currentImageUrls}
        initialIndex={selectedImageIndex ?? 0}
        onClose={() => setIsModalOpen(false)}
      />

      <style>{`
        @keyframes accordionOpen {
          from { height: 0; opacity: 0; }
          to { height: var(--radix-accordion-content-height); opacity: 1; }
        }
        @keyframes accordionClose {
          from { height: var(--radix-accordion-content-height); opacity: 1; }
          to { height: 0; opacity: 0; }
        }
      `}</style>
    </div>
  );
}