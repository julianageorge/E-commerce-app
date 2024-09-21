const searchicon=document.getElementById("nav-search");
searchicon.addEventListener("click",(e)=>{
    searchicon.classList.add('open');
})

const searchInput = document.getElementById("search");
const selectOption = document.getElementById("choose");

const searchProducts = (searchTerm, searchBy) => {
    const products = document.querySelectorAll(".product");
    searchTerm = searchTerm.toUpperCase();

    products.forEach(product => {
        let searchText;
        switch (searchBy) {
            case "name":
                searchText = product.querySelector("h2").textContent.toUpperCase();
                break;
            case "category":
                searchText = product.querySelector("p").textContent.toUpperCase();
                break;
            case "price":
                searchText = product.querySelector(".product-price").textContent.toUpperCase();
                break;
            default:
                searchText = "";
        }
        product.style.display = searchText.includes(searchTerm) ? "" : "none";
    });
};

selectOption.addEventListener("change", () => {
    const searchBy = selectOption.value;
    searchProducts(searchInput.value, searchBy);
});

searchInput.addEventListener("keyup", () => {
    const searchBy = selectOption.value;
    searchProducts(searchInput.value, searchBy);
});
