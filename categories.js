// Load sidebar content
$(document).ready(function () {
    $("#sidebar").load("sidebar.html");
    loadCategories();
    // Add category form submission
    document.getElementById('categoryForm').addEventListener('submit', function (e) {
        e.preventDefault(); 
        const categoryName = document.getElementById('categoryName').value;
        const categoryType = document.getElementById('categoryType').value;
        // Validate form inputs
        if (categoryName && categoryType) {
            if (this.dataset.editingIndex !== undefined) {
                const index = this.dataset.editingIndex;
                categories[index] = { name: categoryName, type: categoryType };
                delete this.dataset.editingIndex; 
                toastr.success('Category updated successfully!'); 
            } else {
                categories.push({ name: categoryName, type: categoryType });
                toastr.success('Category added successfully!'); 
            }

            storeCategories(); 
            this.reset(); 
        
            setTimeout(() => {
                location.reload(); 
            }, 1000);
        }
    });
    // Clear form on reload
    document.getElementById('resetCategory').addEventListener('click', function () {
        const form = document.getElementById('categoryForm');
        form.reset(); 
        delete form.dataset.editingIndex; 
        form.querySelector('button[type="submit"]').textContent = 'Submit'; 
    });
});

// Load categories from local storage
function loadCategories() {
    const storedCategories = JSON.parse(localStorage.getItem('categories')) || [];
    categories = storedCategories;
    updateCategoryTable(); 
}

function updateCategoryTable() {
    const tableBody = document.getElementById('categoryTableBody');
    tableBody.innerHTML = '';
    tableBody.style.textAlign = 'center';
    categories.forEach((category, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <th scope="row" class="text-center">${index + 1}</th>
            <td>${category.name}</td>
            <td>
                <span class="badge bg-${category.type === 'Active' ? 'success' : 'danger'}">
                    ${category.type}
                </span>
            </td>
            <td>
                <button onclick="editCategory(${index})" class="btn btn-warning btn-sm" data-toggle="tooltip" title="Edit Post">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteCategory(${index})" class="btn btn-danger btn-sm" data-toggle="tooltip" title="Delete Post">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    if ($.fn.DataTable.isDataTable('#categoryTable')) {
        $('#categoryTable').DataTable().destroy();
    }
    $('#categoryTable').DataTable({
        pageLength: 5,
        lengthMenu: [5, 10, 15, 20],
        ordering: true,
        autoWidth: false,
        search: true
    });
}

function storeCategories() {
    localStorage.setItem('categories', JSON.stringify(categories));
}

function deleteCategory(index) {
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
            categories.splice(index, 1);
            storeCategories(); 
            location.reload();
        }
    });
}
function editCategory(index) {
    const category = categories[index];
    document.getElementById('categoryName').value = category.name;
    document.getElementById('categoryType').value = category.type;

    document.getElementById('categoryForm').dataset.editingIndex = index;
    
    const submitButton = document.getElementById('crateCategory');
    submitButton.textContent = 'Update Category';
    submitButton.classList.add('w-100'); 
    document.getElementById('resetCategory').style.display = 'none';

    // add tostr in categories update successfully message when user clicks on update button
    document.getElementById('categoryForm').addEventListener('submit', function (e) {
        e.preventDefault(); 
        const categoryName = document.getElementById('categoryName').value;
        const categoryType = document.getElementById('categoryType').value;
        // Validate form inputs
        if (categoryName && categoryType) {
            if (this.dataset.editingIndex !== undefined) {
                const index = this.dataset.editingIndex;
                categories[index] = { name: categoryName, type: categoryType };
                delete this.dataset.editingIndex; 
                toastr.success('Category updated successfully!'); 
            } else {
                categories.push({ name: categoryName, type: categoryType });
                toastr.success('Category added successfully!'); 
            }

            storeCategories(); 
            this.reset(); 
        
            setTimeout(() => {
                location.reload(); 
            }, 1000);
        }
    });
    
}

// Load sidebar content
window.onload = loadCategories;
