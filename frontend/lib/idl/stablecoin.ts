export type StablecoinIdl = {
  "version": "0.1.0",
  "name": "green_stablecoin",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "usdtMint",
          "type": "publicKey"
        },
        {
          "name": "daoTokenAccount",
          "type": "publicKey"
        },
        {
          "name": "decimals",
          "type": "u8"
        }
      ]
    },
    {
      "name": "transfer",
      "accounts": [
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "senderTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipientTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "daoTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "mint",
      "accounts": [
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipientTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAuthority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "burn",
      "accounts": [
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateReserves",
      "accounts": [
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "usdtAmount",
          "type": "u64"
        },
        {
          "name": "realEstateValue",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateDaoAccount",
      "accounts": [
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "newDaoAccount",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "getReserves",
      "accounts": [
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [],
      "returns": {
        "defined": "(u64, u64, bool)"
      }
    },
    {
      "name": "getDaoContributions",
      "accounts": [
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [],
      "returns": "u64"
    }
  ],
  "accounts": [
    {
      "name": "Config",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "usdtMint",
            "type": "publicKey"
          },
          {
            "name": "daoTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "decimals",
            "type": "u8"
          },
          {
            "name": "daoContributions",
            "type": "u64"
          },
          {
            "name": "usdtReserve",
            "type": "u64"
          },
          {
            "name": "realEstateValue",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "TransferEvent",
      "fields": [
        {
          "name": "from",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "to",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "fee",
          "type": "u64",
          "index": false
        },
        {
          "name": "dao",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "MintEvent",
      "fields": [
        {
          "name": "to",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "BurnEvent",
      "fields": [
        {
          "name": "from",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "ReservesUpdatedEvent",
      "fields": [
        {
          "name": "usdtAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "realEstateValue",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "DaoUpdatedEvent",
      "fields": [
        {
          "name": "newDaoAccount",
          "type": "publicKey",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "Unauthorized",
      "msg": "Unauthorized access"
    },
    {
      "code": 6001,
      "name": "InvalidDaoAccount",
      "msg": "Invalid DAO account"
    },
    {
      "code": 6002,
      "name": "InsufficientReserves",
      "msg": "Insufficient reserves"
    },
    {
      "code": 6003,
      "name": "Overflow",
      "msg": "Arithmetic overflow"
    },
    {
      "code": 6004,
      "name": "InsufficientAmount",
      "msg": "Insufficient amount after fee"
    }
  ]
};

// Export the actual IDL as a value rather than just a type
export const StablecoinIdl: StablecoinIdl = {
  "version": "0.1.0",
  "name": "green_stablecoin",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "usdtMint",
          "type": "publicKey"
        },
        {
          "name": "daoTokenAccount",
          "type": "publicKey"
        },
        {
          "name": "decimals",
          "type": "u8"
        }
      ]
    },
    {
      "name": "transfer",
      "accounts": [
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "senderTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipientTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "daoTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "mint",
      "accounts": [
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "recipientTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAuthority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "burn",
      "accounts": [
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateReserves",
      "accounts": [
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "usdtAmount",
          "type": "u64"
        },
        {
          "name": "realEstateValue",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateDaoAccount",
      "accounts": [
        {
          "name": "config",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        }
      ],
      "args": [
        {
          "name": "newDaoAccount",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "getReserves",
      "accounts": [
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [],
      "returns": {
        "defined": "(u64, u64, bool)"
      }
    },
    {
      "name": "getDaoContributions",
      "accounts": [
        {
          "name": "config",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [],
      "returns": "u64"
    }
  ],
  "accounts": [
    {
      "name": "Config",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "usdtMint",
            "type": "publicKey"
          },
          {
            "name": "daoTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "decimals",
            "type": "u8"
          },
          {
            "name": "daoContributions",
            "type": "u64"
          },
          {
            "name": "usdtReserve",
            "type": "u64"
          },
          {
            "name": "realEstateValue",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "TransferEvent",
      "fields": [
        {
          "name": "from",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "to",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        },
        {
          "name": "fee",
          "type": "u64",
          "index": false
        },
        {
          "name": "dao",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "MintEvent",
      "fields": [
        {
          "name": "to",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "BurnEvent",
      "fields": [
        {
          "name": "from",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "amount",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "ReservesUpdatedEvent",
      "fields": [
        {
          "name": "usdtAmount",
          "type": "u64",
          "index": false
        },
        {
          "name": "realEstateValue",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "DaoUpdatedEvent",
      "fields": [
        {
          "name": "newDaoAccount",
          "type": "publicKey",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "Unauthorized",
      "msg": "Unauthorized access"
    },
    {
      "code": 6001,
      "name": "InvalidDaoAccount",
      "msg": "Invalid DAO account"
    },
    {
      "code": 6002,
      "name": "InsufficientReserves",
      "msg": "Insufficient reserves"
    },
    {
      "code": 6003,
      "name": "Overflow",
      "msg": "Arithmetic overflow"
    },
    {
      "code": 6004,
      "name": "InsufficientAmount",
      "msg": "Insufficient amount after fee"
    }
  ]
}; 