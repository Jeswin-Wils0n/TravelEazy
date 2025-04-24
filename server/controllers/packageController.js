const Package = require('../models/Package');

exports.getAllPackages = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(field => delete queryObj[field]);
    
    if (req.query.startDate) {
      queryObj.startDate = { $gte: new Date(req.query.startDate) };
    }
    
    if (req.query.endDate) {
      queryObj.endDate = { $lte: new Date(req.query.endDate) };
    }
    
    if (req.query.fromLocation) {
      queryObj.fromLocation = { $regex: req.query.fromLocation, $options: 'i' };
    }
    
    if (req.query.toLocation) {
      queryObj.toLocation = { $regex: req.query.toLocation, $options: 'i' };
    }
    
    let query = Package.find(queryObj);
    
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    
    query = query.skip(skip).limit(limit);
    
    const packages = await query;
    
    const total = await Package.countDocuments(queryObj);
    
    res.status(200).json({
      success: true,
      count: packages.length,
      total,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit)
      },
      data: packages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getPackage = async (req, res) => {
  try {
    const packageItem = await Package.findById(req.params.id);
    
    if (!packageItem) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: packageItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createPackage = async (req, res) => {
  try {
    const packageItem = await Package.create(req.body);
    
    res.status(201).json({
      success: true,
      data: packageItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updatePackage = async (req, res) => {
  try {
    const packageItem = await Package.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!packageItem) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: packageItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deletePackage = async (req, res) => {
  try {
    const packageItem = await Package.findByIdAndDelete(req.params.id);
    
    if (!packageItem) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getPackageStats = async (req, res) => {
  try {
    const today = new Date();
    
    const stats = await Package.aggregate([
      {
        $facet: {
          'total': [
            { $count: 'count' }
          ],
          'completed': [
            { $match: { endDate: { $lt: today } } },
            { $count: 'count' }
          ],
          'active': [
            { 
              $match: { 
                $and: [
                  { startDate: { $lte: today } },
                  { endDate: { $gte: today } }
                ]
              }
            },
            { $count: 'count' }
          ],
          'upcoming': [
            { $match: { startDate: { $gt: today } } },
            { $count: 'count' }
          ]
        }
      }
    ]);
    
    const formatResult = (result) => {
      return {
        total: result.total[0]?.count || 0,
        completed: result.completed[0]?.count || 0,
        active: result.active[0]?.count || 0,
        upcoming: result.upcoming[0]?.count || 0
      };
    };
    
    res.status(200).json({
      success: true,
      data: formatResult(stats[0])
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};