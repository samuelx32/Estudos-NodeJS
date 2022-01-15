const db = require("./db");

const Post = db.sequelize;

Post.define('passaros', {
    nome: {
        type: db.Sequelize.STRING
    },
    especie: {
        type: db.Sequelize.STRING
    }
});

module.exports = {
    Post: Post
}




Post.sync({force: true});




