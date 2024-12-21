const Job = require('../models/JobModel'); // Adjust path if needed

// Controller to add a new blog post
exports.addJob = async (req, res) => {
  const { title, description,jobType,jobLocation,jobGoogleLink, createdBy } = req.body;

  // Validate input
  if (!title || !description) {
    return res.status(400).json({ message: "Title and description are required" });
  }

  try {
    const newJob = await Job.create({
      title,
      description,
      jobType,
      jobLocation,
      jobGoogleLink,
      createdBy,
     status:'Active'
    });
    res.status(201).json({ message: "Job created successfully", data: newJob });
  } catch (error) {
    console.error('Error adding job:', error);
    res.status(500).json({ message: "An internal error occurred" });
  }
};

// Controller to retrieve all blog posts
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll();
    res.status(200).json({ message: "job retrieved successfully", data: jobs });
  } catch (error) {
    console.error('Error retrieving jobs:', error);
    res.status(500).json({ message: "Error retrieving jobs", error: error.message });
  }
};

// Controller to retrieve a single blog by ID
exports.getjobById = async (req, res) => {
  const { id } = req.params;

  try {
    const job = await Job.findByPk(id);
    if (!job) {
      return res.status(404).json({ message: "job not found" });
    }
    res.status(200).json({ message: "Blog retrieved successfully", data: job });
  } catch (error) {
    console.error('Error retrieving blog:', error);
    res.status(500).json({ message: "Error retrieving job", error: error.message });
  }
};


//delete product by admin

exports.deleteJob=async(req,res,next)=>{
  
    const job=await Job.findByPk(req.params.id);

    if(!job){
        return  next(new ErrorHandler("job not found",404))
    }
    await job.remove()

    res.status(200).json({
        success:true,
        Message:"job deleted peramatnely"
    })
    console.log(job)
};