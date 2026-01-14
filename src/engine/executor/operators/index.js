const {IndexScan} = require("./indexScan")
const {NestedLoopJoin} = require("./nestedLoopJoin")
const {SeqScan} = require("./seqScan")
const {Filter} = require("./filter")
const {Projection} = require("./projection")
const {Insert} = require("./insert")
module.exports = {
    IndexScan,NestedLoopJoin,SeqScan,Filter,Projection,Insert
}