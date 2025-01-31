// ?Import Alanı:
import { personIcon } from "./constants.js";
import { getNoteIcon, getStatus } from "./helpers.js";
import elements from "./ui.js";

// <--------------------------ARA---------------------------------->

// !Başlangıçta kullanıcı konumuna erişmeliyiz, bu sayede haritamızın başlangıç konumunu belirlemiş olucaz..
// todo:Global Değişkenler:
var map;
let clickedCoords;
let layer;
// <-------------------------ARA--------------------------------->
// LocalStorage'den notes keyine sahip elemanları aldık:
let notes = JSON.parse(localStorage.getItem("notes")) || [];
//<-------------------------ARA---------------------------------->
// window içerisindeki navigator objesi içerisinde kullanıcının açmış olduğu sekme ile alakalı birçok veriyi bulundurur.(Kordinat ,tarayıcıile alakalı veriler.Pc ile alakalı veriler bizde geolocation yapısı ile kordinatın hepsine eriştik.Geolocation içerisindeki getCurrentPosition kullanıcının mevcut konumunu almak için kullanılır.bu fonksiyon içerisine iki adet Callback fonksiyon ister ve birinci değer kullanıcının konum bilgisini paylaşması durumunda çalışır ikinci değer ise konum bilgisini paylaşmaması durumunda çalışır. )
// console.log(window.navigator.geolocation);
window.navigator.geolocation.getCurrentPosition(
  //   (e) => {
  //     console.log(e);Succes kısma denk gelirken,
  //   },
  //   (e) => {
  //     console.log(e);Error denk geliyor,
  //   }
  (e) => {
    // !konum bilgisi paylaşıldığında :
    loadMap([e.coords.latitude, e.coords.longitude], "Mevcut Konum");
  },
  (e) => {
    // !konum bilgisi paylaşılmadığında :
    loadMap([41.037826, 28.985113], "Varsayılan Konum");
  }
);

// Todo:Haritayı oluşturduğumuz foksiyondur:
// ?Leaflet'den aldğım Map Oluşturma Kısmı:X=enlem:latitude Y=boylam:longitude değerleri, temsilen setview([x=latitude,y=longitude],z=1:dersem zooma karşılık geliyor.)
// var map = L.map("map").setView([51.505, -0.09], 1);
// map = L.map("map").setView([51.505, -0.09], 1);

function loadMap(currentPosition, msg) {
  map = L.map("map", {
    // Orginal zoom araçlarını kaldırmak için yazdık:
    zoomControl: false,
  }).setView(currentPosition, 12);

  // todo:Haritayı Render Ettiğimiz Nokta:
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Zoom araçlarının konumlanması:
  L.control
    .zoom({
      position: "bottomright",
    })
    .addTo(map);

  //  !Ekrana basılacak bir katman oluşturduk:
  //   let layer = L.layerGroup().addTo(map);
  layer = L.layerGroup().addTo(map);

  //  Kullanıcının başlangıç konumuna bır tane marker ekledik:
  L.marker(currentPosition, { icon: personIcon }).addTo(map).bindPopup(msg);

  // <--------------------------ARA---------------------------->

  // Todo:Harita üzerindeki tıklama olaylarını izlemek için:

  // map.on("click", () => {
  //   alert("Haritaya tıklanıldı..");
  // });
  map.on("click", onMapClick);

  // <--------------------------ARA------------------------------>
  // ?Notları Render Eden Fonksiyon:
  renderNotes();
  // <------------------------ARA------------------------------>
  //  ?Markerları Render Eden Fonksiyon:
  renderMarkers();
  // <------------------------ARA------------------------------>
  // todo:Haritaya tıklanıldığında çalışacak fonksiyon:
  function onMapClick(e) {
    //   console.log(e);
    // Tıklanıla yerin konum bilgisine erişme:
    // const clickedCoords = console.log(e.latlng.lat, e.latlng.lng);
    //  clickedCoords = console.log(e.latlng.lat, e.latlng.lng);
    clickedCoords = [e.latlng.lat, e.latlng.lng];
    //  console.log(clickedCoords);

    //?  Aside'a add classını eklemek için yaptık:
    elements.aside.classList.add("add");
  }

  // <--------------------------ARA-------------------------------->

  // !Formun Gönderilidiğinde çalışcak fonskiyon:
  elements.form.addEventListener("submit", (e) => {
    // Sayfa yenilemeyi Engellemek:
     e.preventDefault();
    // Form İçerisindeki değerlere Erişmek için:
    // console.log("form Gönderildi..");
    // console.log(e);
    // console.log(e.target[].value);

    const title = e.target[0].value;
    const date = e.target[1].value;
    const status = e.target[2].value;

    // Bir tane  not objesi oluşturmak için:
    const newNote = {
      id: new Date().getTime(),
      title,
      date,
      status,
      coords: clickedCoords,
    };
    //   console.log(newNote);
    //   console.log(typeof newNote);

    // <--------------------------ARA------------------------------->
    // !note Dizisine Yeni Notu eklemek için push methodunu kullandık:
    notes.push(newNote);

    //   Bu verileri kaybetmemek adına LocalStorage'a yükleyeceğiz!
    // localStorage.setItem("notes", JSON.stringify(newNote));
    // !LocalStoreage'a notları kaydetmek için:NEwnote ve notes yer değiştirdi.
    localStorage.setItem("notes", JSON.stringify(notes));

    // <--------------------------ARA-------------------------------->
    // Todo:2.Formu Resetle :
    e.target.reset();

    // Todo:2.Aside'ı Eski haline Döndürmek:
    elements.aside.classList.remove("add");

    // <--------------------------ARA-------------------------------->
    //  ? Notları Render Etmek için bu alana geri geldik:
    renderNotes();
    // <--------------------------ARA-------------------------------->
    //  ? Markerları Render Etmek için bu alana geldik:
    renderMarkers();
  });

  // <--------------------------ARA-------------------------------->

  // !Close-Btn'e tıklanınca Aside'ı eski haline döndürmek için yaptığımız işlem:
  //Todo:1.elementler içinde bulunana iptal butonuna tıklanındağında daha önce class olarak verilmiş olan add classını kaldır demek!

    elements.cancelBtn.addEventListener("click", () => {
    elements.aside.classList.remove("add");
  });

  // <--------------------------ARA------------------------------>
  // Mevcur notları Rendeer Eden fonksiyon yazmak için:

  function renderNotes() {
    // ?Note dizisini dönerek her bir not için HTML oluşturduk:
    const noteCard = notes
      .map((note) => {
        // !  1.Tarih ayarları:
        // console.log(
        // new Date("2025-01-31").toLocaleDateString("tr", {
        // day: "numeric",
        // day: "2-digit",
        // month:"short"
        // month:"narrow"
        // month: "long",
        // year: "numeric",
        // year: "2-digit",
        // })
        // );
        const date = new Date(note.date).toLocaleDateString("tr", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });

        // !  2.Status ayarları:
        //<p>${note.status}</p> bu daha önceki hali dönüşüm yaptık//GetStatus adında bır fonksıyorn yazılırken bu fonskıyon kendısıne verılen status degerıne göre uygun ıfadeyı return etti.

        return `<li> 
        <!-- !İnfo -->
        <div>
          <p>${note.title}</p>
          <p>${date}</p>
          <p>${getStatus(note.status)}</p>
        </div> 
        <!-- !İcons -->
        <div class="icons">
          <i data-id='${note.id}' class="bi bi-airplane-fill" id="fly-btn"></i>
          <i data-id='${note.id}' class="bi bi-trash" id="delete-btn"></i>
        </div> 
         </li>`;
      })
      .join("");

    // ?İlgili HTML'i Arayüze Ekle:
    elements.noteList.innerHTML = noteCard;
  }
  // !<--------------------------ARA------------------------------>
  // Sayfa Yükleniliğinde/ yüklenildiği anı izlemesi ve RenderNot Fonksiyonunu çalıştırması için:
  // document.addEventListener("DOMContentLoaded", () => {
  //     RenderNotes();
  // });
  // !<--------------------------ARA------------------------------>


  // Todo:Delete İconlarına Eriş ve her İcon'a tıklanınca bir fonksiyon çalıştır:
  // document.querySelectorAll("li #delete-btn").forEach((btn) => {
  document.querySelectorAll("#delete-btn").forEach((btn) => {
    // console.log(btn);
    // !Delete  Iconun data id'sine eriş :
    const id = btn.dataset.id;
    // console.log(id);

    // !Delete Iconlarına tıklanınca deleteNote fonksiyonu çalışır:
    btn.addEventListener("click", () => {
      //    deleteNote();
      deleteNote(id);
    });
  });

  // Todo:Fly iconlarına Eriş:
  document.querySelectorAll("#fly-btn").forEach((btn) => {
    // console.log(btn);
    // Fly Btn'e tıklanıldığında flyNote fonksiyonu çalıştır.
    btn.addEventListener("click", () => {
      // Fly btn idsine erişmek:
      const id = +btn.dataset.id;
      flyToNote(id);
    });
  });
}

// <--------------------------ARA------------------------------>
//!Her Note için Bir Marker Render Eden Fonksiyon:
// Burada biz notlar alanına girdik,map methodu ile yazdıgımız her bir notu gezdik ve yadığımız not için uygun olan markere bastırdık.
function renderMarkers() {
  // Haritadaki markerları sıfırladık:
  layer.clearLayers();
  notes.map((note) => {
    // Eklenecek İconun türüne karar ver
    const icon = getNoteIcon(note.status)
    // Todo:Not için marker oluşturduk:
    L.marker(note.coords, { icon }).addTo(layer).bindPopup(note.title);

  });
}

// <--------------------------ARA------------------------------>

// !Delete Function /Notu Silen Fonksiyonumuz:
function deleteNote(id) {
  //alert("Delete icona tıklanıldı..");
  //  ?Kullanıcıdan onay almak için confirm methoduyla çalıştık:
  const res = confirm("Not silme işlemini onaylıyor musunuz?");
  // console.log(res);
  // ?Eğer kullanıcı onayladıysa tamam dedyse true geçtiyse:
  if (res) {
    // ? İd'si bilinen notu note dizisinden kaldırmak:
    notes = notes.filter((note) => note.id != id);
    //  console.log(notes);

    // ? Localstorage'ı güncellemek lazım:
    localStorage.setItem("notes", JSON.stringify(notes));
    // Notları Render et:
    renderNotes();
    // Markerları Render et:  
    renderMarkers();
  }

}

// <--------------------------ARA------------------------------>

//? Notlara Focuslanan  Fonksiyon:
function flyToNote(id) {
  // alert("Flyyy");
  // İd'si bilinen notu note dızısı ıcınden bul fınd methodu ıle:
  // console.log(id);
  const foundedNote = notes.find((note) => note.id == id);
  // console.log(foundedNote);
  // Bulunan not'a focuslanmak için:
  map.flyTo(foundedNote.coords, 12);

}
  // ArrowIcon'a tıklanınca çalışacak fonksiyon:
  elements.arrowIcon.addEventListener("click", () => {
  elements.aside.classList.toggle("hide");
});