export const GoldBee = [
  {
    constant: true,
    inputs: [],
    name: "_currentSlotEndTime",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "_increasePercent",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "",
        type: "uint256",
      },
      {
        name: "",
        type: "uint256",
      },
    ],
    name: "_subscribeTotalAmount",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "_currentLimit",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "",
        type: "address",
      },
      {
        name: "",
        type: "uint256",
      },
      {
        name: "",
        type: "uint256",
      },
    ],
    name: "_isSubscribe",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "_originLimit",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "_TincreasePercent",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "_signer",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "_currentEpochId",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "_currentSlotId",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        name: "owner",
        type: "address",
      },
      {
        name: "receipt",
        type: "address",
      },
      {
        name: "jd",
        type: "address",
      },
      {
        name: "usdt",
        type: "address",
      },
      {
        name: "db",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        name: "epochid",
        type: "uint256",
      },
      {
        indexed: false,
        name: "slotid",
        type: "uint256",
      },
      {
        indexed: false,
        name: "subscribeAmount",
        type: "uint256",
      },
    ],
    name: "subScribeEvent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "buyer",
        type: "address",
      },
      {
        indexed: false,
        name: "epochid",
        type: "uint256",
      },
      {
        indexed: false,
        name: "slotid",
        type: "uint256",
      },
      {
        indexed: false,
        name: "usdtAmount",
        type: "uint256",
      },
      {
        indexed: false,
        name: "leftAmount",
        type: "uint256",
      },
      {
        indexed: false,
        name: "leftGroupAmount",
        type: "uint256",
      },
      {
        indexed: false,
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "subScribePurchaseEvent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "epochid",
        type: "uint256",
      },
      {
        indexed: false,
        name: "slotid",
        type: "uint256",
      },
      {
        indexed: false,
        name: "limit",
        type: "uint256",
      },
      {
        indexed: false,
        name: "grouplimit",
        type: "uint256",
      },
      {
        indexed: false,
        name: "timestamp",
        type: "uint256",
      },
      {
        indexed: false,
        name: "endtime",
        type: "uint256",
      },
    ],
    name: "deployNewSlot",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "epochid",
        type: "uint256",
      },
      {
        indexed: false,
        name: "slotid",
        type: "uint256",
      },
      {
        indexed: false,
        name: "limit",
        type: "uint256",
      },
      {
        indexed: false,
        name: "timestamp",
        type: "uint256",
      },
      {
        indexed: false,
        name: "endtime",
        type: "uint256",
      },
    ],
    name: "deployNewEpoch",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "buyer",
        type: "address",
      },
      {
        indexed: false,
        name: "epochid",
        type: "uint256",
      },
      {
        indexed: false,
        name: "slotid",
        type: "uint256",
      },
      {
        indexed: false,
        name: "usdtAmount",
        type: "uint256",
      },
      {
        indexed: false,
        name: "leftAmount",
        type: "uint256",
      },
      {
        indexed: false,
        name: "leftGroupAmount",
        type: "uint256",
      },
      {
        indexed: false,
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "groupBuyEvent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "epochid",
        type: "uint256",
      },
      {
        indexed: false,
        name: "slotid",
        type: "uint256",
      },
      {
        indexed: false,
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "changeSlotEndTimeEvent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "buyer",
        type: "address",
      },
      {
        indexed: false,
        name: "addrid",
        type: "uint256",
      },
      {
        indexed: false,
        name: "typeid",
        type: "uint256",
      },
      {
        indexed: false,
        name: "typeAmount",
        type: "uint256",
      },
      {
        indexed: false,
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "exChangeGoldEvent",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "rewarder",
        type: "address",
      },
      {
        indexed: false,
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        name: "beeAmount",
        type: "uint256",
      },
      {
        indexed: false,
        name: "timstamp",
        type: "uint256",
      },
    ],
    name: "GoldClubReward",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        name: "burnAmount",
        type: "uint256",
      },
    ],
    name: "exchangeUSDTEvent",
    type: "event",
  },
  {
    constant: true,
    inputs: [
      {
        name: "x",
        type: "uint256",
      },
      {
        name: "n",
        type: "uint256",
      },
    ],
    name: "pow",
    outputs: [
      {
        name: "r",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "pure",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "user",
        type: "address",
      },
    ],
    name: "_subscribeData",
    outputs: [
      {
        components: [
          {
            name: "slotid",
            type: "uint256",
          },
          {
            name: "topLimit",
            type: "uint256",
          },
          {
            name: "LowLimit",
            type: "uint256",
          },
          {
            name: "hasSubScribedAmount",
            type: "uint256",
          },
          {
            name: "subScribeAmount",
            type: "uint256",
          },
          {
            name: "isSubscribe",
            type: "bool",
          },
        ],
        name: "",
        type: "tuple[]",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "user",
        type: "address",
      },
      {
        name: "amount",
        type: "uint256",
      },
    ],
    name: "exchangeUSDT",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "signer",
        type: "address",
      },
    ],
    name: "setSigner",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "to",
        type: "address",
      },
      {
        name: "amount",
        type: "uint256",
      },
      {
        name: "beeAmount",
        type: "uint256",
      },
      {
        name: "id",
        type: "uint256",
      },
      {
        name: "signValue",
        type: "string",
      },
    ],
    name: "reward",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "isfullEnd",
        type: "bool",
      },
      {
        name: "endtime",
        type: "uint256",
      },
      {
        name: "beenAmount",
        type: "uint256",
      },
      {
        name: "usdtAmount",
        type: "uint256",
      },
    ],
    name: "deployEpochOrSlot",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "epochid",
        type: "uint256",
      },
      {
        name: "slotid",
        type: "uint256",
      },
      {
        name: "usdtAmount",
        type: "uint256",
      },
    ],
    name: "groupPurchase",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "user",
        type: "address",
      },
      {
        name: "amount",
        type: "uint256",
      },
    ],
    name: "subScribePurchase",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "user",
        type: "address",
      },
      {
        name: "epochid",
        type: "uint256",
      },
      {
        name: "slotid",
        type: "uint256",
      },
      {
        name: "amount",
        type: "uint256",
      },
    ],
    name: "subscribe",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "timeStamp",
        type: "uint256",
      },
    ],
    name: "setSlotEndTime",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "id",
        type: "uint256",
      },
      {
        name: "goldType",
        type: "uint256",
      },
      {
        name: "typeAmount",
        type: "uint256",
      },
      {
        name: "amount",
        type: "uint256",
      },
    ],
    name: "exChangeGold",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "epochid",
        type: "uint256",
      },
      {
        name: "slotid",
        type: "uint256",
      },
    ],
    name: "viewSlot",
    outputs: [
      {
        components: [
          {
            name: "_Limit",
            type: "uint256",
          },
          {
            name: "_EndTime",
            type: "uint256",
          },
          {
            name: "_EpochId",
            type: "uint256",
          },
          {
            name: "_LeftLimit",
            type: "uint256",
          },
          {
            name: "_LeftAmountForGroup",
            type: "uint256",
          },
          {
            name: "_max",
            type: "uint256",
          },
          {
            name: "_min",
            type: "uint256",
          },
        ],
        name: "",
        type: "tuple",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "user",
        type: "address",
      },
      {
        name: "epochid",
        type: "uint256",
      },
      {
        name: "slotid",
        type: "uint256",
      },
    ],
    name: "viewUserInfoOnSlot",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "tokeaddr",
        type: "address",
      },
      {
        name: "to",
        type: "address",
      },
      {
        name: "value",
        type: "uint256",
      },
    ],
    name: "summarizeFund",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];
