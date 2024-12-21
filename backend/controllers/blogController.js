const Blog = require('../models/blogModel'); // Adjust path if needed

// Controller to add a new blog post
exports.addBlog = async (req, res) => {
  const { title, description, image, createdBy, updatedBy,content,blogStatus} = req.body;
console.log('this is blog type '+req.body);
  // Validate input
  const blogType = 'donate';
  
  if (!title || !description) {
    return res.status(400).json({message:"Title and description are required" });
  }

  try {
    const newBlog = await Blog.create({
      title,
      description,
      image,
      createdBy,
      updatedBy,
      content,
      blogType,
      blogStatus
    });
    res.status(201).json({ message: "Blog created successfully", data: newBlog });
  } catch (error) {
    console.error('Error adding blog:', error);
    res.status(500).json({ message: "An internal error occurred" });
  }
};

// Controller to retrieve all blog posts
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll();
    res.status(200).json({ message: "Blogs retrieved successfully", data: blogs });
  } catch (error) {
    console.error('Error retrieving blogs:', error);
    res.status(500).json({ message: "Error retrieving blogs", error: error.message });
  }
};


// Controller to retrieve approved blog posts for users
exports.getApprovedBlogs = async (req, res) => {
  try {
    const approvedBlogs = await Blog.findAll({
      where: { blogStatus: 'approved' },
    });
    res.status(200).json({ message: "Approved blogs retrieved successfully", data: approvedBlogs });
  } catch (error) {
    console.error('Error retrieving approved blogs:', error);
    res.status(500).json({ message: "Error retrieving approved blogs", error: error.message });
  }
};
// Controller to retrieve a single blog by ID
exports.getBlogById = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({ message: "Blog retrieved successfully", data: blog });
  } catch (error) {
    console.error('Error retrieving blog:', error);
    res.status(500).json({ message: "Error retrieving blog", error: error.message });
  }
};


// Controller to delete a blog post by ID
exports.deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    await blog.destroy(); // Delete the blog
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ message: "An error occurred while deleting the blog" });
  }
};




// Controller to update a blog post by ID
exports.updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, description,  content,createdBy, blogStatus } = req.body;

  try {
    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Update the blog data
    blog.title = title || blog.title;
    blog.description = description || blog.description;
    blog.content = content || blog.content;
    blog.createdBy=createdBy ||blog.createdBy;
    blog.blogStatus = blogStatus || blog.blogStatus;  // Update the blog's status

    await blog.save();

    res.status(200).json({ message: "Blog updated successfully", data: blog });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ message: "An internal error occurred while updating the blog" });
  }
};