const getDb = require("./get-db");
const Bell = require("./models/Bell");
const Cat = require("./models/Cat");
const Country = require("./models/Country");
const Follow = require("./models/Follow");
const Message = require("./models/Message");
const MessageRead = require("./models/MessageRead");
const Product = require("./models/Product");
const Review = require("./models/Review");
const SubCat = require("./models/SubCat");
const User = require("./models/User");
const UserList = require("./models/UserList");
const View = require("./models/View");

const tablesMap = {
    Product: Product,
    Cat: Cat,
    SubCat: SubCat,
    Country: Country,
    Review: Review,
    Message: Message,
    MessageRead: MessageRead,
    Bell: Bell,
    View: View,
    UserList: UserList,
    User: User,
    Follow: Follow
}

module.exports = getTables = (dbInfo, tableKeys, locale, defaultLocale) => {
    const db = getDb(dbInfo)
    const tables = {}
    tableKeys.forEach(tableKey => {
        tables[tableKey] = tablesMap[tableKey]? tablesMap[tableKey](db, locale != defaultLocale? locale : null) : null
    });

    return tables

}