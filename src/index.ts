import { RestClient } from './rest_client';

(async () => {
  const client = new RestClient();

  // read requests
  await client.getVaults(); //this would give you a json object iwth the vaults array
  await client.listWallets();

  //initiate transaction

  //see https://docs.utila.io/reference/utila-types

  //example how to do USDC (an erc20 token) on sepolia
  //   const asset =
  //     'assets/erc20.ethereum-testnet-sepolia.0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238';
  //attention: 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238 is the USDC contract address on sepolia
  //https://sepolia.etherscan.io/address/0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238

  //example how to do native ETH on sepolia
  const asset = 'assets/native.ethereum-testnet-sepolia';

  const amount = '0.00001';
  const sourceAddress = '0x3a4E3e66D327Fb8A7a1d17919B40b77B10c8cC0D';
  const destinationAddress = '0x6b10C92B63f8222Fe0b77C87dF30c3F256c73E76';

  const result = await client.initiateAssetTransfer(
    asset,
    amount,
    sourceAddress,
    destinationAddress,
    false,
    'test transfer'
  );

  console.log('Transfer Response:', JSON.stringify(result, null, 2));

  // Next: https://docs.utila.io/reference/webhooks
})();
