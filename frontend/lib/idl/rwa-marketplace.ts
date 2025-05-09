export type RWAMarketplaceIdl = {
  "version": "0.1.0",
  "name": "rwa_marketplace",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "marketplace",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
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
          "name": "stablecoinConfigAddress",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "listRwa",
      "accounts": [
        {
          "name": "marketplace",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "property",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "masterEdition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stablecoinConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
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
          "name": "uri",
          "type": "string"
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "symbol",
          "type": "string"
        },
        {
          "name": "assetValue",
          "type": "u64"
        },
        {
          "name": "location",
          "type": "string"
        },
        {
          "name": "propertyDetails",
          "type": "string"
        },
        {
          "name": "liquidationThreshold",
          "type": {
            "option": "u8"
          }
        }
      ]
    },
    {
      "name": "updateValuation",
      "accounts": [
        {
          "name": "marketplace",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "property",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "stablecoinConfig",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newValue",
          "type": "u64"
        }
      ]
    },
    {
      "name": "transferRwa",
      "accounts": [
        {
          "name": "property",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "currentOwner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "newOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fromTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "toTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "liquidateRwa",
      "accounts": [
        {
          "name": "marketplace",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "property",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "adminTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stablecoinConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "setLiquidationThreshold",
      "accounts": [
        {
          "name": "marketplace",
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
          "name": "threshold",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "Marketplace",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "stablecoinConfig",
            "type": "publicKey"
          },
          {
            "name": "nftCount",
            "type": "u64"
          },
          {
            "name": "liquidationThreshold",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "RealEstateProperty",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "value",
            "type": "u64"
          },
          {
            "name": "initialValue",
            "type": "u64"
          },
          {
            "name": "lastValuationDate",
            "type": "i64"
          },
          {
            "name": "location",
            "type": "string"
          },
          {
            "name": "details",
            "type": "string"
          },
          {
            "name": "status",
            "type": {
              "defined": "AssetStatus"
            }
          },
          {
            "name": "liquidationThreshold",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "AssetStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Listed"
          },
          {
            "name": "AtRisk"
          },
          {
            "name": "Liquidated"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "RWAListedEvent",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "mint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "value",
          "type": "u64",
          "index": false
        },
        {
          "name": "location",
          "type": "string",
          "index": false
        }
      ]
    },
    {
      "name": "RWAValuationUpdatedEvent",
      "fields": [
        {
          "name": "mint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "oldValue",
          "type": "u64",
          "index": false
        },
        {
          "name": "newValue",
          "type": "u64",
          "index": false
        },
        {
          "name": "timestamp",
          "type": "i64",
          "index": false
        }
      ]
    },
    {
      "name": "RWATransferredEvent",
      "fields": [
        {
          "name": "mint",
          "type": "publicKey",
          "index": false
        },
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
          "name": "value",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "RWALiquidationRiskEvent",
      "fields": [
        {
          "name": "mint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "currentValue",
          "type": "u64",
          "index": false
        },
        {
          "name": "liquidationThreshold",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "RWALiquidatedEvent",
      "fields": [
        {
          "name": "mint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "value",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "LiquidationThresholdUpdatedEvent",
      "fields": [
        {
          "name": "newThreshold",
          "type": "u8",
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
      "name": "InvalidTokenAccount",
      "msg": "Invalid token account"
    },
    {
      "code": 6002,
      "name": "NotEligibleForLiquidation",
      "msg": "Asset not eligible for liquidation"
    },
    {
      "code": 6003,
      "name": "InvalidThreshold",
      "msg": "Invalid liquidation threshold (must be between 1-100)"
    }
  ]
};

// Export the actual IDL as a value rather than just a type
export const RWAMarketplaceIdl: RWAMarketplaceIdl = {
  "version": "0.1.0",
  "name": "rwa_marketplace",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "marketplace",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
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
          "name": "stablecoinConfigAddress",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "listRwa",
      "accounts": [
        {
          "name": "marketplace",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "property",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "mint",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "metadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "masterEdition",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "stablecoinConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "metadataProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
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
          "name": "uri",
          "type": "string"
        },
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "symbol",
          "type": "string"
        },
        {
          "name": "assetValue",
          "type": "u64"
        },
        {
          "name": "location",
          "type": "string"
        },
        {
          "name": "propertyDetails",
          "type": "string"
        },
        {
          "name": "liquidationThreshold",
          "type": {
            "option": "u8"
          }
        }
      ]
    },
    {
      "name": "updateValuation",
      "accounts": [
        {
          "name": "marketplace",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "property",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "owner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "stablecoinConfig",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "newValue",
          "type": "u64"
        }
      ]
    },
    {
      "name": "transferRwa",
      "accounts": [
        {
          "name": "property",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "currentOwner",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "newOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "fromTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "toTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "liquidateRwa",
      "accounts": [
        {
          "name": "marketplace",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "property",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "owner",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ownerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "adminTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "stablecoinConfig",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "setLiquidationThreshold",
      "accounts": [
        {
          "name": "marketplace",
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
          "name": "threshold",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "Marketplace",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "publicKey"
          },
          {
            "name": "stablecoinConfig",
            "type": "publicKey"
          },
          {
            "name": "nftCount",
            "type": "u64"
          },
          {
            "name": "liquidationThreshold",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "RealEstateProperty",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "publicKey"
          },
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "value",
            "type": "u64"
          },
          {
            "name": "initialValue",
            "type": "u64"
          },
          {
            "name": "lastValuationDate",
            "type": "i64"
          },
          {
            "name": "location",
            "type": "string"
          },
          {
            "name": "details",
            "type": "string"
          },
          {
            "name": "status",
            "type": {
              "defined": "AssetStatus"
            }
          },
          {
            "name": "liquidationThreshold",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "AssetStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Listed"
          },
          {
            "name": "AtRisk"
          },
          {
            "name": "Liquidated"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "RWAListedEvent",
      "fields": [
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "mint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "value",
          "type": "u64",
          "index": false
        },
        {
          "name": "location",
          "type": "string",
          "index": false
        }
      ]
    },
    {
      "name": "RWAValuationUpdatedEvent",
      "fields": [
        {
          "name": "mint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "oldValue",
          "type": "u64",
          "index": false
        },
        {
          "name": "newValue",
          "type": "u64",
          "index": false
        },
        {
          "name": "timestamp",
          "type": "i64",
          "index": false
        }
      ]
    },
    {
      "name": "RWATransferredEvent",
      "fields": [
        {
          "name": "mint",
          "type": "publicKey",
          "index": false
        },
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
          "name": "value",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "RWALiquidationRiskEvent",
      "fields": [
        {
          "name": "mint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "currentValue",
          "type": "u64",
          "index": false
        },
        {
          "name": "liquidationThreshold",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "RWALiquidatedEvent",
      "fields": [
        {
          "name": "mint",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "owner",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "value",
          "type": "u64",
          "index": false
        }
      ]
    },
    {
      "name": "LiquidationThresholdUpdatedEvent",
      "fields": [
        {
          "name": "newThreshold",
          "type": "u8",
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
      "name": "InvalidTokenAccount",
      "msg": "Invalid token account"
    },
    {
      "code": 6002,
      "name": "NotEligibleForLiquidation",
      "msg": "Asset not eligible for liquidation"
    },
    {
      "code": 6003,
      "name": "InvalidThreshold",
      "msg": "Invalid liquidation threshold (must be between 1-100)"
    }
  ]
}; 