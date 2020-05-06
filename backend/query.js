const { ObjectId } = require('mongodb');

const getModel = (db, coll, res) => {
    db.collection(coll, (err, collection) => {
        if (err) console.log(err);

        collection.find().toArray((err, items) => {
            if (err) console.log(err);
            if (coll === 'artists') {
                items.forEach(artist => {
                    artist.avg_pop = (Math.round(artist.avg_pop * 100) / 100).toFixed(1);
                });
            }
            res.json(items);
        });
    });
};

const getInstance = (db, coll, req, res) => {
    const { id } = req.body;

    db.collection(coll, (err, collection) => {
        if (err) console.log(err);

        collection.find({ _id: ObjectId(id) }).toArray((err, items) => {
            if (err) console.log(err);
            if (!items[0]) {
                res.status(400).json('error');
            } else {
                if (coll === 'artists') {
                    items.forEach(artist => {
                        artist.avg_pop = (Math.round(artist.avg_pop * 100) / 100).toFixed(1);
                    });
                }
                res.json(items[0]);
            }
        });
    });
}

module.exports = {
    getModel,
    getInstance
};
