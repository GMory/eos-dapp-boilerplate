const contractName = "tradestuff"

const acctadd = require('./account/acctadd')
const acctupdate = require('./account/acctupdate')
const acctdel = require('./account/acctdel')

const catadd = require('./category/catadd')
const catupdate = require('./category/catupdate')
const catdel = require('./category/catdel')

const condadd = require('./condition/condadd')
const condupdate = require('./condition/condupdate')
const conddel = require('./condition/conddel')

const likeadd = require('./like/likeadd')
const likedel = require('./like/likedel')

const offeradd = require('./offer/offeradd')

const stuffadd = require('./stuff/stuffadd')
const stuffupdate = require('./stuff/stuffupdate')
const stuffdel = require('./stuff/stuffdel')

const wantadd = require('./want/wantadd')
const wantdel = require('./want/wantdel')

const updaters = [
  {
    actionType: `${contractName}::acctadd`,
    updater: acctadd,
  },
  {
    actionType: `${contractName}::acctupdate`,
    updater: acctupdate,
  },
  {
    actionType: `${contractName}::acctdel`,
    updater: acctdel,
  },
  {
    actionType: `${contractName}::catadd`,
    updater: catadd,
  },
  {
    actionType: `${contractName}::catupdate`,
    updater: catupdate,
  },
  {
    actionType: `${contractName}::catdel`,
    updater: catdel,
  },
  {
    actionType: `${contractName}::condadd`,
    updater: condadd,
  },
  {
    actionType: `${contractName}::condupdate`,
    updater: condupdate,
  },
  {
    actionType: `${contractName}::conddel`,
    updater: conddel,
  },
  {
    actionType: `${contractName}::likeadd`,
    updater: likeadd,
  },
  {
    actionType: `${contractName}::likedel`,
    updater: likedel,
  },
  {
    actionType: `${contractName}::offeradd`,
    updater: offeradd,
  },
  {
    actionType: `${contractName}::stuffadd`,
    updater: stuffadd,
  },
  {
    actionType: `${contractName}::stuffupdate`,
    updater: stuffupdate,
  },
  {
    actionType: `${contractName}::stuffdel`,
    updater: stuffdel,
  },
  {
    actionType: `${contractName}::wantadd`,
    updater: wantadd,
  },
  {
    actionType: `${contractName}::wantdel`,
    updater: wantdel,
  }
]

module.exports = { updaters }