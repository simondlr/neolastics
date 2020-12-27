const { time, balance } = require('@openzeppelin/test-helpers');

const delay = duration => new Promise(resolve => setTimeout(resolve, duration));
const { expect } = require("chai");  

const { loadFixture } = require('ethereum-waffle');
const { BigNumber } = require('ethers');

let ERC721;
let Curve;

const ETH0 = ethers.BigNumber.from('0');

const ETH1 = ethers.utils.parseEther('1');
const ETH2 = ethers.utils.parseEther('2');
const ETH3 = ethers.utils.parseEther('3');
const ETH4 = ethers.utils.parseEther('4');
const initBurnPrice = ethers.utils.parseEther('0.000995'); //creator earn 0.000005
const initMintPrice = ethers.utils.parseEther('0.001');

const palette = [];
palette.push("#fac901"); //y: 1/5 chance (0.1992)
palette.push("#225095"); //blue: 1/5 chance
palette.push("#dd0100"); //red: 1/5 chance
palette.push("#ffffff"); //w: 1/5 chance
palette.push("#000000"); //black: 1/5 chance
palette.push("#00770F"); //green: rare 1/256 chance for a ti

async function getTotalTxCost(txes) {
  let totalTxCost = ethers.utils.parseEther('0'); // todo change init of generic BigNumber, not ETH based to avoid confusion
  for (const tx of txes) {
    const txCost = await getTxCost(tx);
    totalTxCost = totalTxCost.add(txCost);
  }
  return totalTxCost;
}

async function getTxCost(tx) {
  const gasPrice = tx.gasPrice;
  const receipt = await tx.wait();
  const gasUsed = receipt.gasUsed;
  const txCost = gasPrice.mul(gasUsed);
  return txCost;
}

function hexToBytes(hex) {
  for (var bytes = [], c = 0; c < hex.length; c += 2)
  bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

function generateJSSVGFromHash(hash) {
  const bytes = hexToBytes(hash._hex.slice(2));
  const svg = "<svg width='300' height='300'>"
    + "<rect x='0' y='0' width='100' height='100' style='fill:"+palette[parseInt(bytes[0]/51)]+";stroke-width:3;stroke:black'/>" // tile 1
    + "<rect x='0' y='100' width='100' height='100' style='fill:"+palette[parseInt(bytes[1]/51)]+";stroke-width:3;stroke:black'/>" // tile 2
    + "<rect x='0' y='200' width='100' height='100' style='fill:"+palette[parseInt(bytes[2]/51)]+";stroke-width:3;stroke:black'/>" // tile 3
    + "<rect x='100' y='0' width='100' height='100' style='fill:"+palette[parseInt(bytes[3]/51)]+";stroke-width:3;stroke:black'/>" // tile 4
    + "<rect x='100' y='100' width='100' height='100' style='fill:"+palette[parseInt(bytes[4]/51)]+";stroke-width:3;stroke:black'/>" // tile 5
    + "<rect x='100' y='200' width='100' height='100' style='fill:"+palette[parseInt(bytes[5]/51)]+";stroke-width:3;stroke:black'/>" // tile 6
    + "<rect x='200' y='0' width='100' height='100' style='fill:"+palette[parseInt(bytes[6]/51)]+";stroke-width:3;stroke:black'/>" // tile 7
    + "<rect x='200' y='100' width='100' height='100' style='fill:"+palette[parseInt(bytes[7]/51)]+";stroke-width:3;stroke:black'/>" // tile 8
    + "<rect x='200' y='200' width='100' height='100' style='fill:"+palette[parseInt(bytes[8]/51)]+";stroke-width:3;stroke:black'/>" // tile 9
    + "</svg>";

  return svg;
}

describe("Neolastics", function() {
  let curve;
  let neolastics;

  let provider;
  let signers;
  let accounts;
  let snapshot;
  const gasLimit = 9500000; // if gas limit is set, it doesn't superfluosly run estimateGas, slowing tests down.

  this.beforeAll(async function() {
    provider = new ethers.providers.Web3Provider(web3.currentProvider);
    signers = await ethers.getSigners();
    accounts = await Promise.all(signers.map(async function(signer) {return await signer.getAddress(); }));

    ERC721 = await ethers.getContractFactory("ERC721");
    Curve = await ethers.getContractFactory("Curve");

    // creator == accounts[0]
    curve = await Curve.deploy(accounts[0], {gasLimit});
    await curve.deployed();
    const nlAddress = await curve.neolastics();
    neolastics = ERC721.attach(nlAddress);
    snapshot = await provider.send('evm_snapshot', []);
  });

 this.beforeEach(async function() {
    await provider.send('evm_revert', [snapshot]);
    snapshot = await provider.send('evm_snapshot', []);
  });

  it('neolastics: proper contract created', async () => {
    expect(await neolastics.name()).to.equal("Neolastics");
    expect(await neolastics.symbol()).to.equal("NLS");
    expect(await neolastics.baseURI()).to.equal("https://metadata.neolastics.com/.netlify/functions/server/");
    expect(await neolastics.curve()).to.equal(curve.address);
    expect(await neolastics.totalSupply()).to.equal('0');
  });
  
  it('neolastics: mint 1 neolastic from init (with 1 ETH)', async() => {
    const creator = await curve.creator();
    const minter = await balance.tracker(accounts[1]);
    const preMintBal = await minter.get();
    const creatorBal = await balance.tracker(creator);

    // pre mint checks
    expect(await curve.getCurrentPriceToMint()).to.equal(ethers.utils.parseEther('0.001'));
    expect(await curve.getCurrentPriceToBurn()).to.equal(ethers.utils.parseEther('0'));
    expect(await neolastics.totalSupply()).to.equal('0');
    expect(await curve.reserve()).to.equal(ethers.utils.parseEther('0'));

    await expect(neolastics.ownerOf(42)).to.be.revertedWith("ERC721: owner query for nonexistent token");
    await expect(neolastics.tokenURI(42)).to.be.revertedWith("ERC721Metadata: URI query for nonexistent token");

    // mint
    const tx = await curve.connect(signers[1]).mint({gasPrice: '5000000000', value: ETH1, gasLimit})
    // console.log('emit', tx);
    const gasPrice = tx.gasPrice;
    console.log('gp', gasPrice.toString());
    const receipt = await tx.wait();
    // console.log('receipt', receipt.events);
    const gasUsed = receipt.gasUsed;
    const txCost = gasPrice.mul(gasUsed);
    const postMintActualBal = await minter.get();
    const postMintCalcBal =  ethers.utils.parseUnits(preMintBal.toString(), 'wei').sub(txCost).sub(initMintPrice);
    console.log('tx cost in ETH at 50 gwei', ethers.utils.formatEther(txCost));
    
    // balance checks for creator
    const calcCreatorBal = initMintPrice.sub(initBurnPrice);
    const diffCreatorBal = await creatorBal.delta();

    const tokenId = await neolastics.tokenOfOwnerByIndex(accounts[1], 0);

    // converted to string because zeppelin uses BN and ethers.js uses BigNumber.
    expect(diffCreatorBal.toString()).to.equal(calcCreatorBal.toString());
    expect(postMintActualBal.toString()).to.equal(postMintCalcBal.toString());

    expect(await neolastics.ownerOf(tokenId)).to.equal(accounts[1]);
    expect(await neolastics.tokenURI(tokenId)).to.equal("https://metadata.neolastics.com/.netlify/functions/server/"+tokenId);
    expect(await neolastics.totalSupply()).to.equal('1');
    expect(await curve.reserve()).to.equal(ethers.utils.parseEther('0.000995'));

    expect(await curve.getCurrentPriceToMint()).to.equal(ethers.utils.parseEther('0.002'));
    expect(await curve.getCurrentPriceToBurn()).to.equal(ethers.utils.parseEther('0.000995'));

  });

  // mint 1 neolastic with zero ETH (fail)
  it('neolastics: mint 1 with zero ETH (fail)', async() => {
    await expect(curve.connect(signers[1]).mint({value: 0, gasLimit})).to.be.revertedWith('C: No ETH sent');
  });

  // mint 1 neolastic with insufficient funds (fai)
  it('neolastics: mint 1 with too little ETH (fail)', async() => {
    await expect(curve.connect(signers[1]).mint({value: ethers.utils.parseEther('0.00001'), gasLimit})).to.be.revertedWith('C: Not enough ETH sent');
  });


  // mint 1 neolastic from init (with precise ETH 0.001)
  it('neolastics: mint 1 neolastic from init (with 1 ETH)', async() => {
    const creator = await curve.creator();
    const minter = await balance.tracker(accounts[1]);
    const preMintBal = await minter.get();
    const creatorBal = await balance.tracker(creator);

    // mint
    const tx = await curve.connect(signers[1]).mint({value: ethers.utils.parseEther('0.001'), gasLimit});
    const gasPrice = tx.gasPrice;
    const receipt = await tx.wait();
    const gasUsed = receipt.gasUsed;
    const txCost = gasPrice.mul(gasUsed);
    const postMintActualBal = await minter.get();
    const postMintCalcBal =  ethers.utils.parseUnits(preMintBal.toString(), 'wei').sub(txCost).sub(initMintPrice);
    
    // balance checks for creator
    const calcCreatorBal = initMintPrice.sub(initBurnPrice);
    const diffCreatorBal = await creatorBal.delta();

    // converted to string because zeppelin uses BN and ethers.js uses BigNumber.
    expect(diffCreatorBal.toString()).to.equal(calcCreatorBal.toString());
    expect(postMintActualBal.toString()).to.equal(postMintCalcBal.toString());

    const tokenId = await neolastics.tokenOfOwnerByIndex(accounts[1], 0);

    expect(await neolastics.ownerOf(tokenId)).to.equal(accounts[1]);
    expect(await neolastics.tokenURI(tokenId)).to.equal("https://metadata.neolastics.com/.netlify/functions/server/"+tokenId);
    expect(await neolastics.totalSupply()).to.equal('1');

  });

  // mint 1 neolastic from init, then burn.
  it('neolastics: mint 1  neolastic from init, then burn', async() => {
    await curve.connect(signers[1]).mint({value: ETH1, gasLimit});

    const burner = await balance.tracker(accounts[1]);
    const preBurnBal = await burner.get();

    const estimatedBurnReturn = await curve.getCurrentPriceToBurn();

    const tokenId = await neolastics.tokenOfOwnerByIndex(accounts[1], 0);

    // burn
    const tx = await curve.connect(signers[1]).burn(tokenId, {gasLimit});
    const gasPrice = tx.gasPrice;
    const receipt = await tx.wait();
    const gasUsed = receipt.gasUsed;
    const txCost = gasPrice.mul(gasUsed);
    const postBurnActualBal = await burner.get();
    const postBurnCalcBal =  ethers.utils.parseUnits(preBurnBal.toString(), 'wei').sub(txCost).add(estimatedBurnReturn);
    
    // converted to string because zeppelin uses BN and ethers.js uses BigNumber.
    expect(postBurnActualBal.toString()).to.equal(postBurnCalcBal.toString());
    expect(await neolastics.totalSupply()).to.equal('0');
    expect(await curve.reserve()).to.equal('0');
    expect(await curve.getCurrentPriceToMint()).to.equal(ethers.utils.parseEther('0.001'));
    expect(await curve.getCurrentPriceToBurn()).to.equal(ethers.utils.parseEther('0'))
  });

  // mint 1 neolastic, then burn non-existent id (fail)
  it('neolastics: mint 1  neolastic, then burn non-existent id (fail)', async() => {
    await curve.connect(signers[1]).mint({value: ETH1, gasLimit});
    await expect(curve.connect(signers[1]).burn(44, {gasLimit})).to.be.revertedWith("ERC721: owner query for nonexistent token");
  });

  // mint 1 neolastic from init, then burn from incorrect owner (fail).
  it('neolastics: mint 1  neolastic, then burn from incorrect owner (fail)', async() => {
    await curve.connect(signers[1]).mint({value: ETH1, gasLimit});
    const tokenId = await neolastics.tokenOfOwnerByIndex(accounts[1], 0);
    await expect(curve.connect(signers[2]).burn(tokenId, {gasLimit})).to.be.revertedWith("NEOLASTICS: Not the correct owner");
  });

  it('neolastics: mint 1  neolastic, transfer, then burn from new account', async() => {
    await curve.connect(signers[1]).mint({value: ETH1, gasLimit});
    const tokenId = await neolastics.tokenOfOwnerByIndex(accounts[1], 0);
    await neolastics.connect(signers[1]).transferFrom(accounts[1], accounts[2], tokenId, {gasLimit});

    const burner = await balance.tracker(accounts[2]);
    const preBurnBal = await burner.get();

    const estimatedBurnReturn = await curve.getCurrentPriceToBurn();

    // burn
    const tx = await curve.connect(signers[2]).burn(tokenId, {gasLimit});
    const gasPrice = tx.gasPrice;
    const receipt = await tx.wait();
    const gasUsed = receipt.gasUsed;
    const txCost = gasPrice.mul(gasUsed);
    const postBurnActualBal = await burner.get();
    const postBurnCalcBal =  ethers.utils.parseUnits(preBurnBal.toString(), 'wei').sub(txCost).add(estimatedBurnReturn);
    
    // converted to string because zeppelin uses BN and ethers.js uses BigNumber.
    expect(postBurnActualBal.toString()).to.equal(postBurnCalcBal.toString());  
    expect(await neolastics.totalSupply()).to.equal('0');
  });

  // mint 1 neolastic, transfer to other account, and burn from OG account (fail).
  it('neolastics: mint 1  neolastic, transfer, then burn from OG account (fail)', async() => {
    await curve.connect(signers[1]).mint({value: ETH1, gasLimit});
    const tokenId = await neolastics.tokenOfOwnerByIndex(accounts[1], 0);
    await neolastics.connect(signers[1]).transferFrom(accounts[1], accounts[2], tokenId, {gasLimit});
    await expect(curve.connect(signers[1]).burn(tokenId, {gasLimit})).to.be.revertedWith("NEOLASTICS: Not the correct owner");
  });

  // mint 1 neolastic then burn neolastic from ERC721 with owner and non-owner (both fail).
  it('neolastics: mint 1  neolastic, then attempt burn from ERC721 with OG + new owner (both fail)', async() => {
    await curve.connect(signers[1]).mint({value: ETH1, gasLimit});
    const tokenId = await neolastics.tokenOfOwnerByIndex(accounts[1], 0);
    await neolastics.connect(signers[1]).transferFrom(accounts[1], accounts[2], tokenId, {gasLimit});
    await expect(neolastics.connect(signers[1]).burn(accounts[1], tokenId, {gasLimit})).to.be.revertedWith("NEOLASTICS: Burner is not the curve");
    await expect(neolastics.connect(signers[2]).burn(accounts[2], tokenId, {gasLimit})).to.be.revertedWith("NEOLASTICS: Burner is not the curve");
  });

  it('neolastics: mint 10, burn 10', async() => {
    const creator = await curve.creator();
    const minter = await balance.tracker(accounts[1]);
    const creatorBal = await balance.tracker(creator);
    const createPreBal = await creatorBal.get();
    const preMintBal = await minter.get();

    const mintTxes = [];
    for(let i = 0; i < 10; i+=1) {
      mintTxes.push(await curve.connect(signers[1]).mint({value: ETH1, gasLimit}));
    }

    const bal = await neolastics.balanceOf(accounts[1]);
    const totalMintTxCost = await getTotalTxCost(mintTxes);
    
    const r = await curve.reserve();

    const burnTxes = [];
    for(let i = 0; i < 10; i+=1) {
      // burn from front of the index
      const tokenId = await neolastics.tokenOfOwnerByIndex(accounts[1], 0);
      burnTxes.push(await curve.connect(signers[1]).burn(tokenId, {gasLimit}));
    }

    const totalBurnTxCost = await getTotalTxCost(burnTxes);

    // total paid estimated at 0.055 ETH. 0.5% Thus: 0.000275
    const calcCreatorBal = ethers.utils.parseUnits(createPreBal.toString(), 'wei').add(ethers.utils.parseEther('0.000275'));
    const diffCreatorBal = await creatorBal.get();

    // preVal - txCosts - creator cuts
    const postMintCalcBal =  ethers.utils.parseUnits(preMintBal.toString(), 'wei').sub(totalMintTxCost).sub(totalBurnTxCost).sub(ethers.utils.parseEther('0.000275'));
    const postMintActualBal = await minter.get();

    // converted to string because zeppelin uses BN and ethers.js uses BigNumber.
    expect(diffCreatorBal.toString()).to.equal(calcCreatorBal.toString());
    expect(postMintActualBal.toString()).to.equal(postMintCalcBal.toString());

    // expect(await curve.reserve()).to.equal('0');
    expect(await neolastics.totalSupply()).to.equal('0');
  });

  // mint 100, burn 50
  it('neolastics: mint 100, burn 50', async() => {
    const creator = await curve.creator();
    const minter = await balance.tracker(accounts[1]);
    const creatorBal = await balance.tracker(creator);
    const createPreBal = await creatorBal.get();
    const preMintBal = await minter.get();

    const mintTxes = [];
    for(let i = 0; i < 100; i+=1) {
      mintTxes.push(await curve.connect(signers[1]).mint({value: ETH1, gasLimit}));
    }

    const totalMintTxCost = await getTotalTxCost(mintTxes);
    
    const r = await curve.reserve();

    const burnTxes = [];
    for(let i = 0; i < 50; i+=1) {
      // burn from of the index
      const tokenId = await neolastics.tokenOfOwnerByIndex(accounts[1], 0);
      burnTxes.push(await curve.connect(signers[1]).burn(tokenId, {gasLimit}));
    }

    const totalBurnTxCost = await getTotalTxCost(burnTxes);

    // total paid estimated at 5.05 ETH. 0.5% Thus: 0.02525
    // 100*creator cuts
    const calcCreatorBal = ethers.utils.parseUnits(createPreBal.toString(), 'wei').add(ethers.utils.parseEther('0.02525'));
    const diffCreatorBal = await creatorBal.get();

    
    // preVal - txCosts - 100*creator cuts - 1.268625 (derived from 1.275 (*99.5%)) ETH
    const postMintCalcBal =  ethers.utils.parseUnits(preMintBal.toString(), 'wei')
      .sub(totalMintTxCost).sub(totalBurnTxCost)
      .sub(ethers.utils.parseEther('0.02525'))
      .sub(ethers.utils.parseEther('1.268625'));
    const postMintActualBal = await minter.get();

    // converted to string because zeppelin uses BN and ethers.js uses BigNumber.
    expect(diffCreatorBal.toString()).to.equal(calcCreatorBal.toString());
    expect(postMintActualBal.toString()).to.equal(postMintCalcBal.toString());

    expect(await curve.reserve()).to.equal(ethers.utils.parseEther('1.268625'));
    expect(await neolastics.totalSupply()).to.equal('50');
  });

  // mint 100, send 1, burn 99
  it('neolastics: mint 100, send 1, burn 99', async() => {
    const creator = await curve.creator();
    const minter = await balance.tracker(accounts[1]);
    const creatorBal = await balance.tracker(creator);
    const createPreBal = await creatorBal.get();
    const preMintBal = await minter.get();

    const mintTxes = [];
    for(let i = 0; i < 100; i+=1) {
      mintTxes.push(await curve.connect(signers[1]).mint({value: ETH1, gasLimit}));
    }

    const totalMintTxCost = await getTotalTxCost(mintTxes);
    
    const r = await curve.reserve();

    let tokenId = await neolastics.tokenOfOwnerByIndex(accounts[1], 0);

    const transferTx = await neolastics.connect(signers[1]).transferFrom(accounts[1], accounts[2], tokenId, {gasLimit});
    const transferTxCost = await getTxCost(transferTx);

    const burnTxes = [];
    for(let i = 0; i < 99; i+=1) {
      // burn from of the index
      tokenId = await neolastics.tokenOfOwnerByIndex(accounts[1], 0);
      burnTxes.push(await curve.connect(signers[1]).burn(tokenId, {gasLimit}));
    }

    const totalBurnTxCost = await getTotalTxCost(burnTxes);

    // total paid estimated at 5.05 ETH. 0.5% Thus: 0.02525
    // 100*creator cuts
    const calcCreatorBal = ethers.utils.parseUnits(createPreBal.toString(), 'wei').add(ethers.utils.parseEther('0.02525'));
    const diffCreatorBal = await creatorBal.get();

    
    // preVal - txCosts - 100*creator cuts - 1.268625 (derived from 1.275 (*99.5%)) ETH
    const postMintCalcBal =  ethers.utils.parseUnits(preMintBal.toString(), 'wei')
      .sub(totalMintTxCost).sub(totalBurnTxCost).sub(transferTxCost)
      .sub(ethers.utils.parseEther('0.02525')) // creator cut
      .sub(ethers.utils.parseEther('0.000995')); // still left in reserve
    const postMintActualBal = await minter.get();

    // converted to string because zeppelin uses BN and ethers.js uses BigNumber.
    expect(diffCreatorBal.toString()).to.equal(calcCreatorBal.toString());
    expect(postMintActualBal.toString()).to.equal(postMintCalcBal.toString());

    expect(await curve.reserve()).to.equal(ethers.utils.parseEther('0.000995'));
    expect(await neolastics.totalSupply()).to.equal('1');

    // should succeed at being assigned
    tokenId = await neolastics.tokenOfOwnerByIndex(accounts[2], 0);

    // should fail at being assigned
    await expect(neolastics.tokenOfOwnerByIndex(accounts[1], 0)).to.be.revertedWith('EnumerableSet: index out of bounds');
    await expect(neolastics.tokenOfOwnerByIndex(accounts[2], 1)).to.be.revertedWith('EnumerableSet: index out of bounds');
  });

  // mint 100, burn 100, remint 1
  it('neolastics: mint 100, burn 100', async() => {
    const creator = await curve.creator();
    const minter = await balance.tracker(accounts[1]);
    const creatorBal = await balance.tracker(creator);
    const createPreBal = await creatorBal.get();
    const preMintBal = await minter.get();

    const mintTxes = [];
    for(let i = 0; i < 100; i+=1) {
      mintTxes.push(await curve.connect(signers[1]).mint({value: ETH1, gasLimit}));
    }

    const totalMintTxCost = await getTotalTxCost(mintTxes);
    
    const r = await curve.reserve();

    let tokenId = "";

    const burnTxes = [];
    for(let i = 0; i < 100; i+=1) {
      // burn from of the index
      tokenId = await neolastics.tokenOfOwnerByIndex(accounts[1], 0);
      burnTxes.push(await curve.connect(signers[1]).burn(tokenId, {gasLimit}));
    }

    const totalBurnTxCost = await getTotalTxCost(burnTxes);

    // total paid estimated at 5.05 ETH. 0.5% Thus: 0.02525
    // 100*creator cuts
    const calcCreatorBal = ethers.utils.parseUnits(createPreBal.toString(), 'wei').add(ethers.utils.parseEther('0.02525'));
    const diffCreatorBal = await creatorBal.get();

    
    // preVal - txCosts - 100*creator cuts
    const postMintCalcBal =  ethers.utils.parseUnits(preMintBal.toString(), 'wei')
      .sub(totalMintTxCost).sub(totalBurnTxCost)
      .sub(ethers.utils.parseEther('0.02525')) // creator cut
    const postMintActualBal = await minter.get();

    // converted to string because zeppelin uses BN and ethers.js uses BigNumber.
    expect(diffCreatorBal.toString()).to.equal(calcCreatorBal.toString());
    expect(postMintActualBal.toString()).to.equal(postMintCalcBal.toString());

    expect(await curve.reserve()).to.equal(ethers.utils.parseEther('0'));
    expect(await neolastics.totalSupply()).to.equal('0');

    // remint 1
    await curve.connect(signers[1]).mint({value: ETH1, gasLimit});

    const bal = await neolastics.balanceOf(accounts[1]);
    tokenId = await neolastics.tokenOfOwnerByIndex(accounts[1], 0);

    expect(bal.toString()).to.equal('1');
    expect(await neolastics.ownerOf(tokenId)).to.equal(accounts[1]);
    expect(await neolastics.tokenURI(tokenId)).to.equal("https://metadata.neolastics.com/.netlify/functions/server/"+tokenId);
    expect(await neolastics.totalSupply()).to.equal('1');
    expect(await curve.reserve()).to.equal(ethers.utils.parseEther('0.000995'));

    expect(await curve.getCurrentPriceToMint()).to.equal(ethers.utils.parseEther('0.002'));
    expect(await curve.getCurrentPriceToBurn()).to.equal(ethers.utils.parseEther('0.000995'));

  });


  // mint neolastic from ERC721 (fail)
  it('neolastics: attempt mint from ERC721 (fail)', async() => {
    await expect(neolastics.connect(signers[1]).mint(accounts[1], {gasLimit})).to.be.revertedWith("NEOLASTICS: Minter is not the curve");
  });

  // burn neolastic from ERC721 (fail)
  it('neolastics: mint, and then attempt burn from ERC721 (fail)', async() => {
    await curve.connect(signers[1]).mint({value: ETH1, gasLimit});
    const tokenId = await neolastics.tokenOfOwnerByIndex(accounts[1], 0);
    await expect(neolastics.connect(signers[1]).burn(accounts[1], tokenId, {gasLimit})).to.be.revertedWith("NEOLASTICS: Burner is not the curve");
  });
  
  it('neolastics: check svg matching', async() => {
    await curve.connect(signers[1]).mint({value: ETH1, gasLimit});

    const tokenId = await neolastics.tokenOfOwnerByIndex(accounts[1], 0);

    const jsSVG = generateJSSVGFromHash(tokenId);

    // hex is functionally similarly interpreted in the smart contract
    const svgFromId = await neolastics.generateSVGofTokenById(tokenId);
    const svgFromHash = await neolastics.generateSVGFromHash(tokenId);

    expect(svgFromId).to.equal(svgFromHash);
    expect(svgFromHash).to.equal(jsSVG);
  });

  /* attacks ->
  front-running:
  - As mentioned before. It's possible, but not generally profitable due to cost of minting.
  - It's unlike ERC20 smart contract, because storage of an NFT costs more. 0.001951376. At 8 gwei.

  // contract driven attacks?
  // blocking transfers?
  // transfers can be blocked when minting, but this will just cause the contract mint to fail 
  // transfers can be blocked on burning, but again, this is just a problem for the owner.

  // flash minting?
  // with ETH flash mints, you could mint a lot in one block.
  // but it is not profitable since there's no oracle manipulation or other forms of rug pulling here (in one transaction).

  // duplicates?
  // duplicates are possible, but shouldn't be an issue and could perhaps be its own value driver since it would be very rare.
  // a duplicate would occur if the a hash the same 9 bytes of 32.
  */

  /*NOTE. Dit not test the extremes, because it's practically impossible to hit. */
  // eg: there's not ETH to hit into supply problems.

  /*
  Cycling 'attack'.
  One can create a contract that mints/burns/mints/burns/mints/burns to find a rare one.
  It is costly however, but it means the cost would only be storage costs + creator fees.
  At high price levels or interest it might become more profitable to consider these cycling 'attacks'.
  */

});