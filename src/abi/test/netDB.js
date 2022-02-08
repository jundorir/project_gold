export const netDB = [
  {
    inputs: [
      {
        name: "node",
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
        indexed: true,
        name: "inviter",
        type: "address",
      },
      {
        indexed: true,
        name: "inviterTime",
        type: "uint256",
      },
    ],
    name: "BindingParents",
    type: "event",
  },
  {
    constant: false,
    inputs: [
      {
        name: "user",
        type: "address",
      },
      {
        name: "parent",
        type: "address",
      },
    ],
    name: "bindParent",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
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
    name: "getParent",
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
    inputs: [
      {
        name: "user",
        type: "address",
      },
    ],
    name: "getMyChilders",
    outputs: [
      {
        name: "",
        type: "address[]",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];
