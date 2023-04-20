import * as env from "dotenv";
env.config();
import mongoose from "mongoose"

export let dbConnection = async () => {
    await mongoose.connect(process.env.dbConnectionLink)
        .then((result) => console.log(`database is connection .............`))
        .catch((err) => console.log(`database faild to connected .......${err}`))
}
