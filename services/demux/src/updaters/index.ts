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
import { likeadd } from './like/likeadd'
import { likedel } from './like/likedel'
import { stuffadd } from './stuff/stuffadd'
import { stuffupdate } from './stuff/stuffupdate'
import { stuffdel } from './stuff/stuffdel'
import { wantadd } from './want/wantadd'
import { wantdel } from './want/wantdel'

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

export { updaters }