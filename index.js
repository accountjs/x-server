const { ECDSAProvider } = require('@zerodev/sdk');
const { LocalAccountSigner } = require('@alchemy/aa-core');
const { encodeFunctionData, parseAbi, createPublicClient, http } = require('viem');
const { polygonMumbai } = require('viem/chains');

// ZeroDev Project ID
const projectId = 'fc514f35-ed25-4100-97e6-90dd298a5d64';

// The "owner" of the AA wallet, which in this case is a private key
const owner = LocalAccountSigner.privateKeyToAccountSigner('0xea6c44ac03bff858b476bba40716402b03e41b8e97e276d1baec7c37d42484a0');

// The NFT contract we will be interacting with
const contractAddress = '0x34bE7f35132E97915633BC1fc020364EA5134863';
const contractABI = parseAbi(['function mint(address _to) public', 'function balanceOf(address owner) external view returns (uint256 balance)']);
const publicClient = createPublicClient({
  chain: polygonMumbai,
  transport: http('https://polygon-mumbai.infura.io/v3/f36f7f706a58477884ce6fe89165666c'),
});

const main = async () => {
  // Create the AA wallet
  const ecdsaProvider = await ECDSAProvider.init({
    projectId,
    owner,
  });
  const address = await ecdsaProvider.getAddress();
  console.log('My address:', address);

  // Mint the NFT
  const { hash } = await ecdsaProvider.sendUserOperation({
    target: contractAddress,
    data: encodeFunctionData({
      abi: contractABI,
      functionName: 'mint',
      args: [address],
    }),
  });
  await ecdsaProvider.waitForUserOperationTransaction(hash);

  // Check how many NFTs we have
  const balanceOf = await publicClient.readContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'balanceOf',
    args: [address],
  });
  console.log(`NFT balance: ${balanceOf}`);
};

main().then(() => process.exit(0));
