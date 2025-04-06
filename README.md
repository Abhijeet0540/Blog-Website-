# Blog Website

A responsive blog website with user registration, authentication, and blog post management.

## Features

- **User Authentication**
  - User registration with email and password
  - Login functionality for multiple users
  - User-specific content management

- **Blog Management**
  - Create, edit, and delete blog posts
  - Category filtering
  - Image upload support
  - Rich text editor for post content

- **Responsive Design**
  - Mobile-friendly interface
  - Bootstrap-based layout
  - Clean and modern UI

## Pages

- **Home/Blog Page**: Displays all blog posts with category filtering
- **Login Page**: User authentication
- **Register Page**: New user registration
- **Admin Dashboard**: Manage blog posts
- **Post Editor**: Create and edit blog posts
- **Single Post View**: View individual blog posts

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- jQuery
- Bootstrap 5
- Local Storage for data persistence

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Open the project in your preferred code editor

3. Launch the website by opening `blog.html` in a web browser

## Usage

### Registration
- Navigate to the registration page by clicking "Create new account" on the login page
- Fill in your details and create an account

### Login
- Use your registered email and password to log in
- Default admin credentials:
  - Email: blog@gmail.com
  - Password: 123456

### Creating Posts
- After logging in, navigate to the admin dashboard
- Click "Add Post" to create a new blog post
- Fill in the post details and save

### Viewing Posts
- All published posts can be viewed on the blog page
- Filter posts by category using the dropdown menu

## Project Structure

- `blog.html` - Main blog page
- `Login.html` - User login page
- `register.html` - User registration page
- `admin_table.html` - Admin dashboard
- `index.html` - Post editor
- `show.html` - Single post view
- `script.js` - Main JavaScript file
- `blog.js` - Blog page functionality
- `login.js` - Login functionality
- `register.js` - Registration functionality

## Future Enhancements

- Server-side database integration
- Comment system for blog posts
- Social media sharing
- User profile management
- Advanced search functionality
