import { goToIcon ,homeIcon ,jobIcon ,parkIcon, schoolIcon, airportIcon, hospitalIcon, forestIcon, restauranteIcon } from "./constants.js";

// Note'un Status Değeri için düzenleme yapan fonksiyon:
const getStatus=(status)=>{
    switch (status) {
      case "goto":
        return "Ziyaret";
      case "park":
        return "Park";
      case "home":
        return "Ev";
      case "job":
        return "İş";
      case "hospital":
        return "hastane";
      case "school":
        return "okul";
      case "airport":
        return "havalanı";
      case "forest":
        return "Mesire Alanı";
      case "restaurante":
        return "restaurante";
      default:
        return "Tanımsız Durum";
    }
};

// Her status için gerekli ikona karar veren bir fonksiyon yazalım ve Dışarda aldığı statuse göre benım adıma karar verip marker yerleştircek:
const getNoteIcon=(status)=>{
    switch (status) {
      case "goto":
        return goToIcon;
      case "park":
        return parkIcon;
      case "home":
        return homeIcon;
      case "job":
        return jobIcon;
      case "hospital":
        return hospitalIcon;
      case "school":
        return schoolIcon;
      case "airport":
        return airportIcon;
      case "forest":
        return forestIcon;
      case "restaurante":
        return restauranteIcon;
      default:
        return null;
    }
};

export {getStatus ,getNoteIcon};