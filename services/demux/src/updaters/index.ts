const contractName = "tradestuff"

import { acctadd } from './account/acctadd'
import { acctupdate } from './account/acctupdate'
import { acctdel } from './account/acctdel'
import { catadd } from './category/catadd'
import { catupdate } from './category/catupdate'
import { catdel } from './category/catdel'
import { condadd } from './condition/condadd'
import { condupdate } from './condition/condupdate'
import { conddel } from './condition/conddel'

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
  }
]

export { updaters }