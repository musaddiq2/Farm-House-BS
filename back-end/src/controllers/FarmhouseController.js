import Farmhouse from "../models/Farmhouse.js";

export const FarmhouseCreate = async (req, res) => {
    try {
        const {
            name,
            adminId,
            description,
            location: { address, city, state, pincode },
            capacity: { minGuests, maxGuests },
            pricing: { fullDay },
            instantBooking,
            rules: { petsAllowed, alcoholAllowed, smokingAllowed }
        } = req.body;

        // Generate slug from name
        const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

        // Validate the data
        if (!name || !description || !address || !city || !state || !pincode || !minGuests || !maxGuests || !fullDay) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        if (typeof minGuests !== 'number' || typeof maxGuests !== 'number' || typeof fullDay !== 'number') {
            return res.status(400).json({ message: 'Invalid data types' });
        }

        if (typeof petsAllowed !== 'boolean' || typeof alcoholAllowed !== 'boolean' || typeof smokingAllowed !== 'boolean') {
            return res.status(400).json({ message: 'Invalid data types' });
        }
        
        // Create a new instance of the Farmhouse model
        const farmhouse = new Farmhouse({
            name,
            slug,
            adminId: adminId,
            description,
            location: {
                address,
                city,
                state,
                pincode
            },
            capacity: {
                minGuests,
                maxGuests
            },
            pricing: {
                fullDay
            },
            instantBooking,
            rules: {
                petsAllowed,
                alcoholAllowed,
                smokingAllowed
            }
        });

        // Save the instance to the database
        await farmhouse.save();

        return res.status(201).json({ message: 'Farmhouse created successfully' });
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

