$(document).ready(function () {
    $("#sidebar").load("sidebar.html");
    displayPosts();

    // Initialize DataTables after the posts are loaded
    $('#postTable').DataTable({
        pageLength: 5,
        lengthMenu: [5, 10, 15, 20],
        ordering: true,
        autoWidth: false
    });

    // Auto-fill author field with current user's name if available
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && document.getElementById('auther')) {
        document.getElementById('auther').value = currentUser.fullName;
        // Make the author field read-only to ensure posts are associated with the logged-in user
        document.getElementById('auther').setAttribute('readonly', 'readonly');
    }
});
// Initialize flatpickr
document.addEventListener('DOMContentLoaded', function () {
    flatpickr("#postDate", {
        dateFormat: "Y-m-d",
        allowInput: true,
        maxDate: "today"
    });
});
// Function to create image preview
function createImagePreview(imageSrc, fileIndex, removeCallback) {
    const imgContainer = document.createElement('div');
    imgContainer.classList.add('img-container');

    const img = document.createElement('img');
    img.src = imageSrc;
    img.alt = 'Uploaded Image';
    img.classList.add('rounded', 'img-preview');

    const editIndex = localStorage.getItem('editIndex');
    if (editIndex !== null) {
        const removeButton = document.createElement('button');
        removeButton.innerHTML = '<i class="fas fa-times"></i>';
        removeButton.classList.add('remove-btn');

        // Add click event listener to remove button
        removeButton.addEventListener('click', () => removeCallback(fileIndex));
        imgContainer.appendChild(img);
        imgContainer.appendChild(removeButton);
    } else {
        imgContainer.appendChild(img);
    }
    return imgContainer;
}

// Remove file from the preview (existing files)
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('fileInput').addEventListener('change', function (event) {
        const files = event.target.files;
        const imagePreview = document.getElementById('imagePreview');
        const errorImage = document.getElementById('errorImage');
        imagePreview.innerHTML = "";  // Clear previous image previews
        errorImage.textContent = "";

        Array.from(files).forEach((file, fileIndex) => {
            const fileSize = file.size / (1024 * 1024);

            // // Validate file type - allow only .jpg or .jpeg (case-insensitive)
            // const fileExtension = file.name.split('.').pop().toLowerCase();
            // if (fileExtension !== 'jpg' && fileExtension !== 'jpeg') {
            //     errorImage.textContent = 'Only .jpg and .jpeg files are allowed';
            //     return;
            // }

            // Validate file size - should be less than 2 MB
            if (fileSize > 2) {
                errorImage.textContent = 'Each file size must be less than 2 MB';
                return;
            }

            const reader = new FileReader();
            reader.onload = function (e) {
                const imgContainer = createImagePreview(e.target.result, fileIndex, () => {
                    removeFilePreview(fileIndex, files);
                });
                imagePreview.appendChild(imgContainer);
            };
            reader.readAsDataURL(file);
        });
    });
});
// Remove file from the preview (new files)
function removeFilePreview(fileIndex, files) {
    const fileArray = Array.from(files);
    fileArray.splice(fileIndex, 1);
    document.getElementById('fileInput').files = new FileList();
    document.getElementById('imagePreview').innerHTML = '';
    Array.from(fileArray).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imgContainer = createImagePreview(e.target.result, index, () => {
                removeFilePreview(index, fileArray);
            });
            document.getElementById('imagePreview').appendChild(imgContainer);
        };
        reader.readAsDataURL(file);
    });
}
// Initialize CKEditor
ClassicEditor
    .create(document.querySelector('#editor'), {
        toolbar: ['heading', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'undo', 'redo', 'imageUpload', 'mediaEmbed'],
        image: { toolbar: ['imageTextAlternative', 'imageStyle:full', 'imageStyle:side'] },
        placeholder: 'Write your amazing content here...',
        height: '400px',
        language: 'en'
    })
    .then(editor => { editorInstance = editor; })
    .catch(error => console.error(error));
$(document).ready(function () {
    loadCategories();
});
// Load categories from local storage
document.addEventListener('DOMContentLoaded', function () {
    loadCategoriesForDropdown();
});

// Load categories from local storage
function loadCategoriesForDropdown() {
    const storedCategories = JSON.parse(localStorage.getItem('categories')) || [];
    const activeCategories = storedCategories.filter(category => category.type === 'Active');

    const dropdown = document.getElementById('categories');
    dropdown.innerHTML = '<option value="">Select Category</option>';

    // Add active categories to the dropdown
    activeCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name;
        option.textContent = category.name;
        dropdown.appendChild(option);
    });
}
// Save post to local storage
function save() {
    const editorContent = editorInstance.getData();
    let isValid = validateForm(editorContent);

    if (isValid) {
        const files = fileInput.files;
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        let editIndex = localStorage.getItem('editIndex');
        editIndex = editIndex !== null ? parseInt(editIndex, 10) : null;

        const post = posts[editIndex] || {};
        const imageNames = [];
        const imageBase64Array = post.imageBase64Array || [];

        let likeCount = post.likeCount || 0;
        let comments = post.comments || [];

        function savePost() {
            // Get current user from localStorage
            const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};

            const postData = {
                postTitle: postTitle.value,
                description: editorContent,
                imageNames: imageNames.length > 0 ? imageNames : post.imageNames,
                imageBase64Array: imageBase64Array.length > 0 ? imageBase64Array : post.imageBase64Array,
                auther: auther.value,
                userId: currentUser.id || 'anonymous', // Associate post with user ID
                userEmail: currentUser.email || '', // Store user email for reference
                postDate: postDate.value,
                categories: categories.value,
                selectStatus: selectStatus.value,
                likeCount: likeCount,
                comments: comments
            };

            // Update existing post if editing
            if (editIndex !== null && editIndex >= 0) {
                posts[editIndex] = postData;
                localStorage.removeItem('editIndex');

                // Show success message for updating
                Swal.fire({
                    icon: "success",
                    title: "Data updated successfully!",  // Custom message for update
                    timer: 1200,
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                });
            } else {
                posts.push(postData);

                // Show success message for saving new data
                Swal.fire({
                    icon: "success",
                    title: "Data saved successfully!",  // Custom message for new data
                    timer: 1200,
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                });
            }

            // Save the updated posts array to localStorage
            localStorage.setItem('posts', JSON.stringify(posts));

            reset(); // Reset form fields after saving
            setTimeout(() => window.location.href = 'admin_table.html', 1000);
        }

        // Handle file processing for post images
        if (files.length > 0) {
            let filesProcessed = 0;
            Array.from(files).forEach((file, index) => {
                const reader = new FileReader();
                reader.onload = function (e) {
                    imageNames.push(file.name);
                    imageBase64Array.push(e.target.result);
                    filesProcessed++;
                    if (filesProcessed === files.length) {
                        savePost();
                    }
                };
                reader.readAsDataURL(file);
            });
        } else {
            savePost();
        }
    }
}

// Load post data for editing
function loadPostDataForEdit() {
    const editIndex = localStorage.getItem('editIndex');
    if (editIndex !== null) {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        const post = posts[editIndex];
        const addBlogButton = document.getElementById('addblog');
        addBlogButton.innerHTML = '<i class="fa fa-arrow-left"></i> Edit Blog';
        document.getElementById('post').textContent = 'Edit Blog';

        // Add click event listener to the add blog button
        addBlogButton.addEventListener('click', function () {
            window.location.href = 'admin_table.html';
        });

        document.getElementById('save').innerText = 'Update';
        document.getElementById('reset').style.display = 'none';

        // Load post data
        document.getElementById('postTitle').value = post.postTitle || '';
        editorInstance.setData(post.description || '');
        document.getElementById('auther').value = post.auther || '';
        document.getElementById('postDate').value = post.postDate || '';
        document.getElementById('categories').value = post.categories || '';
        document.getElementById('selectStatus').value = post.selectStatus || '';

        // Image preview logic
        const imagePreview = document.getElementById('imagePreview');
        imagePreview.innerHTML = '';  // Clear previous previews

        if (post.imageBase64Array && post.imageBase64Array.length > 0) {
            post.imageBase64Array.forEach((imageBase64, imageIndex) => {
                const imgContainer = createImagePreview(imageBase64, imageIndex, () => {
                    // Confirm delete
                    Swal.fire({
                        title: 'Are you sure?',
                        text: 'This image will be permanently deleted!',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, delete it!'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            removeOldImage(imageIndex, post, posts, editIndex);

                            // Show success message
                            const Toast = Swal.mixin({
                                toast: true,
                                position: "top-end",
                                showConfirmButton: false,
                                timer: 3000,
                                timerProgressBar: true,
                                didOpen: (toast) => {
                                    toast.onmouseenter = Swal.stopTimer;
                                    toast.onmouseleave = Swal.resumeTimer;
                                }
                            });
                            Toast.fire({
                                icon: "success",
                                title: "Image deleted successfully"
                            });
                        }
                    });
                });
                imagePreview.appendChild(imgContainer);
            });
        }
    }
}
// add post redirect to admin_table
document.addEventListener('DOMContentLoaded', function () {
    loadPostDataForEdit();
    document.getElementById('addblog').addEventListener('click', function () {
        window.location.href = 'admin_table.html';
    });
});
// Remove an image
function removeOldImage(imageIndex, post, posts, editIndex) {
    post.imageBase64Array.splice(imageIndex, 1);
    posts[editIndex] = post;
    localStorage.setItem('posts', JSON.stringify(posts));
    loadPostDataForEdit();
}
// Validate form fields and save post
function validateForm(editorContent) {
    let isValid = true;
    const editIndex = localStorage.getItem('editIndex');
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const post = posts[editIndex];

    // Validate form fields
    if (postTitle.value.trim() === "") {
        showError(postTitle, errorTitle, 'Title field is required');
        isValid = false;
    } else {
        clearError(postTitle, errorTitle);
    }
    // Validate editor content
    if (editorContent.trim() === "") {
        showError(editorInstance.ui.view.editable.element, errorDescription, 'Description field is required');
        isValid = false;
    } else {
        clearError(editorInstance.ui.view.editable.element, errorDescription);
    }
    // Validate image
    if (fileInput.files.length === 0 && (!post || !post.imageBase64Array || post.imageBase64Array.length === 0)) {
        errorImage.textContent = 'Please select an image';
        isValid = false;
    } else {
        clearError(fileInput, errorImage);
    }
    // Validate author
    if (auther.value.trim() === "") {
        showError(auther, errorauther, 'Author field is required');
        isValid = false;
    } else {
        clearError(auther, errorauther);
    }
    // Validate date
    if (postDate.value === "") {
        showError(postDate, errorPostDate, 'Date field is required');
        isValid = false;
    } else {
        clearError(postDate, errorPostDate);
    }

    // Validate categories
    if (categories.value.trim() === "") {
        showError(categories, errorCategories, 'Categories field is required');
        isValid = false;
    } else {
        clearError(categories, errorCategories);
    }
    // Validate select status
    if (selectStatus.value === "") {
        showError(selectStatus, errorselectStatus, 'Status field is required');
        isValid = false;
    } else {
        clearError(selectStatus, errorselectStatus);
    }
    return isValid;
}

// Clear form on reload
function clearFormOnReload() {
    localStorage.removeItem('formData');
    localStorage.removeItem('editIndex');
    reset();
    if (window.location.pathname.includes('admin_table.html')) {
        displayPosts();
    }
}

// Clear form on reload
window.addEventListener('beforeunload', clearFormOnReload);

// Error handling
function showError(field, errorElement, message) {
    errorElement.textContent = message;
    field.style.border = "1px solid red";
    field.style.boxShadow = "0 0 5px 2px rgba(255, 0, 0, 0.25)";
}
function clearError(field, errorElement) {
    errorElement.textContent = "";
    field.style.border = "";
    field.style.boxShadow = "";
}

// Display posts in the table
function displayPosts() {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const tableBody = document.getElementById('postTableBody');
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    tableBody.innerHTML = '';

    // Filter posts based on user role
    let filteredPosts = posts;
    if (currentUser.role !== 'admin') {
        // Regular users can only see their own posts
        filteredPosts = posts.filter(post => post.userId === currentUser.id);
    }

    // Add filter controls if admin
    if (currentUser.role === 'admin' && document.getElementById('filterControls')) {
        const filterControls = document.getElementById('filterControls');
        if (!document.getElementById('userFilter')) {
            filterControls.innerHTML = `
                <div class="mb-3">
                    <label for="userFilter" class="form-label">Filter by User:</label>
                    <select id="userFilter" class="form-select">
                        <option value="all">All Users</option>
                        ${getUserOptions()}
                    </select>
                </div>
            `;

            // Add event listener to the filter
            document.getElementById('userFilter').addEventListener('change', function () {
                displayPosts();
            });
        }
    }

    // Apply user filter if admin and filter is selected
    if (currentUser.role === 'admin' && document.getElementById('userFilter') && document.getElementById('userFilter').value !== 'all') {
        const selectedUserId = document.getElementById('userFilter').value;
        filteredPosts = posts.filter(post => post.userId === selectedUserId);
    }

    filteredPosts.forEach((post, index) => {
        const truncatedDescription = post.description.length > 30 ? post.description.slice(0, 30) + '...' : post.description;
        const truncatedTitle = post.postTitle.length > 15 ? post.postTitle.slice(0, 15) + '...' : post.postTitle;
        const firstImageBase64 = post.imageBase64Array && post.imageBase64Array.length > 0 ? post.imageBase64Array[0] : '';
        const imagePreviewHtml = firstImageBase64 ? `<img src="${firstImageBase64}" alt="${post.imageName}" style="width: 30px; height: 30px; border-radius: 50%; object-fit: cover; margin-right: 5px;">` : '';

        // Get the actual index in the original posts array for edit/delete operations
        const originalIndex = posts.findIndex(p =>
            p.postTitle === post.postTitle &&
            p.description === post.description &&
            p.userId === post.userId);

        const row = document.createElement('tr');

        row.addEventListener('click', function (event) {
            if (!event.target.closest('button')) {
                viewPost(originalIndex);  // Pass the correct index to viewPost function
            }
        });

        // Only show edit/delete buttons for admin or post owner
        const canEditDelete = currentUser.role === 'admin' || post.userId === currentUser.id;

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${imagePreviewHtml}${truncatedTitle}</td>
            <td>${truncatedDescription}</td>
            <td>${post.auther}</td>
            <td>${post.userEmail || 'N/A'}</td>
            <td>${post.postDate}</td>
            <td>${post.categories}</td>
            <td>
                <span class="badge bg-${post.selectStatus === 'Active' ? 'success' : 'danger'}">
                    ${post.selectStatus}
                </span>
            </td>
            <td>
                ${canEditDelete ? `
                <button onclick="deletePost(${originalIndex})" class="btn btn-danger btn-sm" data-toggle="tooltip" title="Delete Post"><i class="fas fa-trash-alt"></i></button>
                <button onclick="editPost(${originalIndex})" class="btn btn-warning btn-sm" data-toggle="tooltip" title="Edit Post"><i class="fas fa-edit"></i></button>
                ` : ''}
                <button onclick="viewPost(${originalIndex})" class="btn btn-primary btn-sm" data-toggle="tooltip" title="View Post"><i class="fas fa-eye"></i></button>
            </td>`;
        tableBody.appendChild(row);
    });
}
// Function to get user options for the filter dropdown
function getUserOptions() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const posts = JSON.parse(localStorage.getItem('posts')) || [];

    // Get unique user IDs from posts
    const userIds = [...new Set(posts.map(post => post.userId))];

    // Create options HTML
    return userIds.map(userId => {
        const user = users.find(u => u.id === userId) || {};
        const userName = user.fullName || 'Unknown User';
        return `<option value="${userId}">${userName} (${user.email || 'No email'})</option>`;
    }).join('');
}

// Delete post with confirmation
function deletePost(index) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const post = posts[index];

    // Check if user has permission to delete this post
    if (post && (currentUser.role === 'admin' || post.userId === currentUser.id)) {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                posts.splice(index, 1);
                localStorage.setItem('posts', JSON.stringify(posts));
                displayPosts();
                Swal.fire('Deleted!', 'Your post has been deleted.', 'success');
            }
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Permission Denied',
            text: 'You do not have permission to delete this post.'
        });
    }
}
// Edit post
function editPost(index) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const post = posts[index];

    // Check if user has permission to edit this post
    if (post && (currentUser.role === 'admin' || post.userId === currentUser.id)) {
        localStorage.setItem('editIndex', index);
        window.location.href = 'index.html';
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Permission Denied',
            text: 'You do not have permission to edit this post.'
        });
    }
}
// View post details
function viewPost(index) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const post = posts[index];
    localStorage.setItem('viewPost', JSON.stringify(post));
    localStorage.setItem('selectedPostIndex', index);
    window.location.href = 'show.html';
}
// Reset form
function reset() {
    clearError(postTitle, errorTitle);
    postTitle.value = "";

    clearError(editorInstance.ui.view.editable.element, errorDescription);
    editorInstance.setData('');

    clearError(fileInput, errorImage);
    fileInput.value = "";

    imagePreview.innerHTML = "";  // Clear image previews

    clearError(auther, errorauther);
    auther.value = "";

    clearError(postDate, errorPostDate);
    postDate.value = "";

    clearError(categories, errorCategories);
    categories.value = "";

    clearError(selectStatus, errorselectStatus);
    selectStatus.value = "";

    localStorage.removeItem('editIndex');  // Clear edit index
}
// Clear form on reload
document.getElementById('postTitle').oninput = () => clearError(postTitle, errorTitle);
document.getElementById('fileInput').oninput = () => clearError(fileInput, errorImage);
document.getElementById('auther').oninput = () => clearError(auther, errorauther);
document.getElementById('postDate').oninput = () => clearError(postDate, errorPostDate);
document.getElementById('categories').oninput = () => clearError(categories, errorCategories);
document.getElementById('selectStatus').oninput = () => clearError(selectStatus, errorselectStatus);

// Run this function on admin_table.html to display saved posts
if (window.location.pathname.includes('admin_table.html')) {
    displayPosts();
}

// Logout functionality
document.addEventListener('DOMContentLoaded', function () {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            // Clear the current user from localStorage
            localStorage.removeItem('currentUser');
            // Redirect to login page
            window.location.href = 'Login.html';
        });
    }
});