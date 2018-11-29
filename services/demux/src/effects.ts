const logAccountAdd = (_: any, payload: any) => {
  console.info("=========================\nACCOUNT CREATED ===> Payload:\n=========================\n\n", payload)
}

const effects = [
  {
    actionType: "tradestuff::acctadd",
    effect: logAccountAdd,
  },
]

export { effects }
