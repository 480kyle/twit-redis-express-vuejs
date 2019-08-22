const Sequelize = require('sequelize')

const {log, error} = require('../../consts/constants')
const {database, user, password, host} = JSON.parse(process.env.MYSQL)

const sequelize = new Sequelize(database, user, password, {
    host: host,
    dialect: 'mysql'
})

/* test sequelize connection */
sequelize
    .authenticate()
    .then(() => {
        log('Connection has been established successfully.')
    })
    .catch(err => {
        error('Unable to connect to the database:', err)
    })