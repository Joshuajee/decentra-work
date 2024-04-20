export type Decentrawork = {
  version: '0.1.0';
  name: 'decentrawork';
  instructions: [
    {
      name: 'close';
      accounts: [
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'bestOffer';
          isMut: true;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: 'decrement';
      accounts: [
        {
          name: 'bestOffer';
          isMut: true;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: 'increment';
      accounts: [
        {
          name: 'bestOffer';
          isMut: true;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: 'initialize';
      accounts: [
        {
          name: 'payer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'bestOffer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: 'set';
      accounts: [
        {
          name: 'bestOffer';
          isMut: true;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'value';
          type: 'u8';
        }
      ];
    }
  ];
  accounts: [
    {
      name: 'bestOffer';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'count';
            type: 'u8';
          }
        ];
      };
    }
  ];
};

export const IDL: Decentrawork = {
  version: '0.1.0',
  name: 'decentrawork',
  instructions: [
    {
      name: 'close',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'bestOffer',
          isMut: true,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'decrement',
      accounts: [
        {
          name: 'bestOffer',
          isMut: true,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'increment',
      accounts: [
        {
          name: 'bestOffer',
          isMut: true,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'initialize',
      accounts: [
        {
          name: 'payer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'bestOffer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: 'set',
      accounts: [
        {
          name: 'bestOffer',
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'value',
          type: 'u8',
        },
      ],
    },
  ],
  accounts: [
    {
      name: 'bestOffer',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'count',
            type: 'u8',
          },
        ],
      },
    },
  ],
};
