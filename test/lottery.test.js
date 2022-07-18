const Lottery = artifacts.require("Lottery");

contract("Lottery", accounts => {

    it("... should add owner of contract to players", async () => {
        const lotteryInstance = await Lottery.deployed();
        const owner = await lotteryInstance.players(0);
        //console.log(owner);
        assert.equal(owner, accounts[0], "The owner of the smart contract is a player");
    });

    it("... should add any player who pays the required fee to players", async () => {
        const lotteryInstance = await Lottery.deployed();
        const result = await web3.eth.sendTransaction({from: accounts[1], to: lotteryInstance.address, value: web3.utils.toWei('0.1', 'ether')});
        console.log(result.logs[0].args);
        const player = await lotteryInstance.players(1);
        const balance = await lotteryInstance.getBalance({from: accounts[0]});
        console.log(web3.utils.fromWei(balance.toString(), 'ether'));
        assert.equal(player, accounts[1], "The account should be added to players");
    });
    it("... should pick a random winner and send the eth to him and 10% to the owner", async () => {
        const lotteryInstance = await Lottery.deployed();
         await web3.eth.sendTransaction({from: accounts[1], to: lotteryInstance.address, value: web3.utils.toWei('0.1', 'ether')});
         await web3.eth.sendTransaction({from: accounts[2], to: lotteryInstance.address, value: web3.utils.toWei('0.1', 'ether')});
         await web3.eth.sendTransaction({from: accounts[3], to: lotteryInstance.address, value: web3.utils.toWei('0.1', 'ether')});
         await web3.eth.sendTransaction({from: accounts[4], to: lotteryInstance.address, value: web3.utils.toWei('0.1', 'ether')});
         const balance = await lotteryInstance.getBalance({from: accounts[0]});
        console.log("Balance before pick winner " + web3.utils.fromWei(balance.toString(), 'ether'));
         const result = await lotteryInstance.pickWinner({from: accounts[0]});
         console.log(result.logs[0].args);
         const updatedBalance = await lotteryInstance.getBalance({from: accounts[0]});
         console.log("Balance after  pick winner " + web3.utils.fromWei( updatedBalance.toString(), 'ether'));
    });
});