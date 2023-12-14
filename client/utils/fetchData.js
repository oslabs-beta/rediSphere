const fetchData = async () => {
  try {
    //call to backend
    const res = await fetch('/api/cacheHitsRatio');
    //grab data from response
    const newData = await res.json();
    //parse from JSON
    return await newData;
  } catch (error) {
    console.log(error);
  }
};

export default fetchData;
