import { createEVM } from "@ethereumjs/evm";
import type { EVM } from "@ethereumjs/evm";
import { createAddressFromString, type Address } from "@ethereumjs/util";
import {
  bytesToHex,
  concat,
  encodeAbiParameters,
  encodeFunctionData,
  decodeFunctionResult,
  hexToBytes,
} from "viem";
import { erc721Abi } from "@/contracts/erc721Abi";
import { erc721InitBytecode } from "@/contracts/erc721Bytecode";

const DEPLOYER = createAddressFromString("0x0000000000000000000000000000000000000001");
const GAS_LIMIT = 100_000_000n;

let evmPromise: Promise<{ evm: EVM; contract: Address }> | null = null;
const svgCache = new Map<string, string>();

async function deploy() {
  const evm = await createEVM();

  const constructorArgs = encodeAbiParameters(
    [
      { type: "string", name: "name_" },
      { type: "string", name: "symbol_" },
    ],
    ["Neolastics", "NLS"],
  );
  const initCode = concat([erc721InitBytecode, constructorArgs]);

  const result = await evm.runCall({
    caller: DEPLOYER,
    data: hexToBytes(initCode),
    gasLimit: GAS_LIMIT,
  });

  if (result.execResult.exceptionError) {
    throw new Error(`ERC721 deploy failed: ${result.execResult.exceptionError.error}`);
  }
  if (!result.createdAddress) {
    throw new Error("ERC721 deploy did not produce a contract address");
  }

  return { evm, contract: result.createdAddress };
}

function getEvm() {
  if (!evmPromise) evmPromise = deploy();
  return evmPromise;
}

export async function generateSvg(tokenId: string): Promise<string> {
  const cached = svgCache.get(tokenId);
  if (cached) return cached;

  const { evm, contract } = await getEvm();

  const calldata = encodeFunctionData({
    abi: erc721Abi,
    functionName: "generateSVGofTokenById",
    args: [BigInt(tokenId)],
  });

  const result = await evm.runCall({
    caller: DEPLOYER,
    to: contract,
    data: hexToBytes(calldata),
    gasLimit: GAS_LIMIT,
  });

  if (result.execResult.exceptionError) {
    throw new Error(`generateSVGofTokenById reverted: ${result.execResult.exceptionError.error}`);
  }

  const svg = decodeFunctionResult({
    abi: erc721Abi,
    functionName: "generateSVGofTokenById",
    data: bytesToHex(result.execResult.returnValue),
  }) as string;

  svgCache.set(tokenId, svg);
  return svg;
}
