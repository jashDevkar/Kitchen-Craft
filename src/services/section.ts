import axios from "axios";

export interface Section {
  _id: string;
  name: string;
  createdAt: string;
  displayOnHomePage: boolean;
}

export const fetchSections = async (): Promise<Section[]> => {
  try {
    const response = await axios.get("/sections");
    return response.data.data;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const fetchHomepageSections = async (): Promise<Section[]> => {
  const res = await axios.get('/homepage-sections');
  return res.data.data ?? [];
};



export const addSection = async (name: string): Promise<Section|null> => {
  try {
    const response = await axios.post("/add-section", {
      name,
      displayOnHomePage: true,
    });
    return response.data.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const deleteSections = async (ids: string[]): Promise<void> => {
  try {
    await axios.post("/delete-sections", { ids: ids });
  } catch (err) {
    console.log(err);
  }
};
