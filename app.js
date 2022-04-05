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
  selected.classList.toggle("selected");
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
