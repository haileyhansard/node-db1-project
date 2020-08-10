const express = require('express');

const db = require('../data/dbConfig');

const router = express.Router();

router.get('/', (req, res) => {
    db('accounts')
        .then(accounts => {
            res.status(200).json({ data: accounts })
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: error.message });
        });
});

router.get('/:id', (req, res) => {
    db('accounts')
    .where({ id: req.params.id })
        .then(account => {
            res.status(200).json({ data: account });
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ error: error.message });
        });
});

router.post('/', (req, res) => {
    const account = req.body;
    db('accounts')
    .insert(account)
    .returning('id')
    .then(ids => {
        res.status(201).json({ insert: ids })
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ error: error.message });
    });
});

router.put('/:id', (req, res) => {
    const changes = req.body;
    const accountId = req.params.id;

    db('accounts')
        .where({ id: accountId })
        .update(changes)
        .then(count => {
            if(count) {
                res.status(200).json({ message: "Account updated successfully" });
            } else {
                res.status(404).json({ message: "Account not found" });
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ error: error.message })
        });
});

router.delete('/:id', (req, res) => {
    const accountId = req.params.id;

    db('accounts')
        .where({ id: accountId })
        .del()
        .then(count => {
            if(count) {
                res.status(200).json({ message: "Account removed successfully" });
            } else {
                res.status(404).json({ message: "Account attempted to target was not found" });
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ error: error.message });
        });
});

module.exports = router;