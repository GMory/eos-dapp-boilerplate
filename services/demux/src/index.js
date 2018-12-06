const watcher = require("demux")
const handler = require("demux-postgres")
const massive = require("massive")
const reader = require("./MongoActionReader")
const updaters = require("./updaters")

const effects = []

console.info("==== Starting demux ====")

const INITIAL_BLOCK = Number(process.env.CHAIN_INIT_BLOCK || 100)

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017"
const MONGO_DB = process.env.MONGO_DB || "EOSFN"

console.info("Initial Block to sync >>>> ", INITIAL_BLOCK)

const dbConfig = {
  user: process.env.DB_USER || "user",
  password: process.env.DB_PASSWORD || "pass",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || "eoslocal",
  schema: process.env.DB_SCHEMA || "public",
}

console.info("DB Config >>>\n", dbConfig)

const init = async () => {

  const db = await massive(dbConfig)

  const actionHandler = new handler.MassiveActionHandler(
    updaters.updaters,
    effects,
    db,
    dbConfig.schema,
  )

  const inlineListeners = [
    "tradestuff::acctadd",
    "tradestuff::acctupdate",
    "tradestuff::acctdel",
    "tradestuff::catadd",
    "tradestuff::catupdate",
    "tradestuff::catdel",
    "tradestuff::condadd",
    "tradestuff::condupdate",
    "tradestuff::conddel",
    "tradestuff::likeadd",
    "tradestuff::likedel",
    "tradestuff::offeraccpt",
    "tradestuff::offeradd",
    "tradestuff::offerdecl",
    "tradestuff::offerdel",
    "tradestuff::offerrenew",
    "tradestuff::stuffadd",
    "tradestuff::stuffupdate",
    "tradestuff::stuffdel",
    "tradestuff::stuffsent",
    "tradestuff::stuffrecv",
    "tradestuff::wantadd",
    "tradestuff::wantdel",
  ]

  const actionReader = new reader.MongoActionReader(
    MONGO_URI,
    INITIAL_BLOCK,
    false,
    600,
    MONGO_DB,
    inlineListeners,
  )

  await actionReader.initialize()

  const actionWatcher = new watcher.BaseActionWatcher(
    actionReader,
    actionHandler,
    500,
  )

  actionWatcher.watch()

}

const exit = (e) => {
  console.error("An error has occured. error is: %s and stack trace is: %s", e, e.stack)
  console.error("Process will restart now.")
  process.exit(1)
}

process.on("unhandledRejection", exit)
process.on("uncaughtException", exit)
setTimeout(init, 2500)
