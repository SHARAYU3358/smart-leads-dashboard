import { Response } from 'express';
import Lead from '../models/Lead';
import { AuthRequest } from '../types';

// Get all leads with filter, search, sort, pagination
export const getLeads = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const {
      status,
      source,
      search,
      sort = 'latest',
      page = '1',
      limit = '10',
    } = req.query;

    const filter: any = {};

    if (status) filter.status = status;
    if (source) filter.source = source;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOrder = sort === 'oldest' ? 1 : -1;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const total = await Lead.countDocuments(filter);
    const leads = await Lead.find(filter)
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limitNum)
      .populate('createdBy', 'name email');

    res.json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get single lead
export const getLead = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).populate(
      'createdBy',
      'name email'
    );
    if (!lead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }
    res.json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Create lead
export const createLead = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, email, status, source } = req.body;

    if (!name || !email || !source) {
      res.status(400).json({ message: 'Please fill all required fields' });
      return;
    }

    const lead = await Lead.create({
      name,
      email,
      status,
      source,
      createdBy: req.user?.id,
    });

    res.status(201).json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update lead
export const updateLead = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!lead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }

    res.json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete lead
export const deleteLead = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }

    res.json({ success: true, message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Export leads as CSV
export const exportCSV = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const leads = await Lead.find().populate('createdBy', 'name email');

    const csvRows = [
      ['Name', 'Email', 'Status', 'Source', 'Created At'],
      ...leads.map((lead) => [
        lead.name,
        lead.email,
        lead.status,
        lead.source,
        lead.createdAt.toISOString(),
      ]),
    ];

    const csvContent = csvRows.map((row) => row.join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=leads.csv'
    );
    res.send(csvContent);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

