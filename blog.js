// Load footer section
$(function () {
    $('#footer').load('footer.html');
});

// Function to load categories from local storage and display them in the dropdown
function loadCategories() {
    const storedCategories = JSON.parse(localStorage.getItem('categories')) || []; // Fetch categories from localStorage
    const dropdown = document.getElementById('categories'); // Dropdown element
    dropdown.innerHTML = '<option value="showall">Select Category</option>'; // Default option

    // Filter active categories and add them to the dropdown
    storedCategories.forEach(category => {
        if (category.type === 'Active') {
            const option = document.createElement('option');
            option.value = category.name;
            option.textContent = category.name;
            dropdown.appendChild(option);
        }
    });
}

// Function to select category and display posts
function selectCategory() {
    const selectedCategory = document.getElementById('categories').value;
    localStorage.setItem('selectedCategory', selectedCategory);
    displayPosts();
}

// Function to format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: '2-digit' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}

// Function to filter active posts
function getActivePosts(posts) {
    return posts.filter(post => post.selectStatus === 'Active');
}

// Function to display posts based on selected category
let limit = 4;
function displayPosts(limit = 4) {
    const postContainer = document.getElementById('posts');
    const storedPosts = JSON.parse(localStorage.getItem('posts')) || [];
    const selectedCategory = localStorage.getItem('selectedCategory') || 'showall';
    postContainer.innerHTML = '';

    let activePosts = getActivePosts(storedPosts);

    if (selectedCategory !== 'showall') {
        activePosts = activePosts.filter(post => post.categories === selectedCategory);
    }

    // Reverse the array so the newest posts appear first
    activePosts = activePosts.reverse();
    if (activePosts.length === 0) {
        postContainer.innerHTML = '<p class="text-center mt-5 text-danger opacity-100 font-weight-bold "><-------THIS CATEGORY DOES NOT HAVE ANY POSTS-------></p>';
        document.getElementById('showMore').style.display = 'none';
        return;
    }

    // Slice to show only limited posts
    const postsToDisplay = activePosts.slice(0, limit);

    // Display the posts
    postsToDisplay.forEach((post, index) => {
        const postElement = document.createElement('div');
        postElement.classList.add('col-md-3', 'mb-4', 'p-3');
        postElement.setAttribute('id', `post-${index + 1}`);

        const postImage = post.imageBase64Array && post.imageBase64Array.length > 0 ? post.imageBase64Array[0] : 'placeholder.jpg';

        postElement.innerHTML = `
            <a class="text-decoration-none">
                <div class="image-container">
                    <img src="${postImage}" alt="Post Image" class="post-image" style="width: 100%; height: 200px; object-fit: cover;">
                    <span class="category-label">${post.categories}</span>
                </div>
                <div class="post-content">
                    <h3 class="post-title mb-3 text-dark">${post.postTitle.slice(0, 60) + '.....'}</h3>
                    <p class="post-date text-muted"><i class="fas fa-calendar-alt pe-2"></i>${formatDate(post.postDate)}</p>
                </div>
            </a>
        `;

        postElement.addEventListener('click', () => {
            localStorage.setItem('selectedPostIndex', storedPosts.indexOf(post));
            window.location.href = 'show.html';
        });

        postContainer.appendChild(postElement);
    });

    const showMoreButton = document.getElementById('showMore');
    if (activePosts.length > limit) {
        showMoreButton.style.display = 'block';
        showMoreButton.textContent = limit >= activePosts.length ? 'Show Less' : 'Show More';
    } else {
        showMoreButton.style.display = 'none';
    }
}

// Function to show more posts
function toggleShowMore() {
    const showMoreButton = document.getElementById('showMore');
    const storedPosts = JSON.parse(localStorage.getItem('posts')) || [];
    const selectedCategory = localStorage.getItem('selectedCategory') || 'showall';

    // Filter active posts
    let activePosts = getActivePosts(storedPosts);
    if (selectedCategory !== 'showall') {
        activePosts = activePosts.filter(post => post.categories === selectedCategory);
    }

    if (showMoreButton.getAttribute('data-showing') === 'false') {
        limit = activePosts.length; // Show all posts
        showMoreButton.setAttribute('data-showing', true);
    } else {
        limit = 4; // Show only 4 posts
        showMoreButton.setAttribute('data-showing', false);
    }
    displayPosts(limit);
}

// Function to load more posts
function loadMorePosts() {
    const currentPostCount = document.getElementById('posts').children.length;
    displayPosts(currentPostCount + 10); // Load more posts in increments of 10
}

// Initialize categories and posts when the page loads
window.onload = function () {
    loadCategories(); // Load categories into the dropdown
    displayPosts(); // Display posts

    const showMoreButton = document.getElementById('showMore');
    if (showMoreButton) {
        showMoreButton.addEventListener('click', loadMorePosts);
    }
};
