// Load footer section
$(function () {
    $('#footer').load('footer.html');
});

// Function to load categories from local storage and display them in the dropdown
function loadCategories() {
    const storedCategories = JSON.parse(localStorage.getItem('categories')) || [];
    const dropdown = document.getElementById('categories');
    
    if (!dropdown) {
        console.error('Categories dropdown not found');
        return;
    }
    
    dropdown.innerHTML = '<option value="showall">All Categories</option>';

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
    if (!postContainer) {
        console.error('Post container not found');
        return;
    }
    
    const storedPosts = JSON.parse(localStorage.getItem('posts')) || [];
    const selectedCategory = localStorage.getItem('selectedCategory') || 'showall';
    
    // Clear the container
    postContainer.innerHTML = '';
    
    // Log for debugging
    console.log('Total posts in localStorage:', storedPosts.length);
    console.log('Selected category:', selectedCategory);
    
    // Get active posts
    let activePosts = getActivePosts(storedPosts);
    console.log('Active posts:', activePosts.length);
    
    // Filter by category if needed
    if (selectedCategory !== 'showall') {
        activePosts = activePosts.filter(post => post.categories === selectedCategory);
        console.log('Posts after category filtering:', activePosts.length);
    }

    // Reverse the array so the newest posts appear first
    activePosts = activePosts.reverse();
    
    // Show message if no posts
    if (activePosts.length === 0) {
        postContainer.innerHTML = `
            <div class="col-12 text-center mt-5 ">
                <div class="alert alert-info" role="alert">
                    <h4 class="alert-heading">No Posts Found</h4>
                    <p>There are no posts in this category yet.</p>
                    <hr>
                    <button class="btn btn-primary" onclick="showAllPosts()">View All Posts</button>
                </div>
            </div>`;
        
        const showMoreButton = document.getElementById('showMore');
        if (showMoreButton) {
            showMoreButton.style.display = 'none';
        }
        return;
    }

    // Slice to show only limited posts
    const postsToDisplay = activePosts.slice(0, limit);

    // Display the posts
    postsToDisplay.forEach((post, index) => {
        const postElement = document.createElement('div');
        postElement.classList.add('col-md-3', 'mb-4', 'p-3');
        
        // Handle image
        let postImage = 'https://placehold.co/600x400?text=No+Image';
        if (post.imageBase64Array && post.imageBase64Array.length > 0) {
            postImage = post.imageBase64Array[0];
        }
        
        // Handle title
        const displayTitle = post.postTitle || 'Untitled Post';
        
        // Handle category
        const category = post.categories || 'Uncategorized';
        
        // Handle date
        const displayDate = post.postDate ? formatDate(post.postDate) : formatDate(new Date().toISOString());
        
        // Create post HTML
        postElement.innerHTML = `
            <a class="text-decoration-none " style="cursor: pointer !important;">
                <div class="image-container">
                    <img src="${postImage}" alt="${displayTitle}" class="post-image" style="width: 100%; height: 200px; object-fit: cover;">
                    <span class="category-label">${category}</span>
                </div>
                <div class="post-content">
                    <h3 class="post-title mb-3 text-dark">${displayTitle}</h3>
                    <p class="post-date text-muted"><i class="fas fa-calendar-alt me-2"></i>${displayDate}</p>
                </div>
            </a>
        `;
        
        // Add click event
        postElement.addEventListener('click', () => {
            localStorage.setItem('selectedPostIndex', storedPosts.indexOf(post));
            window.location.href = 'show.html';
        });
        
        // Add to container
        postContainer.appendChild(postElement);
    });

    // Handle show more button
    const showMoreButton = document.getElementById('showMore');
    if (showMoreButton) {
        if (activePosts.length > limit) {
            showMoreButton.style.display = 'block';
        } else {
            showMoreButton.style.display = 'none';
        }
    }
}

// Function to show more posts
function loadMorePosts() {
    const currentPostCount = document.getElementById('posts').children.length;
    displayPosts(currentPostCount + 4);
}

// Function to show all posts regardless of category
function showAllPosts() {
    const dropdown = document.getElementById('categories');
    if (dropdown) {
        dropdown.value = 'showall';
    }
    localStorage.setItem('selectedCategory', 'showall');
    displayPosts();
}

// Initialize when the page loads
window.onload = function() {
    console.log('Page loaded, initializing blog...');
    loadCategories();
    displayPosts();
    
    const showMoreButton = document.getElementById('showMore');
    if (showMoreButton) {
        showMoreButton.addEventListener('click', loadMorePosts);
    }
};
