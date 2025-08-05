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
  const sourceAddress = '0xF9E4662db168105E4cDAc3AE67EAa1068A815b6D';
  const destinationAddress = '0x1dAA578D51DC6ddfc2E026e6deB78aE2C045f48b';

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
