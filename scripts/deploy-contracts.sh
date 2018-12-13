#!/bin/bash
# TODO
#!/bin/bash

cleos='docker exec -i eoslocal_eosio cleos -u http://eosio:8888 --wallet-url http://wallet:8901'
directory_of_contract_to_deploy="contracts/tradestuff"
TS_ACCOUNT="tradestuff"
U1_ACCOUNT="user1"
U2_ACCOUNT="user2"
U3_ACCOUNT="user3"
U4_ACCOUNT="user4"

function create_contract_accounts () {
  echo "Creating testing accounts"

  PRIVATEKEY="5K4MHQN7sPdEURaxzjCnbynUwkEKRJzs8zVUf24ofaFiZNK815J"
  PUBLICKEY="EOS5k6Jht1epqZ2mnRLFVDXDTosaTneR6xFhvenVLiFfz5Ue125dL"

  import_private_key $PRIVATEKEY

  create_eos_account $TS_ACCOUNT $PUBLICKEY
  create_eos_account $U1_ACCOUNT $PUBLICKEY
  create_eos_account $U2_ACCOUNT $PUBLICKEY
  create_eos_account $U3_ACCOUNT $PUBLICKEY
  create_eos_account $U4_ACCOUNT $PUBLICKEY
}

function deploy_contract () {
  $cleos set contract $TS_ACCOUNT ${directory_of_contract_to_deploy} -p $TS_ACCOUNT
}
function import_private_key () {
  $cleos wallet import --private-key $1
}
function create_eos_account () {
  $cleos create account eosio $1 $2 $2
  $cleos push action eosio.token issue '[ "'$1'", "10.0000 EOS", "initial stake - free tokens" ]' -p eosio
}
function unlock_wallet () {
  echo "unlocking eoslocal wallet..."
  wallet_pass=$(docker exec -i eoslocal_eosio cat //opt/application/config/keys/eoslocal_wallet_password.txt)
  $cleos wallet unlock --name eoslocal --password  $wallet_pass
  sleep .5
}

unlock_wallet
create_contract_accounts
deploy_contract
