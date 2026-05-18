import axios from "axios"

export interface Section {
  _id: string
  name: string
  createdAt: string
  displayOnHomePage: boolean
}


export const fetchSections = async (): Promise<Section[]> => {
  try {
    const response = await axios.get('http://localhost:8000/sections')
    console.log("sections",response.data.data)
    return response.data.data
  } catch (err) {
    console.log(err)
    return []
  }
}

export const fetchAllHomePageSections = async()=>{
    try{

    }catch(err){

    }
}


export const addSection = async (name: string): Promise<Section> => {
    try {
      const response = await axios.post('http://localhost:8000/add-section', {
        name,
        displayOnHomePage: true,
      })
      return response.data
    } catch (err) {
      console.log(err)
      
    }
    return {
      _id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString(),
      displayOnHomePage: false,
    }
  }


  export const deleteSections = async (ids: string[]): Promise<void> => {
    try{
        await axios.post('http://localhost:8000/delete-sections', { 'ids':ids})
    }
    catch(err){
        console.log(err);
    }
  }