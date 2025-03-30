router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Requested ID:', id); // Thêm log để debug

    if (!id) {
      return res.status(400).json({ message: 'ID is required' });
    }

    const application = await Application.findById(id);
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ message: error.message });
  }
}); 