import React, { Component } from "react";
import Lottery from "../truffle_abis/Lottery.json";
import "./App.css";
import Web3 from 'web3';

class App extends Component {
    state = {lottery: {}, loaded: false, isOwner: false, selectedAccount: '', lotteryAddress: ''};
    componentDidMount = async () => {
        try{

            await this.loadWeb3();

            this.web3 = window.web3;
            this.accounts = await this.web3.eth.getAccounts();
            this.setState({selectedAccount: this.accounts[0]})
            const networkId = await this.web3.eth.net.getId();

            const lotteryData = Lottery.networks[networkId];
            this.setState({lotteryAddress: lotteryData.address});
            if(lotteryData){
                const lottery = new this.web3.eth.Contract(
                    Lottery.abi, lotteryData.address
                );
                    this.setState({lottery});
            }else{
                window.alert('Error! Lottery Contract not deployed - no detected network');
            }
            let self = this;
            window.ethereum.on('accountsChanged', function (accounts){
                self.setState({selectedAccount: accounts[0]});
                console.log(`Selected account changed to ${self.state.selectedAccount}`);
              });
            let isOwner = await this.checkOwner();
            this.setState({isOwner});
            this.listenToPlayerJoin();

            this.setState({loaded: true});

        }catch(error){
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
              );
              console.error(error);
        }
    };

    async loadWeb3(){
        if(window.ethereum){
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        }else if(window.web3){
            window.web3 = new Web3(window.web3.currentProvider);
        }else{
            window.alert('No ethereum browser detected! try metamask');
        }
    }

    async checkOwner(){
        let manager = await this.state.lottery.methods.manager().call();
        console.log(manager);
        if(manager == this.state.selectedAccount){
            return true;
        }else{
            return false;
        }
    }

    listenToPlayerJoin = () => {
        let self = this;
        this.state.lottery.events.PlayerAdded().on("data", async function(evt) {
            alert(evt.returnValues.playerAddress);
        });
    }



    render() {
        if(!this.state.loaded){
            return <div>Loading Web3, accounts, and contract....</div>;
        }
        let pickWinnerButton;
        if(this.state.isOwner){
            pickWinnerButton = <div><button type="button">Pick Winner</button></div>
        }else{
            pickWinnerButton = <div></div>;
        }

        return(
            <div className="App">
                <h1>Lottery Dapp</h1>
                {pickWinnerButton}
               <p>Pay 0.1 ether to this address {this.state.lotteryAddress}</p>
            </div>
        );
    }



}

export default App;