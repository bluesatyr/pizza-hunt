const { Comment, Pizza } = require('../models');

const commentController = {
  // add comment to pizza
  addComment({ params, body }, res) {
    console.log(body);
    Comment.create(body)
      .then(({ _id }) => {
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          { $push: { comments: _id } }, // $push is a MongoDB built-in => adds data to an array
          { new: true } // to receive back the updated information from the .create()
        );
      })
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => res.json(err));
  },
  // add reply
  addReply({ params, body }, res) {
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      { $push: { replies: body} },
      { new: true }
    )
    .then(dbPizzaData => {
      if (!dbPizzaData) {
        res.status(404).json({ message: 'No Pizza found with this id!' });
        return;
      }
      res.json(dbPizzaData);
    })
    .catch(err => res.json(err));
  },
  // remove comment
  removeComment({ params }, res) {
    Comment.findOneAndDelete({ _id: params.commentId })
      .then(deletedComment => {
        if (!deletedComment) {
          return res.status(404).json({ message: 'No comment with this id!' });
        }
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          { $pull: { comments: params.commentId } }, //take that data and use it to identify and remove it from the associated pizza
          { new: true }
        );
      })
      .then(dbPizzaData => {
        if (!dbPizzaData) {
          res.status(404).json({ message: 'No pizza found with this id!' });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch(err => res.json(err));
  },
  // remove reply
  removeReply({ params }, res) {
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      { $pull: { replies: { replyId: params.replyId } } }, //removes reply by replyId
      { new: true } // returns updated comment without deleted reply
    )
     .then(dbPizzaData => res.json(dbPizzaData))
     .catch(err => res.json(err));
  }
};

module.exports = commentController;