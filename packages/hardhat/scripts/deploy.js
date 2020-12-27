async function main() {
    // We get the contract to deploy
    //const provider = new ethers.providers.Web3Provider(web3.currentProvider);
    //const signers = await ethers.getSigners();
    //const accounts = await Promise.all(signers.map(async function(signer) {return await signer.getAddress(); }));

    const ERC721 = await ethers.getContractFactory("ERC721");
    const Curve = await ethers.getContractFactory("Curve");

    const curve = await Curve.deploy("0x0CaCC6104D8Cd9d7b2850b4f35c65C1eCDEECe03");
    await curve.deployed();
    const nlAddress = await curve.neolastics();
    const curveAddress = await curve.address;

    console.log("Curve deployed to: ", curveAddress);
    console.log("ERC721 deployed to: ", nlAddress);
  }
  
  main()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });