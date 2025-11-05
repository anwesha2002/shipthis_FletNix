const Show = require('../models/Show');
const { applyAgeFilter, checkAgeRestriction } = require('../middleware/ageMiddleware');

const getShows = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 15;
        const search = req.query.search || '';
        const type = req.query.type || '';
        const cast = req.query.cast || '';

        let query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { cast: { $elemMatch: { $regex: search, $options: 'i' } } }
            ];
        }

        if (type && (type === 'Movie' || type === 'TV Show')) {
            query.type = type;
        }

        if (cast) {
            query.cast = { $elemMatch: { $regex: cast, $options: 'i' } };
        }

        const userAge = req.user ? req.user.age : null;
        query = applyAgeFilter(query, userAge);

        const skip = (page - 1) * limit;



        const [items, totalItems] = await Promise.all([
            Show.find(query).skip(skip).limit(limit).lean(),
            Show.countDocuments(query)
        ]);

        const totalPages = Math.ceil(totalItems / limit);

        res.json({
            items,
            page,
            limit,
            totalPages,
            totalItems

        });
    } catch (error) {
        console.error('Get shows error:', error);
        res.status(500).json({ error: 'Server error fetching shows' });
    }
};

const getShowById = async (req, res) => {
    try {
        const { id } = req.params;

        console.log("id :" + id);

        let show = await Show.findOne({ show_id: id });

        if (!show) {
            show = await Show.findById(id);
        }

        if (!show) {
            return res.status(404).json({ error: 'Show not found' });
        }

        const userAge = req.user ? req.user.age : null;

        if (!checkAgeRestriction(show, userAge)) {
            return res.status(403).json({ error: 'Restricted content' });
        }

        console.log(show)

        res.json({ show });
    } catch (error) {
        console.error('Get show by ID error:', error);
        res.status(500).json({ error: 'Server error fetching show' });
    }
};

module.exports = { getShows, getShowById };