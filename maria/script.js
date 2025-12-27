document.addEventListener('DOMContentLoaded', () => {
    const categories = document.querySelectorAll('.category-item');

    categories.forEach(item => {
        item.addEventListener('click', () => {
            // Visual feedback for active category
            categories.forEach(c => {
                c.style.background = "#141414";
                c.style.color = "#C5A059";
            });

            item.style.background = "#C5A059";
            item.style.color = "#141414";

            console.log("Selected: " + item.innerText);
        });
    });

    // Active Navbar Link
    const navLinks = document.querySelectorAll('.nav-links a');
    const currentPage = window.location.pathname.split("/").pop();

    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});
