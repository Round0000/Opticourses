const collection = db.collection("opticourses");

let localDB = [];

async function getCollection() {
  collection
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        localDB.push(doc.data());
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

uiCreateForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newItem = {
    product: e.target.createProduct.value,
    brand: e.target.createBrand.value,
    detail: e.target.createDetail.value,
    shop: e.target.createShop.value,
    volume: e.target.createVolume.value,
    price: Number(e.target.createPrice.value),
    kgprice: Number(e.target.createKgprice.value),
  };

  console.log(newItem);
  addToDB(newItem);

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
    if (item.product.toUpperCase().includes(query)) {
      const price = item.price ? item.price.toFixed(2) + "€" : "---";
      const kgprice = item.kgprice ? item.kgprice.toFixed(2) + "€" : "---";
      const li = document.createElement("LI");
      li.classList.add("results-list-item");
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
