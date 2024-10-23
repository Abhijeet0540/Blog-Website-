$(function () {
    $('#footer').load('footer.html');
});

document.addEventListener('DOMContentLoaded', () => {
    loadComments(); // Load comments when the page is ready
    document.getElementById('send-btn').addEventListener('click', addComment); // Handle new comments
});

let currentSlide = 0;
let slideInterval;

// Load post details
// Load post details
function loadPost() {
    const selectedPostIndex = localStorage.getItem('selectedPostIndex');
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    
    if (selectedPostIndex !== null && posts[selectedPostIndex]) {
        const post = posts[selectedPostIndex];

        // Update the viewCount
        post.viewCount = post.viewCount || 0;
        post.viewCount++;

        // Save the updated post back to localStorage
        posts[selectedPostIndex] = post;
        localStorage.setItem('posts', JSON.stringify(posts));

        // Create slider images
        const slidesContainer = document.querySelector('.slides');
        slidesContainer.innerHTML = ''; // Clear previous images

        post.imageBase64Array.forEach((imageSrc) => {
            const img = document.createElement('img');
            img.src = imageSrc;
            slidesContainer.appendChild(img);
        });

        const images = document.querySelectorAll('.slides img');
        slidesContainer.style.width = `${images.length * 100}%`;
        slidesContainer.style.height = `${images[0].clientHeight}px`;

        // Update other post details
        document.getElementById('postTitle').innerText = post.postTitle;
        document.getElementById('postCategory').innerText = post.categories;
        document.getElementById('postDate').innerText = formatDate(post.postDate); // Format date
        document.getElementById('postDescription').innerHTML = post.description;
        document.getElementById('postAuther').innerText = post.auther;

        // Display the current like count and view count
        document.getElementById('likeCount').innerText = `like ${post.likeCount}`;
        document.getElementById('viewCount').innerText = `Views: ${post.viewCount}`;

        // Bind the like button event
        document.getElementById('likeBtn').onclick = () => toggleLike(selectedPostIndex);

        // Start slider
        showSlide(currentSlide);
        slideInterval = setInterval(nextSlide, 3000);
    } else {
        document.body.innerHTML = '<p>Post not found.</p>';
    }
}


// Toggle like function
function toggleLike(postIndex) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    
    if (posts[postIndex]) {
        const post = posts[postIndex];
        
        // Toggle like
        if (post.isLiked) {
            post.likeCount--;
            post.isLiked = false;
            
        } else {
            post.likeCount++;
            post.isLiked = true;
            
        }
        // Save the updated post back to localStorage
        posts[postIndex] = post;
        localStorage.setItem('posts', JSON.stringify(posts));

        // Update the like count display with the format "like 0"
        document.getElementById('likeCount').innerText =`like ${post.likeCount}`;
    }
}

// Load and display comments
function loadComments() {
    const selectedPostIndex = localStorage.getItem('selectedPostIndex');
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const post = posts[selectedPostIndex];

    if (post) {
        const commentsList = document.getElementById('comments-list');
        const commentCountElement = document.getElementById('comment-count');
        commentsList.innerHTML = ''; // Clear existing comments

        // Update the comment count
        const commentCount = post.comments ? post.comments.length : 0;
        commentCountElement.innerText = `Comments ${commentCount}`;

        // If there are comments, display them
        if (commentCount > 0) {
            post.comments.forEach(comment => {
                const commentElement = document.createElement('li');
                commentElement.innerHTML = `
                    <div class="comment-main-level">
                        <div class="comment-avatar">
                            <img  src="https://img.freepik.com/premium-vector/cheerful-rastafarian-man-vector-illustration_1323048-68187.jpg?uid=R133268976&ga=GA1.1.634881023.1727092348&semt=ais_hybrid" alt="avatar">
                        </div>
                        <div class="comment-box">
                            <div class="comment-head">
                                <h6 class="comment-name"><a href="#">${comment.name}</a></h6>
                                <span>${comment.time}</span>
                                <i class="fa fa-reply"></i>
                                <i class="fa fa-heart"></i>
                            </div>
                            <div class="comment-content">
                                ${comment.content}
                            </div>
                        </div>
                    </div>
                `;
                commentsList.appendChild(commentElement);
            });
        }
    }
}

// Add a new comment
function addComment() {
    const commentInput = document.getElementById('comment-input').value.trim();
    if (!commentInput) return; // Do not add empty comments

    const selectedPostIndex = localStorage.getItem('selectedPostIndex');
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const post = posts[selectedPostIndex];

    if (post) {
        const newComment = {
            name: 'John Doe', 
            time: new Date().toLocaleTimeString(),
            content: commentInput
        };

        post.comments = post.comments || [];
        post.comments.push(newComment);

        posts[selectedPostIndex] = post;
        localStorage.setItem('posts', JSON.stringify(posts));

        document.getElementById('comment-input').value = '';
        loadComments();
    }
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    loadComments(); // Load existing comments on page load
    document.getElementById('send-btn').addEventListener('click', addComment); // Add comment on button click
});

// Utility function to format the date
function formatDate() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0'); // Day with leading zero
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
}

// Slider functionality
function showSlide(index) {
    const slides = document.querySelector('.slides');
    const totalSlides = document.querySelectorAll('.slides img').length;
    const slideWidth = slides.clientWidth / totalSlides;
    slides.style.transform = `translateX(-${index * slideWidth}px)`;
}

function nextSlide() {
    const slides = document.querySelectorAll('.slides img');
    currentSlide = (currentSlide + 1) % slides.length; 
    showSlide(currentSlide);
}

function prevSlide() {
    const slides = document.querySelectorAll('.slides img');
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
}

window.onload = loadPost;

