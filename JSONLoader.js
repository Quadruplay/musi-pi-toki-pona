export async function loadJSONFile(filePath) {
    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      
      const jsonData = await response.json();
      return jsonData;
    } catch (error) {
      throw new Error(`Error loading JSON file: ${error.message}`);
    }
  }