const contract=artifacts.require("./MyblogApp.sol");

module.exports=async function(deployer)
{
    await deployer.deploy(contract);
}