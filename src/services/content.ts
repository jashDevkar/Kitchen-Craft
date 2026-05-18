import axios from "axios";

export interface ContentItem {
  _id?: string;
  imageUrl: string;
  createdAt: string;
  displayOnHomePage?: boolean;
}



export const fetchSectionContents = async (sectionName: string,mode:string|null = "management" ): Promise<ContentItem[]> => {
  try {
    const response = await axios.post("/content", { sectionName, mode:mode ?? "management" });
    return response.data.data;
  } catch (err) {
    console.log(err);
  }
  return [];
};





export const uploadContent = async (sectionName: string, file: File): Promise<ContentItem> => {
  try {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("sectionName", sectionName);
    const response = await axios.post("/add-content", formData);
  } catch (err) {
    console.log(err);
  }
  return { imageUrl: URL.createObjectURL(file), createdAt: new Date().toISOString() };
};


export const toggleImageVisibility = async (contentId: string): Promise<ContentItem> => {
  const response = await axios.patch("/toggle-image-visibility", { contentId });
  return response.data.data;
};



export const deleteContent = async (contentIds: Array<string | null>): Promise<void> => {
  const response = await axios.delete("/delete-content", { data: { contentIds } });
  return response.data;
};