import { Service } from 'typedi';
import { ECDSAProvider } from '@zerodev/sdk';
import { LocalAccountSigner } from '@alchemy/aa-core';
import { createPublicClient, encodeFunctionData, http, parseAbi } from 'viem';
import { polygonMumbai } from 'viem/chains';
import { PROJECT_ID } from '../config/index';

const owner = LocalAccountSigner.privateKeyToAccountSigner('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80');
const contractAddress = '0x34bE7f35132E97915633BC1fc020364EA5134863';
const contractABI = parseAbi(['function mint(address _to) public', 'function balanceOf(address owner) external view returns (uint256 balance)']);
const publicClient = createPublicClient({
  chain: polygonMumbai,
  transport: http('https://polygon-mumbai.infura.io/v3/f36f7f706a58477884ce6fe89165666c'),
});

@Service()
export class AccountService {
  public async address(salt: bigint): Promise<string> {
    // LocalAccountSigner.privateKeyToAccountSigner("")

    return '0x1234567890123456789012345678901234567890';
  }

  public async deploy(salt: bigint, newOwner: string): Promise<string> {
    const ecdsaProvider = await ECDSAProvider.init({
      projectId: PROJECT_ID,
      owner,
      opts: {
        accountConfig: {
          index: salt,
        },
      },
    });
    const address = await ecdsaProvider.getAddress();
    console.log('My address:', address);

    return address;
  }

  public async mint(): Promise<string> {
    console.log('projectId:', PROJECT_ID);
    console.log('owner:', owner.getAddress());

    const ecdsaProvider = await ECDSAProvider.init({
      projectId: PROJECT_ID,
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

    return hash;
  }

  public async balance(address: string): Promise<string> {
    // Check how many NFTs we have
    const balanceOf = await publicClient.readContract({
      address: contractAddress,
      abi: contractABI,
      functionName: 'balanceOf',
      args: [address],
    });
    return `NFT balance: ${balanceOf}`;
  }
}
