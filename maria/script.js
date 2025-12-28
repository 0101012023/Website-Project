$(document).ready(function() {
    let cartCount = 0;

    // Function to load products from a JSON file
    function loadProducts(jsonFile, containerId) {
        $.getJSON(jsonFile, function(products) {
            const container = $(containerId);
            container.empty();
            $.each(products, function(index, product) {
                const card = $(`
                    <div class="section-card" data-index="${index}" data-json="${jsonFile}">
                        <img src="${product.image}" alt="${product.title}">
                        <p>${product.title}</p>
                    </div>
                `);
                container.append(card);
            });
        });
    }

    // Load Top Sales and What's New products
    loadProducts("top-sales.json", "#top-sales-display");
    loadProducts("whats-new.json", "#whats-new-display");

    // Show modal when a product card is clicked
    $(document).on("click", ".section-card", function() {
        const index = $(this).data("index");
        const jsonFile = $(this).data("json");
        $.getJSON(jsonFile, function(products) {
            const product = products[index];
            $("#modalImage").attr("src", product.image);
            $("#modalTitle").text(product.title);
            $("#modalDescription").text(product.description);
            $("#modalPrice").text(product.price);
            $("#productModal").fadeIn();
        });
    });

    // Close modal
    $("#closeModal").click(function() {
        $("#productModal").fadeOut();
    });

    // Add to cart
    $("#addToCartBtn").click(function() {
        cartCount++;
        $(".badge").text(cartCount);
        alert("Product added to cart!");
        $("#productModal").fadeOut();
    });

    // Close modal if clicked outside content
    $(window).click(function(e) {
        if ($(e.target).is("#productModal")) {
            $("#productModal").fadeOut();
        }
    });

    // Search by brand
    $("#searchBtn").click(function() {
        const query = $("#brandSearch").val().toLowerCase();
        $(".section-card").each(function() {
            const title = $(this).find("p").text().toLowerCase();
            if (title.includes(query)) $(this).show();
            else $(this).hide();
        });
    });
});
