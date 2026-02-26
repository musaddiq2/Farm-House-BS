import Farmhouse from "../models/Farmhouse.js";

export const FarmhouseCreate = async (req, res) => {
    try {
        const {
            name,
            adminId,
            description,
            address,
            city,
            state,
            pincode,
            minGuests: minGuestsInput,
            maxGuests: maxGuestsInput,
            fullDay: fullDayInput,
            hourly: hourlyInput,
            multiDay: multiDayInput,
            amenities,
            foodOptions,
            rules,
            instantBooking,
            minBookingDuration,
            maxBookingDuration,
            advanceBookingDays
        } = req.body;

        const minGuests = Number(minGuestsInput);
        const maxGuests = Number(maxGuestsInput);
        const fullDay = Number(fullDayInput);
        const hourly = hourlyInput ? Number(hourlyInput) : undefined;
        const multiDay = multiDayInput ? Number(multiDayInput) : undefined;

        // Process uploaded files safely
        const images = req.filesrimages?.map((file, index) => ({
            url: file.filename,
            publicId: file.filename,
            order: index
        })) || [];

        const videos = req.files?.video?.[0] ? [{
            url: req.files.video[0].filename,
            publicId: req.files.video[0].filename
        }] : [];

        // Generate slug from name
        const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

        // Validate the data
        const requiredFields = ['name', 'description', 'address', 'city', 'state', 'pincode'];
        const missingFields = requiredFields.filter(field => !req.body[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Missing required fields: ${missingFields.join(', ')}`,
            });
        }

        if (!minGuests || !maxGuests) {
            return res.status(400).json({ message: 'Missing required capacity fields' });
        }

        if (typeof minGuests !== 'number' || typeof maxGuests !== 'number') {
            return res.status(400).json({ message: 'Invalid capacity data types' });
        }

        if (!fullDay || (typeof fullDay !== 'number')) {
            return res.status(400).json({ message: 'Missing or invalid full day pricing data' });
        }


        // Create a new instance of the Farmhouse model
        const farmhouse = new Farmhouse({
            name,
            slug,
            adminId,
            description,
            location: {
                address,
                city,
                state,
                pincode
            },
            images,
            videos,
            amenities: {
                name: amenities?.name || '',
                icon: amenities?.icon || '',
                available: amenities?.available || true
            },
            capacity: {
                minGuests: minGuests,
                maxGuests: maxGuests
            },
            pricing: {
                fullDay,
                hourly,
                multiDay
            },
            amenities: amenities || [],
            foodOptions: foodOptions || [],
            rules: rules || {
                petsAllowed: false,
                alcoholAllowed: false,
                smokingAllowed: false
            },
            instantBooking: instantBooking || false,
            minBookingDuration,
            maxBookingDuration,
            advanceBookingDays
        });

        // Save the instance to the database
        await farmhouse.save();

        return res.status(201).json({
            message: 'Farmhouse created successfully',
            data: farmhouse
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const ViewFarmhouses = async (req, res) => {
    try {
        const farmhouses = await Farmhouse.find().select('-__v');

        return res.status(200).json({
            success: true,
            data: farmhouses,
            message: 'Farmhouses retrieved successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const EditFarmhouse = async (req, res) => {
    try {
        const { id } = req.params;
        const farmhouse = await Farmhouse.findById(id);

        if (!farmhouse || farmhouse.isDeleted) {
            return res.status(404).json({ message: 'Farmhouse not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'Farmhouse retrieved successfully',
            data: farmhouse
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const UpdateFarmhouse = async (req, res) => {
    try {
        const { id } = req.params;

        const farmhouse = await Farmhouse.findById(id);
        if (!farmhouse) {
            return res.status(404).json({ message: 'Farmhouse not found' });
        }
        const updates = req.body;
        // Find the farmhouse by ID and update it
        const updatedFarmhouse = await Farmhouse.findByIdAndUpdate(id, updates, { new: true });

        return res.status(200).json({
            success: true,
            message: 'Farmhouse updated successfully',
            data: updatedFarmhouse
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const SoftDeleteFarmhouse = async (req, res) => {
    try {
        const { id } = req.params;

        const farmhouse = await Farmhouse.findById(id);
        if (!farmhouse) {
            return res.status(404).json({ message: 'Farmhouse not found' });
        }

        if (farmhouse.isDeleted) {
            return res.status(400).json({ message: 'Farmhouse is already deleted' });
        }

        // Soft delete: set isDeleted flag and deletedAt timestamp
        const deletedFarmhouse = await Farmhouse.findByIdAndUpdate(
            id,
            {
                isDeleted: true,
                deletedAt: new Date()
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: 'Farmhouse deleted successfully',
            data: deletedFarmhouse
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!["approved", "rejected", "inactive"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const farmhouse = await Farmhouse.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        res.json({ message: "Status updated", farmhouse });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};