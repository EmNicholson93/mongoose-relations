const { Router } = require('express');
const Actor = require ('../models/Actor');
const Film = require('../models/Film');

module.exports = Router()
  .post('/', (req, res, next) => {
    const {
      name,
      dob,
      pob
    } = req.body;

    Actor
      .create({ name, dob, pob })
      .then(actor => res.send(actor))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Actor
      .find()
      .select({ __v: false, dob: false, pob: false })
      .then(actor => res.send(actor))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Promise.all([
      Actor.findById(req.params.id)
        .select({ _id: false, __v: false }),
      Film.find({ 'cast.actor': req.params.id })
        .select({ _id: true, title: true, released: true })
    ])
      .then(([actor, films]) => res.send({ ...actor.toJSON(), films }))
      .catch(next);
  })

  .put('/:id', (req, res, next) => {
    const { name, dob, pob } = req.body;

    Actor
      .findByIdAndUpdate(req.params.id, { name, dob, pob }, { new: true })
      .then(actor => res.send(actor))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Film
      .find({ 'cast.actor': req.params.id })
      .then(films => {
        if(films.length === 0) {
          Actor
            .findByIdAndDelete(req.params.id)
            .then(actor => res.send(actor))
            .catch(next);
        } else {
          res.send({
            message: 'Could not delete because the actor is in at least one film.'
          });
        }
      })
      .catch(next);
  });
