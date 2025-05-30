const SetupModel = {
  async getPlaceName(lat, lon) {
    const apiKey = '734bff584dcd48bbacb0e42139a0cca7'; 
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        return data.results[0].formatted;
      } else {
        return 'Nama tempat tidak ditemukan';
      }
    } catch (error) {
      console.error('Gagal mendapatkan nama tempat:', error);
      return 'Gagal mengambil nama tempat';
    }
  }
};

export default SetupModel;
