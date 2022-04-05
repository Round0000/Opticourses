const collection = db.collection("opticourses");

let localDB = [];

async function getCollection() {
  collection
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        const item = doc.data();
        item.id = doc.id;
        localDB.push(item);
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
}

// Initial data fetch
getCollection();

const uiCreateForm = document.querySelector(".create-form");
const uiSearchForm = document.querySelector(".search-form");
const uiResultsList = document.querySelector(".results-list");
const uiShopLists = document.querySelector(".shoplists");
const tabs = document.querySelector(".tabs");
const tabSearch = document.querySelector("#tabSearch");
const tabCreate = document.querySelector("#tabCreate");
const tabShopLists = document.querySelector("#tabLists");
const sections = [uiSearchForm, uiResultsList, uiCreateForm, uiShopLists];

tabs.addEventListener("click", (e) => {
  e.preventDefault();
  if (
    e.target.classList.contains("tabBtn") &&
    !e.target.classList.contains("tabCurrent")
  ) {
    document.querySelectorAll(".tabBtn").forEach((btn) => {
      btn.classList.remove("tabCurrent");
    });
    e.target.classList.add("tabCurrent");

    sections.forEach((section) => {
      section.classList.add("hidden");
    });

    if (e.target === tabSearch) {
      uiSearchForm.classList.remove("hidden");
      uiResultsList.classList.remove("hidden");
    }
    if (e.target === tabCreate) {
      uiCreateForm.classList.remove("hidden");
    }
    if (e.target === tabShopLists) {
      uiShopLists.classList.remove("hidden");
    }
  }
});

uiResultsList.addEventListener("click", (e) => {
  const selected = e.target.closest(".results-list-item");

  if (e.target.matches(".closeActions")) {
    selected.classList.remove("selected");
    return;
  }

  if (e.target.matches(".itemClone")) {
    cloneProduct(localDB.find((item) => item.id === selected.dataset.ref));
    selected.classList.remove("selected");
    return;
  }

  if (e.target.matches(".itemEdit")) {
    // editProduct(localDB.find((item) => item.id === selected.dataset.ref));
    selected.classList.remove("selected");
    return;
  }

  selected.classList.add("selected");
});

uiCreateForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newItem = {
    product: e.target.createProduct.value.trim(),
    brand: e.target.createBrand.value.trim(),
    detail: e.target.createDetail.value.trim(),
    shop: e.target.createShop.value.trim(),
    volume: e.target.createVolume.value.trim(),
    price: Number(e.target.createPrice.value.trim()),
    kgprice: Number(e.target.createKgprice.value.trim()),
  };

  console.log(newItem);
  addToDB(newItem);
  getCollection();

  e.target.reset();
});

uiSearchForm.addEventListener("submit", (e) => {
  e.preventDefault();

  output(e.target.searchInput.value.toUpperCase());

  e.target.reset();
});

function output(query) {
  uiResultsList.innerHTML = "";
  localDB.forEach((item) => {
    if (
      item.product.toUpperCase().includes(query) ||
      item.brand.toUpperCase().includes(query) ||
      item.detail.toUpperCase().includes(query)
    ) {
      const price = item.price ? item.price.toFixed(2) + "€" : "---";
      const kgprice = item.kgprice ? item.kgprice.toFixed(2) + "€" : "---";
      const li = document.createElement("LI");
      li.classList.add("results-list-item");
      li.dataset.ref = item.id;
      li.innerHTML = `
    <h2 class="item-product">${item.product}</h2>
      <h3 class="item-brand">${item.brand}</h3>
      <p class="item-detail">${item.detail}</p>
      <p class="item-shop">${item.shop}</p>
      <div class="item-values">
        <p class="item-volume">${item.volume}</p>
        <p class="item-price">${price}</p>
        <p class="item-kgprice">${kgprice}</p>
      </div>
      <div class="item-actions">
          <button class="itemEdit"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg> Edit</button>
          <button class="itemClone"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-copy">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg> Clone</button>
          <button class="itemAddToList"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-list">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg> Add to list</button>
            <button class="closeActions"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--ic" width="32" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"></path></svg></button>
        </div>
  `;
      uiResultsList.append(li);
    }
  });
}

function addToDB(item) {
  const newID = item.product[0] + item.brand[0] + item.shop[0] + Date.now();
  collection
    .doc(newID)
    .set(item)
    .then((docRef) => {
      console.log("Document written with ID: ", newID);
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}

// Clone product
function cloneProduct(obj) {
  document.querySelectorAll(".tabBtn").forEach((btn) => {
    btn.classList.remove("tabCurrent");
  });
  tabCreate.classList.add("tabCurrent");

  sections.forEach((section) => {
    section.classList.add("hidden");
  });

  populateForm(obj);

  uiCreateForm.classList.remove("hidden");
}

function populateForm(obj) {
  uiCreateForm.product.value = obj.product;
  uiCreateForm.brand.value = obj.brand;
  uiCreateForm.detail.value = obj.detail;
  uiCreateForm.shop.value = obj.shop;
  uiCreateForm.volume.value = obj.volume;
  uiCreateForm.price.value = obj.price;
  uiCreateForm.kgprice.value = obj.kgprice;
}

function editProduct(obj) {
  populateForm(obj);

  uiCreateForm.classList.remove("hidden");
}

// db.collection('opticourses').doc('ASM1617897266303').update({ product: "Adoucissant" })
