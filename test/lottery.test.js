const Lottery = artifacts.require("Lottery");

contract("Lottery", accounts => {

    it("... should add owner of contract to players", async () => {
        const lotteryInstance = await Lottery.deployed();
        const owner = await lotteryInstance.players(0);
        console.log(owner);
        assert.equal(owner, accounts[0], "The owner of the smart contract is a player");
    });

    it("... should add any player who pays the required fee to players", async () => {
        const lotteryInstance = await Lottery.deployed();
        await web3.eth.sendTransaction({from: accounts[1], to: lotteryInstance.address, value: web3.utils.toWei('0.1', 'ether')});
        
    });
});