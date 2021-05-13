// CRUD create read update delete
const {MongoClient, ObjectID} = require('mongodb')

const databaseName = 'task_manager'

MongoClient.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (error, client) => {
        if (error) {
            return console.log('Unable to connect to database!')
        }

        const db = client.db(databaseName)

    }
)